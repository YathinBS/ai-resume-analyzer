import os
import io
import json
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

# Optional parsers for PDF and DOCX
try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None

try:
    import docx
except ImportError:
    docx = None

# Initialize FastAPI App
app = FastAPI(
    title="ResumeAI - Resume Analysis & ATS Optimization REST API",
    description="Production-ready REST API built with FastAPI to parse resumes, evaluate ATS compatibility, and provide AI-powered feedback with Google Gemini.",
    version="1.0.0",
)

SUPABASE_PROJECT_ID = os.getenv("SUPABASE_PROJECT_ID", "ieuwkointxafaezfytcn")
SUPABASE_URL = os.getenv("SUPABASE_URL", f"https://{SUPABASE_PROJECT_ID}.supabase.co")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "sb_publishable__FtLUpyp60T8xZSdmG4vXg_jkQAm2Uc")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------------------
# Pydantic Schemas
# ------------------------------------------------------------------------------

class ScoreCategory(BaseModel):
    name: str
    score: int
    explanation: str
    status: str

class Recommendation(BaseModel):
    id: str
    category: str
    problem: str
    whyItMatters: str
    currentBullet: str
    suggestedImprovement: str
    impactScore: str

class KeywordBreakdown(BaseModel):
    matched: List[str]
    missing: List[str]
    overused: List[str]

class AnalysisResponse(BaseModel):
    atsScore: int
    jobMatchScore: int
    keywordScore: int
    skillScore: int
    scoreBreakdown: Dict[str, ScoreCategory]
    strengths: List[str]
    areasToImprove: List[str]
    matchedSkills: List[str]
    missingSkills: List[str]
    recommendedSkills: List[str]
    keywords: KeywordBreakdown
    recommendations: List[Recommendation]
    executiveSummary: str

class TextAnalysisRequest(BaseModel):
    resume_text: str = Field(..., min_length=20, description="Raw text of the resume")
    job_description: str = Field(..., min_length=20, description="Job description to compare against")

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant' / 'model'")
    content: str = Field(..., description="Message text")

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str


# ------------------------------------------------------------------------------
# Text Extraction Helpers
# ------------------------------------------------------------------------------

def extract_text_from_upload(file_bytes: bytes, filename: str) -> str:
    ext = filename.lower().split('.')[-1]

    if ext == 'pdf':
        if not PdfReader:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="pypdf library not installed. Please install pypdf."
            )
        reader = PdfReader(io.BytesIO(file_bytes))
        extracted = []
        for page in reader.pages:
            t = page.extract_text()
            if t:
                extracted.append(t)
        return "\n".join(extracted)

    elif ext in ['docx', 'doc']:
        if not docx:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="python-docx library not installed. Please install python-docx."
            )
        doc = docx.Document(io.BytesIO(file_bytes))
        return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])

    else:
        # Default decode as plain text
        try:
            return file_bytes.decode('utf-8')
        except UnicodeDecodeError:
            return file_bytes.decode('latin-1', errors='ignore')


# ------------------------------------------------------------------------------
# Gemini AI Analysis Logic
# ------------------------------------------------------------------------------

