🩵 PHASE 1: FOUNDATIONS — Learn the Core Technologies
🔹 1. Frontend — React + TailwindCSS + Axios

Purpose: To build a beautiful, fast, interactive UI.

Learn / Use:

React (JS Library) → For building UI.

React Router DOM → For navigation (/, /quiz/:id, /history).

Axios / Fetch API → For calling FastAPI endpoints.

Tailwind CSS → For fast, modern styling.

React Toastify → For animated notifications.

Install Commands:

npm create vite@latest frontend --template react
cd frontend
npm install axios react-router-dom react-toastify
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p


Learn Concepts:

React Hooks (useState, useEffect)

API calls using Axios

Component-based architecture

Notification handling (React-Toastify)

Page Routing

🔹 2. Backend — FastAPI + SQLAlchemy + LangChain + Gemini

Purpose: To scrape, process, generate, and store quiz data.

Learn / Use:

FastAPI → Main Python web framework.

SQLAlchemy → ORM for database (MySQL).

Pydantic → Data models & validation.

LangChain → Framework to integrate LLM (Gemini).

Gemini API → The AI model used for quiz generation.

BeautifulSoup4 + Requests → For scraping Wikipedia content.

Install Commands:

cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install fastapi uvicorn[standard] sqlalchemy beautifulsoup4 requests pydantic python-dotenv langchain-core langchain-community langchain-google-genai mysqlclient


Learn Concepts:

REST API design (POST, GET endpoints)

Environment variables (.env setup)

Database ORM (SQLAlchemy models)

LLM prompt creation (LangChain)

JSON serialization/deserialization

🩵 PHASE 2: BACKEND SETUP & ARCHITECTURE
📁 Folder Structure
backend/
│── main.py                 # FastAPI App
│── database.py             # MySQL setup + SQLAlchemy
│── models.py               # SQLAlchemy Models + Pydantic Schemas
│── scraper.py              # Wikipedia scraping
│── llm_quiz_generator.py   # LLM (Gemini) integration
│── requirements.txt        # Python dependencies
│── .env                    # Secrets (API keys, DB credentials)

⚙️ 1. Database Connection (database.py)

Use SQLAlchemy create_engine() to connect to MySQL.

Define Quiz model (id, url, title, date_generated, full_quiz_data).

Example:

from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")

engine = create_engine(f"mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{DB_HOST}/{DB_NAME}")
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(Integer, primary_key=True)
    url = Column(String(255))
    title = Column(String(255))
    date_generated = Column(DateTime, default=datetime.utcnow)
    full_quiz_data = Column(Text)

⚙️ 2. Wikipedia Scraper (scraper.py)

Use requests + BeautifulSoup4 to clean content.

import requests
from bs4 import BeautifulSoup

def scrape_wikipedia(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    title = soup.find("h1").text
    paragraphs = soup.select("#mw-content-text p")
    content = " ".join(p.get_text() for p in paragraphs)
    return title, content

⚙️ 3. LLM Integration (llm_quiz_generator.py)

Use LangChain + Gemini API.

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def generate_quiz(content, title):
    model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=GEMINI_API_KEY)

    prompt = f"""
    You are a quiz generator. Create 5 questions from the article "{title}".
    Each question should have options, correct answer, explanation, and difficulty.
    Return output as JSON.
    Article: {content[:4000]}...
    """

    response = model.invoke(prompt)
    return response.content

⚙️ 4. FastAPI Endpoints (main.py)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine, SessionLocal, Quiz
from scraper import scrape_wikipedia
from llm_quiz_generator import generate_quiz
import json

Base.metadata.create_all(bind=engine)
app = FastAPI()

origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate_quiz")
def generate_quiz_api(data: dict):
    url = data["url"]
    title, content = scrape_wikipedia(url)
    quiz_data = generate_quiz(content, title)
    db = SessionLocal()
    quiz = Quiz(url=url, title=title, full_quiz_data=json.dumps(quiz_data))
    db.add(quiz)
    db.commit()
    return quiz_data

@app.get("/history")
def get_history():
    db = SessionLocal()
    quizzes = db.query(Quiz).all()
    return [{"id": q.id, "url": q.url, "title": q.title, "date": q.date_generated} for q in quizzes]

🩵 PHASE 3: FRONTEND IMPLEMENTATION (React + Tailwind)
📁 Folder Structure
frontend/
│── src/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── QuizPage.jsx
│   │   └── HistoryPage.jsx
│   ├── components/
│   │   ├── QuizCard.jsx
│   │   └── Loader.jsx
│   ├── services/api.js
│   ├── App.jsx
│   └── index.css

