# API Training Project

A simple Node.js project to learn **API handling**, **HTTP methods**, **Sequelize CRUD**, and **Nodemailer** with hands-on examples.

---

## Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### 1. Clone or open the project

```bash
cd d:\Training
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
copy .env.example .env
```

Edit `.env` and add your email settings (optional — the app works without email):

```env
PORT=3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com
```

> **Gmail tip:** Enable 2-Step Verification, then create an [App Password](https://myaccount.google.com/apppasswords). Use that as `SMTP_PASS`.

### 4. (Optional) Reset database with sample data

```bash
npm run db:sync
```

This creates the `users` table and inserts two sample users.

### 5. Start the server

```bash
npm start
```

For auto-restart on file changes:

```bash
npm run dev
```

Server runs at: **http://localhost:3000**

---

## Project Structure

```
Training/
├── src/
│   ├── index.js              # App entry point (Fastify server)
│   ├── config/
│   │   └── database.js       # Sequelize database connection
│   ├── models/
│   │   └── User.js           # User model (maps to "users" table)
│   ├── controllers/
│   │   └── userController.js # CRUD logic (GET, POST, PUT, PATCH, DELETE)
│   ├── routes/
│   │   └── userRoutes.js     # URL → controller mapping
│   ├── services/
│   │   └── emailService.js   # Nodemailer email sending
│   ├── middleware/
│   │   └── errorHandler.js   # Global error handling
│   └── scripts/
│       └── syncDatabase.js   # Create table + seed sample data
├── .env.example
├── package.json
└── README.md
```
