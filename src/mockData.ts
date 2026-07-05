import { 
  User, 
  UserRole, 
  StudentProfile, 
  CompanyProfile, 
  Project, 
  ProjectStatus, 
  Application, 
  ApplicationStatus, 
  WeeklySubmission, 
  WeeklyEvaluation, 
  FinalProjectEvaluation, 
  Notification,
  HiringDecision,
  CompanyEvaluation,
  StudentWarning
} from './types';

// Mock Users
export const initialUsers: User[] = [
  {
    id: 'user_student_1',
    email: 'minh.anh@rmit.edu.vn',
    role: UserRole.STUDENT,
    isVerified: true,
    status: 'ACTIVE',
    createdAt: '2026-06-01T10:00:00Z'
  },
  {
    id: 'user_student_2',
    email: 'duc.huy@rmit.edu.vn',
    role: UserRole.STUDENT,
    isVerified: false,
    status: 'PENDING',
    createdAt: '2026-07-02T14:30:00Z'
  },
  {
    id: 'user_company_1',
    email: 'hiring@vuno.co.kr',
    role: UserRole.COMPANY,
    isVerified: true,
    status: 'ACTIVE',
    createdAt: '2026-05-15T09:00:00Z'
  },
  {
    id: 'user_company_2',
    email: 'global@gb-sensor.co.kr',
    role: UserRole.COMPANY,
    isVerified: false,
    status: 'PENDING',
    createdAt: '2026-07-03T11:15:00Z'
  },
  {
    id: 'user_admin_1',
    email: 'admin@konexa.co',
    role: UserRole.ADMIN,
    isVerified: true,
    status: 'ACTIVE',
    createdAt: '2026-01-01T08:00:00Z'
  }
];

// Mock Student Profiles
export const initialStudentProfiles: StudentProfile[] = [
  {
    userId: 'user_student_1',
    fullName: 'Nguyen Minh Anh',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    university: 'RMIT University Vietnam',
    major: 'Bachelor of Software Engineering (Honours)',
    graduationDate: '2027-04',
    englishProficiency: 'IELTS 8.5 (Professional Bilingual)',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'TailwindCSS', 'REST APIs', 'PostgreSQL'],
    portfolioUrl: 'https://minhanh-dev.studio',
    githubUrl: 'https://github.com/minhanh-rmit',
    linkedinUrl: 'https://linkedin.com/in/minhanh-dev',
    resumeFileName: 'Nguyen_Minh_Anh_Resume_2026.pdf',
    introVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Mock video link
    preferredCountry: 'South Korea',
    preferredIndustry: 'AI & Enterprise Software',
    preferredRole: 'Frontend Developer Intern',
    availability: '20 hours/week (Remote)'
  },
  {
    userId: 'user_student_2',
    fullName: 'Tran Duc Huy',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
    university: 'RMIT University Vietnam',
    major: 'Bachelor of Digital Media',
    graduationDate: '2026-12',
    englishProficiency: 'IELTS 7.5 (Fluent)',
    skills: ['Figma', 'UI/UX Design', 'Motion Graphics', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
    portfolioUrl: 'https://duchuy-design.co',
    githubUrl: 'https://github.com/duchuy-design',
    linkedinUrl: 'https://linkedin.com/in/duchuy-design',
    resumeFileName: 'Tran_Duc_Huy_Portfolio.pdf',
    preferredCountry: 'South Korea or Vietnam (Remote)',
    preferredIndustry: 'Product Tech & Startups',
    preferredRole: 'UI/UX Designer',
    availability: '25 hours/week'
  }
];

// Mock Company Profiles
export const initialCompanyProfiles: CompanyProfile[] = [
  {
    userId: 'user_company_1',
    companyName: 'VUNO AI Solutions',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=256&auto=format&fit=crop',
    industry: 'Healthcare AI & Deep Tech',
    website: 'https://www.vuno.co.kr',
    location: 'Gyeongbuk Technopark, Gyeongsan',
    companySize: '50-100 Employees',
    englishAvailability: 'Full Business English (Dedicated Global Team Lead)',
    verificationStatus: 'VERIFIED',
    businessRegistrationFile: 'VUNO_Biz_Registration_Gyeongbuk_2026.pdf'
  },
  {
    userId: 'user_company_2',
    companyName: 'Gyeongbuk Precision Sensor',
    logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=256&auto=format&fit=crop',
    industry: 'Industrial IoT & Manufacturing',
    website: 'https://www.gb-sensor.co.kr',
    location: 'Gumi National Industrial Complex, Gyeongbuk',
    companySize: '120 Employees',
    englishAvailability: 'Basic English (Requires English deliverables, local mentors present)',
    verificationStatus: 'PENDING',
    businessRegistrationFile: 'Gyeongbuk_Sensor_Gumi_992-12.pdf'
  }
];

