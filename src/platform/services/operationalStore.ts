import { AuditLog, DomainEvent, TrustScore } from '../domain/enterpriseCore';

const keys = {
  auditLogs: 'konexa_auditLogs',
  domainEvents: 'konexa_domainEvents',
  trustScores: 'konexa_trustScores',
  metrics: 'konexa_operationalMetrics'
};

export interface OperationalMetrics {
  totalEvents: number;
  deniedActions: number;
  lastActivityAt: string;
  averageTrustScore: number;
}

function readArray<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeArray<T>(key: string, value: T[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function appendOperationalRecords(input: {
  auditLogs?: AuditLog[];
  domainEvents?: DomainEvent[];
  trustScores?: TrustScore[];
}) {
  const auditLogs = [...input.auditLogs ?? [], ...readArray<AuditLog>(keys.auditLogs)].slice(0, 1000);
  const domainEvents = [...input.domainEvents ?? [], ...readArray<DomainEvent>(keys.domainEvents)].slice(0, 1000);
  const previousScores = readArray<TrustScore>(keys.trustScores);
  const scoreMap = new Map(previousScores.map((item) => [`${item.entityType}:${item.entityId}`, item]));
  (input.trustScores ?? []).forEach((score) => scoreMap.set(`${score.entityType}:${score.entityId}`, score));
  const trustScores = Array.from(scoreMap.values());

  writeArray(keys.auditLogs, auditLogs);
  writeArray(keys.domainEvents, domainEvents);
  writeArray(keys.trustScores, trustScores);

  const averageTrustScore = trustScores.length
    ? Math.round(trustScores.reduce((sum, item) => sum + item.score, 0) / trustScores.length)
    : 0;

  const metrics: OperationalMetrics = {
    totalEvents: domainEvents.length,
    deniedActions: auditLogs.filter((item) => item.decision === 'DENY').length,
    lastActivityAt: new Date().toISOString(),
    averageTrustScore
  };
  if (typeof window !== 'undefined') localStorage.setItem(keys.metrics, JSON.stringify(metrics));
  return metrics;
}

export function readOperationalMetrics(): OperationalMetrics {
  if (typeof window === 'undefined') {
    return { totalEvents: 0, deniedActions: 0, lastActivityAt: '', averageTrustScore: 0 };
  }
  const raw = localStorage.getItem(keys.metrics);
  if (!raw) return { totalEvents: 0, deniedActions: 0, lastActivityAt: '', averageTrustScore: 0 };
  try {
    return JSON.parse(raw) as OperationalMetrics;
  } catch {
    return { totalEvents: 0, deniedActions: 0, lastActivityAt: '', averageTrustScore: 0 };
  }
}

export function recordDeniedAction(auditLogs: AuditLog[]) {
  return appendOperationalRecords({ auditLogs });
}
