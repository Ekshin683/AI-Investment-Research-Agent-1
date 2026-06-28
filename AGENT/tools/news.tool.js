// tools/news.tool.js
// News aggregation tool — fetches and formats news using Tavily
// ⚠️  REQUIRES: TAVILY_API_KEY in your .env file

import { searchCompanyNews } from "./webSearch.tool.js";

// ── Fetch and Format News Articles ──────────────────────────────────
export const fetchCompanyNewsArticles = async (companyName, ticker = "") => {
  try {
    const rawResults = await searchCompanyNews(companyName, ticker);

    // rawResults comes back as a JSON string from Tavily
    let articles = [];
    if (typeof rawResults === "string") {
      articles = JSON.parse(rawResults);
    } else if (Array.isArray(rawResults)) {
      articles = rawResults;
    }

    // Format articles into clean objects
    const formatted = articles.map((article, index) => ({
      id:      index + 1,
      title:   article.title || "No title",
      url:     article.url || "",
      content: article.content
        ? article.content.substring(0, 500)  // Limit to 500 chars
        : "No content available",
      score:   article.score || 0,           // Relevance score from Tavily
    }));

    return formatted;
  } catch (error) {
    console.error("Error fetching news articles:", error.message);
    return [];
  }
};

// ── Format Articles for LLM Prompt ──────────────────────────────────
// Converts article array into readable text for the LLM
export const formatArticlesForPrompt = (articles) => {
  if (!articles || articles.length === 0) {
    return "No recent news articles found.";
  }

  return articles
    .map(
      (article, i) => `
Article ${i + 1}:
Title: ${article.title}
Content: ${article.content}
URL: ${article.url}
`
    )
    .join("\n---\n");
};