// src/api.js
import { toast } from "react-toastify";

const API_BASE = "https://ai-quiz-generator-1-h6me.onrender.com";

// Generate quiz
export async function generateQuiz(url) {
  try {
    const response = await fetch(`${API_BASE}/generate_quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!response.ok)
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);

    toast.success("Quiz generated successfully! ✅");
    return await response.json();
  } catch (error) {
    toast.error(`Error: ${error.message}`);
    throw error;
  }
}

// Fetch quiz history
export async function getHistory() {
  try {
    const response = await fetch(`${API_BASE}/history`);
    if (!response.ok) throw new Error("Failed to fetch history");
    toast.success("History loaded successfully! ✅");
    return await response.json();
  } catch (error) {
    toast.error(`Error: ${error.message}`);
    throw error;
  }
}

// Fetch quiz by ID
export async function getQuizById(id) {
  try {
    const response = await fetch(`${API_BASE}/quiz/${id}`);
    if (!response.ok) throw new Error("Failed to fetch quiz");
    toast.success("Quiz loaded successfully! ✅");
    return await response.json();
  } catch (error) {
    toast.error(`Error: ${error.message}`);
    throw error;
  }
}
