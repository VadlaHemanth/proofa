import {
  StudentProfile,
  StudentGoal,
  StudentConstraints,
  Skill,
  ProofItem,
  WeeklyPlan,
  RoleReadiness,
  TruthfulResume,
  CuratedResource,
  DPDPPreferences,
  ChatMessage,
} from '../types';

export const initialProfile: StudentProfile = {
  id: 'student_rahul_jntuh_2026',
  fullName: 'Rahul Sharma',
  email: 'rahul.s.jntuh@gmail.com',
  collegeName: 'JNTUH College of Engineering, Hyderabad',
  degree: 'B.Tech in Computer Science and Engineering',
  graduationYear: 2027,
  currentSemester: '6th Semester',
  cgpa: 7.92,
  cgpaPublic: false, // Default private for DPDP compliance
  githubUrl: 'https://github.com/rahul-sharma-dev',
  linkedinUrl: 'https://linkedin.com/in/rahul-sharma-jntuh',
  portfolioUrl: 'https://rahul-dev.vercel.app',
  phoneNumber: '+91 98765 43210',
  phonePublic: false,
  city: 'Hyderabad',
  state: 'Telangana',
  age: 20,
  parentalConsentAcknowledged: true,
};

export const initialGoal: StudentGoal = {
  targetRole: 'Backend Developer Intern',
  targetTimelineWeeks: 8,
  stipendExpectation: '₹15,000 - ₹25,000 / month',
  locationPreference: 'Hyderabad / Remote',
  weeklyProofMilestone: 'Deploy a containerized FastAPI microservice with PostgreSQL & complete automated tests',
};

export const initialConstraints: StudentConstraints = {
  weekdayHours: 2.5,
  weekendHours: 5,
  upcomingExams: [
    {
      id: 'exam_os_midterm',
      title: 'Operating Systems Mid-Term',
      subject: 'Operating Systems (Process Scheduling, Deadlocks, Memory Management)',
      date: '2026-09-20', // in 3 days
      priority: 'high',
      notes: 'Need 45 mins daily review to maintain CGPA above 7.5 cut-off',
    },
    {
      id: 'exam_dbms_lab_viva',
      title: 'DBMS Lab Practical & Viva',
      subject: 'Database Systems (Normalization, Complex SQL, Triggers)',
      date: '2026-09-25',
      priority: 'medium',
      notes: 'Dual benefit: directly helps with backend interview prep!',
    },
  ],
  preferredLanguages: ['English', 'Telugu', 'Hindi'],
  deviceLimitations: 'Dell Inspiron 8GB RAM (runs Docker with light containers)',
};

export const initialSkills: Skill[] = [
  {
    id: 'skill_python',
    name: 'Python',
    category: 'Language',
    selfRating: 'Intermediate',
    verifiedProofCount: 2,
    lastPracticedDate: '2026-09-16',
    benchmarkScore: 8,
  },
  {
    id: 'skill_fastapi',
    name: 'FastAPI / REST APIs',
    category: 'Framework',
    selfRating: 'Intermediate',
    verifiedProofCount: 2,
    lastPracticedDate: '2026-09-15',
    benchmarkScore: 7,
  },
  {
    id: 'skill_postgres',
    name: 'PostgreSQL & SQL',
    category: 'Database',
    selfRating: 'Intermediate',
    verifiedProofCount: 2,
    lastPracticedDate: '2026-09-14',
    benchmarkScore: 7,
  },
  {
    id: 'skill_git',
    name: 'Git & GitHub Workflows',
    category: 'Tool',
    selfRating: 'Intermediate',
    verifiedProofCount: 2,
    lastPracticedDate: '2026-09-16',
    benchmarkScore: 8,
  },
  {
    id: 'skill_dsa',
    name: 'Data Structures & Algorithms',
    category: 'Core CS',
    selfRating: 'Beginner',
    verifiedProofCount: 1,
    lastPracticedDate: '2026-09-13',
    benchmarkScore: 5,
  },
  {
    id: 'skill_docker',
    name: 'Docker & Containerization',
    category: 'Tool',
    selfRating: 'Beginner',
    verifiedProofCount: 0,
    lastPracticedDate: '2026-09-10',
    benchmarkScore: 2,
  },
];

