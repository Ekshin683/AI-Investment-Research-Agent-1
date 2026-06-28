# AI Investment Research Agent

> An intelligent investment research platform powered by **LangGraph.js** multi-node AI agent pipeline. Enter any company name and receive a comprehensive **INVEST / PASS / HOLD** verdict backed by real financial data, news analysis, sentiment scoring, and risk assessment — all in one terminal-style dashboard.

![Terminal AI Dashboard](https://img.shields.io/badge/Status-Live-00ff9d?style=for-the-badge)
![LangGraph](https://img.shields.io/badge/LangGraph.js-Agent_Pipeline-purple?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [LangGraph Agent Pipeline](#langgraph-agent-pipeline)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [How It Works](#how-it-works)
- [Screenshots](#screenshots)

---

## 🎯 Overview

The **AI Investment Research Agent** is a full-stack MERN application that uses a **LangGraph.js multi-node agent pipeline** to autonomously research any company and deliver a data-driven investment verdict. 

Unlike simple chatbots, this agent runs a structured **6-node pipeline** — each node specializes in one aspect of investment research. The nodes share a typed state object, passing enriched data forward until the final verdict node synthesizes everything into a confident **INVEST**, **PASS**, or **HOLD** decision.

---

## ✨ Features

- 🔍 **Company Resolution** — Automatically identifies ticker symbols for any company worldwide
- 📊 **Real Financial Data** — Fetches live P/E ratio, EPS, profit margins, revenue growth, stock price
- 📰 **News Analysis** — Aggregates and analyzes recent news articles using Tavily search
- 💭 **Sentiment Scoring** — AI-powered market sentiment analysis (Bullish / Bearish / Neutral)
- ⚠️ **Risk Assessment** — Identifies key risk factors and evaluates competitive moat
- 🏛️ **Investment Verdict** — Final INVEST / PASS / HOLD with confidence score (0–100%)
- 💬 **AI Analyst Chatbot** — Ask follow-up questions about any research result
- 📈 **Interactive Dashboard** — Clickable score rings, metric boxes, news feed, agent log
- 🕐 **Research History** — All past research saved to MongoDB and accessible instantly
- ⚡ **Live Progress Tracking** — Real-time step-by-step agent progress as it runs
- 🌍 **Global Stock Support** — Works with US, Indian (BSE/NSE), European, and Asian stocks

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| Tailwind CSS | Utility-first styling |
| JetBrains Mono | Terminal-style monospace font |
| Recharts | Data visualization |
| Fetch API | HTTP requests and polling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 20 | Runtime environment |
| Express.js | REST API framework |
| MongoDB + Mongoose | Database and ODM |
| Morgan | HTTP request logging |
| Helmet | Security headers |
| Express Validator | Input sanitization |
| Nodemon | Development auto-restart |
| Groq SDK | AI chatbot endpoint |

### AI Agent
| Technology | Purpose |
|---|---|
| LangGraph.js | Multi-node agent pipeline orchestration |
| LangChain Core | Message types and abstractions |
| Groq (Llama 3.3 70B) | LLM for all AI reasoning nodes |
| Tavily Search API | Web search for company info and news |
| Alpha Vantage API | US stock financial data |
| Twelve Data API | Global stock financial data |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│   SearchBar → StepProgress → DashboardView + Chatbot    │
└─────────────────────┬───────────────────────────────────┘
                      │ REST API (polling every 4s)
┌─────────────────────▼───────────────────────────────────┐
│                   BACKEND (Express)                      │
│   Routes → Controller → Service → MongoDB               │
└─────────────────────┬───────────────────────────────────┘
                      │ Dynamic import (file:// URL)
┌─────────────────────▼───────────────────────────────────┐
│              AI AGENT (LangGraph.js)                     │
│                                                          │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐            │
│  │ Company  │──▶│Financial │──▶│  News    │            │
│  │ Search   │   │  Data    │   │ Analysis │            │
│  └──────────┘   └──────────┘   └──────────┘            │
│                                      │                   │
│  ┌──────────┐   ┌──────────┐   ┌────▼─────┐            │
│  │ Verdict  │◀──│  Risk    │◀──│Sentiment │            │
│  │Decision  │   │Assessment│   │ Analysis │            │
│  └──────────┘   └──────────┘   └──────────┘            │
│        │                                                 │
│        ▼                                                 │
│  INVEST / PASS / HOLD + Confidence Score                │
└─────────────────────────────────────────────────────────┘
```

---

## 🤖 LangGraph Agent Pipeline

The heart of the application is a **6-node LangGraph StateGraph** where each node reads from and writes to a shared typed state object.

### Shared State Schema
```javascript
{
  companyName,      // User input
  companyProfile,   // Resolved from Node 1
  ticker,           // Stock ticker symbol
  financialData,    // From Node 2
  financialScore,   // 0-10 score
  recentNews,       // From Node 3
  newsScore,        // 0-10 score
  sentimentResult,  // From Node 4
  sentimentScore,   // 0-10 score
  riskFactors,      // From Node 5
  riskScore,        // 0-10 score
  moatAnalysis,     // Competitive advantage
  verdict,          // INVEST / PASS / HOLD
  confidenceScore,  // 0-100 overall
  reasoning,        // Detailed explanation
  summary,          // 2-3 line summary
  steps,            // Live progress log
  errors            // Any node errors
}
```

### Node Descriptions

| Node | File | Role | Tools Used |
|---|---|---|---|
| **01 Company Search** | `01_companySearch.node.js` | Resolves company name to ticker and profile | Tavily Web Search + Groq LLM |
| **02 Financial Data** | `02_financialData.node.js` | Fetches real stock price, P/E, EPS, margins | Alpha Vantage / Twelve Data API |
| **03 News Analysis** | `03_newsAnalysis.node.js` | Pulls and scores recent news articles | Tavily News Search + Groq LLM |
| **04 Sentiment Analysis** | `04_sentimentAnalysis.node.js` | Scores overall market sentiment | Groq LLM |
| **05 Risk Assessment** | `05_riskAssessment.node.js` | Identifies risks and competitive moat | Groq LLM |
| **06 Verdict Decision** | `06_verdictDecision.node.js` | Synthesizes all data into final verdict | Groq LLM |

### Confidence Score Calculation
```
Confidence = (Financial × 35%) + (News × 20%) + (Sentiment × 25%) + (Risk × 20%)

INVEST → Confidence ≥ 65%
HOLD   → Confidence 45–64%
PASS   → Confidence < 45%
```

---

## 📁 Project Structure

```
AI-Investment-Research-Agent/
│
├── FRONTEND/                          # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx          # Company name input with quick suggestions
│   │   │   ├── ResearchCard.jsx       # Full research result display
│   │   │   ├── VerdictBadge.jsx       # INVEST/PASS/HOLD colored badge
│   │   │   ├── StepProgress.jsx       # Live 6-node progress tracker
│   │   │   ├── MetricRow.jsx          # Single financial metric display
│   │   │   └── ReasoningLog.jsx       # Terminal-style agent log
│   │   ├── pages/
│   │   │   ├── HomePage.jsx           # Main dashboard with chatbot
│   │   │   └── ResultPage.jsx         # Dedicated result page
│   │   ├── api/
│   │   │   └── researchClient.js      # API calls + polling logic
│   │   ├── App.jsx                    # Router setup
│   │   ├── main.jsx                   # React entry point
│   │   └── index.css                  # Global styles + CSS variables
│   ├── tailwind.config.js
│   ├── vite.config.js                 # Proxy config for API
│   └── package.json
│
├── BACKEND/                           # Node.js + Express API
│   ├── src/
│   │   ├── routes/
│   │   │   └── research.routes.js     # POST /api/research, GET /api/research/:id
│   │   ├── controllers/
│   │   │   └── research.controller.js # Request handlers + chatWithAnalyst
│   │   ├── services/
│   │   │   └── research.service.js    # Calls AGENT via dynamic import
│   │   ├── models/
│   │   │   └── Research.model.js      # Mongoose schema for research results
│   │   ├── middleware/
│   │   │   ├── errorHandler.middleware.js    # Global error handler
│   │   │   └── validateInput.middleware.js   # Input sanitization
│   │   ├── config/
│   │   │   └── db.config.js           # MongoDB Atlas connection
│   │   └── server.js                  # Express app entry point
│   ├── .env                           # Secret keys (not committed)
│   ├── .env.example                   # Template for required keys
│   └── package.json
│
└── AGENT/                             # LangGraph.js AI Agent
    ├── graph/
    │   ├── investmentGraph.js         # StateGraph definition and compilation
    │   └── stateSchema.js             # Shared state type definitions
    ├── nodes/
    │   ├── 01_companySearch.node.js   # Node 1: Company resolution
    │   ├── 02_financialData.node.js   # Node 2: Financial data fetching
    │   ├── 03_newsAnalysis.node.js    # Node 3: News aggregation + analysis
    │   ├── 04_sentimentAnalysis.node.js # Node 4: Market sentiment
    │   ├── 05_riskAssessment.node.js  # Node 5: Risk + moat evaluation
    │   └── 06_verdictDecision.node.js # Node 6: Final INVEST/PASS/HOLD
    ├── tools/
    │   ├── webSearch.tool.js          # Tavily search integration
    │   ├── financials.tool.js         # Alpha Vantage / Twelve Data integration
    │   └── news.tool.js               # News fetching and formatting
    ├── prompts/
    │   └── systemPrompts.js           # All LLM prompt templates
    ├── index.js                       # Agent entry point + test runner
    └── package.json
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (free at mongodb.com/atlas)
- API keys (see Environment Variables section)

### Clone the repository
```bash
git clone https://github.com/YourUsername/AI-Investment-Research-Agent.git
cd AI-Investment-Research-Agent
```

### Install dependencies

```bash
# Frontend
cd FRONTEND
npm install
cd ..

# Backend
cd BACKEND
npm install
cd ..

# Agent
cd AGENT
npm install
cd ..
```

---


### Where to get API keys

| Key | URL | Free Tier |
|---|---|---|
| `GROQ_API_KEY` | https://console.groq.com | 100K tokens/day |
| `TAVILY_API_KEY` | https://tavily.com | 1000 searches/month |
| `ALPHA_VANTAGE_API_KEY` | https://alphavantage.co | 25 requests/day |
| `TWELVE_DATA_API_KEY` | https://twelvedata.com | 800 requests/day |
| `MONGODB_URI` | https://mongodb.com/atlas | 512MB free |

---

## ▶️ Running the Application

### Development mode (run in separate terminals)

**Terminal 1 — Backend:**
```bash
cd BACKEND
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd FRONTEND
npm run dev
# App starts on http://localhost:5173
```

### Test the Agent directly
```bash
cd AGENT
node index.js Apple
# Runs full 6-node pipeline and prints verdict
```

---

## 🔌 API Endpoints

### Research Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/research` | Start new investment research |
| `GET` | `/api/research` | Get all research history |
| `GET` | `/api/research/:id` | Get research result by ID |
| `DELETE` | `/api/research/:id` | Delete a research record |
| `POST` | `/api/research/chat` | AI Analyst chatbot |

### Request / Response Examples

**Start Research:**
```json
POST /api/research
{
  "companyName": "Apple"
}

Response:
{
  "success": true,
  "message": "Research started",
  "researchId": "64abc123...",
  "status": "running"
}
```

**Poll for Result:**
```json
GET /api/research/64abc123...

Response:
{
  "success": true,
  "data": {
    "companyName": "Apple",
    "ticker": "AAPL",
    "verdict": "INVEST",
    "confidenceScore": 78,
    "financialScore": 8,
    "newsScore": 7,
    "sentimentScore": 8,
    "riskScore": 7,
    "reasoning": "Apple demonstrates strong...",
    "status": "completed"
  }
}
```

**AI Chatbot:**
```json
POST /api/research/chat
{
  "message": "Should I invest in Apple?",
  "researchContext": "Company: Apple (AAPL)..."
}

Response:
{
  "success": true,
  "reply": "Based on the research data..."
}
```

---

## 💡 How It Works

### 1. User submits a company name
The frontend sends a `POST /api/research` request with the company name.

### 2. Backend creates a research record
A MongoDB document is created with `status: "running"` and the research ID is returned immediately to the frontend.

### 3. Agent pipeline runs in background
The backend service dynamically imports the AGENT and invokes the LangGraph pipeline. The agent runs all 6 nodes sequentially, each enriching the shared state.

### 4. Frontend polls for updates
The frontend polls `GET /api/research/:id` every 4 seconds. As each node completes, the step progress UI updates in real time.

### 5. MongoDB is updated on completion
Once all 6 nodes finish, the complete result (verdict, scores, reasoning, financials, news, risks) is saved to MongoDB.

### 6. Dashboard renders the result
The frontend displays the full result in a Power BI-style dashboard with clickable score rings, metric boxes, news feed, and the AI Analyst chatbot.

### 7. AI Chatbot answers follow-up questions
The chatbot sends messages to `POST /api/research/chat` which uses Groq's Llama 3.3 70B model with full research context to answer investment questions.

---

## 🎨 UI Features

### Terminal-style Design
- Dark navy background (`#070d14`)
- Neon green accent (`#00ff9d`)
- JetBrains Mono monospace font throughout
- Inspired by Bloomberg Terminal and financial data platforms

### Interactive Score Rings
Click any of the 4 score rings (Financial, News, Sentiment, Risk) to expand a detailed breakdown of what contributed to that score.

### Live Agent Log
Watch the agent's terminal output in real-time as each node completes, with color-coded success (green) and failure (red) indicators.

### AI Analyst Chatbot
After research completes, a persistent chatbot panel appears on the right. Ask questions like:
- "Should I invest in this company?"
- "What are the biggest risks?"
- "Explain the confidence score"
- "What is the price target?"

---

## ⚠️ Known Limitations

| Limitation | Details |
|---|---|
| **Groq free tier** | 100K tokens/day — runs ~15-20 research sessions |
| **Alpha Vantage free tier** | US stocks only, 25 req/day |
| **Indian stocks** | Ticker format required (e.g. `CIPLA.BSE`) |
| **Research time** | Takes 30–90 seconds per company |
| **Not financial advice** | This tool is for educational/research purposes only |

---

## 🔮 Future Improvements

- [ ] Portfolio tracking across multiple companies
- [ ] Historical research comparison
- [ ] Email alerts for verdict changes
- [ ] PDF export of research reports
- [ ] Real-time stock price websocket
- [ ] Support for crypto assets
- [ ] Multi-language support

---

## ⚖️ Disclaimer

> This application is for **educational and research purposes only**. It does not constitute financial advice. Always consult a qualified financial advisor before making investment decisions. The AI verdicts are based on publicly available data and AI analysis which may be incomplete or inaccurate.

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

<div align="center">
  <p>Built with ❤️ using LangGraph.js, React, Node.js, and MongoDB</p>
  <p>
    <a href="https://langchain.com/langgraph">LangGraph</a> •
    <a href="https://groq.com">Groq</a> •
    <a href="https://tavily.com">Tavily</a> •
    <a href="https://mongodb.com/atlas">MongoDB Atlas</a>
  </p>
</div>
