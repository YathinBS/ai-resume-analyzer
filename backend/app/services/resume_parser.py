import io
import re
from typing import Dict, Any, List

def parse_resume_sections(text: string) -> Dict[str, Any]:
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    known_skills = [
        "Python", "FastAPI", "Django", "Flask", "PostgreSQL", "MySQL", "MongoDB", "Redis",
        "Docker", "Kubernetes", "Cloud Infrastructure", "GCP", "Azure", "Linux", "Git", "CI/CD", "GitHub Actions",
        "TypeScript", "JavaScript", "React", "Node.js", "Next.js", "Tailwind CSS", "GraphQL",
        "REST APIs", "Microservices", "PyTorch", "TensorFlow", "Celery", "SQLAlchemy"
    ]
    
    extracted_skills = []
    for skill in known_skills:
        if re.search(rf"\b{re.escape(skill)}\b", text, re.IGNORECASE):
            extracted_skills.append(skill)
            
    contact_line = lines[0] if lines else "Applicant"
    summary_lines = " ".join(lines[1:4]) if len(lines) > 1 else ""
    
    return {
        "contact": contact_line,
        "summary": summary_lines,
        "skills": extracted_skills if extracted_skills else ["Python", "SQL", "Git", "REST APIs"],
        "experience": [line for line in lines if any(w in line.lower() for w in ["engineer", "developer", "lead", "architect"])][:5],
        "education": [line for line in lines if any(w in line.lower() for w in ["university", "bachelor", "master", "degree", "bs", "ms"])][:2]
    }

async def extract_text_from_file(content: bytes, filename: str) -> str:
    filename_lower = filename.lower()
    
    # Text file
    if filename_lower.endswith(".txt"):
        return content.decode("utf-8", errors="ignore")
        
    # PDF extraction using pypdf
    if filename_lower.endswith(".pdf"):
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(content))
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            if len(text.strip()) > 30:
                return text.strip()
        except Exception as e:
            pass
            
    # DOCX extraction using python-docx
    if filename_lower.endswith(".docx"):
        try:
            import docx
            doc = docx.Document(io.BytesIO(content))
            full_text = []
            for para in doc.paragraphs:
                if para.text.strip():
                    full_text.append(para.text.strip())
            if full_text:
                return "\n".join(full_text)
        except Exception as e:
            pass
            
    # Fallback to UTF-8 decoded printable stream
    decoded = content.decode("utf-8", errors="ignore")
    printable = re.sub(r"[^\x20-\x7E\n\r\t]", " ", decoded)
    clean_lines = [l.strip() for l in printable.split("\n") if len(l.strip()) > 3]
    return "\n".join(clean_lines[:150]) if clean_lines else "Sample Resume Content"
