import { pathToFileURL } from "url";
import path              from "path";
import { fileURLToPath } from "url";
import dotenv            from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const agentPath = path.resolve(__dirname, "../../agent/index.js");

export const runResearchService = async (companyName) => {
  try {
    process.env.GROQ_API_KEY          = process.env.GROQ_API_KEY;
    process.env.TAVILY_API_KEY        = process.env.TAVILY_API_KEY;
    process.env.ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
    process.env.TWELVE_DATA_API_KEY   = process.env.TWELVE_DATA_API_KEY;

    // Works both locally and on Render
    const isProd    = process.env.NODE_ENV === "production";
    const agentPath = isProd
      ? path.resolve(__dirname, "../../AGENT/index.js")    // Render path
      : path.resolve(__dirname, "../../../AGENT/index.js"); // Local path

    const agentURL = pathToFileURL(agentPath).href;
    console.log("Loading AGENT from:", agentURL);

    const { runInvestmentResearch } = await import(agentURL);
    const result = await runInvestmentResearch(companyName);

    return {
      companyName:     result.companyName,
      ticker:          result.ticker,
      companyProfile:  result.companyProfile,
      financialData:   result.financialData,
      financialScore:  result.financialScore,
      recentNews:      result.recentNews,
      newsScore:       result.newsScore,
      sentimentResult: result.sentimentResult,
      sentimentScore:  result.sentimentScore,
      riskFactors:     result.riskFactors,
      riskScore:       result.riskScore,
      moatAnalysis:    result.moatAnalysis,
      verdict:         result.verdict,
      confidenceScore: result.confidenceScore,
      reasoning:       result.reasoning,
      summary:         result.summary,
      steps:           result.steps,
      errors:          result.errors,
      startedAt:       result.startedAt,
      completedAt:     result.completedAt,
    };
  } catch (error) {
    console.error("Research service error:", error.message);
    throw new Error(`Agent failed: ${error.message}`);
  }
};