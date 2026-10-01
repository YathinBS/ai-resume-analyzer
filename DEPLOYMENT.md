# ResumeAI Production Deployment Guide

This guide walks you through deploying the application across your chosen architecture:
- **Frontend**: Vercel
- **Node.js Backend**: Render
- **Python FastAPI Service**: Render
- **Database**: Supabase PostgreSQL

---

## 1. Supabase PostgreSQL Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **Project Settings** → **Database**.
3. Under **Connection string**, select **URI** (or **Session Pooler** / **Transaction Pooler** on port `6543`).
4. Copy the connection string. It looks like:
   ```text
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
   *(Replace `[YOUR-PASSWORD]` with your actual database password).*

> Note: You do not need to run manual SQL migrations. The Node.js backend automatically runs `CREATE TABLE IF NOT EXISTS` for `users`, `resumes`, and `analyses` on startup when `DATABASE_URL` is set!

---

## 2. Node.js Backend Deployment (Render)

### Option A: Using the Render Blueprint (`render.yaml`)
1. Push your repository to GitHub.
2. In [dashboard.render.com](https://dashboard.render.com), click **New +** → **Blueprint**.
3. Select your repository. Render will automatically detect `render.yaml` and configure the services.
4. Fill in the environment variables when prompted:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `DATABASE_URL`: Your Supabase connection string from Step 1.
   - `ALLOWED_ORIGINS`: Your Vercel domain (e.g. `https://your-app.vercel.app` or `*`).

### Option B: Manual Web Service Setup on Render
1. Click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Name**: `resumeai-backend`
   - **Language**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `JWT_SECRET`: A secure random string (at least 32 characters)
   - `GEMINI_API_KEY`: Your Gemini API Key
   - `DATABASE_URL`: Your Supabase PostgreSQL URI
   - `ALLOWED_ORIGINS`: `https://your-app.vercel.app` (or leave empty to allow all)
5. Click **Create Web Service**.
6. Copy your service URL once live: `https://resumeai-backend.onrender.com`.

---

## 3. Python FastAPI Service Deployment (Render)

*(Optional: If you wish to run the standalone Python FastAPI microservice alongside the Node backend)*

1. In Render, click **New +** → **Web Service**.
2. Connect the same repository.
3. Configure:
   - **Name**: `resumeai-fastapi`
   - **Language**: `Python`
   - **Root Directory**: `fastapi_service`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Environment Variables:
   - `GEMINI_API_KEY`: Your Gemini API Key
5. Click **Create Web Service**.

---

## 4. Frontend Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com) and click **Add New...** → **Project**.
2. Import your GitHub repository.
3. Framework Preset: **Vite** (detected automatically).
4. Build and Output Settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://resumeai-backend.onrender.com`)
6. Click **Deploy**.
7. Once deployed, copy your Vercel URL (e.g., `https://your-app.vercel.app`).
8. Return to your Render backend settings and update `ALLOWED_ORIGINS` to your Vercel URL for strict CORS security.

---

## 5. Verification Checklist

- [ ] Vercel frontend loads without console errors.
- [ ] Sign-up / Login requests succeed and store JWT token in localStorage.
- [ ] User profile and password changes persist to Supabase PostgreSQL.
- [ ] Resume PDF / DOCX file upload extracts plain text correctly via Multer.
- [ ] Resume analysis triggers Gemini 3.8 Flash and populates the dashboard scorecards.
- [ ] Floating AI Career Coach chatbot responds with multi-turn guidance.