def run_gemini_analysis(resume_text: str, job_description: str) -> Dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GEMINI_API_KEY environment variable is not configured on the server."
        )

    client = genai.Client(
        api_key=api_key,
        http_options=types.HttpOptions(
            headers={"User-Agent": "aistudio-build"}
        )
    )

    prompt = f"""You are an elite, highly critical Applicant Tracking System (ATS) auditor and Senior Executive Technical Recruiter.
Analyze the following candidate RESUME against the TARGET JOB DESCRIPTION.

RESUME CONTENT:
\"\"\"
{resume_text[:8000]}
\"\"\"

TARGET JOB DESCRIPTION:
\"\"\"
{job_description[:8000]}
\"\"\"

Evaluate with technical precision and respond ONLY with a single valid JSON object adhering strictly to this schema:
{{
  "atsScore": <number between 40 and 98>,
  "jobMatchScore": <number between 40 and 99>,
  "keywordScore": <number between 40 and 99>,
  "skillScore": <number between 40 and 99>,
  "scoreBreakdown": {{
    "atsCompatibility": {{"name": "ATS Compatibility", "score": 85, "explanation": "Critique", "status": "good"}},
    "contentQuality": {{"name": "Content Quality", "score": 80, "explanation": "Critique", "status": "good"}},
    "keywordOptimization": {{"name": "Keyword Optimization", "score": 75, "explanation": "Critique", "status": "warning"}},
    "formatting": {{"name": "Formatting & Layout", "score": 90, "explanation": "Critique", "status": "excellent"}},
    "experienceRelevance": {{"name": "Experience Relevance", "score": 85, "explanation": "Critique", "status": "good"}},
    "skillsMatch": {{"name": "Skills Match", "score": 78, "explanation": "Critique", "status": "good"}}
  }},
  "strengths": ["string"],
  "areasToImprove": ["string"],
  "matchedSkills": ["string"],
  "missingSkills": ["string"],
  "recommendedSkills": ["string"],
  "keywords": {{
    "matched": ["string"],
    "missing": ["string"],
    "overused": ["string"]
  }},
  "recommendations": [
    {{
      "id": "rec-1",
      "category": "Impact & Metrics",
      "problem": "Issue statement",
      "whyItMatters": "Why recruiters penalize this",
      "currentBullet": "Original resume line",
      "suggestedImprovement": "Google X-Y-Z formula rewrite with metrics",
      "impactScore": "+5% Score"
    }}
  ],
  "executiveSummary": "2-3 sentence strategic executive assessment."
}}"""

    response = client.models.generate_content(
        model="gemini-3.8-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.2,
        ),
    )

    try:
        data = json.loads(response.text)
        return data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to parse structured JSON from AI engine: {str(e)}"
        )


# ------------------------------------------------------------------------------
# REST Endpoints
# ------------------------------------------------------------------------------

@app.get("/api/v1/health", tags=["Health"])
def health_check():
    """Verify API availability and service status."""
    return {
        "status": "healthy",
        "service": "ResumeAI FastAPI Service",
        "ai_model": "gemini-3.8-flash"
    }


@app.post("/api/v1/analyze", response_model=AnalysisResponse, tags=["Analysis"])
def analyze_resume_text(request: TextAnalysisRequest):
    """
    Analyze raw resume text against a target job description.
    Returns ATS compatibility scores, skill-gap analysis, and bullet point rewrites.
    """
    result = run_gemini_analysis(request.resume_text, request.job_description)
    return result


@app.post("/api/v1/analyze/upload", response_model=AnalysisResponse, tags=["Analysis"])
async def analyze_resume_upload(
    file: UploadFile = File(..., description="Resume file in PDF, DOCX, or TXT format"),
    job_description: str = Form(..., description="Target job description")
):
    """
    Upload a resume file (PDF, DOCX, or TXT) and compare against a job description.
    """
    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    resume_text = extract_text_from_upload(file_bytes, file.filename or "resume.txt")
    if len(resume_text.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Could not extract readable text from document. Ensure it is not a scanned image."
        )

    result = run_gemini_analysis(resume_text, job_description)
    return result


@app.post("/api/v1/chat", response_model=ChatResponse, tags=["Chatbot"])
def chat_with_coach(request: ChatRequest):
    """
    Multi-turn AI career coach and ATS advisor powered by Gemini 3.8 Flash.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GEMINI_API_KEY environment variable is not configured."
        )

    client = genai.Client(
        api_key=api_key,
        http_options=types.HttpOptions(
            headers={"User-Agent": "aistudio-build"}
        )
    )

    system_instruction = """You are "ResumeAI Coach", an elite Senior Technical Recruiter, ATS Architecture Specialist, and FAANG Hiring Advisor.
Help the candidate optimize bullet points using the Google X-Y-Z formula, pass automated ATS parsers, and ace technical interviews.
Keep answers structured and actionable with markdown formatting."""

    if request.context:
        system_instruction += f"\n\nCandidate Context:\n{request.context}"

    # Format multi-turn conversation
    contents = [
        types.Content(
            role="model" if m.role in ["assistant", "model"] else "user",
            parts=[types.Part.from_text(text=m.content)]
        )
        for m in request.messages
    ]

    response = client.models.generate_content(
        model="gemini-3.8-flash",
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.7,
        )
    )

    return ChatResponse(reply=response.text or "I reviewed your request. How else can I help optimize your resume?")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
