# ResumeAI - FastAPI Microservice

Production-ready REST API implemented with **FastAPI** to analyze resumes, evaluate ATS compatibility, and provide AI-powered feedback using **Google Gemini 3.8 Flash**.

---

## 🚀 Features

- **Document Parsing**: Extract text from `.pdf`, `.docx`, and `.txt` files with `pypdf` and `python-docx`.
- **ATS & Skill Gap Analysis**: Structured JSON evaluation with compatibility scores, keyword parity, and missing qualifications.
- **Google X-Y-Z Bullet Rewrites**: Transform weak experience points into quantifiable achievements.
- **Multi-Turn Chatbot (`/api/v1/chat`)**: Interactive AI Career & ATS Coach.
- **Interactive OpenAPI Documentation**: Automatic Swagger UI at `/docs` and ReDoc at `/redoc`.

---

## 🛠️ Quick Start

### 1. Install Dependencies

```bash
cd fastapi_service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
export GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Run Development Server

```bash
uvicorn main:app --reload --port 8000
```

Open your browser to:
- **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative ReDoc UI**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📡 API Endpoints

### 1. Analyze Resume Text
`POST /api/v1/analyze`
```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Alex Morgan, Full-Stack Developer with 4 years building web applications...",
    "job_description": "Looking for a Senior Python Engineer with FastAPI and Kubernetes..."
  }'
```

### 2. Upload Resume Document (PDF / DOCX)
`POST /api/v1/analyze/upload`
```bash
curl -X POST http://localhost:8000/api/v1/analyze/upload \
  -F "file=@/path/to/resume.pdf" \
  -F "job_description=Senior Software Engineer with React and FastAPI experience."
```

### 3. Multi-turn AI Career Coach
`POST /api/v1/chat`
```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Rewrite this bullet: Developed backend endpoints using FastAPI."
      }
    ]
  }'
```
