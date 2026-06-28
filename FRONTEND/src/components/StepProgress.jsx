// src/components/StepProgress.jsx
const STEPS = [
  { key: "companySearch",     label: "Company Search",     icon: "🔍" },
  { key: "financialData",     label: "Financial Data",     icon: "📊" },
  { key: "newsAnalysis",      label: "News Analysis",      icon: "📰" },
  { key: "sentimentAnalysis", label: "Sentiment Analysis", icon: "💭" },
  { key: "riskAssessment",    label: "Risk Assessment",    icon: "⚠️" },
  { key: "verdictDecision",   label: "Final Verdict",      icon: "🏛️" },
];

const StepProgress = ({ steps = [], status }) => {
  const completedKeys = steps
    .filter((s) => s.status === "completed")
    .map((s) => s.node);

  const currentStep = steps[steps.length - 1];

  return (
    <div className="terminal-card space-y-3">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-[#4a5568] uppercase tracking-wider">
          Agent Pipeline
        </span>
        {status === "running" && (
          <span className="flex items-center gap-1.5 text-xs font-mono text-[#00ff9d]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse-dot" />
            PROCESSING
          </span>
        )}
        {status === "completed" && (
          <span className="text-xs font-mono text-[#00ff9d]">✓ COMPLETE</span>
        )}
      </div>

      {STEPS.map((step, index) => {
        const isCompleted = completedKeys.includes(step.key);
        const isCurrent   = currentStep?.node === step.key && status === "running";
        const isPending   = !isCompleted && !isCurrent;

        return (
          <div key={step.key} className="flex items-center gap-3">
            {/* Step indicator */}
            <div
              className={`
                w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0
                ${isCompleted ? "bg-[rgba(0,255,157,0.2)] border border-[rgba(0,255,157,0.5)]" : ""}
                ${isCurrent  ? "bg-[rgba(0,255,157,0.1)] border border-[#00ff9d] animate-pulse" : ""}
                ${isPending  ? "bg-[#111827] border border-[#1e2d3d]" : ""}
              `}
            >
              {isCompleted ? (
                <span className="text-[#00ff9d] text-xs">✓</span>
              ) : (
                <span className={isPending ? "text-[#4a5568]" : "text-[#00ff9d]"}>
                  {index + 1}
                </span>
              )}
            </div>

            {/* Step info */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono ${
                    isCompleted || isCurrent ? "text-white" : "text-[#4a5568]"
                  }`}
                >
                  {step.icon} {step.label}
                </span>
                {isCompleted && (
                  <span className="text-[10px] font-mono text-[#00ff9d]">DONE</span>
                )}
                {isCurrent && (
                  <span className="text-[10px] font-mono text-[#ffd32a] animate-pulse">
                    RUNNING...
                  </span>
                )}
              </div>
              {/* Message from completed step */}
              {isCompleted && steps.find((s) => s.node === step.key)?.message && (
                <p className="text-[10px] text-[#4a5568] font-mono mt-0.5 truncate">
                  {steps.find((s) => s.node === step.key)?.message}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Overall progress bar */}
      <div className="mt-4">
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${(completedKeys.length / STEPS.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] font-mono text-[#4a5568]">
            {completedKeys.length}/{STEPS.length} nodes complete
          </span>
          <span className="text-[10px] font-mono text-[#00ff9d]">
            {Math.round((completedKeys.length / STEPS.length) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepProgress;