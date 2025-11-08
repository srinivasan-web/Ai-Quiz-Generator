// src/api.js
const API_BASE = "https://ai-quiz-generator-1-h6me.onrender.com";

export async function generateQuiz(url) {
  const response = await fetch(`${API_BASE}/generate_quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!response.ok)
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  return response.json();
}

export async function getHistory() {
  const response = await fetch(`${API_BASE}/history`);
  if (!response.ok) throw new Error("Failed to fetch history");
  return response.json();
}

export async function getQuizById(id) {
  const response = await fetch(`${API_BASE}/quiz/${id}`);
  if (!response.ok) throw new Error("Failed to fetch quiz");
  return response.json();
}
