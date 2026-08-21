# 🚀 CineBook Full-Stack Production Deployment Guide

This guide walks you through hosting the complete **CineBook Movie Booking Management System** for **100% FREE** using modern, industry-standard cloud providers:

- **Database**: [Neon](https://neon.tech) / [Supabase](https://supabase.com) (Serverless PostgreSQL)
- **Backend API**: [Render](https://render.com) (Node.js / Fastify Web Service)
- **Frontend Client**: [Vercel](https://vercel.com) (React 19 + Vite Global Edge CDN)

---

## 📋 Architecture Overview

```mermaid
graph LR
    Client[Users / Browser] -->|HTTPS| Frontend[Vercel CDN - React Vite Frontend]
    Frontend -->|REST API / JWT| Backend[Render Web Service - Fastify Backend]
    Backend -->|PostgreSQL Protocol + SSL| DB[(Neon / Supabase Serverless PostgreSQL)]
```

---

## 🗄️ Step 1: Create Free Cloud PostgreSQL Database (Neon)

1. Go to **[https://neon.tech](https://neon.tech)** and sign up / log in with GitHub.
2. Click **Create Project**:
   - **Project Name**: `cinebook-db`
   - **Postgres Version**: `16` or `17` (Default)
   - **Region**: Choose the closest region to your users (e.g., `US East` or `Singapore / Asia`).
3. Once created, Neon displays your **Connection String / URI**.
4. Copy the connection string. It will look like:
   ```text
   postgresql://neondb_owner:npg_AbCdEf123@ep-cool-butterfly-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
   *(Keep this connection string ready for Step 2 and Step 3)*.

---

## 🌱 Step 2: Seed the Cloud Database with Initial Data

You can seed all tables, admin accounts, customer accounts, theaters, movies, and shows directly from your local terminal:

1. Open your terminal in the `backend` folder:
   ```powershell
   cd backend
   ```
2. Run the seeder with your cloud database connection string:
   ```powershell
   # Windows PowerShell
   $env:DATABASE_URL="YOUR_NEON_DATABASE_URL_HERE"; npm run seed
   
   # Linux / macOS / Bash
   DATABASE_URL="YOUR_NEON_DATABASE_URL_HERE" npm run seed
   ```
3. You will see:
   ```text
   ✅ Database connected successfully.
   ✅ Database schema synchronized.
   ✅ Users verified (Admin: admin@cinebook.com, Customer: user@cinebook.com)
   ✅ 3 Theaters verified.
   ✅ 4 Movies verified.
   ✅ Shows verified & all seats generated.
   🎉 Database Seeding Complete!
   ```

---

## ⚙️ Step 3: Deploy Backend API on Render

1. Push your project code to **GitHub**:
   ```bash
   git add .
   git commit -m "Configure cloud hosting and environment variables"
   git push origin main
   ```
2. Go to **[https://dashboard.render.com](https://dashboard.render.com)** and log in with GitHub.
3. Click **New +** -> **Web Service**.
4. Select your **GitHub Repository** (`MovieBookingManagementSystem`).
5. Configure the service settings:
   | Setting | Value |
   | :--- | :--- |
   | **Name** | `cinebook-backend` (or any unique name) |
   | **Root Directory** | `backend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | `Free` |

6. Scroll down to **Environment Variables** and add:
   | Key | Value |
   | :--- | :--- |
   | `DATABASE_URL` | *(Paste your Neon connection string from Step 1)* |
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | `cinebook_production_jwt_secret_key_2026` *(or your custom secret)* |
   | `CORS_ORIGIN` | `*` |

7. Click **Create Web Service**.
8. Wait ~2 minutes for the deployment to finish. Render will generate a live URL:
   ```text
   https://cinebook-backend-xyz.onrender.com
   ```
9. **Test your backend**: Open `https://cinebook-backend-xyz.onrender.com/api/health` in your browser. You should see:
   ```json
   {"ok":true,"service":"cinebook-backend","version":"2026-08-19-booking-seat-fix-v3"}
   ```

---

## 🎨 Step 4: Deploy Frontend Client on Vercel

1. Go to **[https://vercel.com](https://vercel.com)** and log in with GitHub.
2. Click **Add New...** -> **Project**.
3. Select your repository (`MovieBookingManagementSystem`) and click **Import**.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select `frontend`
   - **Build Command**: `npm run build` (Default)
   - **Output Directory**: `dist` (Default)
5. Expand **Environment Variables** and add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://cinebook-backend-xyz.onrender.com/api` *(Replace with your actual Render URL from Step 3 + /api)* |

6. Click **Deploy**.
7. Vercel will build and deploy your site in ~30 seconds. You will get a live URL:
   ```text
   https://cinebook-frontend-xyz.vercel.app
   ```

---

## 🔒 Step 5: (Optional) Lock Down CORS for Production

Once your Vercel frontend is live:
1. Go back to **Render Dashboard** -> `cinebook-backend` -> **Environment**.
2. Change `CORS_ORIGIN` from `*` to your exact frontend domain:
   ```text
   CORS_ORIGIN=https://cinebook-frontend-xyz.vercel.app
   ```
3. Click **Save Changes** (Render will automatically redeploy).

---

## 🔑 Default Credentials

| Account Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@cinebook.com` | `Admin@123` |
| **Customer** | `user@cinebook.com` | `User@123` |

---

## 🛠️ Verification Checklist

- [x] Cloud Database connected over SSL
- [x] Backend responds on `/api/health` and `/api/movies`
- [x] Frontend displays movies, theaters, and showtimes
- [x] Admin login & management dashboard works
- [x] Customer login, interactive seat selection, and booking creation works
- [x] SPA direct URL refreshes work smoothly without 404 (handled by `vercel.json`)