🧩 Example API File (src/services/api.js)
import axios from "axios";

const API_BASE = "http://localhost:8000";

export const generateQuiz = async (url) => {
  const res = await axios.post(`${API_BASE}/generate_quiz`, { url });
  return res.data;
};

export const getHistory = async () => {
  const res = await axios.get(`${API_BASE}/history`);
  return res.data;
};

🧩 Home Page (Generate Quiz)
import { useState } from "react";
import { generateQuiz } from "../services/api";
import { toast } from "react-toastify";

export default function HomePage() {
  const [url, setUrl] = useState("");

  const handleSubmit = async () => {
    toast.info("Generating quiz...");
    try {
      const data = await generateQuiz(url);
      toast.success("Quiz generated successfully!");
      console.log(data);
    } catch {
      toast.error("Failed to generate quiz");
    }
  };

  return (
    <div className="p-6">
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter Wikipedia URL"
        className="border p-2 rounded w-1/2"
      />
      <button onClick={handleSubmit} className="ml-2 bg-blue-500 text-white p-2 rounded">
        Generate
      </button>
    </div>
  );
}

🩵 PHASE 4: DEPLOYMENT
🔹 Frontend:

Deploy using Vercel / Netlify / Render.

🔹 Backend:

Deploy using Render / Railway / Deta Space.

🔹 Database:

Use Railway MySQL (free) or PlanetScale.

🧰 TECHNOLOGIES USED
Layer	Technology	Purpose
Frontend	React	UI development
	TailwindCSS	Styling
	React Router DOM	Navigation
	Axios	API requests
	React Toastify	Notifications
Backend	FastAPI	REST API framework
	SQLAlchemy	ORM for MySQL
	BeautifulSoup4	Web scraping
	LangChain	AI orchestration
	Gemini API	Quiz generation LLM
Database	MySQL	Persistent storage
🧠 LLM SETUP (Gemini API)

Go to Google AI Studio
.

Create a new API key.

Copy and store in .env:

GEMINI_API_KEY="your-api-key"


Use via langchain-google-genai.









i/* Main container */
.auth-container {
  position: relative;
  width: 100%;

  height: 100vh;
  background: radial-gradient(circle at top, #0b0f2e, #050712 90%);
  display: flex;
  color: white;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 3D floating shapes */
.floating-3d-shape {
  position: absolute;
  width: 380px;
  height: 380px;
  background: linear-gradient(135deg, #5b5fff, #9f4bff);
  filter: blur(60px);
  border-radius: 50%;
  animation: float 10s ease-in-out infinite;
  transform: translateZ(-200px) rotateX(45deg);
  opacity: 0.5;
}

.floating-3d-shape.two {
  width: 420px;
  height: 420px;
  background: linear-gradient(135deg, #ff5bd8, #ff884b);
  top: 50%;
  left: 60%;
  animation-duration: 14s;
  opacity: 0.4;
}

/* Animation for floating effect */
@keyframes float {
  0% {
    transform: translateY(0px) translateX(0px) translateZ(-200px) rotate(0deg);
  }
  50% {
    transform: translateY(-60px) translateX(40px) translateZ(-200px)
      rotate(20deg);
  }
  100% {
    transform: translateY(0px) translateX(0px) translateZ(-200px) rotate(0deg);
  }
}

/* Card */
.auth-card {
  width: 500px;
  padding: 28px;

  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(18px);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 5;
  color: white;
  box-shadow: 0 0 30px rgba(20, 20, 60, 0.4);
  animation: cardFade 1.2s ease;
}

@keyframes cardFade {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Title + subtitle */
.title {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  color: white;
}

.subtitle {
  font-size: 14px;
  text-align: center;
  color: #d5d7ff;
  margin-bottom: 20px;
}

/* Toggle box */
.toggle-box {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 18px;
}

.toggle-btn {
  padding: 8px 18px;
  border-radius: 30px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  cursor: pointer;
  transition: 0.3s;
  font-size: 14px;
}

.toggle-btn.active {
  background: white;
  color: #111;
  font-weight: 600;
}

/* Fade animation */
.fade-in {
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
  }
}

/* Clerk form override */
.cl-card {
  background: transparent !important;
  box-shadow: none !important;
}

.cl-input {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: white !important;
}

.cl-button {
  background: #7b2ff7 !important;
  border: none !important;
  color: rgb(255, 255, 255) !important;
  border-radius: 30px !important;
  transition: 0.3s;
}

.cl-button:hover {
  transform: scale(1.03);
}

/* Responsive */
@media (max-width: 480px) {
  .auth-card {
    width: 92%;
    padding: 18px;
  }
}

