import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PROMPTS } from "../prompts/systemPrompts.js";

const llm = new ChatGroq({
  model:       "llama-3.3-70b-versatile",
  temperature: 0,
  apiKey:      process.env.GROQ_API_KEY,
});

export const verdictDecisionNode = async (state) => {
  console.log("🏛️  Node 6: Making final verdict for —", state.companyName);
  try {
    const fullContext = `
Company: ${state.companyName} (${state.ticker})
Sector: ${state.companyProfile?.sector || "Unknown"}

SCORES:
Financial Score:  ${state.financialScore}/10
News Score:       ${state.newsScore}/10
Sentiment Score:  ${state.sentimentScore}/10
Risk Score:       ${state.riskScore}/10

FINANCIAL DATA:
Market Cap:    ${state.financialData?.overview?.marketCap    || "N/A"}
P/E Ratio:     ${state.financialData?.overview?.peRatio      || "N/A"}
EPS:           ${state.financialData?.overview?.eps          || "N/A"}
Profit Margin: ${state.financialData?.overview?.profitMargin || "N/A"}
Rev Growth:    ${state.financialData?.overview?.revenueGrowth || "N/A"}
Debt/Equity:   ${state.financialData?.overview?.debtToEquity || "N/A"}
ROE:           ${state.financialData?.overview?.returnOnEquity || "N/A"}
Current Price: ${state.financialData?.quote?.price           || "N/A"}
Target Price:  ${state.financialData?.overview?.analystTarget || "N/A"}

SENTIMENT: ${state.sentimentResult?.sentimentResult || "Unknown"}
Analyst Consensus: ${state.sentimentResult?.analystConsensus || "Unknown"}

MOAT: ${state.moatAnalysis || "N/A"}
RISKS: ${state.riskFactors?.length || 0} identified

DESCRIPTION: ${state.companyProfile?.description || "N/A"}
    `;
    const response = await llm.invoke([
      new SystemMessage(PROMPTS.VERDICT_DECISION),
      new HumanMessage(fullContext),
    ]);
    let verdictData = null;
    try {
      const cleaned = response.content.trim().replace(/```json|```/g, "").trim();
      verdictData = JSON.parse(cleaned);
    } catch {
      verdictData = {
        verdict: "HOLD", confidenceScore: 50,
        reasoning: "Unable to generate detailed reasoning",
        summary: "Insufficient data", keyStrengths: [], keyWeaknesses: [],
        recommendation: "Gather more data before investing",
      };
    }
    console.log("✅ Node 6 complete — Verdict:", verdictData.verdict, "| Confidence:", verdictData.confidenceScore);
    return {
      ...state,
      verdict:         verdictData.verdict,
      confidenceScore: verdictData.confidenceScore,
      reasoning:       verdictData.reasoning,
      summary:         verdictData.summary,
      completedAt:     new Date().toISOString(),
      steps: [...state.steps, {
        node:    "node_verdictDecision",
        status:  "completed",
        message: `Verdict: ${verdictData.verdict} (${verdictData.confidenceScore}% confidence)`,
        data:    verdictData,
      }],
    };
  } catch (error) {
    console.error("❌ Node 6 error:", error.message);
    return {
      ...state,
      verdict: "PASS", confidenceScore: 0,
      errors: [...state.errors, { node: "node_verdictDecision", error: error.message }],
      steps:  [...state.steps, { node: "node_verdictDecision", status: "failed", message: error.message }],
    };
  }
};