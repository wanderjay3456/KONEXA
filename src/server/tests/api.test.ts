import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { AddressInfo } from 'node:net';
import { createServer } from 'node:http';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createKonexaApp } from '../app';
import { JsonFilePlatformRepository } from '../repository';
import { loadServerConfig } from '../config';

async function withApi(run: (baseUrl: string) => Promise<void>) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'konexa-api-'));
  const repository = new JsonFilePlatformRepository(path.join(dir, 'state.json'));
  const app = createKonexaApp(repository, {
    ...loadServerConfig({}),
    port: 0,
    dataFile: path.join(dir, 'state.json'),
    corsOrigin: 'http://localhost:3000'
  });
  const server = createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const { port } = server.address() as AddressInfo;
  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

async function withSecureApi(run: (baseUrl: string) => Promise<void>) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'konexa-api-secure-'));
  const repository = new JsonFilePlatformRepository(path.join(dir, 'state.json'));
  const app = createKonexaApp(repository, {
    ...loadServerConfig({}),
    port: 0,
    dataFile: path.join(dir, 'state.json'),
    corsOrigin: 'http://localhost:3000',
    apiKey: 'test-production-key'
  });
  const server = createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const { port } = server.address() as AddressInfo;
  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

async function withStaticApi(run: (baseUrl: string) => Promise<void>) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'konexa-api-static-'));
  const staticDir = path.join(dir, 'dist');
  fs.mkdirSync(staticDir, { recursive: true });
  fs.writeFileSync(path.join(staticDir, 'index.html'), '<!doctype html><title>KONEXA</title><div id="root"></div>');

  const repository = new JsonFilePlatformRepository(path.join(dir, 'state.json'));
  const app = createKonexaApp(repository, {
    ...loadServerConfig({}),
    port: 0,
    dataFile: path.join(dir, 'state.json'),
    corsOrigin: 'http://localhost:3000',
    serveStatic: true,
    staticDir
  });
  const server = createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const { port } = server.address() as AddressInfo;
  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

async function json(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...init?.headers
    }
  });
  const body = await response.json();
  return { response, body };
}

test('health, state, and metrics endpoints expose operational status', async () => {
  await withApi(async (baseUrl) => {
    const health = await json(`${baseUrl}/api/health`);
    assert.equal(health.response.status, 200);
    assert.equal(health.body.status, 'ok');

    const state = await json(`${baseUrl}/api/state`);
    assert.equal(state.response.status, 200);
    assert.ok(state.body.projects.length >= 1);

    const metrics = await json(`${baseUrl}/api/metrics`);
    assert.equal(metrics.response.status, 200);
    assert.ok(metrics.body.requestCount >= 3);
  });
});

test('auth API registers and logs in student and company accounts', async () => {
  await withApi(async (baseUrl) => {
    const registeredStudent = await json(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        role: 'STUDENT',
        email: 'new.student@rmit.edu.vn',
        password: 'Evidence2026',
        fullName: 'Le An Minh',
        major: 'Computer Science'
      })
    });
    assert.equal(registeredStudent.response.status, 201);
    assert.equal(registeredStudent.body.user.status, 'PENDING');
    assert.equal(registeredStudent.body.studentProfile.fullName, 'Le An Minh');

    const studentLogin = await json(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        role: 'STUDENT',
        email: 'new.student@rmit.edu.vn',
        password: 'Evidence2026'
      })
    });
    assert.equal(studentLogin.response.status, 200);
    assert.equal(studentLogin.body.user.email, 'new.student@rmit.edu.vn');

    const registeredCompany = await json(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        role: 'COMPANY',
        email: 'talent@example.co.kr',
        password: 'Company2026',
        companyName: 'Example Korea AI',
        businessRegistrationFile: 'business-registration.pdf'
      })
    });
    assert.equal(registeredCompany.response.status, 201);
    assert.equal(registeredCompany.body.companyProfile.verificationStatus, 'PENDING');

    const duplicate = await json(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        role: 'STUDENT',
        email: 'new.student@rmit.edu.vn',
        password: 'Evidence2026',
        fullName: 'Duplicate Student',
        major: 'Business'
      })
    });
    assert.equal(duplicate.response.status, 409);
  });
});

