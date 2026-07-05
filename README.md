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
- Lazy-loaded admin workspaces for better production bundles

## Run Locally

```bash
npm install
npm run dev
```

## Validate

```bash
npm run lint
npm run test
npm run build
```

## Production Notes

See `docs/production-readiness.md` for domain rules, schema contracts, monitoring records, and the Supabase migration path.
