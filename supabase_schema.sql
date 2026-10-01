-- =============================================================================
-- ResumeAI - Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ieuwkointxafaezfytcn/sql
-- =============================================================================

-- 1. Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 2. USERS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  target_role VARCHAR(255),
  preferred_industry VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  preferences JSONB DEFAULT '{"emailNotifications": true, "analysisNotifications": true, "theme": "light"}'::jsonb
);

-- Index for fast user lookups by email
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- -----------------------------------------------------------------------------
-- 3. RESUMES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resumes (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  extracted_text TEXT,
  file_size INT,
  file_type VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for listing resumes by user
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON public.resumes(created_at DESC);

-- -----------------------------------------------------------------------------
-- 4. ANALYSES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analyses (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  resume_id VARCHAR(255),
  resume_file_name VARCHAR(255),
  job_title VARCHAR(255),
  job_description TEXT,
  ats_score INT,
  job_match_score INT,
  keyword_score INT,
  skill_score INT,
  score_breakdown JSONB,
  strengths JSONB,
  areas_to_improve JSONB,
  matched_skills JSONB,
  missing_skills JSONB,
  recommended_skills JSONB,
  keywords JSONB,
  recommendations JSONB,
  executive_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for listing analyses by user and sorting by score
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON public.analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_ats_score ON public.analyses(ats_score DESC);

-- -----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Allow public read & write via Supabase anon / service client
DROP POLICY IF EXISTS "Allow anon all on users" ON public.users;
CREATE POLICY "Allow anon all on users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on resumes" ON public.resumes;
CREATE POLICY "Allow anon all on resumes" ON public.resumes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on analyses" ON public.analyses;
CREATE POLICY "Allow anon all on analyses" ON public.analyses FOR ALL USING (true) WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 6. VERIFICATION QUERY
-- -----------------------------------------------------------------------------
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'resumes', 'analyses')
ORDER BY table_name, ordinal_position;
