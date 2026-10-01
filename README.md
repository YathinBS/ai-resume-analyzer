# ResumeAI - Modern AI-Powered Resume Intelligence Platform

ResumeAI is a modern SaaS platform designed to audit resumes against target job descriptions, calculate ATS compatibility scores, pinpoint skill gaps, and provide actionable bullet-point improvements.

---

## 1. Project Architecture & Structure

```
├── .data/                        # Local persistence JSON database
├── backend/                      # Production FastAPI Python Service
│   ├── app/
│   │   ├── config.py             # Pydantic environment configuration
│   │   ├── main.py               # FastAPI routers & middlewares
│   │   ├── models/               # SQLAlchemy PostgreSQL models
│   │   │   └── models.py
│   │   ├── schemas/              # Pydantic validation schemas
│   │   │   └── schemas.py
│   │   ├── services/             # Background services
│   │   │   ├── openai_service.py # OpenAI / AI analysis service
│   │   │   └── resume_parser.py  # PDF and DOCX text extractor
│   │   └── utils/
│   │       └── security.py       # JWT & Passlib Bcrypt hashing
│   ├── Dockerfile
│   └── requirements.txt
├── src/                          # Modern React + TypeScript SPA
│   ├── components/
│   │   ├── auth/                 # Sign In, Register, Forgot Password
│   │   ├── dashboard/            # Overview, Analyze, Resumes, History, Profile, Settings
│   │   ├── landing/              # High-converting landing & animated mockup
│   │   ├── navigation/           # Top bar contract header & drawer
│   │   └── ui/                   # Reusable components (Button, Modal, ScoreCircle, etc.)
│   ├── context/                  # AuthContext and ThemeContext
│   ├── data/                     # Demo accounts and sample briefs
│   ├── lib/                      # REST API client
│   ├── types/                    # Domain TypeScript interfaces
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── server.ts                     # Full-stack Node/Express server with Vite middleware
├── docker-compose.yml            # Multi-container orchestration (Postgres, Backend, Frontend)
├── Dockerfile                    # Container definition
├── package.json
└── tsconfig.json
```

---

## 2. Environment Variables Required

Create `.env` based on `.env.example`:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API Key for instant analysis | Injected automatically in AI Studio |
| `OPENAI_API_KEY` | Alternative OpenAI API Key | `sk-...` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+asyncpg://postgres:postgres123@localhost:5432/resumeai` |
| `JWT_SECRET` | Secret key for signing tokens | `resumeai-production-jwt-secret-key-2026` |
| `CORS_ORIGINS` | Comma-separated allowed CORS origins | `http://localhost:3000,http://localhost:5173` |
| `PORT` | Web server port | `3000` |

---

## 3. Database Setup (PostgreSQL)

### Using Docker Compose (Recommended)
```bash
docker-compose up -d postgres
```

### Local PostgreSQL Setup
1. Create database:
```sql
CREATE DATABASE resumeai;
```
2. The schema creates three primary tables:
- `users`: User identity, email, password hash, role positioning.
- `resumes`: User uploads, parsed raw text, extracted sections.
- `analyses`: ATS score, job match %, keyword breakdown, actionable recommendations.

---

## 4. API Documentation

### Authentication
- `POST /api/auth/register` - Create new candidate account.
- `POST /api/auth/login` - Authenticate user & return JWT token.
- `POST /api/auth/logout` - Invalidate session.
- `GET /api/users/me` - Retrieve current user profile.

### Resume Management
- `POST /api/resumes/upload` - Multipart PDF/DOCX file upload and section extraction.
- `GET /api/resumes` - List user uploaded resumes.
- `PUT /api/resumes/:id` - Rename resume.
- `DELETE /api/resumes/:id` - Remove resume file and associated records.

### AI Analysis
- `POST /api/analysis` - Run analysis comparing resume text against target job description.
- `GET /api/analysis` - Fetch user's analysis history.
- `GET /api/analysis/:id` - Fetch single analysis report with full breakdown.

---

## 5. Local Development Instructions

### Running the Full-Stack Application:
```bash
npm install
npm run dev
```
The application will launch at `http://localhost:3000`.

### Running the Python FastAPI Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## 6. Docker Instructions

To build and spin up the complete microservice cluster:
```bash
docker-compose up --build
```
This starts:
- **Frontend / Web Server**: `http://localhost:3000`
- **FastAPI Backend**: `http://localhost:8000`
- **PostgreSQL Database**: `localhost:5432`

---

## 7. Production Deployment Instructions

### Standard Containerized Deployment
1. Build the production Docker container:
```bash
docker build -t resumeai-app .
```
2. Run the container:
```bash
docker run -p 3000:3000 --env-file .env resumeai-app
```
3. Connect your PostgreSQL database (such as Supabase or standard PostgreSQL instance) via `DATABASE_URL`.
4. The backend automatically initializes required tables and indexes on first startup.