export const initialProofItems: ProofItem[] = [
  {
    id: 'proof_task_tracker_api',
    title: 'FastAPI Campus Task Tracker Service',
    description: 'A production-structured REST API with JWT authentication, rate limiting, and automated Pytest suite.',
    type: 'github_repo',
    url: 'https://github.com/rahul-sharma-dev/campus-task-tracker-api',
    skillsTagged: ['Python', 'FastAPI / REST APIs', 'Git & GitHub Workflows'],
    dateAdded: '2026-09-12',
    verificationStatus: 'verified',
    verificationDetails: {
      verifiedAt: '2026-09-12T14:30:00Z',
      commitsCount: 24,
      primaryLanguage: 'Python (96.4%)',
      notes: 'Inspected GitHub repository: Clean repository structure, 12 passing unit tests, and OpenAPI documentation.',
    },
    shareableWithRecruiter: true,
  },
  {
    id: 'proof_render_deployment',
    title: 'Live Deployed Task Tracker API on Render',
    description: 'Live cloud deployment connected with hosted PostgreSQL database and interactive Swagger UI.',
    type: 'deployed_demo',
    url: 'https://campus-task-tracker.onrender.com/docs',
    skillsTagged: ['FastAPI / REST APIs', 'PostgreSQL & SQL'],
    dateAdded: '2026-09-13',
    verificationStatus: 'verified',
    verificationDetails: {
      verifiedAt: '2026-09-13T10:15:00Z',
      liveStatusHttp: 200,
      notes: 'Automated healthcheck ping verified HTTP 200 OK. Response latency: 142ms.',
    },
    shareableWithRecruiter: true,
  },
  {
    id: 'proof_dbms_schema',
    title: 'University Placement DB Schema & Query Suite',
    description: '3NF relational schema design with indexing for low-latency candidate queries and transaction isolation tests.',
    type: 'code_snippet',
    codeSnippet: `-- University Placement Engine Normalized Schema
CREATE TABLE students (
    student_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    cgpa NUMERIC(3,2) CHECK (cgpa >= 0.0 AND cgpa <= 10.0),
    is_opted_in BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_student_cgpa ON students(cgpa) WHERE is_opted_in = TRUE;`,
    skillsTagged: ['PostgreSQL & SQL'],
    dateAdded: '2026-09-14',
    verificationStatus: 'verified',
    verificationDetails: {
      verifiedAt: '2026-09-14T16:00:00Z',
      notes: 'Verified DDL syntax and indexing strategy against PostgreSQL 16 standards.',
    },
    shareableWithRecruiter: true,
  },
  {
    id: 'proof_hackerrank_sql',
    title: 'HackerRank SQL (Intermediate) Skill Certificate',
    description: 'Demonstrated proficiency in complex joins, aggregations, window functions, and subqueries.',
    type: 'certificate',
    url: 'https://www.hackerrank.com/certificates/c4987f2e1a8b',
    skillsTagged: ['PostgreSQL & SQL'],
    dateAdded: '2026-09-08',
    verificationStatus: 'verified',
    verificationDetails: {
      verifiedAt: '2026-09-08T18:00:00Z',
      notes: 'Third-party certificate credential verified.',
    },
    shareableWithRecruiter: true,
  },
  {
    id: 'proof_dsa_foundation',
    title: '30 DSA Foundation Problems Solved on LeetCode',
    description: 'Solved problems on Two Pointers, Sliding Window, Binary Search, and Linked Lists.',
    type: 'assessment',
    url: 'https://leetcode.com/u/rahul_sharma_cse',
    skillsTagged: ['Data Structures & Algorithms'],
    dateAdded: '2026-09-11',
    verificationStatus: 'verified',
    verificationDetails: {
      verifiedAt: '2026-09-11T12:00:00Z',
      notes: 'Verified LeetCode profile public submission activity (34 problems solved).',
    },
    shareableWithRecruiter: true,
  },
];

