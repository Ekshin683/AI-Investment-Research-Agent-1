# AI Investment Research Agent
### InsideIIM × Altuni AI Labs — Take-Home Assignment

---

## Overview

The **AI Investment Research Agent** is a full-stack application that takes a company name as input, autonomously researches it using a **6-node LangGraph.js agent pipeline**, and delivers a data-driven **INVEST / PASS / HOLD** verdict with detailed reasoning.

**Live Demo:** https://ai-investment-research-agent-1.vercel.app

---

## How to Run It

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- API keys (listed below)

### Install dependencies

```bash
cd FRONTEND && npm install && cd ..
cd BACKEND && npm install --legacy-peer-deps && cd ..
cd AGENT && npm install --legacy-peer-deps && cd ..
```

### Environment Variables

**BACKEND/.env**
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-investment
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
GROQ_API_KEY=gsk_your_key_here
TAVILY_API_KEY=tvly_your_key_here
ALPHA_VANTAGE_API_KEY=your_key_here
TWELVE_DATA_API_KEY=your_key_here
```

**AGENT/.env**
```
GROQ_API_KEY=gsk_your_key_here
TAVILY_API_KEY=tvly_your_key_here
ALPHA_VANTAGE_API_KEY=your_key_here
TWELVE_DATA_API_KEY=your_key_here
```

### API Keys

| Key | URL | Free Tier |
|---|---|---|
| GROQ_API_KEY | https://console.groq.com | 100K tokens/day |
| TAVILY_API_KEY | https://tavily.com | 1000 searches/month |
| ALPHA_VANTAGE_API_KEY | https://alphavantage.co | 25 req/day |
| TWELVE_DATA_API_KEY | https://twelvedata.com | 800 req/day |
| MONGODB_URI | https://mongodb.com/atlas | 512MB free |

### Run

```bash
# Terminal 1 - Backend
cd BACKEND && npm run dev

# Terminal 2 - Frontend  
cd FRONTEND && npm run dev
```

Open http://localhost:5173

---

## How It Works

### Architecture

```
FRONTEND (React + Vite)
    ↓ REST API polling every 4s
BACKEND (Node.js + Express + MongoDB)
    ↓ Dynamic import
AGENT (LangGraph.js 6-node pipeline)
    ↓
INVEST / PASS / HOLD verdict
```

### LangGraph Pipeline

6 nodes share a typed state object:

| Node | Role | Tools |
|---|---|---|
| 01 Company Search | Resolves company to ticker + profile | Tavily + Groq |
| 02 Financial Data | Fetches P/E, EPS, price, margins | Alpha Vantage / Twelve Data |
| 03 News Analysis | Pulls and scores recent news | Tavily + Groq |
| 04 Sentiment Analysis | Market sentiment scoring | Groq LLM |
| 05 Risk Assessment | Risk factors + moat analysis | Groq LLM |
| 06 Verdict Decision | Final INVEST/PASS/HOLD | Groq LLM |

### Confidence Score Formula

```
Confidence = (Financial x 35%) + (Sentiment x 25%) + (News x 20%) + (Risk x 20%)

INVEST  -> Confidence >= 65
HOLD    -> Confidence 45-64
PASS    -> Confidence < 45
```

### Tech Stack

- Frontend: React 18, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB + Mongoose, Groq SDK
- AI: LangGraph.js, Groq Llama 3.3 70B, Tavily Search
- Deploy: Vercel + Render + MongoDB Atlas

---

## Key Decisions and Trade-offs

### What I chose and why

**LangGraph over simple LangChain chains**
- Explicit node-by-node control with shared typed state
- Each node independently testable and debuggable
- Clean state flow without prop drilling
- Trade-off: More setup but far more maintainable at scale

**Groq (Llama 3.3 70B) over OpenAI**
- Free tier: 100K tokens/day, no billing required
- Highly capable for structured JSON output
- Trade-off: Daily token limit of 100K (~15-20 research runs/day)

**Polling over WebSockets**
- Simpler to implement and debug
- Works reliably on Vercel + Render
- Trade-off: 4-second delay vs true real-time
- Would use SSE with more time

**MongoDB over PostgreSQL**
- Flexible schema for nested research JSON
- Easy to store arrays (news, risks) and mixed objects
- Trade-off: Less suited for complex relational queries

**Dual Financial API (Alpha Vantage + Twelve Data)**
- Alpha Vantage for US stocks
- Twelve Data for global stocks (BSE, NSE, LSE)
- Trade-off: Two APIs to manage with limited free tiers

### What I left out

| Feature | Reason |
|---|---|
| WebSocket real-time updates | Polling sufficient for 30-90s research |
| User authentication | Out of scope for assignment |
| PDF export | Would add with more time |
| Portfolio comparison | Future feature |
| Crypto support | Different data sources needed |

---

## Example Runs

### Microsoft (MSFT)
```
Verdict:         INVEST
Confidence:      73.5%
Financial Score: 9/10
News Score:      3/10
Sentiment:       8/10 - Bullish
Risk Score:      8/10

