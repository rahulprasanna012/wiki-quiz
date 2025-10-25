🧠 AI Wiki Quiz Generator
<div align="center">
![Python](https://img.shields.io.shields.io/badge/FastAPI-0.104://img.shields.io/badge/React-18.2./badge/License-MIT-yellow articles into engaging educational quizzes using AI**

Features - Demo - Installation - Usage - API - Contributing

</div>
📋 Table of Contents
Overview

Features

Technology Stack

Prerequisites

Installation

Configuration

Usage

Project Structure

API Documentation

Testing

Troubleshooting

Deployment

Contributing

License

🎯 Overview
AI Wiki Quiz Generator is a full-stack application that automatically generates comprehensive educational quizzes from Wikipedia articles. Using Google's Gemini AI and LangChain, it scrapes Wikipedia content, analyzes it, and creates structured quizzes with multiple-choice questions, explanations, and related topics.

🎥 Demo
![Quiz Generation Demo](docs ✨ Features

🤖 AI-Powered Generation: Utilizes Google Gemini for intelligent quiz creation

📝 Comprehensive Quizzes: 5-10 multiple-choice questions with detailed explanations

🌐 Wikipedia Integration: Automatic content scraping and cleaning

💾 Persistent Storage: MySQL/TiDB Cloud database with full quiz history

🎨 Modern UI: React with Tailwind CSS for responsive design

⚡ Fast Processing: 10-30 seconds per quiz generation

📊 Quiz Analytics: View history and detailed quiz breakdown

🔒 Secure: Environment-based configuration for API keys

🚀 Production Ready: CORS configured, error handling, validation

🛠️ Technology Stack
Backend
Technology	Version	Purpose
Python	3.11	Core language
FastAPI	0.104.1	Web framework
LangChain	0.1.10	LLM orchestration
Google Gemini	gemini-pro	AI model
SQLAlchemy	2.0.23	ORM
BeautifulSoup4	4.12.2	Web scraping
Pydantic	2.4.2	Data validation
PyMySQL	1.1.2	MySQL driver
Frontend
Technology	Version	Purpose
React	18.2.0	UI framework
Vite	5.0	Build tool
Tailwind CSS	3.4	Styling
Fetch API	Native	HTTP client
Database
MySQL / TiDB Cloud (MySQL-compatible)

📦 Prerequisites
Before you begin, ensure you have the following installed:

Python 3.11+ (Download)

Node.js 18+ (Download)

npm or yarn

MySQL or TiDB Cloud account

Google Gemini API Key (Get it here)

🚀 Installation
1. Clone the Repository
bash
git clone https://github.com/yourusername/ai-quiz-generator.git
cd ai-quiz-generator
2. Backend Setup
bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
3. Frontend Setup
bash
cd frontend

# Install dependencies
npm install

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
⚙️ Configuration
Environment Variables
Create a .env file in the backend directory:

text
# Database Configuration
DATABASE_URL=mysql+pymysql://user:password@host:port/database?ssl_ca=&ssl_verify_cert=true&ssl_verify_identity=true

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
Database Setup Options
Option 1: TiDB Cloud (Recommended)
text
DATABASE_URL=mysql+pymysql://user:password@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/database?ssl_ca=&ssl_verify_cert=true&ssl_verify_identity=true
Option 2: Local MySQL
text
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/quiz_db
Option 3: SQLite (Development Only)
text
DATABASE_URL=sqlite:///./quiz_history.db
Initialize Database
bash
cd backend
python -c "from database import init_db; init_db()"
🎮 Usage
Start the Application
Terminal 1 - Backend
bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn main:app --reload
🚀 Backend runs on: http://localhost:8000

Terminal 2 - Frontend
bash
cd frontend
npm run dev
🌐 Frontend runs on: http://localhost:5173

Generate Your First Quiz
Open http://localhost:5173

Enter a Wikipedia URL:

text
https://en.wikipedia.org/wiki/Artificial_intelligence
Click "Generate Quiz"

Wait 10-30 seconds for AI processing

View your quiz with questions, answers, and explanations!

Example Wikipedia URLs
Artificial Intelligence: https://en.wikipedia.org/wiki/Artificial_intelligence

Python Programming: https://en.wikipedia.org/wiki/Python_(programming_language)

Machine Learning: https://en.wikipedia.org/wiki/Machine_learning

Quantum Computing: https://en.wikipedia.org/wiki/Quantum_computing

A.P.J. Abdul Kalam: https://en.wikipedia.org/wiki/A._P._J._Abdul_Kalam

📁 Project Structure
text
ai-quiz-generator/
├── backend/                    # FastAPI backend
│   ├── database.py            # SQLAlchemy models & setup
│   ├── models.py              # Pydantic schemas
│   ├── scraper.py             # Wikipedia scraper
│   ├── llm_quiz_generator.py  # AI quiz generation
│   ├── main.py                # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── QuizDisplay.jsx
│   │   │   └── Modal.jsx
│   │   ├── tabs/              # Tab components
│   │   │   ├── GenerateQuizTab.jsx
│   │   │   └── HistoryTab.jsx
│   │   ├── services/          # API client
│   │   │   └── api.js
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Tailwind styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
📡 API Documentation
Interactive API Docs
Visit http://localhost:8000/docs for interactive Swagger UI documentation.

Endpoints
POST /generate_quiz
Generate a quiz from Wikipedia URL

Request:

json
{
  "url": "https://en.wikipedia.org/wiki/Artificial_intelligence"
}
Response:

json
{
  "id": 1,
  "url": "https://en.wikipedia.org/wiki/Artificial_intelligence",
  "title": "Artificial Intelligence",
  "date_generated": "2025-10-25T12:00:00",
  "quiz_data": {
    "title": "Artificial Intelligence",
    "summary": "Brief 2-3 sentence summary...",
    "questions": [
      {
        "question": "What is AI?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": "Option A",
        "explanation": "Detailed explanation..."
      }
    ],
    "key_entities": ["Machine Learning", "Neural Networks", "..."],
    "related_topics": ["Robotics", "Computer Vision", "..."]
  }
}
GET /history
Retrieve all generated quizzes

Response:

json
[
  {
    "id": 1,
    "url": "https://en.wikipedia.org/wiki/...",
    "title": "Article Title",
    "date_generated": "2025-10-25T12:00:00"
  }
]
GET /quiz/{quiz_id}
Get specific quiz details

Response:

json
{
  "id": 1,
  "url": "https://en.wikipedia.org/wiki/...",
  "title": "Article Title",
  "date_generated": "2025-10-25T12:00:00",
  "quiz_data": { /* Full quiz data */ }
}
🧪 Testing
Backend Testing
bash
# Health check
curl http://localhost:8000/

# Test quiz generation
curl -X POST http://localhost:8000/generate_quiz \
  -H "Content-Type: application/json" \
  -d '{"url": "https://en.wikipedia.org/wiki/Python_(programming_language)"}'

# Get history
curl http://localhost:8000/history

# Get specific quiz
curl http://localhost:8000/quiz/1
Frontend Testing
Open http://localhost:5173

Test quiz generation with multiple URLs

Verify history tab displays all quizzes

Check modal functionality for quiz details

🐛 Troubleshooting
Common Issues
Database Connection Error
text
sqlalchemy.exc.OperationalError: Can't connect to MySQL server
Solution:

Verify DATABASE_URL in .env

Ensure database server is running

Check username/password

For TiDB Cloud, ensure SSL parameters are included

Gemini API Error
text
404 models/gemini-1.5-flash is not found
Solution:

Use gemini-pro instead of gemini-1.5-flash

Verify GEMINI_API_KEY in .env

Check API quota at Google AI Studio

CORS Error
text
Access to fetch blocked by CORS policy
Solution:

Restart both backend and frontend servers

Check CORS origins in main.py

Ensure frontend URL (http://localhost:5173) is in allowed origins

Module Not Found
text
ModuleNotFoundError: No module named 'pymysql'
Solution:

bash
source venv/bin/activate  # Activate virtual environment
pip install -r requirements.txt
Python Version Issue
text
pydantic-core requires Rust compiler
Solution:

Use Python 3.11 instead of 3.14

Follow installation instructions to downgrade

🚢 Deployment
Backend Deployment (Example: Heroku)
bash
# Add Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Add runtime.txt
echo "python-3.11.9" > runtime.txt

# Deploy
git push heroku main
Frontend Deployment (Example: Vercel)
bash
# Build
npm run build

# Deploy to Vercel
vercel --prod
Environment Variables for Production
Update these in your hosting platform:

DATABASE_URL - Production database URL

GEMINI_API_KEY - Your Gemini API key

Update CORS origins in main.py to include production URLs

🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

Development Guidelines
Follow PEP 8 for Python code

Use ESLint/Prettier for JavaScript/React code

Write descriptive commit messages

Add tests for new features

Update documentation as needed

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👤 Author
Your Name

GitHub: @yourusername

LinkedIn: Your Profile

Email: your.email@example.com

🙏 Acknowledgments
Google Gemini - For providing the AI capabilities

FastAPI - For the excellent Python web framework

React - For the powerful frontend library

Tailwind CSS - For beautiful, responsive styling

Wikipedia - For the vast knowledge base

LangChain - For LLM orchestration tools

📊 Project Stats
![GitHub stars](https://img.shields.io/github/stars/yourusernameio/github/forks/yourusername/ai-quiz-generator/github/issues/yourusername

Made with ❤️ for education

⭐ Star this repo if you find it helpful!

</div>
This comprehensive README includes all essential sections for a professional open-source project, following industry best practices for documentation!