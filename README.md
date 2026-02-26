# 🔍 CodeWatch — AI Repository Analyzer

> AI-powered GitHub repository analysis platform that generates comprehensive reports on code quality, security vulnerabilities, industry standards compliance, and personalized learning recommendations.

## ✨ Features

- **Code Quality Analysis** — Detects issues across naming, error handling, structure, and patterns
- **Security Scanning** — Identifies vulnerabilities with severity ratings and CWE references
- **Industry Standards** — Checks SOLID, REST, 12-Factor App, and framework-specific standards
- **Code Metrics** — LOC, complexity, maintainability index, language breakdown
- **Learning Recommendations** — Personalized resources based on detected gaps
- **Architecture Insights** — AI-generated observations on design patterns and scalability

---

## 🏗️ Architecture

```
codewatch/
├── backend/          # Node.js + Express + TypeScript API
│   └── src/
│       ├── index.ts            # Express server entry
│       ├── routes/analyze.ts   # Analysis endpoint
│       ├── services/
│       │   ├── github.ts       # GitHub API integration (Octokit)
│       │   └── analyzer.ts     # Claude AI analysis engine
│       └── types/index.ts      # Shared TypeScript types
│
└── frontend/         # React + Vite + TypeScript + Tailwind
    └── src/
        ├── App.tsx              # Root component with state machine
        ├── api/client.ts        # Axios API client
        ├── components/
        │   ├── Hero.tsx          # Landing section
        │   ├── RepoInput.tsx     # Repository URL input form
        │   ├── AnalyzingState.tsx # Loading/progress UI
        │   ├── ScoreGauge.tsx    # Circular score visualization
        │   └── Report/
        │       ├── ReportDashboard.tsx       # Main report container
        │       ├── ReportOverview.tsx        # Summary + score bars
        │       ├── CodeQualityPanel.tsx      # Code issues browser
        │       ├── SecurityPanel.tsx         # Vulnerability list
        │       ├── IndustryStandardsPanel.tsx # Standards compliance
        │       ├── MetricsPanel.tsx          # Charts + metrics
        │       └── LearningPanel.tsx         # Recommendations
        └── types/index.ts       # Shared TypeScript types
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Anthropic API key ([get one here](https://console.anthropic.com))
- GitHub Personal Access Token (optional but recommended)

### 1. Clone and install

```bash
git clone <your-repo>
cd codewatch

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure environment variables

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
GITHUB_TOKEN=ghp_your-token-here   # Optional but recommended
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# No changes needed for local development (uses Vite proxy)
```

### 3. Run development servers

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App opens at http://localhost:5173
```

### 4. Analyze a repository

1. Open http://localhost:5173
2. Paste any public GitHub repository URL
3. Click **Analyze** and wait 30–90 seconds
4. View your comprehensive report!

---

## 🔧 API Reference

### `POST /api/analyze`

Analyzes a GitHub repository and returns a full report.

**Request:**
```json
{
  "repoUrl": "https://github.com/owner/repo",
  "branch": "main",          // optional
  "includeTests": true       // optional, default true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overallScore": 78,
    "grade": "B+",
    "summary": "...",
    "scores": { "codeQuality": 80, "security": 75, ... },
    "codeQuality": { "score": 80, "issues": [...], "positives": [...] },
    "security": { "score": 75, "riskLevel": "medium", "vulnerabilities": [...] },
    "industryStandards": { "score": 82, "standards": [...] },
    "metrics": { "estimatedLinesOfCode": 5420, ... },
    "learningRecommendations": [...]
  }
}
```

---

## 🚢 Production Deployment

### Backend (Railway / Render / Fly.io)

```bash
cd backend
npm run build
npm start
```

Set environment variables in your hosting provider dashboard.

### Frontend (Vercel / Netlify)

```bash
cd frontend
npm run build
# Deploy the /dist folder
```

Set `VITE_API_URL=https://your-backend-url.com/api` in your hosting environment.

---

## ⚙️ Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Claude API key | ✅ Yes |
| `GITHUB_TOKEN` | GitHub PAT (increases rate limit 60→5000/hr) | ⚠️ Recommended |
| `PORT` | Backend server port | No (default: 5000) |
| `FRONTEND_URL` | CORS allowed origin | No (default: localhost:5173) |
| `RATE_LIMIT_MAX_REQUESTS` | Max analyses per window | No (default: 20) |

---

## 🛡️ Security & Rate Limiting

- Rate limited to 20 analyses per 15-minute window per IP
- Repository files are never stored — analysis is stateless
- All API keys are server-side only (never exposed to frontend)
- Helmet.js security headers on all responses

---

## 📝 License

MIT License — free to use for your hackathon!
