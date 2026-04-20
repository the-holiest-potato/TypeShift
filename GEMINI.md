# TypeShift - Project Context

## Project Overview
**TypeShift** is a modern, web-based typing speed and accuracy tracker. It provides a highly interactive environment inspired by minimalist typing platforms, focusing on a clean aesthetic and smooth user experience.

- **Frontend:** React 19, Vite, JavaScript (ESM).
- **Backend:** Node.js (Express), Drizzle ORM, PostgreSQL.
- **Database:** PostgreSQL 15 (Running via Docker for Dev, RDS for Prod).
- **Routing:** React Router DOM for multi-page navigation.
- **Styling:** Modern Dark Mode with Purple accents (`--main-color: #ae81ff`).

## Project Status
- **Completed:** 
    - Core typing engine, real-time stats, and minimalist dark-mode UI.
    - Infinite typing support and 4-line windowed scrolling.
    - **Backend Phase 1-3:** JWT Authentication, PostgreSQL integration, and persistent test history.
    - **Backend Phase 4:** Production Dockerization and AWS Deployment readiness.
- **Next Steps:** Global Leaderboard, Performance Dashboard, and Production Launch.

## Building and Running

### Frontend
- **Start Development Server:** `npm run dev`
- **Build for Production:** `npm run build`

### Backend (server/)
1. **Start Database:** `cd server && docker-compose up -d`
2. **Sync Schema:** `npm run db:push`
3. **Start API Server:** `npm run dev`

## AWS Deployment Architecture
- **Frontend:** Hosted on **Amazon S3** as a static website and served via **Amazon CloudFront** for global CDN and HTTPS.
- **Backend:** Containerized via **Docker** and deployed on **AWS App Runner** for automatic scaling and simplified management.
- **Database:** **Amazon RDS (PostgreSQL)** for a managed, highly available production database.
- **Security:** Secrets managed via environment variables in App Runner; HTTPS enforced by CloudFront.

## Key Files
- `server/Dockerfile`: Production container definition.
- `server/src/db/schema.js`: Database schema.
- `src/context/AuthContext.jsx`: Full-stack integration.

