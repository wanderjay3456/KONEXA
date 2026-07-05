import fs from 'node:fs';
import path from 'node:path';
import {
  initialApplications,
  initialCompanyEvaluations,
  initialCompanyProfiles,
  initialEvaluations,
  initialFinalEvaluations,
  initialNotifications,
  initialProjects,
  initialStudentProfiles,
  initialStudentWarnings,
  initialSubmissions,
  initialUsers
} from '../mockData';
import { AuditLog, DomainEvent, PlatformState, TrustScore } from '../platform/domain/enterpriseCore';
import { FinalProjectEvaluation, Notification, ProfileVersion } from '../types';

export interface PersistedPlatformState extends PlatformState {
  finalEvaluations: FinalProjectEvaluation[];
  notifications: Notification[];
  authCredentials: AuthCredential[];
  auditLogs: AuditLog[];
  domainEvents: DomainEvent[];
  trustScores: TrustScore[];
  profileVersions: ProfileVersion[];
}

export interface AuthCredential {
  userId: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformRepository {
  read(): PersistedPlatformState;
  write(state: PersistedPlatformState): void;
  update(mutator: (state: PersistedPlatformState) => PersistedPlatformState): PersistedPlatformState;
}

function initialState(): PersistedPlatformState {
  return {
    users: initialUsers,
    studentProfiles: initialStudentProfiles,
    companyProfiles: initialCompanyProfiles,
    projects: initialProjects,
    applications: initialApplications,
    submissions: initialSubmissions,
    evaluations: initialEvaluations,
    finalEvaluations: initialFinalEvaluations,
    notifications: initialNotifications,
    authCredentials: [],
    companyEvaluations: initialCompanyEvaluations,
    warnings: initialStudentWarnings,
    auditLogs: [],
    domainEvents: [],
    trustScores: [],
    profileVersions: []
  };
}

function mergeWithInitial(value: Partial<PersistedPlatformState>): PersistedPlatformState {
  const base = initialState();
  return {
    ...base,
    ...value,
    auditLogs: value.auditLogs ?? [],
    authCredentials: value.authCredentials ?? [],
    domainEvents: value.domainEvents ?? [],
    trustScores: value.trustScores ?? [],
    profileVersions: value.profileVersions ?? []
  };
}

export class JsonFilePlatformRepository implements PlatformRepository {
  constructor(private readonly filePath: string) {}

  read(): PersistedPlatformState {
    if (!fs.existsSync(this.filePath)) {
      const seeded = initialState();
      this.write(seeded);
      return seeded;
    }

    const raw = fs.readFileSync(this.filePath, 'utf8');
    if (!raw.trim()) {
      const seeded = initialState();
      this.write(seeded);
      return seeded;
    }

    return mergeWithInitial(JSON.parse(raw) as Partial<PersistedPlatformState>);
  }

  write(state: PersistedPlatformState) {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    const tempPath = `${this.filePath}.${process.pid}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(state, null, 2));
    fs.renameSync(tempPath, this.filePath);
  }

  update(mutator: (state: PersistedPlatformState) => PersistedPlatformState) {
    const current = this.read();
    const next = mutator(current);
    this.write(next);
    return next;
  }
}

export function appendOperationalState(
  state: PersistedPlatformState,
  records: { auditLogs?: AuditLog[]; domainEvents?: DomainEvent[]; trustScores?: TrustScore[]; profileVersions?: ProfileVersion[] }
): PersistedPlatformState {
  const trustScoreMap = new Map(state.trustScores.map((item) => [`${item.entityType}:${item.entityId}`, item]));
  (records.trustScores ?? []).forEach((item) => trustScoreMap.set(`${item.entityType}:${item.entityId}`, item));

  return {
    ...state,
    auditLogs: [...records.auditLogs ?? [], ...state.auditLogs].slice(0, 2000),
    domainEvents: [...records.domainEvents ?? [], ...state.domainEvents].slice(0, 2000),
    trustScores: Array.from(trustScoreMap.values()),
    profileVersions: [...records.profileVersions ?? [], ...state.profileVersions].slice(0, 1000)
  };
}
