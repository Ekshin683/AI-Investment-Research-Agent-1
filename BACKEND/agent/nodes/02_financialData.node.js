// nodes/02_financialData.node.js
// Node 2 — Fetches real financial data from Alpha Vantage
// Simple version — works great for US stocks

import {
  fetchCompanyOverview,
  fetchStockQuote,
  calculateFinancialScore,
} from "../tools/financials.tool.js";

export const financialDataNode = async (state) => {
  console.log("📊 Node 2: Fetching financial data for —", state.ticker);

  try {
    const ticker = state.ticker;

    // Skip if no ticker found
    if (!ticker || ticker === "UNKNOWN") {
      console.warn("⚠️  No ticker available, skipping financial data");
      return {
        ...state,
        financialData:  null,
        financialScore: 3,
        steps: [
          ...state.steps,
          {
            node:    "node_financialData",
            status:  "skipped",
            message: "No ticker symbol found, skipping financial data",
          },
        ],
      };
    }

    // Fetch overview and quote in parallel
    const [overview, quote] = await Promise.all([
      fetchCompanyOverview(ticker),
      fetchStockQuote(ticker),
    ]);

    // Calculate financial score
    const financialScore = calculateFinancialScore(overview, quote);

    const financialData = {
      overview,
      quote,
      fetchedAt: new Date().toISOString(),
    };

    console.log("✅ Node 2 complete — Financial score:", financialScore);

    return {
      ...state,
      financialData,
      financialScore,
      steps: [
        ...state.steps,
        {
          node:    "node_financialData",
          status:  "completed",
          message: `Financial data fetched. Score: ${financialScore}/10`,
        },
      ],
    };
  } catch (error) {
    console.error("❌ Node 2 error:", error.message);
    return {
      ...state,
      financialScore: 0,
      errors: [...state.errors, { node: "node_financialData", error: error.message }],
      steps: [
        ...state.steps,
        { node: "node_financialData", status: "failed", message: error.message },
      ],
    };
  }
};
