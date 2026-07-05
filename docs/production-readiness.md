# KONEXA Production Readiness Notes

KONEXA is implemented as a project-first hiring operating system. The current deployable app preserves the existing React workspaces and adds an enterprise domain layer for project applications, company project creation, weekly evaluations, final hiring decisions, audit logging, domain events, and trust scoring.

## Implemented Operating Contracts

- Business rules live in `src/platform/domain/enterpriseCore.ts`.
- PostgreSQL/Supabase schema and REST contract live in `src/platform/schema/postgresSchema.ts`.
- Browser-backed operational persistence for audit logs, domain events, trust scores, and monitoring metrics lives in `src/platform/services/operationalStore.ts`.
- Production API routes live in `src/server/app.ts`.
- File-backed server persistence lives in `src/server/repository.ts` and is configured by `KONEXA_DATA_FILE`.
- Domain tests live in `src/platform/tests/enterpriseCore.test.ts`.
- API integration tests live in `src/server/tests/api.test.ts`.
- Admin architecture workspaces are lazy loaded to reduce initial production bundle size.

## Validation Flow

Every domain mutation follows the same production order:

1. Check account status and verification.
2. Check role permissions.
3. Validate evidence-bearing inputs.
4. Execute the mutation.
5. Emit domain events.
6. Record audit logs.
7. Recalculate trust scores when student evidence changes.
8. Persist operational records.
9. Notify the affected user.

## Deployment Commands

```bash
npm install
npm run lint
npm run test
npm run build
npm run api
```

## Operational API

The API exposes health, metrics, state read models, project creation, applications, weekly submissions, weekly evaluations, final hiring decisions, audit logs, and trust score read models. Write operations require `x-konexa-user-id` and are rejected if the actor is not permitted by the domain rules.

## Supabase Migration Path

The app currently runs fully in the browser for deployability. To connect Supabase, run the SQL exported by `konexaPostgresSchema`, then persist the domain outputs from `enterpriseCore.ts` to `audit_logs`, `domain_events`, and `trust_scores` in the same transaction as each aggregate write.
