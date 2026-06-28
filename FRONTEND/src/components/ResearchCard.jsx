// src/components/ResearchCard.jsx
import VerdictBadge from "./VerdictBadge";
import MetricRow    from "./MetricRow";
import ReasoningLog from "./ReasoningLog";

const ScoreRing = ({ score, label, max = 10 }) => {
  const pct        = (score / max) * 100;
  const radius     = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (pct / 100) * circumference;
  const color =
    pct >= 70 ? "#00ff9d" : pct >= 45 ? "#ffd32a" : "#ff4757";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={radius} fill="none" stroke="#1e2d3d" strokeWidth="4" />
          <circle
            cx="36" cy="36" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-mono font-bold" style={{ color }}>
            {score}
          </span>
        </div>
      </div>
      <span className="text-[9px] font-mono text-[#4a5568] uppercase tracking-wider text-center">
        {label}
      </span>
    </div>
  );
};

const ResearchCard = ({ data }) => {
  if (!data) return null;

  const {
    companyName, ticker, companyProfile,
    financialData, financialScore,
    newsScore, sentimentScore, riskScore,
    sentimentResult, riskFactors,
    verdict, confidenceScore,
    reasoning, summary, steps,
    recentNews, moatAnalysis,
  } = data;

  const overview = financialData?.overview;
  const quote    = financialData?.quote;

  return (
    <div className="space-y-4 animate-fade-in pb-24">

      {/* Header */}
      <div className="terminal-card">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-[#00ff9d]">${ticker}</span>
              <span className="text-xs font-mono text-[#4a5568]">
                {companyProfile?.exchange || "NASDAQ"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">{companyName}</h2>
            <p className="text-xs text-[#4a5568] font-mono mt-0.5">
              {companyProfile?.sector} · {companyProfile?.industry}
            </p>
          </div>
          <VerdictBadge verdict={verdict} size="md" />
        </div>

        {/* Price */}
        {quote?.price && (
          <div className="flex items-end gap-2 mt-3 pt-3 border-t border-[#1e2d3d]">
            <span className="text-2xl font-mono font-bold text-white">
              ${parseFloat(quote.price).toFixed(2)}
            </span>
            <span
              className={`text-sm font-mono mb-0.5 ${
                parseFloat(quote.changePercent) >= 0
                  ? "text-[#00ff9d]"
                  : "text-[#ff4757]"
              }`}
            >
              {quote.changePercent}
            </span>
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="mt-3 p-3 bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.15)] rounded-lg">
            <p className="text-xs text-[#a0aec0] leading-relaxed">{summary}</p>
          </div>
        )}
      </div>

      {/* Confidence + Score rings */}
      <div className="terminal-card">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-[#4a5568] uppercase tracking-wider">
            Analysis Scores
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#4a5568]">Confidence</span>
            <span className="text-sm font-mono font-bold text-[#00ff9d]">
              {confidenceScore}%
            </span>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="progress-bar mb-5">
          <div className="progress-bar-fill" style={{ width: `${confidenceScore}%` }} />
        </div>

        {/* Score rings */}
        <div className="grid grid-cols-4 gap-2">
          <ScoreRing score={financialScore} label="Financial" />
          <ScoreRing score={newsScore}      label="News" />
          <ScoreRing score={sentimentScore} label="Sentiment" />
          <ScoreRing score={riskScore}      label="Risk" />
        </div>
      </div>

      {/* Sentiment */}
      {sentimentResult && (
        <div className="terminal-card">
          <span className="text-xs font-mono text-[#4a5568] uppercase tracking-wider block mb-3">
            Sentiment Analysis
          </span>
          <div className="flex items-center justify-between mb-3">
            <span
              className={`text-lg font-mono font-bold ${
                sentimentResult.sentimentResult === "Bullish"
                  ? "text-[#00ff9d]"
                  : sentimentResult.sentimentResult === "Bearish"
                  ? "text-[#ff4757]"
                  : "text-[#ffd32a]"
              }`}
            >
              {sentimentResult.sentimentResult}
            </span>
            <span className="accent-badge">{sentimentResult.analystConsensus}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-mono text-[#4a5568] mb-1.5">SHORT TERM</p>
              <p className="text-xs font-mono text-white">
                {sentimentResult.shortTermOutlook}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-[#4a5568] mb-1.5">LONG TERM</p>
              <p className="text-xs font-mono text-white">
                {sentimentResult.longTermOutlook}
              </p>
            </div>
          </div>
          {sentimentResult.catalysts?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#1e2d3d]">
              <p className="text-[10px] font-mono text-[#4a5568] mb-1.5">CATALYSTS</p>
              {sentimentResult.catalysts.map((c, i) => (
                <p key={i} className="text-xs text-[#a0aec0] font-mono">▸ {c}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Financial Metrics */}
      {overview && (
        <div className="terminal-card">
          <span className="text-xs font-mono text-[#4a5568] uppercase tracking-wider block mb-3">
            Technical Indicators
          </span>
          <MetricRow label="P/E Ratio"       value={overview.peRatio       || "N/A"} />
          <MetricRow label="EPS"             value={overview.eps           || "N/A"} highlight />
          <MetricRow label="Profit Margin"   value={overview.profitMargin  || "N/A"} />
          <MetricRow label="Revenue Growth"  value={overview.revenueGrowth || "N/A"} />
          <MetricRow label="Return on Equity" value={overview.returnOnEquity || "N/A"} />
          <MetricRow label="Debt/Equity"     value={overview.debtToEquity  || "N/A"} />
          <MetricRow label="Beta"            value={overview.beta          || "N/A"} />
          <MetricRow label="52W High"        value={`$${overview.week52High || "N/A"}`} />
          <MetricRow label="52W Low"         value={`$${overview.week52Low  || "N/A"}`} />
          <MetricRow label="Analyst Target"  value={`$${overview.analystTarget || "N/A"}`} highlight />
        </div>
      )}

      {/* Risk Factors */}
      {riskFactors?.length > 0 && (
        <div className="terminal-card">
          <span className="text-xs font-mono text-[#4a5568] uppercase tracking-wider block mb-3">
            Risk Assessment
          </span>
          <div className="space-y-2.5">
            {riskFactors.map((risk, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 ${
                    risk.severity === "High"
                      ? "bg-[rgba(255,71,87,0.15)] text-[#ff4757]"
                      : risk.severity === "Medium"
                      ? "bg-[rgba(255,211,42,0.15)] text-[#ffd32a]"
                      : "bg-[rgba(0,180,255,0.15)] text-[#00b4ff]"
                  }`}
                >
                  {risk.severity}
                </span>
                <div>
                  <p className="text-xs font-mono text-white">{risk.factor}</p>
                  <p className="text-[11px] text-[#4a5568] mt-0.5">{risk.description}</p>
                </div>
              </div>
            ))}
          </div>
          {moatAnalysis && (
            <div className="mt-3 pt-3 border-t border-[#1e2d3d]">
              <p className="text-[10px] font-mono text-[#4a5568] mb-1">MOAT ANALYSIS</p>
              <p className="text-xs text-[#a0aec0]">{moatAnalysis}</p>
            </div>
          )}
        </div>
      )}

      {/* News Feed */}
      {recentNews?.length > 0 && (
  <div className="terminal-card">
    <span className="text-xs font-mono text-[#4a5568] uppercase tracking-wider block mb-3">
      News Feed Relevance
    </span>

    <div className="space-y-3">
      {recentNews.slice(0, 4).map((article, i) => (
        <div
          key={i}
          className="flex gap-3 pb-3 border-b border-[#1e2d3d] last:border-0 last:pb-0"
        >
          <div className="w-10 h-10 bg-[#0d1521] rounded-lg flex items-center justify-center flex-shrink-0 text-lg">
            📰
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs text-white font-medium leading-snug line-clamp-2">
              {article.title}
            </p>

            <p className="text-[10px] text-[#4a5568] font-mono mt-1 line-clamp-2">
              {article.content}
            </p>

            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[#00ff9d] font-mono mt-1 block hover:underline"
              >
                Read more →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      {/* Agent Verdict + Reasoning Log */}
      <div className="terminal-card">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono text-[#4a5568] uppercase tracking-wider">
            Agent's Verdict
          </span>
          <span className="accent-badge">
            CONFIDENCE: {confidenceScore}%
          </span>
        </div>
        <p className="text-sm text-[#a0aec0] leading-relaxed mb-4">{reasoning}</p>

        {/* Company description */}
        {companyProfile?.description && (
          <div className="p-3 bg-[#0d1521] rounded-lg border border-[#1e2d3d]">
            <p className="text-xs text-[#4a5568]">{companyProfile.description}</p>
          </div>
        )}
      </div>

      {/* Reasoning Log */}
      <ReasoningLog steps={steps} reasoning="" verdict={verdict} />
    </div>
  );
};

export default ResearchCard;