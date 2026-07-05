import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { konexaPostgresSchema, restApiContract } from '../schema/postgresSchema';

const migrationPath = path.resolve('supabase/migrations/202607050001_initial_konexa_platform.sql');

const requiredTables = [
  'users',
  'student_profiles',
  'company_profiles',
  'projects',
  'applications',
  'weekly_submissions',
  'weekly_evaluations',
  'final_project_evaluations',
  'company_evaluations',
  'student_warnings',
  'notifications',
  'audit_logs',
  'domain_events',
  'trust_scores'
];

test('initial migration contains every production table and RLS activation', () => {
  const sql = fs.readFileSync(migrationPath, 'utf8');

  for (const table of requiredTables) {
    assert.match(sql, new RegExp(`create table if not exists ${table}`));
    assert.match(sql, new RegExp(`alter table ${table} enable row level security`));
  }

  assert.match(sql, /create index if not exists idx_projects_company_status/);
  assert.match(sql, /create policy "users can read their own account"/);
});

test('typescript schema contract stays synchronized with migration table coverage', () => {
  for (const table of requiredTables) {
    assert.match(konexaPostgresSchema, new RegExp(`create table if not exists ${table}`));
  }
});

test('REST contract includes core project-first hiring endpoints', () => {
  assert.ok(restApiContract.includes('POST /api/projects'));
  assert.ok(restApiContract.includes('POST /api/projects/:projectId/applications'));
  assert.ok(restApiContract.includes('POST /api/submissions/:submissionId/evaluations'));
  assert.ok(restApiContract.includes('GET /api/trust-scores/:entityType/:entityId'));
});
