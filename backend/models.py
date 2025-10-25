"""
Pydantic Models for LLM Output Validation
Defines the structure that Gemini must return
"""

from pydantic import BaseModel, Field
from typing import List


class QuizQuestion(BaseModel):
    """
    Single quiz question with options and answer
    """
    question: str = Field(description="The quiz question text")
    options: List[str] = Field(description="List of 4 multiple choice options")
    correct_answer: str = Field(description="The correct answer from the options")
    explanation: str = Field(description="Brief explanation of why the answer is correct")


class QuizOutput(BaseModel):
    """
    Complete quiz output structure from LLM
    """
    title: str = Field(description="Title of the Wikipedia article")
    summary: str = Field(description="Brief 2-3 sentence summary of the article")
    questions: List[QuizQuestion] = Field(
        description="List of 5-10 quiz questions",
        min_length=5,
        max_length=10
    )
    key_entities: List[str] = Field(
        description="List of 3-5 key entities/concepts from the article",
        min_length=3,
        max_length=5
    )
    related_topics: List[str] = Field(
        description="List of 3-5 related topics for further reading",
        min_length=3,
        max_length=5
    )

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Artificial Intelligence",
                "summary": "AI is intelligence demonstrated by machines...",
                "questions": [
                    {
                        "question": "What year was the term AI coined?",
                        "options": ["1950", "1956", "1960", "1965"],
                        "correct_answer": "1956",
                        "explanation": "The term was coined at Dartmouth Conference in 1956"
                    }
                ],
                "key_entities": ["Machine Learning", "Neural Networks", "Deep Learning"],
                "related_topics": ["Robotics", "Computer Vision", "NLP"]
            }
        }