// Mock Projects
export const initialProjects: Project[] = [
  {
    id: 'proj_1',
    companyId: 'user_company_1',
    companyName: 'VUNO AI Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=256&auto=format&fit=crop',
    title: 'Southeast Asia Localization & Medical Dashboard Prototype',
    description: 'We are expanding our chest X-ray AI detection platform to Vietnam. We require an RMIT student to build a localized web dashboard prototype to show to local hospitals. The project validates actual React component structuring, responsive API integration, and translation layer optimization.',
    expectedOutcome: 'A high-fidelity interactive React + TypeScript web panel localized to Vietnamese and English, conforming to DICOM viewer specs and ready for hospital pilot simulations.',
    durationWeeks: 4,
    compensation: '$800 USD + Certificate of Validation + Priority Hiring Channel',
    requiredSkills: ['React', 'TypeScript', 'REST APIs', 'UI/UX Translation'],
    weeklyHours: 15,
    status: ProjectStatus.RUNNING,
    createdAt: '2026-06-10T11:00:00Z',
    milestones: [
      {
        week: 1,
        goal: 'Project Setup & DICOM Component Architecture Draft',
        deliverableDescription: 'GitHub repository initialized with React, TailwindCSS, and basic router + static panel mockups.'
      },
      {
        week: 2,
        goal: 'Interactive Charts & Localization Engine Implementation',
        deliverableDescription: 'Connecting components to dynamic mock data and implementing English/Vietnamese language toggle.'
      },
      {
        week: 3,
        goal: 'Feedback Integration & High-Contrast Patient Timeline UI',
        deliverableDescription: 'Refining dashboard based on Gyeongbuk tech lead review, implementing medical imaging viewer simulator.'
      },
      {
        week: 4,
        goal: 'Comprehensive End-to-End Walkthrough & Documentation',
        deliverableDescription: 'Recording a 5-minute product video walkthrough, submitting finalized repository code and developer logs.'
      }
    ]
  },
  {
    id: 'proj_2',
    companyId: 'user_company_1',
    companyName: 'VUNO AI Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=256&auto=format&fit=crop',
    title: 'English Technical Documentation & API SDK Refactoring',
    description: 'Structure clean English developer documentation and TypeScript SDK client wrappers for our developer API portal. Helps global hospitals build custom pipelines over VUNO solutions.',
    expectedOutcome: 'Complete typed SDK files and an elegant developer documentation site utilizing VitePress or standard Markdown.',
    durationWeeks: 4,
    compensation: '$600 USD + Technical Mentor Endorsement',
    requiredSkills: ['TypeScript', 'Technical Writing', 'SDK Development'],
    weeklyHours: 12,
    status: ProjectStatus.OPEN,
    createdAt: '2026-07-01T15:00:00Z',
    milestones: [
      {
        week: 1,
        goal: 'API Endpoint Audit & Schema Analysis',
        deliverableDescription: 'Comprehensive spreadsheet of audited API routes with verified inputs and responses.'
      },
      {
        week: 2,
        goal: 'TypeScript SDK SDK Wrapper Skeleton Design',
        deliverableDescription: 'Core HTTP client wrapper with comprehensive TypeScript interface declarations.'
      },
      {
        week: 3,
        goal: 'Markdown documentation draft for Core Services',
        deliverableDescription: 'Documentation pages explaining Auth, Inference, and Data export APIs with real examples.'
      },
      {
        week: 4,
        goal: 'SDK Release Build & Verified Sandbox Examples',
        deliverableDescription: 'Sample app showcasing SDK integration with full code comments and testing setup.'
      }
    ]
  }
];

