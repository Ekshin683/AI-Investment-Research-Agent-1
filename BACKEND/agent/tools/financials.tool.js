// tools/financials.tool.js
// Alpha Vantage financial data tool
// Get free key at: https://www.alphavantage.co/support/#api-key

const BASE_URL = "https://www.alphavantage.co/query";
const API_KEY  = process.env.ALPHA_VANTAGE_API_KEY;

// ── Fetch Company Overview ───────────────────────────────────────────
export const fetchCompanyOverview = async (ticker) => {
  try {
    const url      = `${BASE_URL}?function=OVERVIEW&symbol=${ticker}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data     = await response.json();

    if (data["Error Message"] || data["Note"] || !data.Symbol) {
      console.warn("Alpha Vantage warning:", data["Error Message"] || data["Note"]);
      return null;
    }

    return {
      ticker:          data.Symbol,
      name:            data.Name,
      sector:          data.Sector,
      industry:        data.Industry,
      marketCap:       data.MarketCapitalization,
      peRatio:         data.PERatio,
      pegRatio:        data.PEGRatio,
      eps:             data.EPS,
      revenuePerShare: data.RevenuePerShareTTM,
      profitMargin:    data.ProfitMargin,
      operatingMargin: data.OperatingMarginTTM,
      returnOnEquity:  data.ReturnOnEquityTTM,
      returnOnAssets:  data.ReturnOnAssetsTTM,
      revenueGrowth:   data.QuarterlyRevenueGrowthYOY,
      earningsGrowth:  data.QuarterlyEarningsGrowthYOY,
      debtToEquity:    data.DebtToEquityRatio,
      dividendYield:   data.DividendYield,
      week52High:      data["52WeekHigh"],
      week52Low:       data["52WeekLow"],
      analystTarget:   data.AnalystTargetPrice,
      beta:            data.Beta,
    };
  } catch (error) {
    console.error("Error fetching company overview:", error.message);
    return null;
  }
};

// ── Fetch Latest Quote ───────────────────────────────────────────────
export const fetchStockQuote = async (ticker) => {
  try {
    const url      = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data     = await response.json();
    const quote    = data["Global Quote"];

    if (!quote || !quote["05. price"]) return null;

    return {
      price:         quote["05. price"],
      change:        quote["09. change"],
      changePercent: quote["10. change percent"],
      volume:        quote["06. volume"],
      high:          quote["03. high"],
      low:           quote["04. low"],
      previousClose: quote["08. previous close"],
    };
  } catch (error) {
    console.error("Error fetching stock quote:", error.message);
    return null;
  }
};

// ── Calculate Financial Score ────────────────────────────────────────
export const calculateFinancialScore = (overview, quote) => {
  if (!overview) return 0;

  let score = 5;

  const pe = parseFloat(overview.peRatio);
  if (!isNaN(pe)) {
    if (pe > 0 && pe < 15) score += 1.5;
    else if (pe < 25)      score += 1;
    else if (pe > 50)      score -= 1;
  }

  const margin = parseFloat(overview.profitMargin);
  if (!isNaN(margin)) {
    if (margin > 0.20)      score += 1.5;
    else if (margin > 0.10) score += 0.5;
    else if (margin < 0)    score -= 2;
  }

  const growth = parseFloat(overview.revenueGrowth);
  if (!isNaN(growth)) {
    if (growth > 0.20)      score += 1;
    else if (growth > 0.10) score += 0.5;
    else if (growth < 0)    score -= 1;
  }

  const roe = parseFloat(overview.returnOnEquity);
  if (!isNaN(roe)) {
    if (roe > 0.20)         score += 1;
    else if (roe > 0.10)    score += 0.5;
    else if (roe < 0)       score -= 1;
  }

  return Math.min(10, Math.max(0, Math.round(score * 10) / 10));
};
