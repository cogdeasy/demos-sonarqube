# SonarQube Demo Application

A rich, modern SonarQube-like web application built with React, TypeScript, and Express.js. This demo showcases code quality analysis dashboards with realistic mock data across 10 projects in multiple programming languages.

## Features

- **Dashboard** - Portfolio overview with quality gate distribution, language breakdown, rating distributions, and activity trend charts
- **Projects** - Browse all analyzed projects with quality gate badges, ratings, coverage bars, and search/filter capabilities
- **Project Detail** - Deep dive into individual project metrics, new code period stats, activity history, and recent issues
- **Issues** - Full issue tracker with bugs, vulnerabilities, and code smells. Filter by type, severity, status, and language with pagination
- **Security Hotspots** - Security review dashboard with vulnerability probability ratings, review progress tracking, and category breakdown
- **Measures** - Coverage, duplications, and complexity visualizations with radar charts and comparison tables
- **Rules** - Coding rules catalog with expandable descriptions, filtered by type, severity, and language
- **Quality Gates** - Quality gate definitions with condition status (pass/fail) and actual vs threshold values
- **Activity** - Historical trend analysis with line/area charts for issues, coverage, duplications, technical debt, and code growth

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons
- React Router for navigation

### Backend
- Express.js with TypeScript
- RESTful API with filtering, pagination, and search
- Comprehensive mock data (10 projects, 30 issues, 15 security hotspots, 20 rules, 3 quality gates)

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Development

1. **Install and start the backend:**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Install and start the frontend (in a new terminal):**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. Open http://localhost:5173 in your browser

### Docker

```bash
docker-compose up --build
```

Then open http://localhost:8080 in your browser.

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/projects` | List projects (search, qualityGate, language filters) |
| `GET /api/projects/:key` | Get project details |
| `GET /api/projects/:key/issues` | Get project issues |
| `GET /api/projects/:key/hotspots` | Get project security hotspots |
| `GET /api/projects/:key/activity` | Get project activity history |
| `GET /api/issues` | List issues (type, severity, status, language, search filters) |
| `GET /api/issues/summary` | Get issues summary statistics |
| `GET /api/security-hotspots` | List security hotspots (status, probability filters) |
| `GET /api/security-hotspots/summary` | Get hotspots summary |
| `GET /api/rules` | List coding rules (type, severity, language, search filters) |
| `GET /api/quality-gates` | List quality gates |
| `GET /api/quality-gates/:id` | Get quality gate details |
| `GET /api/activity` | Get portfolio activity history |
| `GET /api/metrics/overview` | Get portfolio-wide metrics overview |
| `GET /api/health` | Health check |

## Project Structure

```
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # API client and formatters
│   ├── tailwind.config.js
│   └── vite.config.ts
├── server/                  # Express backend
│   ├── src/
│   │   ├── data/            # Mock data files
│   │   ├── routes/          # API route handlers
│   │   └── types/           # TypeScript type definitions
│   └── tsconfig.json
├── docker-compose.yml
└── README.md
```