test('project application API uses domain rules and records trust evidence', async () => {
  await withApi(async (baseUrl) => {
    const submitted = await json(`${baseUrl}/api/projects/proj_2/applications`, {
      method: 'POST',
      headers: { 'x-konexa-user-id': 'user_student_1' },
      body: JSON.stringify({
        coverLetter: 'I will ship the SDK documentation with transparent weekly project evidence.',
        portfolioUrl: 'https://minhanh-dev.studio'
      })
    });

    assert.equal(submitted.response.status, 201);
    assert.equal(submitted.body.projectId, 'proj_2');

    const duplicate = await json(`${baseUrl}/api/projects/proj_2/applications`, {
      method: 'POST',
      headers: { 'x-konexa-user-id': 'user_student_1' },
      body: JSON.stringify({
        coverLetter: 'I will ship the SDK documentation with transparent weekly project evidence.'
      })
    });
    assert.equal(duplicate.response.status, 403);

    const audit = await json(`${baseUrl}/api/audit-logs`);
    assert.equal(audit.response.status, 200);
    assert.ok(audit.body.some((item: { decision: string }) => item.decision === 'DENY'));
  });
});

test('company evaluation API updates submissions, events, and trust scores', async () => {
  await withApi(async (baseUrl) => {
    const evaluation = await json(`${baseUrl}/api/submissions/sub_1_w3/evaluations`, {
      method: 'POST',
      headers: { 'x-konexa-user-id': 'user_company_1' },
      body: JSON.stringify({
        communication: 5,
        responsibility: 5,
        quality: 5,
        deadline: 4,
        problemSolving: 5,
        professionalism: 5,
        comment: 'Excellent evidence quality and clear week-three delivery notes.'
      })
    });

    assert.equal(evaluation.response.status, 201);
    assert.equal(evaluation.body.submissionId, 'sub_1_w3');

    const trustScore = await json(`${baseUrl}/api/trust-scores/STUDENT/user_student_1`);
    assert.equal(trustScore.response.status, 200);
    assert.ok(trustScore.body.score >= 80);
  });
});

test('configured API key protects operational endpoints and preserves health checks', async () => {
  await withSecureApi(async (baseUrl) => {
    const health = await json(`${baseUrl}/api/health`);
    assert.equal(health.response.status, 200);
    assert.ok(health.response.headers.get('x-request-id'));
    assert.equal(health.response.headers.get('x-frame-options'), 'DENY');

    const blocked = await json(`${baseUrl}/api/state`);
    assert.equal(blocked.response.status, 401);
    assert.equal(blocked.body.error.code, 'API_KEY_REQUIRED');

    const allowed = await json(`${baseUrl}/api/state`, {
      headers: { 'x-konexa-api-key': 'test-production-key' }
    });
    assert.equal(allowed.response.status, 200);
    assert.ok(allowed.body.projects.length >= 1);
  });
});

test('server can serve production frontend assets beside API routes', async () => {
  await withStaticApi(async (baseUrl) => {
    const api = await json(`${baseUrl}/api/health`);
    assert.equal(api.response.status, 200);

    const page = await fetch(`${baseUrl}/student/dashboard`);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /KONEXA/);
  });
});

test('profile update API versions student profile and propagates displayed identity', async () => {
  await withApi(async (baseUrl) => {
    const updated = await json(`${baseUrl}/api/students/user_student_1/profile`, {
      method: 'PATCH',
      headers: { 'x-konexa-user-id': 'user_student_1' },
      body: JSON.stringify({
        fullName: 'Nguyen Minh Anh Tran',
        skills: ['React', 'TypeScript', 'Supabase'],
        biography: 'Evidence-first software engineer focused on healthcare AI delivery.',
        contactEmail: 'minh.anh@rmit.edu.vn'
      })
    });

    assert.equal(updated.response.status, 200);
    assert.equal(updated.body.profileVersion, 2);

    const state = await json(`${baseUrl}/api/state`);
    assert.ok(state.body.profileVersions.length === 1);
    assert.ok(state.body.domainEvents?.length === undefined);

    const audit = await json(`${baseUrl}/api/audit-logs`);
    assert.ok(audit.body.some((item: { action: string }) => item.action === 'student.updated'));
  });
});

test('profile update API versions company profile and propagates project branding', async () => {
  await withApi(async (baseUrl) => {
    const updated = await json(`${baseUrl}/api/companies/user_company_1/profile`, {
      method: 'PATCH',
      headers: { 'x-konexa-user-id': 'user_company_1' },
      body: JSON.stringify({
        companyName: 'VUNO Global AI',
        description: 'Explainable healthcare AI partner for project-first global hiring.',
        preferredSkills: ['React', 'TypeScript', 'Healthcare AI'],
        recruitmentStatus: 'OPEN'
      })
    });

    assert.equal(updated.response.status, 200);
    assert.equal(updated.body.profileVersion, 2);

    const projects = await json(`${baseUrl}/api/projects`);
    assert.ok(projects.body.some((item: { companyName: string }) => item.companyName === 'VUNO Global AI'));
  });
});

