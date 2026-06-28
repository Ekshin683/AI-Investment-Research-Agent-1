// src/components/VerdictBadge.jsx
const VerdictBadge = ({ verdict, size = "md" }) => {
  const sizes = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-lg px-4 py-2",
  };

  const styles = {
    INVEST: "verdict-invest",
    PASS:   "verdict-pass",
    HOLD:   "verdict-hold",
  };

  const icons = {
    INVEST: "▲",
    PASS:   "▼",
    HOLD:   "●",
  };

  return (
    <span
      className={`
        font-mono font-bold rounded-md tracking-widest
        ${sizes[size] || sizes.md}
        ${styles[verdict] || "verdict-hold"}
      `}
    >
      {icons[verdict]} {verdict}
    </span>
  );
};

export default VerdictBadge;