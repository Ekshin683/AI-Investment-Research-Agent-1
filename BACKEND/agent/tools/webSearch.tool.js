// tools/webSearch.tool.js
import { tavily } from "@tavily/core";

const createTavilyClient = () => {
  const apiKey = process.env.TAVILY_API_KEY;
  console.log("Tavily key prefix:", apiKey?.substring(0, 10));

  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is missing. Add it to your .env file.");
  }

  return tavily({ apiKey });
};

export const searchCompanyInfo = async (companyName) => {
  try {
    const client   = createTavilyClient();
    const response = await client.search(
      `${companyName} company stock ticker financial overview 2024`,
      { maxResults: 5, includeAnswer: true, includeRawContent: false }
    );

    const resultsText = response.results
      .map((r, i) => `Result ${i + 1}:\nTitle: ${r.title}\nContent: ${r.content}\nURL: ${r.url}`)
      .join("\n\n---\n\n");

    return resultsText;
  } catch (error) {
    console.error("Web search error:", error.message);
    return `Could not search for ${companyName}`;
  }
};

export const searchCompanyNews = async (companyName, ticker = "") => {
  try {
    const client   = createTavilyClient();
    const response = await client.search(
      `${companyName} ${ticker} latest news 2024 stock market earnings`,
      { maxResults: 8, includeAnswer: false, includeRawContent: false, topic: "news" }
    );
    return response.results || [];
  } catch (error) {
    console.error("News search error:", error.message);
    return [];
  }
};