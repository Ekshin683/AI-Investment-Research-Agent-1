// src/components/MetricRow.jsx
const MetricRow = ({ label, value, suffix = "", highlight = false, change = null }) => {
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#1e2d3d] last:border-0">
      <span className="text-xs font-mono text-[#4a5568] uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {change !== null && (
          <span
            className={`text-xs font-mono ${
              isPositive ? "text-[#00ff9d]" : isNegative ? "text-[#ff4757]" : "text-[#a0aec0]"
            }`}
          >
            {isPositive ? "+" : ""}{change}%
          </span>
        )}
        <span
          className={`text-sm font-mono font-semibold ${
            highlight ? "text-[#00ff9d]" : "text-white"
          }`}
        >
          {value}{suffix}
        </span>
      </div>
    </div>
  );
};

export default MetricRow;