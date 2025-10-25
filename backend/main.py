"""
FastAPI Application - Main Entry Point
API endpoints for quiz generation and history
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from sqlalchemy.orm import Session
from typing import List
import json
from datetime import datetime

from database import init_db, get_db, Quiz
from scraper import scrape_wikipedia, validate_wikipedia_url
from llm_quiz_generator import generate_quiz


# Initialize FastAPI app
app = FastAPI(
    title="AI Wiki Quiz Generator",
    description="Generate educational quizzes from Wikipedia articles using AI",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://*.vercel.app",  # Allow all Vercel deployments
    "*" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response Models
class QuizGenerateRequest(BaseModel):
    url: HttpUrl


class QuizHistoryResponse(BaseModel):
    id: int
    url: str
    title: str
    date_generated: datetime

    class Config:
        from_attributes = True


class QuizDetailResponse(BaseModel):
    id: int
    url: str
    title: str
    date_generated: datetime
    quiz_data: dict

    class Config:
        from_attributes = True


# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()
    print("Database initialized successfully!")


# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "AI Wiki Quiz Generator API",
        "status": "active",
        "endpoints": {
            "generate": "/generate_quiz (POST)",
            "history": "/history (GET)",
            "detail": "/quiz/{quiz_id} (GET)"
        }
    }


# Endpoint 1: Generate Quiz
@app.post("/generate_quiz")
async def generate_quiz_endpoint(
    request: QuizGenerateRequest,
    db: Session = Depends(get_db)
):
    """
    Generate a quiz from a Wikipedia URL
    
    1. Validates Wikipedia URL
    2. Scrapes article content
    3. Generates quiz using AI
    4. Saves to database
    5. Returns quiz data
    """
    try:
        url_str = str(request.url)
        
        # Validate Wikipedia URL
        if not validate_wikipedia_url(url_str):
            raise HTTPException(
                status_code=400,
                detail="Invalid Wikipedia URL. Please provide a valid Wikipedia article URL."
            )
        
        # Scrape Wikipedia article
        print(f"Scraping: {url_str}")
        title, content = scrape_wikipedia(url_str)
        print(f"Scraped article: {title}")
        
        # Generate quiz using LLM
        print("Generating quiz with AI...")
        quiz_data = generate_quiz(title, content)
        print("Quiz generated successfully!")
        
        # Serialize quiz data to JSON string
        quiz_json = json.dumps(quiz_data)
        
        # Save to database
        new_quiz = Quiz(
            url=url_str,
            title=quiz_data.get("title", title),
            scraped_content=content,  # Bonus: store original content
            full_quiz_data=quiz_json
        )
        db.add(new_quiz)
        db.commit()
        db.refresh(new_quiz)
        
        print(f"Quiz saved to database with ID: {new_quiz.id}")
        
        # Return complete quiz data
        return {
            "id": new_quiz.id,
            "url": url_str,
            "title": new_quiz.title,
            "date_generated": new_quiz.date_generated,
            "quiz_data": quiz_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate quiz: {str(e)}"
        )


# Endpoint 2: Get Quiz History
@app.get("/history", response_model=List[QuizHistoryResponse])
async def get_history(db: Session = Depends(get_db)):
    """
    Get list of all generated quizzes
    Returns basic info: id, url, title, date_generated
    """
    try:
        quizzes = db.query(Quiz).order_by(Quiz.date_generated.desc()).all()
        return quizzes
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch quiz history: {str(e)}"
        )


# Endpoint 3: Get Quiz by ID
@app.get("/quiz/{quiz_id}")
async def get_quiz_by_id(quiz_id: int, db: Session = Depends(get_db)):
    """
    Get complete quiz data by ID
    Deserializes the full_quiz_data JSON string
    """
    try:
        quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        
        if not quiz:
            raise HTTPException(
                status_code=404,
                detail=f"Quiz with ID {quiz_id} not found"
            )
        
        # Deserialize JSON string to dictionary
        quiz_data = json.loads(quiz.full_quiz_data)
        
        return {
            "id": quiz.id,
            "url": quiz.url,
            "title": quiz.title,
            "date_generated": quiz.date_generated,
            "quiz_data": quiz_data
        }
        
    except HTTPException:
        raise
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Failed to parse quiz data"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch quiz: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