Reasoning: Microsoft demonstrates exceptional financial health
with strong profit margins driven by Azure cloud and AI integration.
Despite mixed recent news, bullish market sentiment and analyst buy
consensus support positive long-term outlook. Wide competitive moat
through enterprise software lock-in provides strong downside protection.

Key Strengths: Azure dominance, AI integration, enterprise moat
Key Risks: Regulatory scrutiny, OpenAI dependency, valuation premium
```

### Amazon (AMZN)
```
Verdict:         INVEST
Confidence:      73.25%
Financial Score: 7/10
News Score:      6/10
Sentiment:       7.5/10 - Bullish
Risk Score:      8/10

Reasoning: Amazon strong financials and innovative technologies make
it a leader in consumer cyclical. With bullish sentiment and analyst
buy consensus, well-positioned for growth. Wide moat from AWS and
logistics network supports the investment decision.

Key Strengths: AWS dominance, Prime ecosystem, logistics network
Key Risks: Regulatory pressure, thin retail margins, labor costs
```

### Tesla (TSLA)
```
Verdict:         HOLD
Confidence:      51%
Financial Score: 5/10
News Score:      4/10
Sentiment:       5/10 - Neutral
Risk Score:      6/10

Reasoning: Tesla faces mixed signals with strong EV brand leadership
but increasing competition and margin pressure. Negative news
sentiment due to price cuts and demand concerns. High beta and
elevated risk profile. Wait for better entry point.

Key Strengths: EV brand leadership, Supercharger network
Key Risks: CEO distraction, margin compression, Chinese competition
```

### CIPLA (Indian Stock - BSE/NSE)
```
Verdict:         HOLD
Confidence:      56%
Financial Score: 5/10
News Score:      7/10
Sentiment:       7/10 - Bullish
Risk Score:      7/10

Note: Indian stocks have limited financial data on free API tiers.
Analysis relies more on news and AI reasoning for non-US stocks.
```

---

## What I Would Improve With More Time

### Technical
1. **SSE streaming** - Replace polling with Server-Sent Events for true real-time updates
2. **Yahoo Finance API** - Better global stock coverage especially Indian BSE/NSE
3. **Redis caching** - Cache frequently researched companies to reduce API calls
4. **Parallel nodes** - Run News and Financial nodes in parallel to cut time from 60s to 30s
5. **Retry logic** - Exponential backoff on API failures
6. **Zod validation** - Strict schema validation on all LLM JSON outputs

### Product
7. **Portfolio analysis** - Research and compare multiple companies
8. **Email alerts** - Notify when company verdict changes
9. **PDF report** - Professional investment research PDF export
10. **Watchlist** - Save and monitor companies
11. **Historical verdicts** - Track how confidence score changes over time

### AI
12. **Agent memory** - Remember previous research for the same company
13. **SEC filing analysis** - Add 10-K/10-Q parsing node for US stocks
14. **Multiple model comparison** - Run same research with different LLMs

---

## Project Structure

```
AI-Investment-Research-Agent/
├── FRONTEND/                    # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── VerdictBadge.jsx
│   │   │   ├── StepProgress.jsx
│   │   │   ├── MetricRow.jsx
│   │   │   └── ReasoningLog.jsx
│   │   ├── pages/
│   │   │   └── HomePage.jsx     # Main dashboard + chatbot
│   │   └── api/
│   │       └── researchClient.js
│   └── package.json
│
├── BACKEND/                     # Node.js + Express
│   ├── src/
│   │   ├── routes/research.routes.js
│   │   ├── controllers/research.controller.js
│   │   ├── services/research.service.js
│   │   ├── models/Research.model.js
│   │   ├── middleware/
│   │   ├── config/db.config.js
│   │   └── server.js
│   ├── agent/                   # AGENT embedded for deployment
│   └── package.json
│
└── AGENT/                       # LangGraph.js Pipeline
    ├── graph/
    │   ├── investmentGraph.js   # StateGraph definition
    │   └── stateSchema.js       # Shared state types
    ├── nodes/
    │   ├── 01_companySearch.node.js
    │   ├── 02_financialData.node.js
    │   ├── 03_newsAnalysis.node.js
    │   ├── 04_sentimentAnalysis.node.js
    │   ├── 05_riskAssessment.node.js
    │   └── 06_verdictDecision.node.js
    ├── tools/
    │   ├── webSearch.tool.js
    │   ├── financials.tool.js
    │   └── news.tool.js
    ├── prompts/systemPrompts.js
    └── index.js
```

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://ai-investment-research-agent-1.vercel.app |
| Backend | Render | https://ai-investment-research-agent-1-qpb6.onrender.com |
| Database | MongoDB Atlas | Cloud hosted |

---

## Disclaimer

This tool is for educational and research purposes only and does not constitute financial advice.