// Mock Applications
export const initialApplications: Application[] = [
  {
    id: 'app_1',
    projectId: 'proj_1',
    projectTitle: 'Southeast Asia Localization & Medical Dashboard Prototype',
    companyName: 'VUNO AI Solutions',
    studentId: 'user_student_1',
    studentName: 'Nguyen Minh Anh',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    status: ApplicationStatus.ACCEPTED,
    appliedAt: '2026-06-11T12:00:00Z',
    portfolioUrl: 'https://minhanh-dev.studio/vuno-mock',
    coverLetter: 'I am highly interested in helping VUNO solutions expand successfully in Vietnam! My background in Software Engineering and React fits the DICOM project perfectly.'
  },
  {
    id: 'app_2',
    projectId: 'proj_2',
    projectTitle: 'English Technical Documentation & API SDK Refactoring',
    companyName: 'VUNO AI Solutions',
    studentId: 'user_student_2',
    studentName: 'Tran Duc Huy',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
    status: ApplicationStatus.SUBMITTED,
    appliedAt: '2026-07-03T10:00:00Z',
    coverLetter: 'Although I major in Digital Media, my technical writing, structural formatting, and UI mapping skills will make this API SDK portal clean and modern.'
  }
];

// Mock Weekly Submissions
export const initialSubmissions: WeeklySubmission[] = [
  {
    id: 'sub_1_w1',
    projectId: 'proj_1',
    studentId: 'user_student_1',
    weekNumber: 1,
    submittedAt: '2026-06-17T17:30:00Z',
    deliverableFile: 'https://github.com/minhanh-rmit/vuno-medical-panel-w1',
    progressReport: 'Successfully bootstrapped React-TS dashboard with Vite and Tailwind. Configured dual-language layout parameters and mapped out navigation drawers. Connected to real UI mock APIs and resolved DICOM image loading placeholders.',
    reflection: 'Learning DICOM standard formatting in Gyeongbuk workspace was a challenge, but local technical lead Min-Seok helped clarify metadata structures.',
    isEvaluated: true
  },
  {
    id: 'sub_1_w2',
    projectId: 'proj_1',
    studentId: 'user_student_1',
    weekNumber: 2,
    submittedAt: '2026-06-24T18:00:00Z',
    deliverableFile: 'https://vuno-medical-panel-demo.vercel.app/demo',
    progressReport: 'Finished charting implementation using Recharts. Added translation arrays for all labels, and connected the Patient Timeline component with real-time patient status metrics.',
    reflection: 'Integrating real responsive scaling on multiple tablet/desktop viewports took longer than expected, but layout checks are green.',
    isEvaluated: true
  },
  {
    id: 'sub_1_w3',
    projectId: 'proj_1',
    studentId: 'user_student_1',
    weekNumber: 3,
    submittedAt: '2026-07-01T17:45:00Z',
    deliverableFile: 'https://github.com/minhanh-rmit/vuno-medical-panel-w3',
    progressReport: 'Integrated feedback from VUNO technical lead: Adjusted medical timeline contrast, fixed language shift bugs in patient forms, and implemented interactive search parameters.',
    reflection: 'Implementing clean UX design is vital for doctors. Small font adjustments can prevent severe reading fatigue.',
    isEvaluated: false // Represents a pending review
  }
];

// Mock Weekly Evaluations
export const initialEvaluations: WeeklyEvaluation[] = [
  {
    id: 'eval_1_w1',
    submissionId: 'sub_1_w1',
    projectId: 'proj_1',
    studentId: 'user_student_1',
    weekNumber: 1,
    communication: 5,
    responsibility: 5,
    quality: 4,
    deadline: 5,
    problemSolving: 4,
    professionalism: 5,
    comment: 'Exceptional startup attitude. Minh Anh is highly responsive on Slack and communicates in perfect technical English. Code repo structure is pristine.',
    evaluatedAt: '2026-06-18T10:00:00Z'
  },
  {
    id: 'eval_1_w2',
    submissionId: 'sub_1_w2',
    projectId: 'proj_1',
    studentId: 'user_student_1',
    weekNumber: 2,
    communication: 4,
    responsibility: 5,
    quality: 5,
    deadline: 5,
    problemSolving: 5,
    professionalism: 5,
    comment: 'The quality of the responsive layout is stunning. Minh Anh solved complex DICOM mockup rendering bugs independently. Extremely impressive performance.',
    evaluatedAt: '2026-06-25T09:30:00Z'
  }
];

