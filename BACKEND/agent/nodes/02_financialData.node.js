export const financialDataNode = async (state) => {
  console.log("📊 Node 2: Fetching financial data for —", state.ticker);

  try {
    const ticker = state.ticker;

    // Skip gracefully if no ticker
    if (!ticker || ticker === "UNKNOWN") {
      console.warn("⚠️ No ticker — skipping financial data");
      return {
        ...state,
        financialData:  null,
        financialScore: 5,
        steps: [...state.steps, {
          node:    "node_financialData",
          status:  "completed",
          message: "No ticker found — using AI-based analysis only",
        }],
      };
    }

    const [overview, quote] = await Promise.all([
      fetchCompanyOverview(ticker).catch(() => null),
      fetchStockQuote(ticker).catch(() => null),
    ]);

    const financialScore = calculateFinancialScore(overview, quote);

    console.log("✅ Node 2 complete — Score:", financialScore);

    return {
      ...state,
      financialData:  { overview, quote, fetchedAt: new Date().toISOString() },
      financialScore,
      steps: [...state.steps, {
        node:    "node_financialData",
        status:  "completed",
        message: `Financial data fetched. Score: ${financialScore}/10`,
      }],
    };

  } catch (error) {
    // Never let Node 2 kill the whole pipeline
    console.error("❌ Node 2 error:", error.message);
    return {
      ...state,
      financialData:  null,
      financialScore: 5,
      errors: [...state.errors, { node: "node_financialData", error: error.message }],
      steps: [...state.steps, {
        node:    "node_financialData",
        status:  "completed",
        message: "Financial data unavailable — continuing with other analysis",
      }],
    };
  }
};