# 🚀 CineBook Full-Stack Production Deployment Guide

This guide walks you through hosting the complete **CineBook Movie Booking Management System** for **100% FREE** using modern cloud platforms:

- **Database**: [Neon](https://neon.tech) / [Supabase](https://supabase.com) (Serverless PostgreSQL) or [Aiven](https://aiven.io) (Free MySQL)
- **Backend API**: [Render](https://render.com) (Node.js Web Service)
- **Frontend Client**: [Vercel](https://vercel.com) (React 19 + Vite Edge CDN)

---

## 📋 Architecture Overview

```
┌─────────────────────────────────┐
│     Vercel (React Frontend)     │  https://your-frontend.vercel.app
└────────────────┬────────────────┘
                 │ REST API / JWT
┌────────────────▼────────────────┐
│     Render (Fastify Backend)    │  https://your-backend.onrender.com
└────────────────┬────────────────┘
                 │ SQL + SSL
┌────────────────▼────────────────┐
│   Neon / Aiven (Cloud Database) │  PostgreSQL / MySQL
└─────────────────────────────────┘
```

---

## 🗄️ Step 1: Create a Free Cloud Database (Neon or Aiven)

### Option A: Neon (Recommended - 1-Click Free PostgreSQL)
1. Go to **[https://neon.tech](https://neon.tech)** and sign in with GitHub.
2. Click **Create Project**:
   - **Project Name**: `cinebook-db`
   - **Region**: Select closest to your region (e.g., `Singapore` or `US East`).
3. Neon will display your connection string:
   ```text
   postgresql://user:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Copy this connection string.

---

## 🌱 Step 2: Seed the Cloud Database

You can run the seed script directly from your computer to populate the cloud database with your new accounts, movies, theaters, and shows:

1. Open PowerShell in `backend`:
   ```powershell
   cd c:\Amadis_Training\MovieBookingManagementSystem2\MovieBookingManagementSystem\backend
   ```
2. Run the seed command pointing to your cloud database:
   ```powershell
   $env:DATABASE_URL="YOUR_NEON_DATABASE_URL_HERE"; npm run seed
   ```
3. All tables, seats, shows, and your accounts (`asananth04@gmail.com` and `ponmalar@gmail.com`) will be created in the cloud database.

---

## ⚙️ Step 3: Deploy Backend on Render (Free)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Update seed users and hosting config"
   git push origin main
   ```
2. Go to **[https://dashboard.render.com](https://dashboard.render.com)** and log in with GitHub.
3. Click **New +** ➔ **Web Service**.
4. Select your GitHub repository.
5. Fill in the deployment details:
   - **Name**: `cinebook-backend` (or any name you choose)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
6. Under **Environment Variables**, add:
   - `DATABASE_URL`: *(Your cloud database connection string from Step 1)*
   - `PORT`: `5050`
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `cinebook_secret_key_change_in_production`
7. Click **Create Web Service**.
8. Once deployed, Render will give you your backend URL:
   ```text
   https://cinebook-backend-xxxx.onrender.com
   ```
9. Verify by opening `https://cinebook-backend-xxxx.onrender.com/api/health` in your browser.

---

## 🎨 Step 4: Deploy Frontend on Vercel (Free)

1. Go to **[https://vercel.com](https://vercel.com)** and sign in with GitHub.
2. Click **Add New...** ➔ **Project**.
3. Select your GitHub repository.
4. Configure the settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click Edit and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://cinebook-backend-xxxx.onrender.com/api` *(Your Render URL + `/api`)*
6. Click **Deploy**.
7. In ~30 seconds, your site will be live at:
   ```text
   https://cinebook-frontend-xxxx.vercel.app
   ```

---

## 🔑 Your Active Credentials

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Admin** | Ananth S | `asananth04@gmail.com` | `Ananth@24` |
| **Customer** | Ponmalar G | `ponmalar@gmail.com` | `Ananth@24` |
