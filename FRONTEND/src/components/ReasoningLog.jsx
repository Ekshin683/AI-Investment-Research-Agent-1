// src/components/ReasoningLog.jsx
import { useEffect, useRef } from "react";

const ReasoningLog = ({ steps = [], reasoning = "", verdict = "" }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [steps]);

  return (
    <div className="terminal-card">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-[#4a5568] uppercase tracking-wider">
          Agent Log
        </span>
        <span className="accent-badge">TERMINAL</span>
      </div>

      {/* Log entries */}
      <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-xs">
        <div className="text-[#00ff9d]">&gt; AGENT SESSION INITIALIZED</div>
        <div className="text-[#4a5568]">&gt; Loading research pipeline...</div>

        {steps.map((step, index) => (
          <div key={index} className="space-y-0.5">
            <div
              className={`${
                step.status === "completed"
                  ? "text-[#00ff9d]"
                  : step.status === "failed"
                  ? "text-[#ff4757]"
                  : "text-[#ffd32a]"
              }`}
            >
              &gt; [{step.node?.toUpperCase()}]{" "}
              {step.status === "completed" ? "✓" : step.status === "failed" ? "✗" : "..."}
            </div>
            {step.message && (
              <div className="text-[#4a5568] pl-2">{step.message}</div>
            )}
          </div>
        ))}

        {verdict && (
          <>
            <div className="text-[#00ff9d] mt-2">
              &gt; ANALYSIS COMPLETE...
            </div>
            <div className="text-[#00ff9d]">
              &gt; FINAL RECOMMENDATION:{" "}
              <span
                className={
                  verdict === "INVEST"
                    ? "text-[#00ff9d] font-bold"
                    : verdict === "PASS"
                    ? "text-[#ff4757] font-bold"
                    : "text-[#ffd32a] font-bold"
                }
              >
                {verdict} ■
              </span>
            </div>
          </>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Reasoning */}
      {reasoning && (
        <div className="mt-4 pt-4 border-t border-[#1e2d3d]">
          <p className="text-xs font-mono text-[#4a5568] uppercase tracking-wider mb-2">
            Agent Reasoning
          </p>
          <p className="text-sm text-[#a0aec0] leading-relaxed">{reasoning}</p>
        </div>
      )}
    </div>
  );
};

export default ReasoningLog;