// src/api/researchClient.js
// Handles all API communication with the backend

// const API_BASE = "/api";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Start new research ───────────────────────────────────────────────
export const startResearch = async (companyName) => {
  const response = await fetch(`${API_BASE}/research`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ companyName }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to start research");
  }
  return response.json();
};

// ── Poll for research result ─────────────────────────────────────────
export const getResearchById = async (id) => {
  const response = await fetch(`${API_BASE}/research/${id}`);
  if (!response.ok) throw new Error("Failed to fetch research result");
  return response.json();
};

// ── Get all research history ─────────────────────────────────────────
export const getAllResearch = async () => {
  const response = await fetch(`${API_BASE}/research`);
  if (!response.ok) throw new Error("Failed to fetch research history");
  return response.json();
};

// ── Poll until completed ─────────────────────────────────────────────
// Polls every 3 seconds until status is completed or failed
export const pollResearch = (id, onUpdate, onComplete, onError) => {
  const interval = setInterval(async () => {
    try {
      const response = await getResearchById(id);
      const data     = response.data;

      // Send update to UI
      onUpdate(data);

      // Stop polling when done
      if (data.status === "completed" || data.status === "failed") {
        clearInterval(interval);
        onComplete(data);
      }
    } catch (error) {
      clearInterval(interval);
      onError(error);
    }
  }, 3000);

  // Return cleanup function
  return () => clearInterval(interval);
};