// Mock Final Evaluations
export const initialFinalEvaluations: FinalProjectEvaluation[] = [];

// Mock Notifications
export const initialNotifications: Notification[] = [
  {
    id: 'notif_1',
    userId: 'user_student_1',
    title: 'Verification Approved',
    message: 'Welcome to KONEXA! Your RMIT student profile has been approved by the platform admins. You are now verified to search and apply for premium SME projects.',
    type: 'success',
    isRead: true,
    createdAt: '2026-06-05T09:00:00Z'
  },
  {
    id: 'notif_2',
    userId: 'user_student_1',
    title: 'Project Application Accepted',
    message: 'Congratulations! VUNO AI Solutions accepted your application for Southeast Asia Localization Project. Please check your Project Dashboard.',
    type: 'success',
    isRead: false,
    createdAt: '2026-06-12T14:00:00Z'
  },
  {
    id: 'notif_3',
    userId: 'user_company_1',
    title: 'New Project Applicant',
    message: 'Tran Duc Huy (RMIT University Vietnam) has applied for your API SDK Documentation project.',
    type: 'info',
    isRead: false,
    createdAt: '2026-07-03T10:00:00Z'
  }
];

// Mock Company Evaluations of SMEs by students
export const initialCompanyEvaluations: CompanyEvaluation[] = [
  {
    id: 'comp_eval_1',
    projectId: 'proj_1',
    studentId: 'user_student_1',
    companyId: 'user_company_1',
    communication: 5,
    feedbackQuality: 5,
    mentorship: 5,
    taskClarity: 4,
    responseSpeed: 5,
    respect: 5,
    learningOpportunity: 5,
    workEnvironment: 5,
    professionalism: 5,
    comment: 'The mentor at VUNO was incredibly supportive. They provided clear weekly deliverables, checked in regularly over Slack, and gave deep constructive review on my DICOM viewer code.',
    submittedAt: '2026-06-28T12:00:00Z'
  }
];

// Mock Student Warnings (Only visible to admin)
export const initialStudentWarnings: StudentWarning[] = [
  {
    id: 'warn_1',
    studentId: 'user_student_2',
    reason: 'Slightly slow communication in the introductory week. Rectified upon review.',
    createdAt: '2026-07-03T16:00:00Z'
  }
];

// State Manager (Local Storage powered)
export function getStoredState() {
  const isBrowser = typeof window !== 'undefined';
  if (!isBrowser) {
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
      companyEvaluations: initialCompanyEvaluations,
      warnings: initialStudentWarnings
    };
  }

  const getOrInit = (key: string, initial: any) => {
    const val = localStorage.getItem(`konexa_${key}`);
    if (val) {
      try {
        return JSON.parse(val);
      } catch (e) {
        return initial;
      }
    }
    localStorage.setItem(`konexa_${key}`, JSON.stringify(initial));
    return initial;
  };

  return {
    users: getOrInit('users', initialUsers),
    studentProfiles: getOrInit('studentProfiles', initialStudentProfiles),
    companyProfiles: getOrInit('companyProfiles', initialCompanyProfiles),
    projects: getOrInit('projects', initialProjects),
    applications: getOrInit('applications', initialApplications),
    submissions: getOrInit('submissions', initialSubmissions),
    evaluations: getOrInit('evaluations', initialEvaluations),
    finalEvaluations: getOrInit('finalEvaluations', initialFinalEvaluations),
    notifications: getOrInit('notifications', initialNotifications),
    companyEvaluations: getOrInit('companyEvaluations', initialCompanyEvaluations),
    warnings: getOrInit('warnings', initialStudentWarnings)
  };
}

export function saveStoredState(state: {
  users: User[];
  studentProfiles: StudentProfile[];
  companyProfiles: CompanyProfile[];
  projects: Project[];
  applications: Application[];
  submissions: WeeklySubmission[];
  evaluations: WeeklyEvaluation[];
  finalEvaluations: FinalProjectEvaluation[];
  notifications: Notification[];
  companyEvaluations: CompanyEvaluation[];
  warnings: StudentWarning[];
}) {
  if (typeof window === 'undefined') return;
  Object.entries(state).forEach(([key, val]) => {
    localStorage.setItem(`konexa_${key}`, JSON.stringify(val));
  });
}
