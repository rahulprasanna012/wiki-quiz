"""
Database Configuration and Models
SQLAlchemy setup for MySQL/PostgreSQL
"""

from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

# Database URL - reads from environment variable
# For TiDB Cloud: mysql+pymysql://user:pass@host:port/database

load_dotenv()  # Load environment variables from .env file
DATABASE_URL = os.getenv("DATABASE_URL")


if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set. Please set it in your .env file.")

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

# Create declarative base
Base = declarative_base()

# Create session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Quiz(Base):
    """
    Quiz model for storing generated quizzes
    """
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(500), nullable=False)
    title = Column(String(255), nullable=False)
    date_generated = Column(DateTime, default=datetime.utcnow)
    scraped_content = Column(Text, nullable=True)  # Bonus: Store original content
    full_quiz_data = Column(Text, nullable=False)  # JSON serialized quiz data

    def __repr__(self):
        return f"<Quiz(id={self.id}, title='{self.title}', date={self.date_generated})>"


def init_db():
    """
    Initialize database - create all tables
    """
    Base.metadata.create_all(bind=engine)


def get_db():
    """
    Dependency for getting database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
