import test from 'node:test';
import assert from 'node:assert/strict';
import {
  approveUserVerification,
  createProject,
  DomainRuleError,
  issueStudentWarning,
  registerCompanyAccount,
  registerStudentAccount,
  submitApplication,
  submitFinalEvaluation,
  submitWeeklyEvaluation,
  updateCompanyProfile,
  updateProjectStatus,
  updateStudentProfile
} from '../domain/enterpriseCore';
import { initialCompanyProfiles, initialProjects, initialStudentProfiles, initialUsers, initialApplications, initialSubmissions, initialEvaluations, initialCompanyEvaluations, initialStudentWarnings } from '../../mockData';
import { ApplicationStatus, HiringDecision, ProjectStatus, UserRole } from '../../types';

const state = {
  users: initialUsers,
  studentProfiles: initialStudentProfiles,
  companyProfiles: initialCompanyProfiles,
  projects: initialProjects,
  applications: initialApplications,
  submissions: initialSubmissions,
  evaluations: initialEvaluations,
  companyEvaluations: initialCompanyEvaluations,
  warnings: initialStudentWarnings
};

test('verified students can submit one application to an open project with audit and event records', () => {
  const actor = initialUsers.find((user) => user.id === 'user_student_1')!;
  const result = submitApplication(actor, state, {
    projectId: 'proj_2',
    coverLetter: 'I will provide an evidence-based SDK documentation plan with weekly deliverables.',
    portfolioUrl: 'https://minhanh-dev.studio'
  });

  assert.equal(result.entity.status, ApplicationStatus.SUBMITTED);
  assert.equal(result.events[0].type, 'application.submitted');
  assert.equal(result.auditLogs[0].decision, 'ALLOW');
  assert.equal(result.trustScores[0].entityType, 'STUDENT');
});

test('student and company registration create pending profiles with audit records', () => {
  const student = registerStudentAccount({
    email: 'new.student@rmit.edu.vn',
    fullName: 'Le An Minh',
    major: 'Computer Science'
  });
  assert.equal(student.entity.user.status, 'PENDING');
  assert.equal(student.entity.studentProfile.contactEmail, 'new.student@rmit.edu.vn');
  assert.equal(student.events[0].type, 'user.registered');

  const company = registerCompanyAccount({
    email: 'people@example.co.kr',
    companyName: 'Example Korea AI',
    businessRegistrationFile: 'example-registration.pdf'
  });
  assert.equal(company.entity.companyProfile.verificationStatus, 'PENDING');
  assert.equal(company.auditLogs[0].decision, 'ALLOW');
});

test('duplicate applications are denied to protect project evaluation integrity', () => {
  const actor = initialUsers.find((user) => user.id === 'user_student_2')!;

  assert.throws(
    () => submitApplication({ ...actor, isVerified: true, status: 'ACTIVE' }, state, {
      projectId: 'proj_2',
      coverLetter: 'A valid but duplicate application.'
    }),
    DomainRuleError
  );
});

test('verified companies create projects through pending approval rules', () => {
  const actor = initialUsers.find((user) => user.id === 'user_company_1')!;
  const company = initialCompanyProfiles.find((item) => item.userId === actor.id)!;
  const result = createProject(actor, company, {
    title: 'Korean Medical AI Market Entry Research',
    description: 'Produce a structured evidence report for Korean healthcare AI adoption with weekly checkpoints.',
    expectedOutcome: 'A reviewed bilingual report and presentation-ready evidence matrix.',
    durationWeeks: 4,
    compensation: '$700 USD',
    requiredSkills: ['Research', 'Technical Writing'],
    weeklyHours: 12,
    status: ProjectStatus.DRAFT,
    milestones: [{ week: 1, goal: 'Scope', deliverableDescription: 'Research map' }]
  });

  assert.equal(result.entity.status, ProjectStatus.PENDING_APPROVAL);
  assert.equal(result.auditLogs[0].decision, 'ALLOW');
});

test('weekly evaluations require the owning company and produce recalculated trust scores', () => {
  const actor = initialUsers.find((user) => user.id === 'user_company_1')!;
  const result = submitWeeklyEvaluation(actor, state, {
    submissionId: 'sub_1_w3',
    projectId: 'proj_1',
    studentId: 'user_student_1',
    weekNumber: 3,
    communication: 5,
    responsibility: 5,
    quality: 5,
    deadline: 4,
    problemSolving: 5,
    professionalism: 5,
    comment: 'Strong evidence of progress and clear project communication.'
  });

  assert.equal(result.entity.weekNumber, 3);
  assert.ok(result.trustScores[0].score >= 80);
});

test('final hiring decisions require weekly evidence and derive averages from evaluations', () => {
  const actor = initialUsers.find((user) => user.id === 'user_company_1')!;
  const result = submitFinalEvaluation(actor, state, {
    projectId: 'proj_1',
    studentId: 'user_student_1',
    hiringDecision: HiringDecision.TALENT_POOL,
    feedback: 'Weekly evidence supports future hiring contact after graduation timing is confirmed.'
  });

  assert.equal(result.entity.hiringDecision, HiringDecision.TALENT_POOL);
  assert.equal(result.events[0].type, 'evaluation.final_created');
});

