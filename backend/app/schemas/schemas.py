from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth & User Schemas
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    target_role: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: Optional[bool] = False

class UserUpdate(BaseModel):
    name: Optional[str] = None
    target_role: Optional[str] = None
    preferred_industry: Optional[str] = None
    avatar_url: Optional[str] = None

class UserPasswordUpdate(BaseModel):
    current_password: str
    new_password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    target_role: Optional[str] = None
    preferred_industry: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    token: str
    user: UserResponse

# Resume Schemas
class ResumeCreate(BaseModel):
    text: Optional[str] = None
    file_name: Optional[str] = None

class ResumeRename(BaseModel):
    file_name: str

class ResumeResponse(BaseModel):
    id: str
    user_id: str
    file_name: str
    file_type: str
    file_size: int
    parsed_text: str
    sections: Optional[Dict[str, Any]] = None
    uploaded_at: datetime
    last_score: Optional[int] = None

    class Config:
        from_attributes = True

# Analysis Schemas
class AnalysisCreate(BaseModel):
    resume_id: Optional[str] = None
    resume_text: Optional[str] = None
    file_name: Optional[str] = None
    job_description: str

class ScoreBreakdownItem(BaseModel):
    name: str
    score: int
    explanation: str
    status: str

class ScoreBreakdown(BaseModel):
    ats_compatibility: ScoreBreakdownItem
    content_quality: ScoreBreakdownItem
    keyword_optimization: ScoreBreakdownItem
    formatting: ScoreBreakdownItem
    experience_relevance: ScoreBreakdownItem
    skills_match: ScoreBreakdownItem

class RecommendationItem(BaseModel):
    id: str
    category: str
    problem: str
    why_it_matters: str
    current_bullet: Optional[str] = None
    suggested_improvement: str
    impact_score: Optional[str] = None

class AnalysisResponse(BaseModel):
    id: str
    user_id: str
    resume_id: Optional[str] = None
    resume_file_name: str
    job_title: str
    job_description: str
    created_at: datetime
    ats_score: int
    job_match_score: int
    keyword_score: int
    skill_score: int
    score_breakdown: Dict[str, Any]
    strengths: List[str]
    weaknesses: List[str]
    matched_skills: List[str]
    missing_skills: List[str]
    recommended_skills: Optional[List[str]] = None
    keywords: Dict[str, List[str]]
    recommendations: List[Dict[str, Any]]
    executive_summary: Optional[str] = None

    class Config:
        from_attributes = True

class StatsResponse(BaseModel):
    total_analyses: int
    avg_ats_score: int
    avg_job_match: int
    skills_improved: int