export const initialWeeklyPlan: WeeklyPlan = {
  id: 'plan_week_sep_17_23',
  weekStartDate: '2026-09-17',
  weekEndDate: '2026-09-23',
  theme: 'Backend Reliability & OS Mid-Term Balance',
  weeklyProofMilestone: 'Containerize Task Tracker with Dockerfile + Pass OS Mid-Term with strong score',
  days: [
    {
      date: '2026-09-17',
      dayOfWeek: 'Today (Thursday)',
      isExamDay: false,
      availableHours: 2.5,
      tasks: [
        {
          id: 'task_t1',
          title: 'FastAPI DB Session & Async Connection Pool tuning',
          estimatedMinutes: 50,
          category: 'Coding',
          skillsAddressed: ['FastAPI / REST APIs', 'PostgreSQL & SQL'],
          status: 'pending',
          scheduledDate: '2026-09-17',
          dayOfWeek: 'Thursday',
          isExamDayTask: false,
          notes: 'Switch to asyncpg driver for non-blocking I/O.',
          proofRequired: true,
        },
        {
          id: 'task_t2',
          title: 'OS Mid-Term: Process Scheduling & Deadlock Banker Algorithm',
          estimatedMinutes: 45,
          category: 'College Exam Prep',
          skillsAddressed: ['Core CS'],
          status: 'pending',
          scheduledDate: '2026-09-17',
          dayOfWeek: 'Thursday',
          isExamDayTask: true,
          notes: 'Prioritized for upcoming mid-term exam in 3 days.',
        },
        {
          id: 'task_t3',
          title: 'DSA: Solve 2 Sliding Window array problems',
          estimatedMinutes: 35,
          category: 'DSA',
          skillsAddressed: ['Data Structures & Algorithms'],
          status: 'pending',
          scheduledDate: '2026-09-17',
          dayOfWeek: 'Thursday',
          isExamDayTask: false,
        },
      ],
    },
    {
      date: '2026-09-18',
      dayOfWeek: 'Friday',
      isExamDay: false,
      availableHours: 2.5,
      tasks: [
        {
          id: 'task_f1',
          title: 'Write Dockerfile for FastAPI service and test locally',
          estimatedMinutes: 60,
          category: 'Project',
          skillsAddressed: ['Docker & Containerization'],
          status: 'pending',
          scheduledDate: '2026-09-18',
          dayOfWeek: 'Friday',
          isExamDayTask: false,
          proofRequired: true,
        },
        {
          id: 'task_f2',
          title: 'OS Mid-Term: Virtual Memory, Paging & Page Replacement algorithms',
          estimatedMinutes: 50,
          category: 'College Exam Prep',
          skillsAddressed: ['Core CS'],
          status: 'pending',
          scheduledDate: '2026-09-18',
          dayOfWeek: 'Friday',
          isExamDayTask: true,
        },
        {
          id: 'task_f3',
          title: 'Revise Git commands & push Dockerfile commit',
          estimatedMinutes: 20,
          category: 'Revision',
          skillsAddressed: ['Git & GitHub Workflows'],
          status: 'pending',
          scheduledDate: '2026-09-18',
          dayOfWeek: 'Friday',
          isExamDayTask: false,
        },
      ],
    },
    {
      date: '2026-09-19',
      dayOfWeek: 'Saturday (Weekend Focus)',
      isExamDay: false,
      availableHours: 4.5,
      tasks: [
        {
          id: 'task_sa1',
          title: 'Complete OS Mid-Term mock questions & previous year university papers',
          estimatedMinutes: 90,
          category: 'College Exam Prep',
          skillsAddressed: ['Core CS'],
          status: 'pending',
          scheduledDate: '2026-09-19',
          dayOfWeek: 'Saturday',
          isExamDayTask: true,
        },
        {
          id: 'task_sa2',
          title: 'Setup Docker-compose with FastAPI + Postgres container',
          estimatedMinutes: 75,
          category: 'Project',
          skillsAddressed: ['Docker & Containerization', 'PostgreSQL & SQL'],
          status: 'pending',
          scheduledDate: '2026-09-19',
          dayOfWeek: 'Saturday',
          isExamDayTask: false,
          proofRequired: true,
        },
        {
          id: 'task_sa3',
          title: 'Weekly Proof Capture: Add docker-compose.yml to Proof Locker',
          estimatedMinutes: 30,
          category: 'Coding',
          skillsAddressed: ['Docker & Containerization'],
          status: 'pending',
          scheduledDate: '2026-09-19',
          dayOfWeek: 'Saturday',
          isExamDayTask: false,
        },
      ],
    },
    {
      date: '2026-09-20',
      dayOfWeek: 'Sunday (EXAM DAY - OS Mid-Term)',
      isExamDay: true,
      examName: 'Operating Systems Mid-Term',
      availableHours: 1.0,
      tasks: [
        {
          id: 'task_su1',
          title: 'Final 30-min quick formula & diagram brushup before exam',
          estimatedMinutes: 30,
          category: 'College Exam Prep',
          skillsAddressed: ['Core CS'],
          status: 'pending',
          scheduledDate: '2026-09-20',
          dayOfWeek: 'Sunday',
          isExamDayTask: true,
        },
        {
          id: 'task_su2',
          title: '60-Second Sunday Weekly Review & plan next week milestones',
          estimatedMinutes: 15,
          category: 'Revision',
          skillsAddressed: ['Soft Skill'],
          status: 'pending',
          scheduledDate: '2026-09-20',
          dayOfWeek: 'Sunday',
          isExamDayTask: false,
        },
      ],
    },
    {
      date: '2026-09-21',
      dayOfWeek: 'Monday',
      isExamDay: false,
      availableHours: 2.5,
      tasks: [
        {
          id: 'task_m1',
          title: 'Deploy Dockerized FastAPI service to Render or Railway',
          estimatedMinutes: 60,
          category: 'Project',
          skillsAddressed: ['Docker & Containerization'],
          status: 'pending',
          scheduledDate: '2026-09-21',
          dayOfWeek: 'Monday',
          isExamDayTask: false,
          proofRequired: true,
        },
        {
          id: 'task_m2',
          title: 'DSA: Binary Search on sorted arrays (LeetCode Medium)',
          estimatedMinutes: 45,
          category: 'DSA',
          skillsAddressed: ['Data Structures & Algorithms'],
          status: 'pending',
          scheduledDate: '2026-09-21',
          dayOfWeek: 'Monday',
          isExamDayTask: false,
        },
      ],
    },
    {
      date: '2026-09-22',
      dayOfWeek: 'Tuesday',
      isExamDay: false,
      availableHours: 2.5,
      tasks: [
        {
          id: 'task_tu1',
          title: 'Add API rate limiting using Redis / slowapi to prevent spam',
          estimatedMinutes: 60,
          category: 'Coding',
          skillsAddressed: ['FastAPI / REST APIs'],
          status: 'pending',
          scheduledDate: '2026-09-22',
          dayOfWeek: 'Tuesday',
          isExamDayTask: false,
        },
        {
          id: 'task_tu2',
          title: 'DBMS Lab Practical Prep: Complex Join queries practice',
          estimatedMinutes: 45,
          category: 'College Exam Prep',
          skillsAddressed: ['PostgreSQL & SQL'],
          status: 'pending',
          scheduledDate: '2026-09-22',
          dayOfWeek: 'Tuesday',
          isExamDayTask: true,
        },
      ],
    },
    {
      date: '2026-09-23',
      dayOfWeek: 'Wednesday',
      isExamDay: false,
      availableHours: 2.5,
      tasks: [
        {
          id: 'task_w1',
          title: 'Review and update Proof Locker with new Docker proof',
          estimatedMinutes: 30,
          category: 'Project',
          skillsAddressed: ['Docker & Containerization'],
          status: 'pending',
          scheduledDate: '2026-09-23',
          dayOfWeek: 'Wednesday',
          isExamDayTask: false,
        },
        {
          id: 'task_w2',
          title: 'Run JD Matcher on 2 Hyderabad backend intern postings',
          estimatedMinutes: 30,
          category: 'Revision',
          skillsAddressed: ['Soft Skill'],
          status: 'pending',
          scheduledDate: '2026-09-23',
          dayOfWeek: 'Wednesday',
          isExamDayTask: false,
        },
      ],
    },
  ],
};

