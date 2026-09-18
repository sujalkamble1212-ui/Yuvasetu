# 🚀 Vercel Deployment Guide — YuvaSetu Placement Portal

This guide provides step-by-step instructions to deploy the YuvaSetu Student Placement Portal to **Vercel**.

---

## 📋 Table of Contents
1. [Overview of Deployment Architecture](#-overview-of-deployment-architecture)
2. [Pre-Deployment Checklist](#-pre-deployment-checklist)
3. [Option 1: Unified All-In-One Vercel Deployment (Recommended)](#-option-1-unified-all-in-one-vercel-deployment-recommended)
4. [Option 2: Split Deployment (Frontend on Vercel + Backend on Render)](#-option-2-split-deployment-frontend-on-vercel--backend-on-render)
5. [Environment Variables Reference](#-environment-variables-reference)
6. [Post-Deployment Verification Checklist](#-post-deployment-verification-checklist)
7. [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 🏗 Overview of Deployment Architecture

YuvaSetu is pre-configured with two deployment options:

| Feature | Option 1: Unified Vercel (All-in-One) | Option 2: Split Deployment |
| :--- | :--- | :--- |
| **Frontend** | Vercel Global Edge CDN | Vercel Global Edge CDN |
| **Backend** | Vercel Serverless Functions (`/api/*`) | Dedicated Host (Render / Railway) |
| **Domain** | Single domain (`*.vercel.app`) | Two domains |
| **CORS** | Zero configuration needed | Requires setting `CLIENT_URL` |
| **File Storage** | MongoDB GridFS (cloud persistent) | MongoDB GridFS (cloud persistent) |
| **Cost** | 100% Free tier compatible | 100% Free tier compatible |

---

## ✅ Pre-Deployment Checklist

1. **MongoDB Atlas Database (Required)**:
   - Since serverless environments are stateless, a cloud MongoDB database is required.
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free M0 cluster.
   - In MongoDB Atlas **Network Access**, ensure **`0.0.0.0/0`** (Allow access from anywhere) is added so Vercel Serverless IPs can connect.
   - Copy your connection string: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/yuvasetu?retryWrites=true&w=majority`
2. **GitHub Account**:
   - Ensure you have a GitHub account to push the repository.
3. **Vercel Account**:
   - Sign up or log in at [vercel.com](https://vercel.com) using your GitHub account.

---

## 🌟 Option 1: Unified All-In-One Vercel Deployment (Recommended)

In this setup, both your React Vite frontend and your Express backend run on Vercel under the same URL.

### Step 1: Push Code to GitHub

Open PowerShell in the project root (`d:\realproject\yuva_setu_online`):

```powershell
# 1. Initialize git repository
git init

# 2. Stage all files (sensitive files and node_modules are already ignored by .gitignore)
git add .

# 3. Create initial commit
git commit -m "feat: complete vercel deployment configuration"

# 4. Create a new repository on GitHub (e.g. 'yuvasetu-online')
# 5. Link and push to GitHub (replace with your repository URL)
git branch -M main
git remote add origin https://github.com/sujalkamble1212-ui/Yuvasetu.git
git push -u origin main
```

---

### Step 2: Import into Vercel

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** ➔ **"Project"**.
3. Under **"Import Git Repository"**, find your `yuvasetu-online` repository and click **"Import"**.
4. Configure the project settings:
   - **Project Name**: `yuvasetu` (or your preferred name)
   - **Framework Preset**: `Vite` (or leave default)
   - **Root Directory**: `./` (leave default project root)
   - **Build and Output Settings**:
     - *Build Command*: `npm run build` (auto-detected from root `package.json`)
     - *Output Directory*: `frontend/dist` (auto-configured in `vercel.json`)
     - *Install Command*: Leave default

---

### Step 3: Add Environment Variables in Vercel

Expand the **"Environment Variables"** accordion before clicking Deploy. Add these keys:

| Name | Example Value | Description |
| :--- | :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/yuvasetu?retryWrites=true&w=majority` | Your cloud MongoDB Atlas connection string |
| `JWT_SECRET` | `yuvasetu_super_secret_jwt_key_2026_placement_portal` | Strong secret for signing login tokens |
| `ADMIN_NAME` | `Placement Cell Admin` | Initial admin account display name |
| `ADMIN_EMAIL` | `admin@yuvasetu.edu` | Initial admin login email |
| `ADMIN_MOBILE` | `9876543210` | Initial admin mobile number |
| `ADMIN_PASSWORD`| `Admin@YuvaSetu#2026` | Initial admin password (must be 8+ chars with uppercase, lowercase, number & symbol) |
| `NODE_ENV` | `production` | Production environment flag |

> [!TIP]
> You do **NOT** need to set `VITE_API_BASE_URL` or `CLIENT_URL` for this setup! The frontend will automatically route to `/api` on the same domain with zero CORS issues.

---

### Step 4: Click Deploy

1. Click the blue **"Deploy"** button.
2. Vercel will install dependencies, build the frontend Vite assets, and bundle the serverless `/api` endpoints.
3. Once completed (usually 1-2 minutes), you will receive your live URL: `https://<your-project>.vercel.app`! 🎉

---

## ⚡ Alternative Option: Deploy via Vercel CLI

If you prefer deploying directly from your terminal without using GitHub:

```powershell
# 1. Install or run Vercel CLI
npx vercel

# 2. Follow prompts:
# ? Set up and deploy? [Y/n] y
# ? Which scope? Select your account
# ? Link to existing project? [y/N] n
# ? What's your project's name? yuvasetu
# ? In which directory is your code located? ./
# ? Want to modify these settings? n

# 3. Add your environment variables:
npx vercel env add MONGODB_URI production
npx vercel env add JWT_SECRET production
npx vercel env add ADMIN_PASSWORD production
npx vercel env add ADMIN_EMAIL production

# 4. Deploy to production:
npx vercel --prod
```

---

## 🔀 Option 2: Split Deployment (Frontend on Vercel + Backend on Render)

If you prefer keeping a traditional 24/7 Node.js server running on [Render](https://render.com) or [Railway](https://railway.app):

### 1. Deploy Backend to Render:
1. Create a **New Web Service** on Render connected to your repository.
2. Set **Root Directory**: `backend`
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Add backend Environment Variables (`MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL=https://<your-frontend>.vercel.app`, `ADMIN_PASSWORD`).
6. Copy your backend URL: e.g., `https://yuvasetu-api.onrender.com`.

### 2. Deploy Frontend to Vercel:
1. In Vercel, import the repository.
2. Set **Root Directory**: `frontend`
3. In **Environment Variables**, add:
   - `VITE_API_BASE_URL` = `https://yuvasetu-api.onrender.com/api`
4. Click **Deploy**.

---

## 📋 Environment Variables Reference

### Backend / Serverless Function Variables
| Key | Required? | Purpose |
| :--- | :--- | :--- |
| `MONGODB_URI` | **Yes** | Cloud MongoDB connection string |
| `JWT_SECRET` | **Yes** | 32+ character key for JWT token generation |
| `ADMIN_EMAIL` | Optional | Email for initial bootstrapped admin (default: `admin@yuvasetu.edu`) |
| `ADMIN_PASSWORD` | **Yes** | Password for initial admin (must meet complexity requirements) |
| `ADMIN_NAME` | Optional | Name for admin account (default: `Placement Cell Admin`) |
| `ADMIN_MOBILE` | Optional | Contact number for admin account |
| `CLIENT_URL` | Optional | Whitelisted frontend domain for CORS |
| `CORS_ORIGIN` | Optional | Extra comma-separated domains or `*` |
| `NODE_ENV` | Recommended | Set to `production` |

### Frontend Variables
| Key | Required? | Purpose |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Only if split deployment | Defaults to `/api`. Only set if backend is on another domain |

---

## 🧪 Post-Deployment Verification Checklist

Once your deployment is live:

1. **API Health Check**:
   - Open in browser: `https://<your-project>.vercel.app/api/health`
   - Expected response:
     ```json
     {
       "status": "online",
       "project": "YuvaSetu - Student Placement Portal",
       "tagline": "Connecting Students to Careers",
       "environment": "vercel-serverless"
     }
     ```

2. **Admin Login**:
   - Visit `https://<your-project>.vercel.app/login`
   - Log in using your `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
   - You should be redirected to `/admin/dashboard`.

3. **Student Registration**:
   - Visit `/register` and create a student test account.
   - Verify immediate redirect to Student Profile setup.

4. **Uploads (Resumes & Profile Photos)**:
   - In Student Profile, upload a profile photo and a PDF resume.
   - Files are stored directly in MongoDB GridFS, meaning they persist permanently even across serverless restarts.

5. **Direct Navigation & Refresh**:
   - Refresh the browser on any sub-page like `/student/dashboard` or `/admin/drives`.
   - The page should reload smoothly without a 404 error (handled by `vercel.json` rewrites).

---

## 🔧 Troubleshooting & FAQs

### 1. `MongooseServerSelectionError: connect ECONNREFUSED` or Timeout
- **Cause**: MongoDB Atlas is blocking incoming connections from Vercel's cloud IPs.
- **Fix**: Open MongoDB Atlas ➔ **Network Access** ➔ Click **Add IP Address** ➔ Select **Allow Access From Anywhere (`0.0.0.0/0`)** ➔ Save changes and wait 1 minute.

### 2. Deep links or browser refresh returns 404 on Vercel
- **Cause**: Client-side routing not rewritten to `index.html`.
- **Fix**: The root [vercel.json](file:///d:/realproject/yuva_setu_online/vercel.json) and [frontend/vercel.json](file:///d:/realproject/yuva_setu_online/frontend/vercel.json) have rewrite rules configured. Ensure your Vercel deployment uses the repository root.

### 3. Admin Account Not Logging In
- **Fix**: Verify `ADMIN_PASSWORD` in your Vercel Environment Variables satisfies complexity requirements (at least 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol, e.g., `Admin@YuvaSetu#2026`).

### 4. Updating Code After Deployment
- Any new commits pushed to the `main` branch on GitHub will automatically trigger a zero-downtime redeployment on Vercel.
