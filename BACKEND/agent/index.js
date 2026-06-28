// index.js
// AGENT entry point — exports the compiled graph
// Also contains a test runner for development

import { investmentGraph } from "./graph/investmentGraph.js";
import { defaultState } from "./graph/stateSchema.js";
import dotenv from "dotenv";
dotenv.config();

// ── Export graph for use by BACKEND ─────────────────────────────────
export { investmentGraph };

// ── Run agent function ───────────────────────────────────────────────
export const runInvestmentResearch = async (companyName) => {
  const initialState = {
    ...defaultState,
    companyName,
    startedAt: new Date().toISOString(),
  };

  const result = await investmentGraph.invoke(initialState);
  return result;
};

// ── Quick test — run with: node index.js ────────────────────────────
// Remove or comment this block in production
const isMainModule = process.argv[1]?.endsWith("index.js");
if (isMainModule) {
  const testCompany = process.argv[2] || "Apple";
  console.log("\n🚀 Testing AI Investment Research Agent");
  console.log("Company:", testCompany);
  console.log("─".repeat(50));

  runInvestmentResearch(testCompany)
    .then((result) => {
      console.log("\n📋 FINAL RESULT:");
      console.log("─".repeat(50));
      console.log("Verdict:    ", result.verdict);
      console.log("Confidence: ", result.confidenceScore + "%");
      console.log("Summary:    ", result.summary);
      console.log("Reasoning:  ", result.reasoning);
    })
    .catch(console.error);
}