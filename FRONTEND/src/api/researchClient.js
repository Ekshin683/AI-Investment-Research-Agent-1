// src/api/researchClient.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("API Base URL:", API_BASE); // Debug log

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

export const getResearchById = async (id) => {
  const response = await fetch(`${API_BASE}/research/${id}`);
  if (!response.ok) throw new Error("Failed to fetch research result");
  return response.json();
};

export const getAllResearch = async () => {
  const response = await fetch(`${API_BASE}/research`);
  if (!response.ok) throw new Error("Failed to fetch research history");
  return response.json();
};