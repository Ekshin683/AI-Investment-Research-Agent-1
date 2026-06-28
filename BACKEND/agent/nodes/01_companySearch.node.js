import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { searchCompanyInfo } from "../tools/webSearch.tool.js";
import { PROMPTS } from "../prompts/systemPrompts.js";

const llm = new ChatGroq({
  model:       "llama-3.3-70b-versatile",
  temperature: 0,
  apiKey:      process.env.GROQ_API_KEY,
});

export const companySearchNode = async (state) => {
  console.log("🔍 Node 1: Searching for company —", state.companyName);
  try {
    const searchResults = await searchCompanyInfo(state.companyName);
    const response = await llm.invoke([
      new SystemMessage(PROMPTS.COMPANY_SEARCH),
      new HumanMessage(`Company name: ${state.companyName}\n\nSearch results:\n${searchResults}`),
    ]);
    let companyProfile = null;
    try {
      const cleaned = response.content.trim().replace(/```json|```/g, "").trim();
      companyProfile = JSON.parse(cleaned);
    } catch {
      companyProfile = { companyName: state.companyName, ticker: "UNKNOWN" };
    }
    console.log("✅ Node 1 complete — Ticker:", companyProfile?.ticker);
    return {
      ...state,
      companyProfile,
      ticker: companyProfile?.ticker || "UNKNOWN",
      steps: [...state.steps, {
        node:    "node_companySearch",
        status:  "completed",
        message: `Found: ${companyProfile?.companyName} (${companyProfile?.ticker})`,
      }],
    };
  } catch (error) {
    console.error("❌ Node 1 error:", error.message);
    return {
      ...state,
      errors: [...state.errors, { node: "node_companySearch", error: error.message }],
      steps:  [...state.steps, { node: "node_companySearch", status: "failed", message: error.message }],
    };
  }
};