require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ──────────────────────────────────────────────
// Middleware
// ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ──────────────────────────────────────────────
// IBM IAM Token Cache
// ──────────────────────────────────────────────
let tokenCache = { token: null, expiresAt: 0 };

async function getIBMToken() {
  const now = Date.now();
  if (tokenCache.token && now < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const response = await axios.post(
    process.env.IBM_IAM_URL || 'https://iam.cloud.ibm.com/identity/token',
    new URLSearchParams({
      grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
      apikey: process.env.IBM_API_KEY,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  const { access_token, expires_in } = response.data;
  // Refresh 60 seconds before actual expiry
  tokenCache = {
    token: access_token,
    expiresAt: now + (expires_in - 60) * 1000,
  };
  return access_token;
}

// ──────────────────────────────────────────────
// System Prompt — Fitness Buddy Persona
// ──────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Fitness Buddy, a friendly, knowledgeable, and motivating AI-powered health and fitness coach. Your role is to help users live healthier, happier lives.

You can help with:
- Recommending home workouts and exercise routines tailored to the user's fitness level and goals
- Providing motivational tips, daily inspiration, and habit-building strategies
- Suggesting simple, nutritious meal ideas and basic nutrition guidance
- Answering questions about fitness, wellness, sleep, hydration, and mental health
- Creating weekly workout plans for beginners, intermediate, and advanced users

Guidelines:
- Always be encouraging, positive, and supportive — never judgmental
- Keep advice practical and achievable for everyday people
- Ask clarifying questions when needed (e.g., fitness level, available equipment, dietary restrictions)
- Remind users to consult a healthcare professional for medical concerns
- Use clear, friendly language and keep responses concise but helpful
- Use emojis sparingly to keep the tone warm and approachable 💪

You are NOT a medical professional. Always encourage users to seek medical advice for health conditions.`;

// ──────────────────────────────────────────────
// POST /api/chat  — Main chat endpoint
// ──────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  try {
    const token = await getIBMToken();

    const payload = {
      model_id: process.env.IBM_MODEL_ID || 'ibm/granite-4-h-small',
      project_id: process.env.IBM_PROJECT_ID,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      parameters: {
        max_new_tokens: 800,
        temperature: 0.7,
        top_p: 0.9,
        repetition_penalty: 1.1,
      },
    };

    const response = await axios.post(
      process.env.IBM_API_URL ||
        'https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    const choice = response.data?.choices?.[0];
    const reply = choice?.message?.content || 'I could not generate a response. Please try again.';
    const finishReason = choice?.finish_reason || 'unknown';

    res.json({ reply, finish_reason: finishReason });
  } catch (err) {
    console.error('IBM API error:', err?.response?.data || err.message);
    const status = err?.response?.status || 500;
    const message =
      err?.response?.data?.errors?.[0]?.message ||
      err?.response?.data?.error ||
      'Failed to reach IBM Granite. Please try again later.';
    res.status(status).json({ error: message });
  }
});

// ──────────────────────────────────────────────
// Health-check endpoint
// ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    model: process.env.IBM_MODEL_ID || 'ibm/granite-4-h-small',
    project: process.env.IBM_PROJECT_ID,
  });
});

// ──────────────────────────────────────────────
// Serve frontend for all other routes (SPA)
// ──────────────────────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ──────────────────────────────────────────────
// Start
// ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏋️  Fitness Buddy server running at http://localhost:${PORT}`);
  console.log(`   Model  : ${process.env.IBM_MODEL_ID || 'ibm/granite-4-h-small'}`);
  console.log(`   Project: ${process.env.IBM_PROJECT_ID}\n`);
});
