import { useState, useEffect, useRef } from "react";
import SearchBar    from "../components/SearchBar";
import ResearchCard from "../components/ResearchCard";
import StepProgress from "../components/StepProgress";
import { startResearch, getAllResearch } from "../api/researchClient";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// ── Chatbot Component ─────────────────────────────────────────────────
const Chatbot = ({ researchData }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Terminal AI session established. I have analyzed ${researchData?.companyName || "the company"} and reached a ${researchData?.verdict || "verdict"} decision with ${researchData?.confidenceScore || 0}% confidence. Ask me anything.`,
    },
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const buildContext = () => {
    if (!researchData) return "No research data available.";
    return `
Company: ${researchData.companyName} (${researchData.ticker})
Sector: ${researchData.companyProfile?.sector || "N/A"}
Verdict: ${researchData.verdict}
Confidence: ${researchData.confidenceScore}%
Financial Score: ${researchData.financialScore}/10
News Score: ${researchData.newsScore}/10
Sentiment: ${researchData.sentimentResult?.sentimentResult || "N/A"}
Analyst Consensus: ${researchData.sentimentResult?.analystConsensus || "N/A"}
Risk Score: ${researchData.riskScore}/10
Moat: ${researchData.moatAnalysis || "N/A"}
P/E Ratio: ${researchData.financialData?.overview?.peRatio || "N/A"}
EPS: ${researchData.financialData?.overview?.eps || "N/A"}
Profit Margin: ${researchData.financialData?.overview?.profitMargin || "N/A"}
Revenue Growth: ${researchData.financialData?.overview?.revenueGrowth || "N/A"}
Current Price: ${researchData.financialData?.quote?.price || "N/A"}
Analyst Target: ${researchData.financialData?.overview?.analystTarget || "N/A"}
52W High: ${researchData.financialData?.overview?.week52High || "N/A"}
52W Low: ${researchData.financialData?.overview?.week52Low || "N/A"}
Summary: ${researchData.summary || "N/A"}
Reasoning: ${researchData.reasoning || "N/A"}
Risk Factors: ${researchData.riskFactors?.map(r => r.factor).join(", ") || "N/A"}
    `.trim();
  };

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/research/chat`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message:         userMsg,
          researchContext: buildContext(),
        }),
      });
      const data = await res.json();
      setMessages((m) => [...m, {
        role: "assistant",
        text: data.success ? data.reply : "Sorry, I couldn't process that.",
      }]);
    } catch {
      setMessages((m) => [...m, {
        role: "assistant",
        text: "Connection error. Make sure the backend is running.",
      }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* Messages area */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        paddingBottom: "8px",
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex", gap: "10px", alignItems: "flex-start",
            flexDirection: msg.role === "user" ? "row-reverse" : "row",
          }}>
            {/* Avatar */}
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px",
              background: msg.role === "assistant" ? "rgba(0,255,157,0.2)" : "rgba(0,180,255,0.2)",
              border: `1px solid ${msg.role === "assistant" ? "rgba(0,255,157,0.4)" : "rgba(0,180,255,0.4)"}`,
              color: msg.role === "assistant" ? "#00ff9d" : "#00b4ff",
            }}>
              {msg.role === "assistant" ? "✦" : "U"}
            </div>
            {/* Bubble */}
            <div style={{
              maxWidth: "78%", padding: "10px 14px", borderRadius: "12px",
              fontSize: "13px", lineHeight: "1.6", color: "#e2e8f0",
              background: msg.role === "assistant" ? "rgba(0,255,157,0.05)" : "rgba(0,180,255,0.08)",
              border: `1px solid ${msg.role === "assistant" ? "rgba(0,255,157,0.15)" : "rgba(0,180,255,0.2)"}`,
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: "rgba(0,255,157,0.2)", border: "1px solid rgba(0,255,157,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#00ff9d", fontSize: "12px",
            }}>✦</div>
            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{
                  width: "6px", height: "6px", borderRadius: "50%", background: "#00ff9d",
                  display: "inline-block", animation: `pulse-dot 1s infinite ${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input — fixed at bottom of chat panel, above bottom nav */}
      <div style={{
        padding: "12px 14px",
        borderTop: "1px solid #1e2d3d",
        background: "#0d1521",
        flexShrink: 0,
      }}>
        <div style={{
          display: "flex", gap: "8px", alignItems: "center",
          background: "#111827", border: "1px solid #2d3748",
          borderRadius: "10px", padding: "10px 14px",
        }}>
          <span style={{ color: "#00ff9d", fontFamily: "monospace", fontSize: "13px", flexShrink: 0 }}>
            &gt;_
          </span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about this investment..."
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "white", fontFamily: "monospace", fontSize: "13px",
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              background: input.trim() && !loading ? "#00ff9d" : "#1e2d3d",
              color: input.trim() && !loading ? "black" : "#4a5568",
              border: "none", borderRadius: "6px", padding: "6px 14px",
              fontFamily: "monospace", fontWeight: "bold", fontSize: "11px",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              transition: "all 0.2s", flexShrink: 0,
            }}>
            EXEC
          </button>
        </div>
        <p style={{
          fontSize: "10px", fontFamily: "monospace", color: "#2d3748",
          marginTop: "6px", textAlign: "center",
        }}>
          PRESS ENTER TO SUBMIT OR CLICK EXEC
        </p>
      </div>
    </div>
  );
};

// ── Score Ring ────────────────────────────────────────────────────────
const ScoreRing = ({ score, label, max = 10, onClick }) => {
  const pct         = (score / max) * 100;
  const radius      = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDash  = (pct / 100) * circumference;
  const color = pct >= 70 ? "#00ff9d" : pct >= 45 ? "#ffd32a" : "#ff4757";

  return (
    <div onClick={onClick} style={{ display: "flex", flexDirection: "column", alignItems: "center",
      gap: "6px", cursor: onClick ? "pointer" : "default" }}>
      <div style={{ position: "relative", width: "72px", height: "72px" }}>
        <svg style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }} viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={radius} fill="none" stroke="#1e2d3d" strokeWidth="5" />
          <circle cx="36" cy="36" r={radius} fill="none" stroke={color} strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke-dasharray 1s ease" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "center" }}>
          <span style={{ fontSize: "14px", fontFamily: "monospace", fontWeight: "bold", color }}>{score}</span>
        </div>
      </div>
      <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#4a5568",
        textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
        {label}
      </span>
    </div>
  );
};

// ── Metric Box ────────────────────────────────────────────────────────
const MetricBox = ({ label, value, color = "white", icon = "" }) => (
  <div style={{ background: "#0d1521", border: "1px solid #1e2d3d", borderRadius: "10px",
    padding: "14px 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
    <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#4a5568", textTransform: "uppercase",
      letterSpacing: "0.08em" }}>{icon} {label}</span>
    <span style={{ fontSize: "18px", fontFamily: "monospace", fontWeight: "bold", color }}>{value}</span>
  </div>
);

// ── Risk Badge ────────────────────────────────────────────────────────
const RiskBadge = ({ severity }) => {
  const colors = {
    High:   { bg: "rgba(255,71,87,0.15)",  border: "rgba(255,71,87,0.4)",  text: "#ff4757" },
    Medium: { bg: "rgba(255,211,42,0.15)", border: "rgba(255,211,42,0.4)", text: "#ffd32a" },
    Low:    { bg: "rgba(0,180,255,0.15)",  border: "rgba(0,180,255,0.4)",  text: "#00b4ff" },
  };
  const c = colors[severity] || colors.Low;
  return (
    <span style={{ fontSize: "10px", fontFamily: "monospace", fontWeight: "bold",
      padding: "2px 8px", borderRadius: "4px", background: c.bg, border: `1px solid ${c.border}`,
      color: c.text, flexShrink: 0 }}>
      {severity}
    </span>
  );
};

// ── Dashboard View ────────────────────────────────────────────────────
const DashboardView = ({ data }) => {
  const [activeScore, setActiveScore] = useState(null);
  const overview = data?.financialData?.overview;
  const quote    = data?.financialData?.quote;

  const verdictColor = data?.verdict === "INVEST" ? "#00ff9d"
    : data?.verdict === "PASS" ? "#ff4757" : "#ffd32a";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Row 1 — Header box */}
      <div style={{ background: "#111827", border: "1px solid #1e2d3d", borderRadius: "14px", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
              <span style={{ fontSize: "12px", fontFamily: "monospace", color: "#00ff9d",
                background: "rgba(0,255,157,0.1)", padding: "2px 8px", borderRadius: "4px",
                border: "1px solid rgba(0,255,157,0.3)" }}>${data.ticker}</span>
              <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#4a5568" }}>
                {data.companyProfile?.exchange || "NASDAQ"}
              </span>
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "white", margin: "4px 0" }}>
              {data.companyName}
            </h2>
            <p style={{ fontSize: "11px", color: "#4a5568", fontFamily: "monospace" }}>
              {data.companyProfile?.sector} · {data.companyProfile?.industry}
            </p>
          </div>
          {/* Verdict */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <div style={{ padding: "8px 18px", borderRadius: "10px", fontFamily: "monospace",
              fontWeight: "bold", fontSize: "16px", letterSpacing: "0.1em",
              background: `${verdictColor}20`, border: `1px solid ${verdictColor}60`, color: verdictColor }}>
              {data.verdict === "INVEST" ? "▲" : data.verdict === "PASS" ? "▼" : "●"} {data.verdict}
            </div>
            <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#4a5568" }}>
              {data.confidenceScore}% confidence
            </span>
          </div>
        </div>

        {/* Price row */}
        {quote?.price ? (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "12px", borderTop: "1px solid #1e2d3d" }}>
    <span style={{ fontSize: "28px", fontFamily: "monospace", fontWeight: "bold", color: "white" }}>
      ${parseFloat(quote.price).toFixed(2)}
    </span>
    <span style={{ fontSize: "14px", fontFamily: "monospace", color: parseFloat(quote.changePercent) >= 0 ? "#00ff9d" : "#ff4757" }}>
      {parseFloat(quote.changePercent) >= 0 ? "▲" : "▼"} {quote.changePercent}
    </span>
  </div>
) : (
  <div style={{ paddingTop: "12px", borderTop: "1px solid #1e2d3d" }}>
    <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#ffd32a",
      background: "rgba(255,211,42,0.1)", padding: "4px 10px", borderRadius: "6px",
      border: "1px solid rgba(255,211,42,0.3)" }}>
      ⚠ Non-US stock — live price data unavailable via free API tier
    </span>
  </div>
)}
      </div>

      {/* Row 2 — Score rings */}
      <div style={{ background: "#111827", border: "1px solid #1e2d3d", borderRadius: "14px", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#4a5568", textTransform: "uppercase",
            letterSpacing: "0.08em" }}>Analysis Scores</span>
          <span style={{ fontSize: "13px", fontFamily: "monospace", color: "#00ff9d", fontWeight: "bold" }}>
            {data.confidenceScore}% overall
          </span>
        </div>
        {/* Confidence bar */}
        <div style={{ height: "4px", background: "#1e2d3d", borderRadius: "2px", marginBottom: "20px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${data.confidenceScore}%`, background: "#00ff9d",
            borderRadius: "2px", boxShadow: "0 0 8px rgba(0,255,157,0.5)", transition: "width 1s ease" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          <ScoreRing score={data.financialScore} label="Financial"
            onClick={() => setActiveScore(activeScore === "financial" ? null : "financial")} />
          <ScoreRing score={data.newsScore}      label="News"
            onClick={() => setActiveScore(activeScore === "news" ? null : "news")} />
          <ScoreRing score={data.sentimentScore} label="Sentiment"
            onClick={() => setActiveScore(activeScore === "sentiment" ? null : "sentiment")} />
          <ScoreRing score={data.riskScore}      label="Risk"
            onClick={() => setActiveScore(activeScore === "risk" ? null : "risk")} />
        </div>

        {/* Expandable score detail */}
        {activeScore && (
          <div style={{ marginTop: "16px", padding: "14px", background: "#0d1521",
            borderRadius: "10px", border: "1px solid rgba(0,255,157,0.2)" }}>
            {activeScore === "financial" && (
              <div>
                <p style={{ fontSize: "11px", color: "#00ff9d", fontFamily: "monospace", marginBottom: "8px" }}>
                  FINANCIAL BREAKDOWN
                </p>
                <p style={{ fontSize: "12px", color: "#a0aec0" }}>
                  P/E: {overview?.peRatio || "N/A"} · EPS: {overview?.eps || "N/A"} · 
                  Margin: {overview?.profitMargin || "N/A"} · ROE: {overview?.returnOnEquity || "N/A"}
                </p>
              </div>
            )}
            {activeScore === "news" && (
              <div>
                <p style={{ fontSize: "11px", color: "#00ff9d", fontFamily: "monospace", marginBottom: "8px" }}>
                  NEWS BREAKDOWN
                </p>
                <p style={{ fontSize: "12px", color: "#a0aec0" }}>
                  {data.recentNews?.length || 0} articles analyzed. 
                  Score reflects recent media sentiment and coverage quality.
                </p>
              </div>
            )}
            {activeScore === "sentiment" && (
              <div>
                <p style={{ fontSize: "11px", color: "#00ff9d", fontFamily: "monospace", marginBottom: "8px" }}>
                  SENTIMENT BREAKDOWN
                </p>
                <p style={{ fontSize: "12px", color: "#a0aec0" }}>
                  {data.sentimentResult?.sentimentResult} · {data.sentimentResult?.analystConsensus} · 
                  Short: {data.sentimentResult?.shortTermOutlook} · Long: {data.sentimentResult?.longTermOutlook}
                </p>
              </div>
            )}
            {activeScore === "risk" && (
              <div>
                <p style={{ fontSize: "11px", color: "#00ff9d", fontFamily: "monospace", marginBottom: "8px" }}>
                  RISK BREAKDOWN
                </p>
                <p style={{ fontSize: "12px", color: "#a0aec0" }}>
                  {data.riskFactors?.length || 0} risk factors identified. {data.moatAnalysis}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Row 3 — Key metrics grid */}
      {overview && (
        <div style={{ background: "#111827", border: "1px solid #1e2d3d", borderRadius: "14px", padding: "20px" }}>
          <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#4a5568",
            textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
            Technical Indicators
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
            <MetricBox label="P/E Ratio"      value={overview.peRatio      || "N/A"} />
            <MetricBox label="EPS"            value={overview.eps          || "N/A"} color="#00ff9d" />
            <MetricBox label="Profit Margin"  value={overview.profitMargin || "N/A"} />
            <MetricBox label="Revenue Growth" value={overview.revenueGrowth || "N/A"}
              color={parseFloat(overview.revenueGrowth) > 0 ? "#00ff9d" : "#ff4757"} />
            <MetricBox label="52W High"       value={`$${overview.week52High || "N/A"}`} />
            <MetricBox label="52W Low"        value={`$${overview.week52Low  || "N/A"}`} />
            <MetricBox label="Analyst Target" value={`$${overview.analystTarget || "N/A"}`} color="#00b4ff" />
            <MetricBox label="Beta"           value={overview.beta          || "N/A"} />
          </div>
        </div>
      )}

      {/* Row 4 — Sentiment + Risk side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {/* Sentiment box */}
        {data.sentimentResult && (
          <div style={{ background: "#111827", border: "1px solid #1e2d3d", borderRadius: "14px", padding: "16px" }}>
            <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#4a5568",
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
              Sentiment
            </p>
            <div style={{ fontSize: "18px", fontFamily: "monospace", fontWeight: "bold", marginBottom: "8px",
              color: data.sentimentResult.sentimentResult === "Bullish" ? "#00ff9d"
                : data.sentimentResult.sentimentResult === "Bearish" ? "#ff4757" : "#ffd32a" }}>
              {data.sentimentResult.sentimentResult}
            </div>
            <div style={{ fontSize: "11px", fontFamily: "monospace", color: "#a0aec0",
              background: "rgba(0,255,157,0.08)", padding: "4px 8px", borderRadius: "6px",
              border: "1px solid rgba(0,255,157,0.2)", display: "inline-block" }}>
              {data.sentimentResult.analystConsensus}
            </div>
            <div style={{ marginTop: "10px", fontSize: "11px", color: "#4a5568", fontFamily: "monospace" }}>
              <div>ST: {data.sentimentResult.shortTermOutlook}</div>
              <div>LT: {data.sentimentResult.longTermOutlook}</div>
            </div>
          </div>
        )}

        {/* Risk box */}
        <div style={{ background: "#111827", border: "1px solid #1e2d3d", borderRadius: "14px", padding: "16px" }}>
          <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#4a5568",
            textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
            Risk Factors
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {data.riskFactors?.slice(0, 3).map((risk, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <RiskBadge severity={risk.severity} />
                <span style={{ fontSize: "11px", color: "#a0aec0", lineHeight: "1.4" }}>{risk.factor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 5 — Agent verdict box */}
      <div style={{ background: "#111827", border: `1px solid ${verdictColor}30`,
        borderRadius: "14px", padding: "20px",
        boxShadow: `0 0 20px ${verdictColor}10` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#4a5568",
            textTransform: "uppercase", letterSpacing: "0.08em" }}>Agent's Verdict</p>
          <span style={{ fontSize: "11px", fontFamily: "monospace", color: verdictColor,
            background: `${verdictColor}15`, padding: "2px 10px", borderRadius: "4px",
            border: `1px solid ${verdictColor}40` }}>
            CONFIDENCE: {data.confidenceScore}%
          </span>
        </div>
        <p style={{ fontSize: "13px", color: "#a0aec0", lineHeight: "1.7", marginBottom: "12px" }}>
          {data.reasoning}
        </p>
        {data.summary && (
          <div style={{ padding: "12px", background: `${verdictColor}08`,
            border: `1px solid ${verdictColor}20`, borderRadius: "8px" }}>
            <p style={{ fontSize: "12px", color: "#e2e8f0" }}>{data.summary}</p>
          </div>
        )}
      </div>

      {/* Row 6 — News feed */}
      {data.recentNews?.length > 0 && (
        <div style={{ background: "#111827", border: "1px solid #1e2d3d", borderRadius: "14px", padding: "20px" }}>
          <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#4a5568",
            textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
            News Feed
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {data.recentNews.slice(0, 4).map((article, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", paddingBottom: "12px",
                borderBottom: i < 3 ? "1px solid #1e2d3d" : "none" }}>
                <div style={{ width: "36px", height: "36px", background: "#0d1521", borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px", flexShrink: 0 }}>📰</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "12px", color: "white", fontWeight: "500",
                    lineHeight: "1.4", marginBottom: "4px",
                    overflow: "hidden", display: "-webkit-box",
                    WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {article.title}
                  </p>
                  {article.url && (
                    <a href={article.url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: "10px", color: "#00ff9d", fontFamily: "monospace",
                        textDecoration: "none" }}>
                      Read more →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Row 7 — Agent log */}
      <div style={{ background: "#111827", border: "1px solid #1e2d3d", borderRadius: "14px", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#4a5568",
            textTransform: "uppercase", letterSpacing: "0.08em" }}>Agent Log</p>
          <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#00ff9d",
            background: "rgba(0,255,157,0.1)", padding: "2px 8px", borderRadius: "4px",
            border: "1px solid rgba(0,255,157,0.3)" }}>TERMINAL</span>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: "11px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ color: "#00ff9d" }}>&gt; AGENT SESSION INITIALIZED</div>
          {data.steps?.map((step, i) => (
            <div key={i}>
              <div style={{ color: step.status === "completed" ? "#00ff9d" : "#ff4757" }}>
                &gt; [{step.node?.replace("node_", "").toUpperCase()}]{" "}
                {step.status === "completed" ? "✓" : "✗"}
              </div>
              {step.message && (
                <div style={{ color: "#4a5568", paddingLeft: "12px" }}>{step.message}</div>
              )}
            </div>
          ))}
          <div style={{ color: "#00ff9d", marginTop: "4px" }}>&gt; FINAL RECOMMENDATION:{" "}
            <span style={{ color: verdictColor, fontWeight: "bold" }}>{data.verdict} ■</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main HomePage ─────────────────────────────────────────────────────
const HomePage = () => {
  const [isLoading,  setIsLoading]  = useState(false);
  const [research,   setResearch]   = useState(null);
  const [status,     setStatus]     = useState(null);
  const [error,      setError]      = useState(null);
  const [history,    setHistory]    = useState([]);
  const [activeTab,  setActiveTab]  = useState("research");
  const [dots,       setDots]       = useState("");
  const [showChat,   setShowChat]   = useState(false);
  const pollRef = useRef(null);

  useEffect(() => {
    if (!isLoading) return;
    const i = setInterval(() => setDots((d) => d.length >= 3 ? "" : d + "."), 500);
    return () => clearInterval(i);
  }, [isLoading]);

  useEffect(() => {
    getAllResearch().then((r) => setHistory(r.data || [])).catch(console.error);
  }, []);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const pollForResult = (researchId) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/research/${researchId}`);
        const json = await res.json();
        const data = json.data;
        setResearch(data);
        if (data.status === "completed") {
          clearInterval(pollRef.current);
          setStatus("completed");
          setIsLoading(false);
          getAllResearch().then((r) => setHistory(r.data || [])).catch(console.error);
        } else if (data.status === "failed") {
          clearInterval(pollRef.current);
          setStatus("failed");
          setIsLoading(false);
          setError("Research failed. Please try again.");
        }
      } catch (err) {
        clearInterval(pollRef.current);
        setIsLoading(false);
        setError("Connection lost.");
      }
    }, 4000);
  };

  const handleSearch = async (companyName) => {
    setIsLoading(true);
    setError(null);
    setResearch(null);
    setStatus("running");
    setShowChat(false);
    try {
      const { researchId } = await startResearch(companyName);
      pollForResult(researchId);
    } catch (err) {
      setError(err.message);
      setStatus("failed");
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "insights",  icon: "⊞", label: "Insights"  },
    { id: "research",  icon: "📄", label: "Research"  },
    { id: "analyst",   icon: "💬", label: "Analyst"   },
    { id: "portfolio", icon: "📊", label: "Portfolio" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#070d14", position: "relative" }}>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, padding: "12px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(7,13,20,0.95)", borderBottom: "1px solid #1e2d3d",
        backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
            background: "rgba(0,255,157,0.15)", border: "1px solid rgba(0,255,157,0.3)" }}></div>
          <span style={{ fontFamily: "monospace", fontWeight: "bold", fontSize: "14px", color: "#00ff9d" }}>
            Stocks AI
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00ff9d",
              display: "inline-block", animation: "pulse-dot 1.5s infinite" }} />
            <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#00ff9d" }}>LIVE</span>
          </div>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontFamily: "monospace", fontWeight: "bold",
            background: "rgba(0,255,157,0.2)", color: "#00ff9d" }}>AI</div>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: "flex", height: "calc(100vh - 57px - 64px)" }}>

        {/* Left panel — main content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>

          {/* Title */}
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "10px", fontFamily: "monospace", color: "#00ff9d",
              letterSpacing: "0.1em", marginBottom: "4px" }}>REAL-TIME INTELLIGENCE</p>
            <h1 style={{ fontSize: "26px", fontWeight: "bold", color: "white", lineHeight: 1.2 }}>
              AI Investment <span style={{ color: "#00ff9d" }}>Research</span>
            </h1>
            <p style={{ fontSize: "12px", color: "#4a5568", marginTop: "4px" }}>
              Deep analysis powered by LangGraph AI agent pipeline
            </p>
          </div>

          {/* Search */}
          <div style={{ marginBottom: "20px" }}>
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: "16px", padding: "12px 16px", borderRadius: "10px",
              background: "rgba(255,71,87,0.1)", border: "1px solid rgba(255,71,87,0.3)",
              color: "#ff4757", fontFamily: "monospace", fontSize: "13px" }}>
              ✗ {error}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ padding: "14px 16px", borderRadius: "12px",
                background: "rgba(0,255,157,0.05)", border: "1px solid rgba(0,255,157,0.2)",
                display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00ff9d",
                  flexShrink: 0, animation: "pulse-dot 1.5s infinite" }} />
                <div>
                  <p style={{ fontSize: "12px", fontFamily: "monospace", color: "#00ff9d" }}>
                    AGENT RUNNING{dots}
                  </p>
                  <p style={{ fontSize: "11px", color: "#4a5568", marginTop: "2px" }}>
                    Processing 6 analysis nodes — takes 30–90 seconds
                  </p>
                </div>
              </div>
              {research && (
                <StepProgress steps={research.steps || []} status={status} />
              )}
            </div>
          )}

          {/* Dashboard result */}
          {!isLoading && research && status === "completed" && (
            <DashboardView data={research} />
          )}

          {/* History */}
          {!isLoading && !research && history.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <p style={{ fontSize: "10px", fontFamily: "monospace", color: "#4a5568",
                textTransform: "uppercase", letterSpacing: "0.08em" }}>Recent Research</p>
              {history.map((item) => {
                const vc = item.verdict === "INVEST" ? "#00ff9d"
                  : item.verdict === "PASS" ? "#ff4757" : "#ffd32a";
                return (
                  <div key={item._id} onClick={() => handleSearch(item.companyName)}
                    style={{ background: "#111827", border: "1px solid #1e2d3d", borderRadius: "12px",
                      padding: "14px 16px", display: "flex", alignItems: "center",
                      justifyContent: "space-between", cursor: "pointer" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#00ff9d" }}>
                          ${item.ticker}
                        </span>
                        <span style={{ fontSize: "14px", fontWeight: "500", color: "white" }}>
                          {item.companyName}
                        </span>
                      </div>
                      <p style={{ fontSize: "10px", color: "#4a5568", fontFamily: "monospace", marginTop: "2px" }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "12px", fontFamily: "monospace", fontWeight: "bold",
                        padding: "3px 10px", borderRadius: "6px",
                        background: `${vc}20`, border: `1px solid ${vc}50`, color: vc }}>
                        {item.verdict}
                      </span>
                      <span style={{ fontSize: "11px", color: "#4a5568", fontFamily: "monospace" }}>
                        {item.confidenceScore}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !research && history.length === 0 && (
            <div style={{ textAlign: "center", paddingTop: "60px" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>📊</div>
              <p style={{ fontSize: "14px", fontFamily: "monospace", color: "#4a5568" }}>
                Enter a company name to begin analysis
              </p>
              <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#1e2d3d", marginTop: "4px" }}>
                SYSTEM READY
              </p>
            </div>
          )}
        </div>

        {/* Right panel — Chatbot */}
{research && status === "completed" && (
  <div style={{
    width: "340px",
    borderLeft: "1px solid #1e2d3d",
    display: "flex",
    flexDirection: "column",
    background: "#0d1521",
    height: "100%",        // ← fills available height
    overflow: "hidden",    // ← prevents overflow
  }}>
    {/* Chat header */}
    <div style={{
      padding: "14px 16px",
      borderBottom: "1px solid #1e2d3d",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexShrink: 0,       // ← header doesn't shrink
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "14px" }}>✦</span>
        <span style={{ fontSize: "12px", fontFamily: "monospace",
          color: "#00ff9d", fontWeight: "bold" }}>AI Analyst</span>
      </div>
      <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#4a5568",
        background: "rgba(0,255,157,0.08)", padding: "2px 8px", borderRadius: "4px",
        border: "1px solid rgba(0,255,157,0.2)" }}>LIVE</span>
    </div>
    {/* Chatbot fills remaining height */}
    <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <Chatbot researchData={research} />
    </div>
  </div>
)}
      </div>

      {/* Bottom Navigation */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0d1521",
        borderTop: "1px solid #1e2d3d", display: "flex", justifyContent: "space-around",
        padding: "10px 0 16px", zIndex: 100 }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
              background: "none", border: "none", cursor: "pointer",
              color: activeTab === tab.id ? "#00ff9d" : "#4a5568" }}>
            <span style={{ fontSize: "18px" }}>{tab.icon}</span>
            <span style={{ fontSize: "10px", fontFamily: "monospace" }}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default HomePage;