export const initialRoleReadiness: RoleReadiness = {
  targetRole: 'Backend Developer Intern',
  readinessScore: 6.2, // out of 10
  recommendedGapClosureTimeWeeks: 3,
  nextBestAction: 'Complete Docker containerization of your FastAPI app to satisfy the remaining infrastructure requirement.',
  criteria: [
    {
      id: 'crit_lang_core',
      title: 'Backend Language Fundamentals',
      requirementDescription: 'Strong proficiency in Python/Node syntax, asynchronous I/O, and data modeling.',
      category: 'fundamentals',
      status: 'met',
      evidenceProofId: 'proof_task_tracker_api',
      evidenceNote: 'Verified 24 commits in Python FastAPI repository with clean async syntax.',
      weight: 2.0,
    },
    {
      id: 'crit_git_projects',
      title: '2 Public GitHub Repos with Documentation',
      requirementDescription: 'At least two clean repositories with meaningful commit history and README documentation.',
      category: 'projects',
      status: 'met',
      evidenceProofId: 'proof_task_tracker_api',
      evidenceNote: 'Task Tracker API and DBMS University Schema repositories verified.',
      weight: 2.0,
    },
    {
      id: 'crit_sql_db',
      title: 'Relational Database & SQL Proficiency',
      requirementDescription: 'Database design, indexing, foreign keys, and practical query optimization.',
      category: 'fundamentals',
      status: 'met',
      evidenceProofId: 'proof_hackerrank_sql',
      evidenceNote: 'HackerRank Intermediate SQL certification + 3NF University schema verified.',
      weight: 2.0,
    },
    {
      id: 'crit_deployed_demo',
      title: 'Live Deployed Web Service',
      requirementDescription: 'At least one publicly accessible cloud URL returning verified 200 OK responses.',
      category: 'deployment',
      status: 'met',
      evidenceProofId: 'proof_render_deployment',
      evidenceNote: 'Render deployment verified with Swagger UI documentation.',
      weight: 1.5,
    },
    {
      id: 'crit_dsa_basics',
      title: 'Core DSA Foundation (Arrays, HashMaps, Two Pointers)',
      requirementDescription: 'Able to solve basic to medium coding challenges for technical screening tests.',
      category: 'dsa',
      status: 'partial',
      evidenceProofId: 'proof_dsa_foundation',
      evidenceNote: '34 problems solved. Needs practice on Sliding Window, Trees, and Recursion.',
      weight: 1.5,
    },
    {
      id: 'crit_docker_container',
      title: 'Containerization & Docker Basics',
      requirementDescription: 'Ability to package a backend application inside a Docker container for production deployment.',
      category: 'deployment',
      status: 'missing',
      evidenceNote: 'No Dockerfile or container proof currently verified in Proof Locker.',
      weight: 1.0,
    },
  ],
};