test('notification API enforces ownership and records lifecycle actions', async () => {
  await withApi(async (baseUrl) => {
    const listed = await json(`${baseUrl}/api/notifications?limit=10`, {
      headers: { 'x-konexa-user-id': 'user_student_1' }
    });
    assert.equal(listed.response.status, 200);
    assert.ok(listed.body.items.length >= 1);
    assert.ok(listed.body.items.every((item: { userId: string }) => item.userId === 'user_student_1'));

    const notificationId = listed.body.items.find((item: { isRead: boolean }) => !item.isRead)?.id ?? listed.body.items[0].id;
    const read = await json(`${baseUrl}/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: { 'x-konexa-user-id': 'user_student_1' }
    });
    assert.equal(read.response.status, 200);
    assert.equal(read.body.isRead, true);
    assert.ok(read.body.readAt);

    const denied = await json(`${baseUrl}/api/notifications/${notificationId}/archive`, {
      method: 'PATCH',
      headers: { 'x-konexa-user-id': 'user_student_2' }
    });
    assert.equal(denied.response.status, 404);

    const archived = await json(`${baseUrl}/api/notifications/${notificationId}/archive`, {
      method: 'PATCH',
      headers: { 'x-konexa-user-id': 'user_student_1' }
    });
    assert.equal(archived.response.status, 200);
    assert.ok(archived.body.archivedAt);

    const audit = await json(`${baseUrl}/api/audit-logs`);
    assert.ok(audit.body.some((item: { action: string; resourceId: string }) => item.action === 'notification.archived' && item.resourceId === notificationId));
  });
});

test('admin verification and warning APIs enforce trust operations', async () => {
  await withApi(async (baseUrl) => {
    const approved = await json(`${baseUrl}/api/admin/verifications/user_company_2/approve`, {
      method: 'POST',
      headers: { 'x-konexa-user-id': 'user_admin_1' }
    });
    assert.equal(approved.response.status, 200);
    assert.equal(approved.body.user.status, 'ACTIVE');
    assert.equal(approved.body.companyProfile.verificationStatus, 'VERIFIED');

    const denied = await json(`${baseUrl}/api/admin/verifications/user_student_2/approve`, {
      method: 'POST',
      headers: { 'x-konexa-user-id': 'user_company_1' }
    });
    assert.equal(denied.response.status, 403);

    const warning = await json(`${baseUrl}/api/admin/students/user_student_1/warnings`, {
      method: 'POST',
      headers: { 'x-konexa-user-id': 'user_admin_1' },
      body: JSON.stringify({ reason: 'Missed a required evidence review without prior notice.' })
    });
    assert.equal(warning.response.status, 201);
    assert.equal(warning.body.studentId, 'user_student_1');

    const trustScore = await json(`${baseUrl}/api/trust-scores/STUDENT/user_student_1`);
    assert.equal(trustScore.response.status, 200);
    assert.ok(trustScore.body.evidence.some((item: string) => item.includes('administrative warnings')));
  });
});

test('admin project moderation API opens pending projects with audit evidence', async () => {
  await withApi(async (baseUrl) => {
    const created = await json(`${baseUrl}/api/projects`, {
      method: 'POST',
      headers: { 'x-konexa-user-id': 'user_company_1' },
      body: JSON.stringify({
        title: 'Healthcare Localization Evidence Sprint',
        description: 'Create a transparent localization evidence package for Korean healthcare AI onboarding.',
        expectedOutcome: 'A bilingual evidence matrix and implementation recommendation.',
        durationWeeks: 3,
        compensation: '$650 USD',
        requiredSkills: ['Research', 'Healthcare AI'],
        weeklyHours: 10,
        status: 'DRAFT',
        milestones: [{ week: 1, goal: 'Evidence map', deliverableDescription: 'Reviewed source matrix' }]
      })
    });
    assert.equal(created.response.status, 201);
    assert.equal(created.body.status, 'PENDING_APPROVAL');

    const opened = await json(`${baseUrl}/api/projects/${created.body.id}/status`, {
      method: 'PATCH',
      headers: { 'x-konexa-user-id': 'user_admin_1' },
      body: JSON.stringify({ status: 'OPEN' })
    });
    assert.equal(opened.response.status, 200);
    assert.equal(opened.body.status, 'OPEN');

    const invalid = await json(`${baseUrl}/api/projects/${created.body.id}/status`, {
      method: 'PATCH',
      headers: { 'x-konexa-user-id': 'user_admin_1' },
      body: JSON.stringify({ status: 'COMPLETED' })
    });
    assert.equal(invalid.response.status, 403);

    const audit = await json(`${baseUrl}/api/audit-logs`);
    assert.ok(audit.body.some((item: { action: string; resourceId: string }) => item.action === 'project.status_changed' && item.resourceId === created.body.id));
  });
});
