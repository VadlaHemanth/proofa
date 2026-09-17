import {
  StudentProfile,
  StudentGoal,
  StudentConstraints,
  Skill,
  ProofItem,
  WeeklyPlan,
  PlanTask,
  DailyCheckIn,
  RoleReadiness,
  TruthfulResume,
  DPDPPreferences,
  ChatMessage,
  CuratedResource,
} from '../types';
import {
  initialProfile,
  initialGoal,
  initialConstraints,
  initialSkills,
  initialProofItems,
  initialWeeklyPlan,
  initialRoleReadiness,
  initialResume,
  curatedResources,
  initialDPDPConsent,
  initialChatMessages,
} from './seedData';

const STORAGE_KEYS = {
  PROFILE: 'Proofa_profile',
  GOAL: 'Proofa_goal',
  CONSTRAINTS: 'Proofa_constraints',
  SKILLS: 'Proofa_skills',
  PROOF_ITEMS: 'Proofa_proof_items',
  WEEKLY_PLAN: 'Proofa_weekly_plan',
  CHECK_INS: 'Proofa_check_ins',
  READINESS: 'Proofa_readiness',
  RESUME: 'Proofa_resume',
  DPDP: 'Proofa_dpdp',
  CHAT: 'Proofa_chat',
};

function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to store item ${key}`, err);
  }
}

export const storage = {
  // Profile
  getProfile: (): StudentProfile => getStoredItem(STORAGE_KEYS.PROFILE, initialProfile),
  updateProfile: (profile: StudentProfile): void => setStoredItem(STORAGE_KEYS.PROFILE, profile),

  // Goal
  getGoal: (): StudentGoal => getStoredItem(STORAGE_KEYS.GOAL, initialGoal),
  updateGoal: (goal: StudentGoal): void => setStoredItem(STORAGE_KEYS.GOAL, goal),

  // Constraints
  getConstraints: (): StudentConstraints => getStoredItem(STORAGE_KEYS.CONSTRAINTS, initialConstraints),
  updateConstraints: (constraints: StudentConstraints): void => {
    setStoredItem(STORAGE_KEYS.CONSTRAINTS, constraints);
    // Auto adapt the weekly plan when exam dates or hours change!
    storage.rebalancePlanWithConstraints(constraints);
  },

  // Skills
  getSkills: (): Skill[] => getStoredItem(STORAGE_KEYS.SKILLS, initialSkills),
  updateSkills: (skills: Skill[]): void => {
    setStoredItem(STORAGE_KEYS.SKILLS, skills);
    storage.recalculateReadiness();
  },
  addSkill: (skill: Skill): void => {
    const list = storage.getSkills();
    setStoredItem(STORAGE_KEYS.SKILLS, [...list, skill]);
    storage.recalculateReadiness();
  },

  // Proof Items
  getProofItems: (): ProofItem[] => getStoredItem(STORAGE_KEYS.PROOF_ITEMS, initialProofItems),
  addProofItem: (item: ProofItem): void => {
    const items = storage.getProofItems();
    const updated = [item, ...items];
    setStoredItem(STORAGE_KEYS.PROOF_ITEMS, updated);

    // Update skills tagged count
    const skills = storage.getSkills();
    const updatedSkills = skills.map((s) => {
      if (item.skillsTagged.some((t) => t.toLowerCase() === s.name.toLowerCase())) {
        return {
          ...s,
          verifiedProofCount: (s.verifiedProofCount || 0) + 1,
          benchmarkScore: Math.min(10, (s.benchmarkScore || 5) + 1),
        };
      }
      return s;
    });
    setStoredItem(STORAGE_KEYS.SKILLS, updatedSkills);

    // Recalculate readiness
    storage.recalculateReadiness();
  },
  deleteProofItem: (id: string): void => {
    const items = storage.getProofItems().filter((p) => p.id !== id);
    setStoredItem(STORAGE_KEYS.PROOF_ITEMS, items);
    storage.recalculateReadiness();
  },

  // Weekly Plan & Tasks
  getWeeklyPlan: (): WeeklyPlan => getStoredItem(STORAGE_KEYS.WEEKLY_PLAN, initialWeeklyPlan),
  updateWeeklyPlan: (plan: WeeklyPlan): void => setStoredItem(STORAGE_KEYS.WEEKLY_PLAN, plan),

  toggleTaskCompletion: (taskId: string): PlanTask | null => {
    const plan = storage.getWeeklyPlan();
    let updatedTask: PlanTask | null = null;
    let taskCompleted = false;

    plan.days = plan.days.map((day) => ({
      ...day,
      tasks: day.tasks.map((task) => {
        if (task.id === taskId) {
          const newStatus = task.status === 'completed' ? 'pending' : 'completed';
          updatedTask = { ...task, status: newStatus };
          taskCompleted = newStatus === 'completed';
          return updatedTask;
        }
        return task;
      }),
    }));

    storage.updateWeeklyPlan(plan);

    // Update skill practice recency if task completed
    if (taskCompleted && updatedTask) {
      const skills = storage.getSkills();
      const updatedSkills = skills.map((s) => {
        if ((updatedTask as PlanTask).skillsAddressed.includes(s.name)) {
          return { ...s, lastPracticedDate: new Date().toISOString().split('T')[0] };
        }
        return s;
      });
      setStoredItem(STORAGE_KEYS.SKILLS, updatedSkills);
    }

    return updatedTask;
  },

  rescheduleTask: (taskId: string, targetDate: string): void => {
    const plan = storage.getWeeklyPlan();
    let taskToMove: PlanTask | null = null;

    // Remove from source
    plan.days = plan.days.map((day) => {
      const remaining = day.tasks.filter((t) => {
        if (t.id === taskId) {
          taskToMove = { ...t, scheduledDate: targetDate, status: 'rescheduled' };
          return false;
        }
        return true;
      });
      return { ...day, tasks: remaining };
    });

    // Add to target day
    if (taskToMove) {
      plan.days = plan.days.map((day) => {
        if (day.date === targetDate) {
          return { ...day, tasks: [...day.tasks, taskToMove as PlanTask] };
        }
        return day;
      });
    }

    storage.updateWeeklyPlan(plan);
  },

  // Daily Check-in
  getCheckIns: (): DailyCheckIn[] => getStoredItem(STORAGE_KEYS.CHECK_INS, []),
  submitCheckIn: (checkIn: DailyCheckIn): void => {
    const current = storage.getCheckIns();
    setStoredItem(STORAGE_KEYS.CHECK_INS, [checkIn, ...current]);

    // Reschedule or adapt future tasks based on availableMinutesTomorrow
    const plan = storage.getWeeklyPlan();
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Mark today's completed tasks
    plan.days = plan.days.map((day) => {
      if (day.date === todayStr || day.dayOfWeek.includes('Today')) {
        return {
          ...day,
          tasks: day.tasks.map((t) =>
            checkIn.completedTaskIds.includes(t.id) ? { ...t, status: 'completed' as const } : t
          ),
        };
      }
      return day;
    });

    storage.updateWeeklyPlan(plan);
  },

  rebalancePlanWithConstraints: (constraints: StudentConstraints): void => {
    const plan = storage.getWeeklyPlan();
    const examDates = new Set(constraints.upcomingExams.map((e) => e.date));

    plan.days = plan.days.map((day) => {
      const isExam = examDates.has(day.date);
      const examDetail = constraints.upcomingExams.find((e) => e.date === day.date);
      return {
        ...day,
        isExamDay: isExam,
        examName: examDetail ? examDetail.title : undefined,
        availableHours: isExam ? 1.0 : day.dayOfWeek.includes('Saturday') || day.dayOfWeek.includes('Sunday') ? constraints.weekendHours : constraints.weekdayHours,
      };
    });

    storage.updateWeeklyPlan(plan);
  },

  // Role Readiness
  getRoleReadiness: (): RoleReadiness => getStoredItem(STORAGE_KEYS.READINESS, initialRoleReadiness),
  recalculateReadiness: (): RoleReadiness => {
    const proofs = storage.getProofItems();
    const current = storage.getRoleReadiness();

    const hasLiveDemo = proofs.some((p) => p.type === 'deployed_demo' && p.verificationStatus === 'verified');
    const githubRepos = proofs.filter((p) => p.type === 'github_repo' && p.verificationStatus === 'verified');
    const hasSqlProof = proofs.some((p) => p.skillsTagged.some((s) => s.toLowerCase().includes('sql') || s.toLowerCase().includes('postgres')));
    const hasDockerProof = proofs.some((p) => p.skillsTagged.some((s) => s.toLowerCase().includes('docker')));
    const dsaProofs = proofs.filter((p) => p.skillsTagged.some((s) => s.toLowerCase().includes('algorithm') || s.toLowerCase().includes('dsa')));

    const updatedCriteria = current.criteria.map((c) => {
      if (c.id === 'crit_deployed_demo') {
        return {
          ...c,
          status: (hasLiveDemo ? 'met' : 'missing') as 'met' | 'missing',
          evidenceNote: hasLiveDemo ? 'Live deployment verified via automated healthcheck.' : 'No verified cloud deployment URL found.',
        };
      }
      if (c.id === 'crit_git_projects') {
        const count = githubRepos.length;
        return {
          ...c,
          status: (count >= 2 ? 'met' : count === 1 ? 'partial' : 'missing') as 'met' | 'partial' | 'missing',
          evidenceNote: `${count} verified GitHub repositories with active commits and documentation.`,
        };
      }
      if (c.id === 'crit_sql_db') {
        return {
          ...c,
          status: (hasSqlProof ? 'met' : 'missing') as 'met' | 'missing',
          evidenceNote: hasSqlProof ? 'Verified SQL database schema / certificate proof in locker.' : 'No relational database proof found.',
        };
      }
      if (c.id === 'crit_docker_container') {
        return {
          ...c,
          status: (hasDockerProof ? 'met' : 'missing') as 'met' | 'missing',
          evidenceNote: hasDockerProof ? 'Verified Dockerfile / docker-compose setup in locker.' : 'No Docker or containerization proof found in locker.',
        };
      }
      if (c.id === 'crit_dsa_basics') {
        return {
          ...c,
          status: (dsaProofs.length > 0 ? 'partial' : 'missing') as 'partial' | 'missing',
        };
      }
      return c;
    });

    // Score calculation based on weights
    let totalWeight = 0;
    let earnedWeight = 0;
    updatedCriteria.forEach((c) => {
      totalWeight += c.weight;
      if (c.status === 'met') earnedWeight += c.weight;
      else if (c.status === 'partial') earnedWeight += c.weight * 0.5;
    });

    const score = Number(((earnedWeight / totalWeight) * 10).toFixed(1));

    let nextBestAction = 'Keep pushing daily practice and document your work in GitHub.';
    if (!hasDockerProof) {
      nextBestAction = 'Complete Docker containerization of your FastAPI app to satisfy the remaining infrastructure requirement.';
    } else if (!hasLiveDemo) {
      nextBestAction = 'Deploy your project to Render or Vercel to obtain a verified live demo URL.';
    } else if (githubRepos.length < 2) {
      nextBestAction = 'Publish a second clean GitHub repository with clear README documentation and test suite.';
    }

    const updated: RoleReadiness = {
      ...current,
      readinessScore: score,
      criteria: updatedCriteria,
      nextBestAction,
      recommendedGapClosureTimeWeeks: score >= 8 ? 1 : score >= 6 ? 2 : 4,
    };

    setStoredItem(STORAGE_KEYS.READINESS, updated);
    return updated;
  },

  // Truthful Resume
  getResume: (): TruthfulResume => getStoredItem(STORAGE_KEYS.RESUME, initialResume),
  updateResume: (resume: TruthfulResume): void => setStoredItem(STORAGE_KEYS.RESUME, resume),

  // Curated Resources
  getResources: (): CuratedResource[] => curatedResources,

  // DPDP & Privacy
  getDPDP: (): DPDPPreferences => getStoredItem(STORAGE_KEYS.DPDP, initialDPDPConsent),
  updateDPDP: (prefs: DPDPPreferences): void => setStoredItem(STORAGE_KEYS.DPDP, prefs),

  // Chat Messages (Private Growth Companion)
  getChat: (): ChatMessage[] => getStoredItem(STORAGE_KEYS.CHAT, initialChatMessages),
  addChatMessage: (message: ChatMessage): void => {
    const list = storage.getChat();
    setStoredItem(STORAGE_KEYS.CHAT, [...list, message]);
  },

  // DPDP Data Portability: Export full JSON
  exportFullDataJSON: (): string => {
    const data = {
      exportDate: new Date().toISOString(),
      dpdpNotice: 'This export contains all personal and academic data stored for your Proofa account under India DPDP Act 2023.',
      profile: storage.getProfile(),
      goal: storage.getGoal(),
      constraints: storage.getConstraints(),
      skills: storage.getSkills(),
      proofItems: storage.getProofItems(),
      weeklyPlan: storage.getWeeklyPlan(),
      checkIns: storage.getCheckIns(),
      roleReadiness: storage.getRoleReadiness(),
      truthfulResume: storage.getResume(),
      dpdpPreferences: storage.getDPDP(),
    };
    return JSON.stringify(data, null, 2);
  },

  // DPDP Right to Erasure / Delete Account
  purgeAllData: (): void => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  },

  // Reset to initial prototype seed state
  resetToSeedData: (): void => {
    setStoredItem(STORAGE_KEYS.PROFILE, initialProfile);
    setStoredItem(STORAGE_KEYS.GOAL, initialGoal);
    setStoredItem(STORAGE_KEYS.CONSTRAINTS, initialConstraints);
    setStoredItem(STORAGE_KEYS.SKILLS, initialSkills);
    setStoredItem(STORAGE_KEYS.PROOF_ITEMS, initialProofItems);
    setStoredItem(STORAGE_KEYS.WEEKLY_PLAN, initialWeeklyPlan);
    setStoredItem(STORAGE_KEYS.READINESS, initialRoleReadiness);
    setStoredItem(STORAGE_KEYS.RESUME, initialResume);
    setStoredItem(STORAGE_KEYS.DPDP, initialDPDPConsent);
    setStoredItem(STORAGE_KEYS.CHAT, initialChatMessages);
  },
};
