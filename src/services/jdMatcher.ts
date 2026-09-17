import { JdMatchReport, ProofItem, Skill } from '../types';

interface SkillRequirement {
  name: string;
  aliases: string[];
  severity: 'critical' | 'nice_to_have';
}

const COMMON_TECH_SKILLS: SkillRequirement[] = [
  { name: 'Python', aliases: ['python', 'py'], severity: 'critical' },
  { name: 'FastAPI / REST APIs', aliases: ['fastapi', 'rest', 'restful', 'api', 'apis', 'django', 'flask'], severity: 'critical' },
  { name: 'PostgreSQL & SQL', aliases: ['postgresql', 'postgres', 'sql', 'mysql', 'database', 'rdbms', 'orm', 'sqlalchemy'], severity: 'critical' },
  { name: 'Git & GitHub Workflows', aliases: ['git', 'github', 'version control', 'pull request', 'code review'], severity: 'critical' },
  { name: 'Docker & Containerization', aliases: ['docker', 'container', 'containers', 'containerization', 'kubernetes', 'dockerfile', 'docker-compose'], severity: 'nice_to_have' },
  { name: 'Data Structures & Algorithms', aliases: ['dsa', 'data structures', 'algorithms', 'problem solving', 'leetcode'], severity: 'critical' },
  { name: 'Unit Testing', aliases: ['pytest', 'unit testing', 'integration test', 'tdd', 'testing'], severity: 'nice_to_have' },
  { name: 'Linux & Bash', aliases: ['linux', 'bash', 'shell', 'ubuntu'], severity: 'nice_to_have' },
  { name: 'Redis / Caching', aliases: ['redis', 'caching', 'memcached'], severity: 'nice_to_have' },
];

export function analyzeJobDescription(
  jdText: string,
  jobTitle: string = 'Backend Engineering Intern',
  companyName: string = 'Target Company',
  storedProofs: ProofItem[],
  studentSkills: Skill[]
): JdMatchReport {
  const lowerJd = jdText.toLowerCase();

  // Find which common tech skills are mentioned in the JD
  const mentionedSkills = COMMON_TECH_SKILLS.filter((req) =>
    req.aliases.some((alias) => new RegExp(`\\b${alias}\\b`, 'i').test(lowerJd))
  );

  // If few detected, default to standard backend intern stack
  const effectiveRequirements = mentionedSkills.length >= 3 ? mentionedSkills : COMMON_TECH_SKILLS.slice(0, 5);

  const matchedSkills: JdMatchReport['matchedSkills'] = [];
  const missingSkills: JdMatchReport['missingSkills'] = [];

  effectiveRequirements.forEach((req) => {
    // Check if student has VERIFIED proof for this skill
    const matchingProof = storedProofs.find(
      (p) =>
        p.verificationStatus === 'verified' &&
        p.skillsTagged.some((t) => t.toLowerCase().includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(t.toLowerCase()))
    );

    if (matchingProof) {
      matchedSkills.push({
        skillName: req.name,
        evidenceProofId: matchingProof.id,
        proofSummary: `${matchingProof.title} (${matchingProof.type.replace('_', ' ')})`,
      });
    } else {
      // Check if student at least has a self-rated skill without proof
      const claimedSkill = studentSkills.find((s) => s.name.toLowerCase().includes(req.name.toLowerCase()));
      const action = claimedSkill
        ? `You claimed ${req.name} as ${claimedSkill.selfRating}, but have 0 verified proof in your locker. Add a project repo or code artifact.`
        : `Learn ${req.name} fundamentals and complete a practical exercise.`;

      missingSkills.push({
        skillName: req.name,
        severity: req.severity,
        learningAction: action,
      });
    }
  });

  // Calculate honest match score
  const total = effectiveRequirements.length;
  const matchedCount = matchedSkills.length;
  const matchPercentage = Math.round((matchedCount / total) * 100);

  let verdict: JdMatchReport['readinessVerdict'] = 'Early Stage';
  if (matchPercentage >= 75) {
    verdict = 'Strong Alignment';
  } else if (matchPercentage >= 50) {
    verdict = 'Moderate Gap';
  }

  // Generate strictly grounded tailored resume bullets
  const tailoredResumeBullets = matchedSkills.map((m) => {
    const proof = storedProofs.find((p) => p.id === m.evidenceProofId);
    if (proof) {
      return `Demonstrated ${m.skillName} capability via "${proof.title}" with verified proof (${proof.verificationDetails?.notes || 'code inspection'}).`;
    }
    return `Applied ${m.skillName} in academic and practical software projects.`;
  });

  // 7-day gap-closure plan for missing skills
  const sevenDayGapPlan: JdMatchReport['sevenDayGapPlan'] = [
    {
      day: 1,
      action: missingSkills[0]
        ? `Review ${missingSkills[0].skillName} core concepts using curated guide.`
        : 'Refactor existing API error handlers and clean docstrings.',
      deliverableProof: 'Notes or quick syntax test file.',
    },
    {
      day: 2,
      action: missingSkills[0]
        ? `Implement a mini-project module demonstrating ${missingSkills[0].skillName}.`
        : 'Write 3 integration tests covering edge cases.',
      deliverableProof: 'Git commit with clear message.',
    },
    {
      day: 3,
      action: missingSkills[1]
        ? `Explore ${missingSkills[1].skillName} setup and integrate with local environment.`
        : 'Optimize database queries and verify index usage with EXPLAIN.',
      deliverableProof: 'Configuration file or sample script.',
    },
    {
      day: 4,
      action: 'Run automated linter and ensure code adheres to PEP8 / standard guidelines.',
      deliverableProof: 'Clean lint report.',
    },
    {
      day: 5,
      action: 'Deploy or update public demonstration artifact on Render / GitHub.',
      deliverableProof: 'Verifiable public URL or commit link.',
    },
    {
      day: 6,
      action: 'Add newly created proof artifact to Proof Locker and re-run readiness audit.',
      deliverableProof: 'Updated Proofa passport.',
    },
    {
      day: 7,
      action: 'Review tailored résumé and prepare custom submission notes for direct application.',
      deliverableProof: 'Completed application package ready for human review.',
    },
  ];

  const applicationChecklist = [
    { item: 'Review tailored résumé: ensure every bullet matches work you actually did', done: true },
    { item: 'Verify all project demo and GitHub links are publicly accessible (not 404)', done: true },
    { item: 'Check company hiring portal rules: do not use auto-submit scripts', done: false },
    { item: 'Prepare a 3-sentence truthful introduction highlighting your verified proof', done: false },
    { item: 'Submit directly on official careers page or verified recruiter email', done: false },
  ];

  return {
    id: `match_${Date.now()}`,
    jobTitle,
    companyName,
    targetRole: 'Backend Developer Intern',
    overallMatchPercentage: matchPercentage,
    readinessVerdict: verdict,
    matchedSkills,
    missingSkills,
    tailoredResumeBullets,
    sevenDayGapPlan,
    applicationChecklist,
  };
}
