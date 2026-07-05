# KONEXA Enterprise Platform

KONEXA is an AI-powered project-first hiring operating system connecting verified international students with verified Korean companies.

The platform follows the operating philosophy:

**Project -> Trust -> Employment**

## What Is Implemented

- React, TypeScript, Vite, TailwindCSS production app
- Student, company, and admin operating dashboards
- AI architecture workspaces for memory, prompt, decision, action, permission, conversation, logging, supervisor, matching, trust, progress, approval, warning, badge, recruiter, coach, resume, and portfolio systems
- Enterprise domain layer for core project-first hiring flows
- PostgreSQL/Supabase schema contract
- REST API contract documentation in code
- Permission checks, validation, audit logging, domain events, trust score recalculation, operational metrics, and tests
- Versioned student and company profile management with AI context invalidation events
- Lifecycle-managed notification system with read, archive, dismiss, category, priority, and ownership enforcement
- Lazy-loaded admin workspaces for better production bundles

## Run Locally

```bash
npm install
npm run dev
```

Run the production API in a second terminal:

```bash
npm run api
```

Set `VITE_KONEXA_API_URL=http://localhost:4000` to connect the frontend to the API. When this value is empty, the app runs in browser-local mode for offline demos. In production, set `KONEXA_API_KEY` on the API and `VITE_KONEXA_API_KEY` on the frontend deployment.

## Validate

```bash
npm run lint
npm run test
npm run build
```

## Production Start

```bash
npm run build
KONEXA_SERVE_STATIC=true npm start
```

On Windows PowerShell:

```powershell
$env:KONEXA_SERVE_STATIC="true"
npm start
```

## Continuous Integration

GitHub Actions runs typecheck, tests, and production build on pushes and pull requests to `main`.

## Production Notes

See `docs/production-readiness.md` for domain rules, schema contracts, monitoring records, and the Supabase migration path.

## Core API

- `GET /api/health`
- `GET /api/metrics`
- `GET /api/state`
- `GET /api/projects`
- `POST /api/projects`
- `POST /api/projects/:projectId/applications`
- `PATCH /api/applications/:applicationId/status`
- `POST /api/projects/:projectId/submissions`
- `POST /api/submissions/:submissionId/evaluations`
- `POST /api/projects/:projectId/final-evaluations`
- `GET /api/audit-logs`
- `GET /api/trust-scores/:entityType/:entityId`
- `PATCH /api/students/:studentId/profile`
- `PATCH /api/companies/:companyId/profile`
- `GET /api/notifications`
- `PATCH /api/notifications/:notificationId/:action`
- `PATCH /api/notifications/read-all`

Actor-scoped endpoints require `x-konexa-user-id` so every decision is tied to a verified platform actor.
