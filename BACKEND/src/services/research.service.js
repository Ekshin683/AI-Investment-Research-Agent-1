import { pathToFileURL } from "url";
import path              from "path";
import { fileURLToPath } from "url";
import dotenv            from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export const runResearchService = async (companyName) => {
  try {
    // Force all keys into process.env
    process.env.GROQ_API_KEY         = process.env.GROQ_API_KEY;
    process.env.TAVILY_API_KEY       = process.env.TAVILY_API_KEY;
    process.env.ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

    console.log("✅ Keys check:");
    console.log("   Groq:   ", process.env.GROQ_API_KEY?.slice(0, 12));
    console.log("   Tavily: ", process.env.TAVILY_API_KEY?.slice(0, 12));
    console.log("   AlphaV: ", process.env.ALPHA_VANTAGE_API_KEY?.slice(0, 8));

    const agentPath = path.resolve(__dirname, "../../../AGENT/index.js");
    const agentURL  = pathToFileURL(agentPath).href;

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