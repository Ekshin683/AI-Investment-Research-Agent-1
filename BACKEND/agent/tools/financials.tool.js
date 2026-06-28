// tools/financials.tool.js
// Alpha Vantage financial data tool — fetches real stock/financial data
// ⚠️  REQUIRES: ALPHA_VANTAGE_API_KEY in your .env file
// Get your free key at: https://www.alphavantage.co/support/#api-key

import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://www.alphavantage.co/query";
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;  // ← YOUR KEY GOES IN .env

// ── Fetch Company Overview ───────────────────────────────────────────
// Returns P/E ratio, EPS, market cap, sector, and more
export const fetchCompanyOverview = async (ticker) => {
  try {
    const url = `${BASE_URL}?function=OVERVIEW&symbol=${ticker}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data["Error Message"] || data["Note"]) {
      console.warn("Alpha Vantage warning:", data["Error Message"] || data["Note"]);
      return null;
    }

    return {
      ticker:           data.Symbol,
      name:             data.Name,
      sector:           data.Sector,
      industry:         data.Industry,
      marketCap:        data.MarketCapitalization,
      peRatio:          data.PERatio,
      pegRatio:         data.PEGRatio,
      eps:              data.EPS,
      revenuePerShare:  data.RevenuePerShareTTM,
      profitMargin:     data.ProfitMargin,
      operatingMargin:  data.OperatingMarginTTM,
      returnOnEquity:   data.ReturnOnEquityTTM,
      returnOnAssets:   data.ReturnOnAssetsTTM,
      revenueGrowth:    data.QuarterlyRevenueGrowthYOY,
      earningsGrowth:   data.QuarterlyEarningsGrowthYOY,
      debtToEquity:     data.DebtToEquityRatio,
      dividendYield:    data.DividendYield,
      week52High:       data["52WeekHigh"],
      week52Low:        data["52WeekLow"],
      analystTarget:    data.AnalystTargetPrice,
      beta:             data.Beta,
    };
  } catch (error) {
    console.error("Error fetching company overview:", error.message);
    return null;
  }
};

// ── Fetch Latest Quote ───────────────────────────────────────────────
// Returns current stock price and daily change
export const fetchStockQuote = async (ticker) => {
  try {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const quote = data["Global Quote"];

    if (!quote || !quote["05. price"]) return null;

    return {
      price:          quote["05. price"],
      change:         quote["09. change"],
      changePercent:  quote["10. change percent"],
      volume:         quote["06. volume"],
      high:           quote["03. high"],
      low:            quote["04. low"],
      previousClose:  quote["08. previous close"],
    };
  } catch (error) {
    console.error("Error fetching stock quote:", error.message);
    return null;
  }
};

// ── Calculate Financial Score ────────────────────────────────────────
// Scores the company 0-10 based on key financial metrics
export const calculateFinancialScore = (overview, quote) => {
  if (!overview) return 0;

  let score = 5; // Start neutral

  // P/E Ratio check (lower is generally better, but not too low)
  const pe = parseFloat(overview.peRatio);
  if (!isNaN(pe)) {
    if (pe > 0 && pe < 15)  score += 1.5;  // Undervalued
    else if (pe < 25)       score += 1;    // Fair value
    else if (pe > 50)       score -= 1;    // Expensive
  }

  // Profit margin check
  const margin = parseFloat(overview.profitMargin);
  if (!isNaN(margin)) {
    if (margin > 0.20)      score += 1.5;  // Very profitable
    else if (margin > 0.10) score += 0.5;  // Decent margin
    else if (margin < 0)    score -= 2;    // Losing money
  }

  // Revenue growth check
  const growth = parseFloat(overview.revenueGrowth);
  if (!isNaN(growth)) {
    if (growth > 0.20)      score += 1;    
    else if (growth > 0.10) score += 0.5;  
    else if (growth < 0)    score -= 1;    
  }

  // Return on equity
  const roe = parseFloat(overview.returnOnEquity);
  if (!isNaN(roe)) {
    if (roe > 0.20)         score += 1;    
    else if (roe > 0.10)    score += 0.5;  
    else if (roe < 0)       score -= 1;    
  }

  return Math.min(10, Math.max(0, Math.round(score * 10) / 10));
};