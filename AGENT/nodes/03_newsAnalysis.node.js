import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { fetchCompanyNewsArticles, formatArticlesForPrompt } from "../tools/news.tool.js";
import { PROMPTS } from "../prompts/systemPrompts.js";

const llm = new ChatGroq({
  model:       "llama-3.3-70b-versatile",
  temperature: 0,
  apiKey:      process.env.GROQ_API_KEY,
});

export const newsAnalysisNode = async (state) => {
  console.log("📰 Node 3: Analyzing news for —", state.companyName);
  try {
    const articles     = await fetchCompanyNewsArticles(state.companyName, state.ticker);
    const articlesText = formatArticlesForPrompt(articles);
    const response = await llm.invoke([
      new SystemMessage(PROMPTS.NEWS_ANALYSIS),
      new HumanMessage(`Company: ${state.companyName} (${state.ticker})\n\nRecent News:\n${articlesText}`),
    ]);
    let newsAnalysis = null;
    try {
      const cleaned = response.content.trim().replace(/```json|```/g, "").trim();
      newsAnalysis = JSON.parse(cleaned);
    } catch {
      newsAnalysis = { newsScore: 5, sentiment: "neutral", summary: "Could not analyze news" };
    }
    console.log("✅ Node 3 complete — News score:", newsAnalysis.newsScore);
    return {
      ...state,
      recentNews: articles,
      newsScore:  newsAnalysis.newsScore || 5,
      steps: [...state.steps, {
        node:    "node_newsAnalysis",
        status:  "completed",
        message: `Analyzed ${articles.length} articles. Score: ${newsAnalysis.newsScore}/10`,
        data:    newsAnalysis,
      }],
    };
  } catch (error) {
    console.error("❌ Node 3 error:", error.message);
    return {
      ...state,
      newsScore: 0,
      errors: [...state.errors, { node: "node_newsAnalysis", error: error.message }],
      steps:  [...state.steps, { node: "node_newsAnalysis", status: "failed", message: error.message }],
    };
  }
};