export const initialResume: TruthfulResume = {
  id: 'resume_v1_rahul',
  updatedAt: '2026-09-16',
  summary:
    '3rd Year Computer Science student at JNTUH with proven hands-on experience building asynchronous REST APIs using FastAPI and PostgreSQL. Built and deployed live services on Render with comprehensive unit test coverage and automated Swagger documentation.',
  education: {
    college: 'JNTUH College of Engineering, Hyderabad',
    degree: 'B.Tech in Computer Science and Engineering',
    yearRange: '2023 - 2027',
    cgpa: 7.92,
    showCgpa: true,
    location: 'Hyderabad, Telangana',
  },
  skillsGrouped: {
    languages: ['Python', 'SQL', 'JavaScript (Basics)', 'C++ (Coursework)'],
    frameworks: ['FastAPI', 'Pydantic', 'SQLAlchemy', 'Pytest'],
    databasesAndTools: ['PostgreSQL', 'Git & GitHub', 'Render Cloud', 'Postman', 'Linux / Bash'],
    coursework: ['Operating Systems', 'Database Management Systems', 'Data Structures & Algorithms', 'Computer Networks'],
  },
  projects: [
    {
      id: 'proj_task_tracker',
      title: 'Campus Task Tracker REST API',
      role: 'Backend Developer',
      techStack: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Pytest'],
      liveUrl: 'https://campus-task-tracker.onrender.com/docs',
      githubUrl: 'https://github.com/rahul-sharma-dev/campus-task-tracker-api',
      proofItemId: 'proof_task_tracker_api',
      bullets: [
        {
          id: 'b1',
          text: 'Architected and deployed a modular REST API in Python FastAPI with JWT-based authentication and role-based access control.',
          proofItemId: 'proof_task_tracker_api',
          isVerified: true,
        },
        {
          id: 'b2',
          text: 'Maintained 24 git commits, implemented Pydantic schema validation, and wrote 12 automated Pytest test cases ensuring 85% branch coverage.',
          proofItemId: 'proof_task_tracker_api',
          isVerified: true,
        },
        {
          id: 'b3',
          text: 'Configured continuous cloud deployment on Render connected to hosted PostgreSQL, achieving 142ms average response latency.',
          proofItemId: 'proof_render_deployment',
          isVerified: true,
        },
      ],
    },
    {
      id: 'proj_placement_db',
      title: 'Relational Placement Engine & Query Optimizer',
      role: 'Database Designer',
      techStack: ['PostgreSQL', 'Relational Normalization', 'SQL DDL/DML'],
      githubUrl: 'https://github.com/rahul-sharma-dev/campus-task-tracker-api',
      proofItemId: 'proof_dbms_schema',
      bullets: [
        {
          id: 'b4',
          text: 'Designed a 3NF normalized database schema for student placement workflows with foreign key constraints and validation triggers.',
          proofItemId: 'proof_dbms_schema',
          isVerified: true,
        },
        {
          id: 'b5',
          text: 'Added partial indexes on candidate records to optimize filtered eligibility queries for campus recruitment drives.',
          proofItemId: 'proof_dbms_schema',
          isVerified: true,
        },
      ],
    },
  ],
  certificationsAndProof: [
    {
      title: 'HackerRank SQL (Intermediate) Certification',
      issuer: 'HackerRank',
      date: 'Sept 2026',
      verifiedUrl: 'https://www.hackerrank.com/certificates/c4987f2e1a8b',
    },
    {
      title: 'Verified 34 Problems in Data Structures (LeetCode)',
      issuer: 'LeetCode Community',
      date: 'Aug 2026',
      verifiedUrl: 'https://leetcode.com/u/rahul_sharma_cse',
    },
  ],
};