test('students cannot create company projects', () => {
  const actor = initialUsers.find((user) => user.role === UserRole.STUDENT)!;
  const company = initialCompanyProfiles[0];

  assert.throws(
    () => createProject(actor, company, {
      title: 'Invalid Project',
      description: 'Student attempted company-only action.',
      expectedOutcome: 'Denied action',
      durationWeeks: 4,
      compensation: '$1',
      requiredSkills: ['Trust'],
      weeklyHours: 4,
      status: ProjectStatus.OPEN,
      milestones: []
    }),
    DomainRuleError
  );
});

test('student profile updates are versioned and invalidate AI context', () => {
  const actor = initialUsers.find((user) => user.id === 'user_student_1')!;
  const profile = initialStudentProfiles.find((item) => item.userId === actor.id)!;
  const result = updateStudentProfile(actor, profile, {
    skills: [...profile.skills, 'Supabase'],
    biography: 'Evidence-driven software engineer focused on trustworthy healthcare AI projects.',
    contactEmail: 'minh.anh@rmit.edu.vn'
  });

  assert.equal(result.entity.profileVersion, 2);
  assert.ok(result.profileVersion?.changedFields.includes('skills'));
  assert.ok(result.events.some((item) => item.type === 'ai.context_invalidated'));
  assert.equal(result.auditLogs[0].decision, 'ALLOW');
});

test('pending users can complete their own profiles before verification', () => {
  const pendingStudent = initialUsers.find((user) => user.id === 'user_student_2')!;
  const studentProfile = initialStudentProfiles.find((item) => item.userId === pendingStudent.id)!;
  const studentResult = updateStudentProfile(pendingStudent, studentProfile, {
    preferredRole: 'Product Designer',
    biography: 'Pending student completing evidence profile before verification.'
  });
  assert.equal(studentResult.entity.profileVersion, 2);

  const pendingCompany = initialUsers.find((user) => user.id === 'user_company_2')!;
  const companyProfile = initialCompanyProfiles.find((item) => item.userId === pendingCompany.id)!;
  const companyResult = updateCompanyProfile(pendingCompany, companyProfile, {
    description: 'Pending company completing employer profile before verification.',
    recruitmentStatus: 'PAUSED'
  });
  assert.equal(companyResult.entity.profileVersion, 2);
});

test('company profile updates are versioned and synchronized through events', () => {
  const actor = initialUsers.find((user) => user.id === 'user_company_1')!;
  const profile = initialCompanyProfiles.find((item) => item.userId === actor.id)!;
  const result = updateCompanyProfile(actor, profile, {
    description: 'Healthcare AI company building explainable project pathways for global talent.',
    preferredSkills: ['React', 'TypeScript', 'Clinical AI'],
    recruitmentStatus: 'OPEN'
  });

  assert.equal(result.entity.profileVersion, 2);
  assert.ok(result.profileVersion?.changedFields.includes('description'));
  assert.ok(result.events.some((item) => item.type === 'company.updated'));
});

test('admins approve pending users through audited verification rules', () => {
  const actor = initialUsers.find((user) => user.id === 'user_admin_1')!;
  const target = initialUsers.find((user) => user.id === 'user_company_2')!;
  const profile = initialCompanyProfiles.find((item) => item.userId === target.id)!;
  const result = approveUserVerification(actor, target, profile);

  assert.equal(result.entity.user.status, 'ACTIVE');
  assert.equal(result.entity.user.isVerified, true);
  assert.equal(result.entity.companyProfile?.verificationStatus, 'VERIFIED');
  assert.equal(result.events[0].type, 'verification.approved');
  assert.equal(result.auditLogs[0].decision, 'ALLOW');
});

test('admins moderate project status through allowed transitions', () => {
  const actor = initialUsers.find((user) => user.id === 'user_admin_1')!;
  const pendingProject = { ...initialProjects[0], status: ProjectStatus.PENDING_APPROVAL };
  const result = updateProjectStatus(actor, pendingProject, ProjectStatus.OPEN);

  assert.equal(result.entity.status, ProjectStatus.OPEN);
  assert.equal(result.events[0].type, 'project.status_changed');
  assert.equal(result.auditLogs[0].decision, 'ALLOW');

  assert.throws(
    () => updateProjectStatus(actor, result.entity, ProjectStatus.COMPLETED),
    DomainRuleError
  );
});

test('admin warnings create trust-impacting student evidence', () => {
  const actor = initialUsers.find((user) => user.id === 'user_admin_1')!;
  const result = issueStudentWarning(actor, state, {
    studentId: 'user_student_1',
    reason: 'Missed a required evidence review without prior notice.'
  });

  assert.equal(result.entity.studentId, 'user_student_1');
  assert.equal(result.events[0].type, 'warning.issued');
  assert.ok(result.trustScores[0].evidence.some((item) => item.includes('administrative warnings')));
});
