"""
LLM Quiz Generator using LangChain and Gemini
"""

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from models import QuizOutput
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()


def generate_quiz(article_title: str, article_content: str) -> dict:
    """
    Generate quiz using Gemini LLM via LangChain
    
    Args:
        article_title: Title of the Wikipedia article
        article_content: Cleaned article content
        
    Returns:
        Dictionary with quiz data matching QuizOutput schema
    """
    
    # Initialize Gemini model - USE CORRECT MODEL NAME
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",  # Changed from gemini-1.5-flash
        temperature=0.7,
        google_api_key=os.getenv("GEMINI_API_KEY")
    )
    
    # Get schema as JSON string
    schema_dict = QuizOutput.model_json_schema()
    schema_str = json.dumps(schema_dict, indent=2)
    
    # Create prompt template
    prompt = PromptTemplate(
        template="""You are an expert quiz generator. Create an engaging and educational quiz based on the following Wikipedia article.

Article Title: {title}

Article Content:
{content}

Generate a comprehensive quiz with the following requirements:

1. Create 5-10 multiple choice questions that test understanding of the article
2. Each question should have exactly 4 options
3. Questions should cover different aspects: facts, concepts, relationships, and implications
4. Include a mix of difficulty levels (easy, medium, hard)
5. Provide clear explanations for correct answers
6. Extract 3-5 key entities/concepts from the article
7. Suggest 3-5 related topics for further exploration
8. Write a brief 2-3 sentence summary of the article

Make questions engaging and educational. Avoid trivial or overly complex questions.

Return ONLY a valid JSON object matching this schema:

{schema}

Do not include any markdown formatting, code blocks, or additional text. Return only the raw JSON object.
""",
        input_variables=["title", "content", "schema"]
    )
    
    # Create the chain
    chain = prompt | llm
    
    # Generate quiz
    try:
        response = chain.invoke({
            "title": article_title,
            "content": article_content,
            "schema": schema_str
        })
        
        # Extract JSON from response
        content = response.content.strip()
        
        # Remove markdown code blocks if present
        if content.startswith("```"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        
        content = content.strip()
        
        # Parse JSON
        result = json.loads(content)
        
        # Validate with Pydantic
        validated = QuizOutput(**result)
        
        # Return as dict
        return validated.dict()
        
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {str(e)}")
        print(f"Response content: {content}")
        raise
    except Exception as e:
        print(f"Error generating quiz: {str(e)}")
        raise