export const sampleJobDescriptions = [
  {
    id: 'jd_hyderabad_saas',
    title: 'Backend Engineering Intern',
    company: 'CloudMatrix Technologies (Hyderabad / Hitec City)',
    location: 'Hyderabad, Telangana (Hybrid)',
    stipend: '₹20,000 / month',
    rawText: `CloudMatrix is hiring a Backend Engineering Intern for our core platform team in Hyderabad.

Responsibilities:
- Build and maintain REST APIs using Python (FastAPI or Django)
- Collaborate on database schema design and write optimized SQL queries in PostgreSQL
- Write unit and integration tests for all backend services
- Containerize services using Docker for CI/CD deployment
- Participate in code reviews on GitHub and adhere to Git workflow best practices

Requirements:
- Enrolled in B.Tech / B.E. in Computer Science or related degree
- Strong command of Python and asynchronous programming concepts
- Practical familiarity with PostgreSQL, indexing, and ORM frameworks
- Hands-on experience with Git/GitHub and public code repositories
- Basic understanding of Docker and containerization is preferred
- Ability to manage time alongside college coursework`,
  },
  {
    id: 'jd_fintech_remote',
    title: 'Junior Python Backend Intern',
    company: 'FinPulse Labs (Remote / Bengaluru)',
    location: 'Remote (India)',
    stipend: '₹22,000 / month',
    rawText: `FinPulse Labs is seeking a hungry, detail-oriented Python Backend Intern.

What You Will Do:
- Develop microservices and webhook receivers using FastAPI
- Work with relational databases (PostgreSQL/MySQL) and caching
- Write defensive code with automated testing (Pytest)
- Integrate third-party banking APIs and financial data feeds

What We Look For:
- Demonstrable proof of work: public GitHub repositories with real projects, not just boilerplate code
- Strong problem-solving skills in foundational Data Structures (Arrays, Strings, HashMaps)
- Clear written documentation skills (Swagger/OpenAPI or Markdown)
- Self-driven attitude and commitment of 20 hours per week`,
  },
];

