// src/components/SearchBar.jsx
import { useState } from "react";

const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const suggestions = ["Apple", "Tesla", "NVIDIA", "Microsoft", "Amazon"];

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 bg-[#0d1521] border border-[#1e2d3d] rounded-xl px-4 py-3 focus-within:border-[rgba(0,255,157,0.4)] transition-colors">
          <span className="text-[#00ff9d] font-mono text-sm flex-shrink-0">$&gt;</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter company name or ticker..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-white font-mono text-sm outline-none placeholder-[#4a5568] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-[#00ff9d] text-black font-mono font-bold text-xs px-4 py-1.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#00cc7d] transition-colors flex-shrink-0"
          >
            {isLoading ? "ANALYZING..." : "EXECUTE"}
          </button>
        </div>
      </form>

      {/* Quick suggestions */}
      {!isLoading && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono text-[#4a5568]">QUICK:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
                onSearch(s);
              }}
              className="text-[10px] font-mono text-[#a0aec0] hover:text-[#00ff9d] border border-[#1e2d3d] hover:border-[rgba(0,255,157,0.3)] px-2 py-1 rounded transition-colors"
            >
              ${s.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;