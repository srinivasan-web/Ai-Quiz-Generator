import os, json, re, time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def extract_json(text: str):
    """Extracts JSON safely even if wrapped in markdown or text."""
    text = text.strip()
    if not text:
        raise ValueError("Empty response from AI.")
    # Find JSON inside text
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        raise ValueError("No JSON object found in AI response.")
    return match.group(0)

def generate_quiz_from_text(title: str, content: str, retries: int = 3):
    prompt = f"""
You are a helpful AI quiz generator.

Read the following Wikipedia article titled "{title}" and produce a quiz summary.

⚠️ OUTPUT RULES (Very Important)
- Return **ONLY VALID JSON**
- Do NOT include any markdown, commentary, or text outside JSON
- Follow this exact format:

{{
  "summary": "string",
  "key_entities": ["entity1", "entity2"],
  "sections": ["section1", "section2"],
  "quiz": [
    {{
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "explanation": "string",
      "difficulty": "easy | medium | hard"
    }}
  ],
  "related_topics": ["topic1", "topic2"]
}}

Article:
---
{content[:6000]}  # truncate long articles
---
    """

    for attempt in range(retries):
        try:
            model = genai.GenerativeModel("gemini-2.5-flash")
            response = model.generate_content(prompt)
            raw_text = response.text.strip()

            cleaned_json = extract_json(raw_text)
            data = json.loads(cleaned_json)

            if "quiz" not in data or not isinstance(data["quiz"], list):
                raise ValueError("Missing quiz data in JSON response.")

            return data

        except Exception as e:
            print(f"⚠️ Attempt {attempt+1} failed: {e}")
            time.sleep(1)

    # If all retries fail, return fallback
    return {
        "summary": "Failed to generate quiz due to AI response error.",
        "key_entities": [],
        "sections": [],
        "quiz": [
            {
                "question": "Placeholder question (AI failed to respond).",
                "options": ["A", "B", "C", "D"],
                "answer": "A",
                "explanation": "Fallback content.",
                "difficulty": "easy"
            }
        ],
        "related_topics": []
    }
