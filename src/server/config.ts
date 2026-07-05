export interface ServerConfig {
  port: number;
  dataFile: string;
  corsOrigin: string;
  requestBodyLimit: string;
  apiKey?: string;
  serveStatic: boolean;
  staticDir: string;
}

function readNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function loadServerConfig(env: NodeJS.ProcessEnv = process.env): ServerConfig {
  return {
    port: readNumber(env.PORT, 4000),
    dataFile: env.KONEXA_DATA_FILE || '.konexa-data/platform-state.json',
    corsOrigin: env.KONEXA_CORS_ORIGIN || 'http://localhost:3000',
    requestBodyLimit: env.KONEXA_REQUEST_BODY_LIMIT || '1mb',
    apiKey: env.KONEXA_API_KEY,
    serveStatic: env.KONEXA_SERVE_STATIC === 'true',
    staticDir: env.KONEXA_STATIC_DIR || 'dist'
  };
}
