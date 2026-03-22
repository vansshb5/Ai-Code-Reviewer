# AI Code Reviewer

A full-stack AI-powered code review application that analyzes code and provides instant feedback on bugs, security vulnerabilities, performance issues, and best practices.

## Live Demo

- Frontend: https://ai-code-reviewer-app.vercel.app
- Backend: https://ai-code-reviewer-sng5.onrender.com

---

## Features

- AI Code Review — Instant feedback powered by Groq (Llama 3.3)
- Quality Score — Code quality score out of 100
- Issue Detection — Find bugs and problems in your code
- Suggestions — Best practice recommendations
- Security Analysis — Detect security vulnerabilities
- Performance Tips — Optimize your code
- Improved Code — Get a refactored version of your code
- Review History — Save and revisit past reviews
- Authentication — Secure login and register with JWT

---

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- Monaco Editor
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

### AI
- Groq API (Llama 3.3 70b)

### Deployment
- Frontend — Vercel
- Backend — Render
- Database — MongoDB Atlas

---

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed locally
- Groq API key from console.groq.com

### 1. Clone the repository
```bash
git clone https://github.com/vansshb5/Ai-Code-Reviewer.git
cd Ai-Code-Reviewer
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai_reviewer
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret
```

Start the backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## Project Structure
```
ai_reviewer/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── review.js
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.jsx
│   │   │   └── History.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
└── README.md
```

---

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| PORT | Server port (default: 5000) |
| MONGODB_URI | MongoDB connection string |
| GROQ_API_KEY | Groq API key |
| JWT_SECRET | JWT secret key |

### Frontend

| Variable     |      Description     |
|           ---|                   ---|
| VITE_API_URL | Backend API base URL |

---

## Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

Auto deployment is configured — any push to the main branch triggers a new deployment on both Vercel and Render.

