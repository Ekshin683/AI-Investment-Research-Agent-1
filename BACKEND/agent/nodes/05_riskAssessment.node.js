import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PROMPTS } from "../prompts/systemPrompts.js";

const llm = new ChatGroq({
  model:       "llama-3.3-70b-versatile",
  temperature: 0,
  apiKey:      process.env.GROQ_API_KEY,
});

export const riskAssessmentNode = async (state) => {
  console.log("⚠️  Node 5: Assessing risks for —", state.companyName);
  try {
    const context = `
Company: ${state.companyName} (${state.ticker})
Sector: ${state.companyProfile?.sector || "Unknown"}
P/E Ratio: ${state.financialData?.overview?.peRatio || "N/A"}
Debt to Equity: ${state.financialData?.overview?.debtToEquity || "N/A"}
Profit Margin: ${state.financialData?.overview?.profitMargin || "N/A"}
Beta: ${state.financialData?.overview?.beta || "N/A"}
Financial Score: ${state.financialScore}/10
Sentiment: ${state.sentimentResult?.sentimentResult || "Unknown"}
News Score: ${state.newsScore}/10
Description: ${state.companyProfile?.description || "N/A"}
    `;
    const response = await llm.invoke([
      new SystemMessage(PROMPTS.RISK_ASSESSMENT),
      new HumanMessage(context),
    ]);
    let riskData = null;
    try {
      const cleaned = response.content.trim().replace(/```json|```/g, "").trim();
      riskData = JSON.parse(cleaned);
    } catch {
      riskData = { riskScore: 5, riskLevel: "Medium", riskFactors: [], moatStrength: "Narrow", moatAnalysis: "Unable to assess" };
    }
    console.log("✅ Node 5 complete — Risk level:", riskData.riskLevel);
    return {
      ...state,
      riskFactors:  riskData.riskFactors || [],
      riskScore:    riskData.riskScore   || 5,
      moatAnalysis: riskData.moatAnalysis || "",
      steps: [...state.steps, {
        node:    "node_riskAssessment",
        status:  "completed",
        message: `Risk: ${riskData.riskLevel}. Moat: ${riskData.moatStrength}`,
        data:    riskData,
      }],
    };
  } catch (error) {
    console.error("❌ Node 5 error:", error.message);
    return {
      ...state,
      riskScore: 0,
      errors: [...state.errors, { node: "node_riskAssessment", error: error.message }],
      steps:  [...state.steps, { node: "node_riskAssessment", status: "failed", message: error.message }],
    };
  }
};