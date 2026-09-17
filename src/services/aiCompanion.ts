import { ChatMessage, StudentConstraints, StudentGoal, StudentProfile } from '../types';

export interface AiResponse {
  message: string;
  containsCrisisHelp: boolean;
}

const CRISIS_KEYWORDS = [
  'suicide',
  'kill myself',
  'end my life',
  'hopeless',
  'self harm',
  'want to die',
  'cannot live',
  'no reason to live',
];

export async function processCompanionQuery(
  userQuery: string,
  profile: StudentProfile,
  goal: StudentGoal,
  constraints: StudentConstraints
): Promise<AiResponse> {
  const lower = userQuery.toLowerCase();

  // 1. Safety Guardrail: Crisis Detection
  if (CRISIS_KEYWORDS.some((kw) => lower.includes(kw))) {
    return {
      message: `I hear how overwhelmed you are feeling right now, and I care about your wellbeing. College, placements, and exams can create intense pressure, but your life and mental health are infinitely more valuable than any grade or interview. 

Please reach out to professional support immediately:
• **Tele-MANAS (Govt of India 24x7 Mental Health Helpline):** Call 14416 or 1800-891-4416 (Toll-Free)
• **KIRAN Helpline:** 1800-599-0019
• **Vandrevala Foundation Helpline:** +91 9999 666 555 (Call or WhatsApp)

Please talk to a trusted friend, family member, or college counselor today. We can pause your study plan completely until you feel supported.`,
      containsCrisisHelp: true,
    };
  }

  // 2. Guardrail: 40 LPA / Fast Rich Fantasy
  if (/(40|50|30)\s*(lpa|lakhs?)|in\s*(2|1|two|one)\s*(months?|weeks?)|get\s*rich|guarantee/i.test(lower)) {
    return {
      message: `Let's have an honest, grounded conversation about that.

1. **No Magic Short-cuts:** Promising a 40 LPA package in 60 days from scratch is an internet myth sold by bootcamps. Trying to pull 10-hour days right before your ${constraints.upcomingExams[0]?.title || 'college exams'} will cause burnout and hurt your CGPA.
2. **The Real Path for Tier 2/3 Undergrads:**
   - Step 1: Secure a solid Software Internship (stipend ₹15k–₹30k/mo) based on verifiable proof (like your FastAPI and SQL projects).
   - Step 2: Convert that internship into a Pre-Placement Offer (PPO) or leverage it for high-tier campus placement drives in your final year.
3. **Your Immediate Priority:** Your upcoming ${constraints.upcomingExams[0]?.title || 'exams'}. Maintain your CGPA above 7.5 to pass company eligibility filters, and complete this week's realistic milestone: "${goal.weeklyProofMilestone}".

Ambition is great—let's channel it into disciplined proof instead of lottery thinking.`,
      containsCrisisHelp: false,
    };
  }

  // 3. Guardrail: Exam Stress / Skip College
  if (/exam|mid-?term|semester|fail|lab|study|attendance/i.test(lower)) {
    const nextExam = constraints.upcomingExams[0];
    return {
      message: `Academic balance is essential. In India, over 50% of campus hiring still enforces strict CGPA eligibility cut-offs (usually 7.0 or 7.5). Skipping exam prep for side projects is a mistake.

${nextExam ? `Your upcoming **${nextExam.title}** on **${nextExam.date}** takes priority right now.` : 'Make sure your current coursework is secure.'}

I have configured your plan to allocate 45–60 minutes daily to core college revision. During exam days, all heavy coding milestones are automatically paused or converted into light 15-minute recaps.`,
      containsCrisisHelp: false,
    };
  }

  // 4. Guardrail: Auto-apply / Scraping
  if (/auto-?apply|bot|scrape|easy apply|linkedin bot|spam/i.test(lower)) {
    return {
      message: `Proofa strictly prohibits auto-apply bots and scrapers for two critical reasons:

1. **Account Ban Risk:** Automating LinkedIn Easy Apply or scraping job portals violates their Terms of Service and frequently leads to permanent account suspension.
2. **Low Conversion:** Recruiters delete mass-spammed generic applications in seconds. A single, truthful application with verified proof links (e.g., your live Render deployment and test coverage) converts at a 5x to 10x higher rate than 100 bot-spammed resumes.

Proofa helps you tailor your resume honestly and prepare the exact application package—then **you** review and submit it personally. You stay in full control.`,
      containsCrisisHelp: false,
    };
  }

  // 5. Rejection / Imposter Syndrome
  if (/reject|failed|bad|sad|disappointed|not good enough/i.test(lower)) {
    return {
      message: `Rejections feel heavy, but they are normal data points in engineering. In fact, most working software engineers received dozens of rejections before landing their first breakthrough.

What matters is **diagnostic clarity** over self-criticism:
• If you were rejected at the resume screen: We need to highlight your live demo and GitHub proof more prominently.
• If you struggled in the coding round: We will focus on time complexity and DSA edge cases.
• If it was system design / viva: We will practice explaining your FastAPI database relationships clearly.

Let's review your Role Readiness checklist and turn this into your next proof artifact.`,
      containsCrisisHelp: false,
    };
  }

  // 6. Project & Skills Guidance
  if (/docker|container|deployment|project|what should i do/i.test(lower)) {
    return {
      message: `Looking at your **${goal.targetRole}** roadmap:

Your biggest lever right now is containerizing your FastAPI application:
1. Create a clean multi-stage \`Dockerfile\` (using \`python:3.11-slim\`).
2. Add a \`docker-compose.yml\` that spins up both your FastAPI web app and a local PostgreSQL container.
3. Test \`docker compose up --build\` locally and commit it to GitHub.
4. Once committed, add it to your Proof Locker—this will directly boost your role readiness from 6.2 to 7.5!

Would you like me to show you a sample production Dockerfile for FastAPI?`,
      containsCrisisHelp: false,
    };
  }

  // General helpful response
  return {
    message: `I've noted that, ${profile.fullName.split(' ')[0]}. As your private growth companion, I'm tracking your progress toward becoming a **${goal.targetRole}**. 

Remember our 3 pillars:
1. **Proof over hours:** Focus on finishing verifiable deliverables, not just passive tutorial watching.
2. **Respect your calendar:** Keep 45 mins for your ${constraints.upcomingExams[0]?.title || 'college subjects'}.
3. **Keep it truthful:** Your ATS résumé will only claim what your Proof Locker can verify.

What specific task would you like to tackle in your next study block?`,
    containsCrisisHelp: false,
  };
}