export const curatedResources: CuratedResource[] = [
  {
    id: 'res_striver_dsa',
    title: "Striver's A2Z DSA Course & Sheet",
    description: 'The standard step-by-step roadmap for mastering Data Structures and Algorithms for campus placement coding tests.',
    provider: 'takeUforward',
    url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
    topics: ['Arrays', 'Strings', 'Binary Search', 'Trees', 'Graphs'],
    level: 'Beginner',
    language: 'Multilingual',
    estimatedHours: 40,
    isFree: true,
  },
  {
    id: 'res_fastapi_official',
    title: 'Official FastAPI Tutorial & User Guide',
    description: 'Crystal-clear documentation covering Pydantic models, async endpoints, dependency injection, and security.',
    provider: 'FastAPI / Tiangolo',
    url: 'https://fastapi.tiangolo.com/tutorial/',
    topics: ['Python', 'FastAPI', 'REST APIs', 'Async I/O'],
    level: 'Beginner',
    language: 'English',
    estimatedHours: 12,
    isFree: true,
  },
  {
    id: 'res_roadmap_backend',
    title: 'Interactive Backend Developer Roadmap',
    description: 'Community-driven visual guide outlining core backend technologies, communication protocols, and architectures.',
    provider: 'roadmap.sh',
    url: 'https://roadmap.sh/backend',
    topics: ['System Design', 'Databases', 'APIs', 'Security'],
    level: 'Beginner',
    language: 'English',
    estimatedHours: 15,
    isFree: true,
  },
  {
    id: 'res_docker_curriculum',
    title: 'Docker for Beginners Practical Workshop',
    description: 'A hands-on introduction to Dockerfiles, images, containers, and multi-container orchestration with docker-compose.',
    provider: 'Docker Curriculum',
    url: 'https://docker-curriculum.com/',
    topics: ['Docker', 'Containers', 'DevOps', 'Deployment'],
    level: 'Beginner',
    language: 'English',
    estimatedHours: 4,
    isFree: true,
  },
  {
    id: 'res_gatesmashers_os',
    title: 'Operating Systems Complete Placement Series',
    description: 'Simple, diagram-rich explanations of CPU scheduling, deadlocks, and virtual memory matching university syllabi.',
    provider: 'Gate Smashers',
    url: 'https://www.youtube.com/@GateSmashers',
    topics: ['Operating Systems', 'CPU Scheduling', 'Deadlocks', 'Memory Management'],
    level: 'Beginner',
    language: 'Hindi',
    estimatedHours: 18,
    isFree: true,
  },
  {
    id: 'res_fcc_relational_db',
    title: 'freeCodeCamp Relational Database Certification',
    description: 'Interactive Linux terminal curriculum teaching PostgreSQL, Bash scripting, and Git from scratch.',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/relational-database/',
    topics: ['PostgreSQL', 'SQL', 'Bash', 'Database Normalization'],
    level: 'Beginner',
    language: 'English',
    estimatedHours: 25,
    isFree: true,
  },
];

export const initialDPDPConsent: DPDPPreferences = {
  planningDataProcessingConsent: true,
  githubSyncConsent: true,
  recruiterSharingConsent: true,
  preventCrossStudentMemory: true,
  ageVerified: true,
  shareablePassportId: 'pass_rahul_jntuh_883',
  consentTimestamp: '2026-09-15T09:00:00Z',
};

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'assistant',
    content:
      'Namaste Rahul! I am your private Proofa growth companion. I have your academic calendar from JNTUH, your 2.5h weekday budget, and your OS Mid-term scheduled for Sunday Sept 20. Your timetable is kept completely private from colleges and recruiters. How can I help you make progress today?',
    timestamp: '2026-09-17T08:30:00',
  },
  {
    id: 'msg_2',
    sender: 'student',
    content: 'Can I get a 40 LPA software engineer package at Google in 2 months if I study 10 hours a day?',
    timestamp: '2026-09-17T08:31:00',
  },
  {
    id: 'msg_3',
    sender: 'assistant',
    content:
      'Let’s be completely honest: promising a 40 LPA package in 60 days is a dangerous internet fantasy. A salary number is not a plan, and burning yourself out with 10 hours a day right before your JNTUH mid-terms will hurt your CGPA.\n\nHere is the real, proven path:\n1. Your current role-readiness for a **Backend Intern (₹15k–₹25k stipend)** is **6.2/10**.\n2. You already have verified proof for Python & FastAPI.\n3. Close your 2 real gaps: Docker containerization (3 days) and DSA sliding window/trees (2 weeks).\n4. Convert an internship into a Pre-Placement Offer (PPO) or high-tier fresher role in your final year.\n\nAmbition is great—let’s channel it into today’s 3 realistic tasks instead of a gamble.',
    timestamp: '2026-09-17T08:32:00',
  },
];
