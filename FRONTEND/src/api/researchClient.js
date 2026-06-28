// src/api/researchClient.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const startResearch = async (companyName) => {
  const res = await fetch(`${API_BASE}/research`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ companyName }),
  });
  if (!res.ok) throw new Error("Failed to start research");
  return res.json();
};

export const getResearchById = async (id) => {
  const res = await fetch(`${API_BASE}/research/${id}`);
  if (!res.ok) throw new Error("Failed to fetch result");
  return res.json();
};

export const getAllResearch = async () => {
  const res = await fetch(`${API_BASE}/research`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
};