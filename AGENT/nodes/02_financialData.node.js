export const financialDataNode = async (state) => {
  console.log("📊 Node 2: Fetching financial data for —", state.ticker);

  try {
    const ticker = state.ticker;

    if (!ticker || ticker === "UNKNOWN") {
      return {
        ...state,
        financialData:  null,
        financialScore: 3,
        steps: [...state.steps, {
          node:    "node_financialData",
          status:  "skipped",
          message: "No ticker symbol found",
        }],
      };
    }

    const [overview, quote] = await Promise.all([
      fetchCompanyOverview(ticker),
      fetchStockQuote(ticker),
    ]);

    // If no data returned (Indian/non-US stock), use fallback
    if (!overview && !quote) {
      console.warn("⚠️  No financial data — possibly non-US stock:", ticker);

      // Try searching web for basic financials as fallback
      const { searchCompanyInfo } = await import("../tools/webSearch.tool.js");
      const webData = await searchCompanyInfo(`${state.companyName} stock price PE ratio financials 2024`);

      return {
        ...state,
        financialData:  { overview: null, quote: null, webFallback: webData, isNonUS: true },
        financialScore: 5, // neutral score when no data
        steps: [...state.steps, {
          node:    "node_financialData",
          status:  "completed",
          message: `Non-US stock detected (${ticker}). Using web-based financial data.`,
        }],
      };
    }

    const financialScore = calculateFinancialScore(overview, quote);

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
    console.error("❌ Node 2 error:", error.message);
    return {
      ...state,
      financialScore: 0,
      errors: [...state.errors, { node: "node_financialData", error: error.message }],
      steps:  [...state.steps, { node: "node_financialData", status: "failed", message: error.message }],
    };
  }
};