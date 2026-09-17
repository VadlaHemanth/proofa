export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Skill {
  id: string;
  name: string;
  category: 'Language' | 'Framework' | 'Database' | 'Tool' | 'Core CS' | 'Soft Skill';
  selfRating: SkillLevel;
  verifiedProofCount: number;
  lastPracticedDate?: string;
  benchmarkScore?: number; // 0 to 10
}

export type ProofType = 'github_repo' | 'deployed_demo' | 'code_snippet' | 'certificate' | 'mentor_note' | 'assessment';

export interface ProofItem {
  id: string;
  title: string;
  description: string;
  type: ProofType;
  url?: string;
  codeSnippet?: string;
  skillsTagged: string[];
  dateAdded: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  verificationDetails?: {
    verifiedAt?: string;
    commitsCount?: number;
    primaryLanguage?: string;
    liveStatusHttp?: number;
    mentorName?: string;
    mentorDesignation?: string;
    notes?: string;
  };
  shareableWithRecruiter: boolean;
}

export interface ExamOrDeadline {
  id: string;
  title: string;
  subject: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface StudentConstraints {
  weekdayHours: number; // e.g. 2
  weekendHours: number; // e.g. 5
  upcomingExams: ExamOrDeadline[];
  preferredLanguages: string[]; // e.g. ['English', 'Telugu']
  deviceLimitations?: string;
}

export interface StudentGoal {
  targetRole: string; // e.g. "Backend Developer Intern"
  targetTimelineWeeks: number; // e.g. 8
  stipendExpectation?: string; // e.g. "₹15,000 - ₹25,000 / month"
  locationPreference?: string; // e.g. "Hyderabad / Remote"
  weeklyProofMilestone: string; // e.g. "Build & document a REST API with PostgreSQL & FastAPI"
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  collegeName: string; // e.g. "JNTUH College of Engineering, Hyderabad"
  degree: string; // e.g. "B.Tech Computer Science"
  graduationYear: number; // e.g. 2027
  currentSemester: string; // e.g. "6th Semester"
  cgpa: number; // e.g. 7.8
  cgpaPublic: boolean; // default false for DPDP privacy
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  phoneNumber?: string;
  phonePublic: boolean;
  city: string; // e.g. "Hyderabad"
  state: string; // e.g. "Telangana"
  age: number;
  parentalConsentAcknowledged: boolean;
}

export type TaskStatus = 'pending' | 'completed' | 'rescheduled';

export interface PlanTask {
  id: string;
  title: string;
  estimatedMinutes: number;
  category: 'Coding' | 'DSA' | 'Project' | 'College Exam Prep' | 'Revision';
  skillsAddressed: string[];
  status: TaskStatus;
  scheduledDate: string; // YYYY-MM-DD
  dayOfWeek: string; // Monday, Tuesday...
  isExamDayTask: boolean;
  notes?: string;
  proofRequired?: boolean;
}

export interface DailyPlan {
  date: string;
  dayOfWeek: string;
  isExamDay: boolean;
  examName?: string;
  availableHours: number;
  tasks: PlanTask[];
}

export interface WeeklyPlan {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  theme: string;
  weeklyProofMilestone: string;
  days: DailyPlan[];
}

export interface DailyCheckIn {
  id: string;
  date: string;
  completedTaskIds: string[];
  blockers: string;
  availableMinutesTomorrow: number;
  newDeadlinesOrExams: string;
  reflection?: string;
  createdAt: string;
}

export interface RoleBenchmarkCriterion {
  id: string;
  title: string;
  requirementDescription: string;
  category: 'fundamentals' | 'projects' | 'dsa' | 'deployment' | 'communication';
  status: 'met' | 'partial' | 'missing';
  evidenceProofId?: string;
  evidenceNote?: string;
  weight: number;
}

export interface RoleReadiness {
  targetRole: string;
  readinessScore: number; // 0 to 10
  criteria: RoleBenchmarkCriterion[];
  nextBestAction: string;
  recommendedGapClosureTimeWeeks: number;
}

export interface ResumeBullet {
  id: string;
  text: string;
  proofItemId?: string; // Source pointer!
  sourceFact?: string; // Or student entered verified fact
  isVerified: boolean;
}

export interface ResumeProject {
  id: string;
  title: string;
  role: string;
  techStack: string[];
  bullets: ResumeBullet[];
  liveUrl?: string;
  githubUrl?: string;
  proofItemId?: string;
}

export interface TruthfulResume {
  id: string;
  updatedAt: string;
  summary: string;
  education: {
    college: string;
    degree: string;
    yearRange: string;
    cgpa?: number;
    showCgpa: boolean;
    location: string;
  };
  skillsGrouped: {
    languages: string[];
    frameworks: string[];
    databasesAndTools: string[];
    coursework: string[];
  };
  projects: ResumeProject[];
  certificationsAndProof: {
    title: string;
    issuer: string;
    date: string;
    verifiedUrl?: string;
  }[];
}

export interface JdMatchReport {
  id: string;
  jobTitle: string;
  companyName: string;
  targetRole: string;
  overallMatchPercentage: number; // e.g. 70
  readinessVerdict: 'Strong Alignment' | 'Moderate Gap' | 'Early Stage';
  matchedSkills: {
    skillName: string;
    evidenceProofId?: string;
    proofSummary: string;
  }[];
  missingSkills: {
    skillName: string;
    severity: 'critical' | 'nice_to_have';
    learningAction: string;
  }[];
  tailoredResumeBullets: string[];
  sevenDayGapPlan: {
    day: number;
    action: string;
    deliverableProof: string;
  }[];
  applicationChecklist: {
    item: string;
    done: boolean;
  }[];
}

export interface CuratedResource {
  id: string;
  title: string;
  description: string;
  provider: string; // e.g. "MDN", "freeCodeCamp", "roadmap.sh", "Striver"
  url: string;
  topics: string[];
  level: 'Beginner' | 'Intermediate';
  language: 'English' | 'Telugu' | 'Hindi' | 'Multilingual';
  estimatedHours: number;
  isFree: boolean;
}

export interface DPDPPreferences {
  planningDataProcessingConsent: boolean;
  githubSyncConsent: boolean;
  recruiterSharingConsent: boolean;
  preventCrossStudentMemory: boolean;
  ageVerified: boolean;
  shareablePassportId?: string;
  consentTimestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  containsCrisisHelp?: boolean;
}
