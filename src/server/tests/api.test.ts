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
