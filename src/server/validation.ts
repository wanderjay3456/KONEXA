import { ApplicationStatus, HiringDecision, ProjectStatus } from '../types';

export class RequestValidationError extends Error {
  constructor(
    message: string,
    public readonly details: Record<string, string> = {}
  ) {
    super(message);
  }
}

export function asObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new RequestValidationError('Request body must be an object.');
  }
  return value as Record<string, unknown>;
}

export function readString(body: Record<string, unknown>, field: string, minLength = 1) {
  const value = body[field];
  if (typeof value !== 'string' || value.trim().length < minLength) {
    throw new RequestValidationError('Invalid request body.', { [field]: `Must be a string with at least ${minLength} characters.` });
  }
  return value.trim();
}

export function readOptionalString(body: Record<string, unknown>, field: string) {
  const value = body[field];
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') {
    throw new RequestValidationError('Invalid request body.', { [field]: 'Must be a string.' });
  }
  return value.trim();
}

export function readNumber(body: Record<string, unknown>, field: string, min: number, max: number) {
  const value = body[field];
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    throw new RequestValidationError('Invalid request body.', { [field]: `Must be a number between ${min} and ${max}.` });
  }
  return value;
}

export function readStringArray(body: Record<string, unknown>, field: string, minLength = 1) {
  const value = body[field];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || item.trim().length === 0) || value.length < minLength) {
    throw new RequestValidationError('Invalid request body.', { [field]: `Must contain at least ${minLength} strings.` });
  }
  return value.map((item) => String(item).trim());
}

export function readMilestones(body: Record<string, unknown>) {
  const value = body.milestones;
  if (!Array.isArray(value) || value.length === 0) {
    throw new RequestValidationError('Invalid request body.', { milestones: 'Must contain at least one milestone.' });
  }

  return value.map((item, index) => {
    const milestone = asObject(item);
    return {
      week: readNumber(milestone, 'week', 1, 12),
      goal: readString(milestone, 'goal', 2),
      deliverableDescription: readString(milestone, 'deliverableDescription', 2)
    };
  }).sort((a, b) => a.week - b.week);
}

export function readApplicationStatus(body: Record<string, unknown>) {
  const status = readString(body, 'status');
  if (!Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
    throw new RequestValidationError('Invalid request body.', { status: 'Unsupported application status.' });
  }
  return status as ApplicationStatus;
}

export function readProjectStatus(body: Record<string, unknown>) {
  const status = readString(body, 'status');
  if (!Object.values(ProjectStatus).includes(status as ProjectStatus)) {
    throw new RequestValidationError('Invalid request body.', { status: 'Unsupported project status.' });
  }
  return status as ProjectStatus;
}

export function readHiringDecision(body: Record<string, unknown>) {
  const decision = readString(body, 'hiringDecision');
  if (!Object.values(HiringDecision).includes(decision as HiringDecision)) {
    throw new RequestValidationError('Invalid request body.', { hiringDecision: 'Unsupported hiring decision.' });
  }
  return decision as HiringDecision;
}
