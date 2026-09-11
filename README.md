# 🏋️ Fitness Buddy

An AI-powered health and fitness coach built with **Node.js/Express** on the backend and a **single-page chat UI** on the frontend, powered by **IBM Granite 4** via IBM Cloud Watson Machine Learning.

---

## ✨ Features

- 💬 **Conversational AI chat** — full multi-turn conversation with memory
- 🏠 **Home workout recommendations** — beginner to advanced, no equipment needed
- 🥗 **Nutrition & meal planning** — simple, healthy meal ideas
- 🔥 **Motivation & habit building** — daily inspiration and consistency tips
- 📅 **Weekly workout plans** — structured 7-day programs
- ⚡ **Quick-prompt chips** — one-click starters for common fitness questions
- 📱 **Mobile-responsive** — works on phones, tablets, and desktops

---

## 🗂️ Project Structure

```
fitness-buddy/
├── server.js          # Express backend + IBM Granite proxy
├── package.json       # Dependencies
├── .env.example       # Environment variable template
├── setup.ps1          # One-click .env setup (Windows/PowerShell)
└── public/
    └── index.html     # Frontend chat UI (single page)
```

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

**Option A — PowerShell (Windows):**
```powershell
.\setup.ps1
```

**Option B — Manual:**  
Copy `.env.example` to `.env` and fill in your IBM API key:
```
IBM_API_KEY=your_ibm_api_key_here
IBM_PROJECT_ID=cba9e4f9-6ef7-4edc-b85a-d3e43144a81a
IBM_MODEL_ID=ibm/granite-4-h-small
IBM_API_URL=https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29
IBM_IAM_URL=https://iam.cloud.ibm.com/identity/token
PORT=3000
```

### 3. Start the server

```bash
npm start
```

### 4. Open in browser

Navigate to **http://localhost:3000**

---

## 🔧 Development (with auto-reload)

```bash
npm run dev
```

---

## 🌐 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/chat` | Send a message, receive AI reply |
| `GET`  | `/api/health` | Server health check |

### POST `/api/chat`

**Request body:**
```json
{
  "messages": [
    { "role": "user", "content": "Give me a beginner workout" }
  ]
}
```

**Response:**
```json
{
  "reply": "Here's a great beginner workout...",
  "finish_reason": "stop"
}
```

---

## 🧠 IBM Granite Configuration

| Setting | Value |
|---------|-------|
| Model | `ibm/granite-4-h-small` |
| Project ID | `cba9e4f9-6ef7-4edc-b85a-d3e43144a81a` |
| Region | `us-south` |
| Max tokens | 800 |
| Temperature | 0.7 |

---

## ⚠️ Disclaimer

Fitness Buddy is an AI assistant and does **not** replace professional medical advice. Always consult a healthcare professional before starting a new fitness or diet program.
