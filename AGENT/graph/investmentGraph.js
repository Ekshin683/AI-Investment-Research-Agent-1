// graph/investmentGraph.js
import { StateGraph, END } from "@langchain/langgraph";
import { stateAnnotation }          from "./stateSchema.js";
import { companySearchNode }        from "../nodes/01_companySearch.node.js";
import { financialDataNode }        from "../nodes/02_financialData.node.js";
import { newsAnalysisNode }         from "../nodes/03_newsAnalysis.node.js";
import { sentimentAnalysisNode }    from "../nodes/04_sentimentAnalysis.node.js";
import { riskAssessmentNode }       from "../nodes/05_riskAssessment.node.js";
import { verdictDecisionNode }      from "../nodes/06_verdictDecision.node.js";

const buildInvestmentGraph = () => {
  const graph = new StateGraph({ channels: stateAnnotation });

  // ── Add nodes (names must NOT match state attribute names) ──────────
  graph.addNode("node_companySearch",     companySearchNode);
  graph.addNode("node_financialData",     financialDataNode);
  graph.addNode("node_newsAnalysis",      newsAnalysisNode);
  graph.addNode("node_sentimentAnalysis", sentimentAnalysisNode);
  graph.addNode("node_riskAssessment",    riskAssessmentNode);
  graph.addNode("node_verdictDecision",   verdictDecisionNode);

  // ── Define execution order ──────────────────────────────────────────
  graph.addEdge("__start__",              "node_companySearch");
  graph.addEdge("node_companySearch",     "node_financialData");
  graph.addEdge("node_financialData",     "node_newsAnalysis");
  graph.addEdge("node_newsAnalysis",      "node_sentimentAnalysis");
  graph.addEdge("node_sentimentAnalysis", "node_riskAssessment");
  graph.addEdge("node_riskAssessment",    "node_verdictDecision");
  graph.addEdge("node_verdictDecision",   END);

  return graph.compile();
};

export const investmentGraph = buildInvestmentGraph();