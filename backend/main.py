from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from database import SessionLocal, init_db, Quiz
from scraper import scrape_wikipedia
from llm_quiz_generator import generate_quiz_from_text
import json, os
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()

# ✅ Initialize database
init_db()

app = FastAPI(title="AI Wiki Quiz Generator")

# ✅ Setup CORS properly
# Split the FRONTEND_ORIGINS string into a list (Render reads it as a single string)
frontend_origins = os.getenv("FRONTEND_ORIGINS", "")
origins = [origin.strip() for origin in frontend_origins.split(",") if origin.strip()]

# ✅ Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],  # fallback for safety
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Models
class WikiRequest(BaseModel):
    url: str

# ✅ Routes
@app.get("/")
def home():
    return {"message": "✅ Backend running successfully"}

@app.post("/generate_quiz")
def generate_quiz_api(req: WikiRequest):
    db = SessionLocal()
    try:
        title, content = scrape_wikipedia(req.url)
        quiz_data = generate_quiz_from_text(title, content)
        quiz_json = json.dumps(quiz_data)

        quiz_entry = Quiz(
            url=req.url,
            title=title,
            scraped_content=content,
            full_quiz_data=quiz_json,
            date_generated=datetime.utcnow(),
        )
        db.add(quiz_entry)
        db.commit()
        db.refresh(quiz_entry)

        return {"id": quiz_entry.id, "title": title, **quiz_data}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        db.close()

@app.get("/history")
def get_history():
    db = SessionLocal()
    data = db.query(Quiz).all()
    db.close()
    return [
        {"id": q.id, "url": q.url, "title": q.title, "date_generated": q.date_generated}
        for q in data
    ]

@app.get("/quiz/{quiz_id}")
def get_quiz(quiz_id: int):
    db = SessionLocal()
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    db.close()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found.")
    return json.loads(quiz.full_quiz_data)
