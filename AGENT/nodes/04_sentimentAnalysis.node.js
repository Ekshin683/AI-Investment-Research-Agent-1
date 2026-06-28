import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PROMPTS } from "../prompts/systemPrompts.js";

const llm = new ChatGroq({
  model:       "llama-3.3-70b-versatile",
  temperature: 0,
  apiKey:      process.env.GROQ_API_KEY,
});

export const sentimentAnalysisNode = async (state) => {
  console.log("💭 Node 4: Analyzing sentiment for —", state.companyName);
  try {
    const context = `
Company: ${state.companyName} (${state.ticker})
Company Profile: ${JSON.stringify(state.companyProfile, null, 2)}
Financial Score: ${state.financialScore}/10
P/E Ratio: ${state.financialData?.overview?.peRatio || "N/A"}
Profit Margin: ${state.financialData?.overview?.profitMargin || "N/A"}
Revenue Growth: ${state.financialData?.overview?.revenueGrowth || "N/A"}
News Score: ${state.newsScore}/10
    `;
    const response = await llm.invoke([
      new SystemMessage(PROMPTS.SENTIMENT_ANALYSIS),
      new HumanMessage(context),
    ]);
    let sentimentResult = null;
    try {
      const cleaned = response.content.trim().replace(/```json|```/g, "").trim();
      sentimentResult = JSON.parse(cleaned);
    } catch {
      sentimentResult = { sentimentResult: "Neutral", sentimentScore: 5, analystConsensus: "Hold" };
    }
    console.log("✅ Node 4 complete — Sentiment:", sentimentResult.sentimentResult);
    return {
      ...state,
      sentimentResult,
      sentimentScore: sentimentResult.sentimentScore || 5,
      steps: [...state.steps, {
        node:    "node_sentimentAnalysis",
        status:  "completed",
        message: `Sentiment: ${sentimentResult.sentimentResult}. Score: ${sentimentResult.sentimentScore}/10`,
        data:    sentimentResult,
      }],
    };
  } catch (error) {
    console.error("❌ Node 4 error:", error.message);
    return {
      ...state,
      sentimentScore: 0,
      errors: [...state.errors, { node: "node_sentimentAnalysis", error: error.message }],
      steps:  [...state.steps, { node: "node_sentimentAnalysis", status: "failed", message: error.message }],
    };
  }
};