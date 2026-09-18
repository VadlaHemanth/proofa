import React, { useState } from 'react';
import {
  ScanSearch,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Send,
  Copy,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { storage } from '../services/storage';
import { sampleJobDescriptions } from '../services/seedData';
import { analyzeJobDescription } from '../services/jdMatcher';
import { JdMatchReport } from '../types';

export const JdMatchPage: React.FC = () => {
  const proofItems = storage.getProofItems();
  const skills = storage.getSkills();

  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);
  const [jobTitle, setJobTitle] = useState<string>(sampleJobDescriptions[0].title);
  const [companyName, setCompanyName] = useState<string>(sampleJobDescriptions[0].company);
  const [jdText, setJdText] = useState<string>(sampleJobDescriptions[0].rawText);
  const [matchReport, setMatchReport] = useState<JdMatchReport | null>(() =>
    analyzeJobDescription(sampleJobDescriptions[0].rawText, sampleJobDescriptions[0].title, sampleJobDescriptions[0].company, proofItems, skills)
  );
  const [copiedAppText, setCopiedAppText] = useState<boolean>(false);

  const handleSelectSample = (index: number) => {
    setSelectedSampleIndex(index);
    const sample = sampleJobDescriptions[index];
    setJobTitle(sample.title);
    setCompanyName(sample.company);
    setJdText(sample.rawText);
    const report = analyzeJobDescription(sample.rawText, sample.title, sample.company, proofItems, skills);
    setMatchReport(report);
  };

  const handleAnalyzeCustomJd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim()) return;
    const report = analyzeJobDescription(jdText, jobTitle || 'Target Role', companyName || 'Target Company', proofItems, skills);
    setMatchReport(report);
  };

  const handleCopyApplicationPitch = () => {
    if (!matchReport) return;
    const pitch = `Dear ${matchReport.companyName} Hiring Team,

I am applying for the ${matchReport.jobTitle} position. Rather than just listing skills on paper, I would like to highlight demonstrated proof of my work:

• Python & FastAPI: Built and documented an asynchronous campus task service with 24 commits and Pytest test coverage.
• PostgreSQL: Designed normalized 3NF database schemas and optimized index queries (HackerRank intermediate SQL certified).
• Live Deployment: Live Swagger API deployed on Render at https://campus-task-tracker.onrender.com/docs.

I have completed a thorough role-alignment review (${matchReport.overallMatchPercentage}% match based on verified work). I would love the opportunity to discuss how I can contribute to your engineering goals.

Best regards,
${storage.getProfile().fullName}
${storage.getProfile().githubUrl}
    `.trim();

    navigator.clipboard.writeText(pitch);
    setCopiedAppText(true);
    setTimeout(() => setCopiedAppText(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            <ScanSearch className="w-4 h-4 text-brand-600" />
            <span>Honest JD Gap Analyzer • Proof-Matched Requirements</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Job Description Match & Gap Plan
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Paste any job description or select curated Hyderabad openings. Proofa compares requirements against your <strong>stored proof</strong>—not just self-claims—and generates a 7-day sprint plan to close remaining gaps.
          </p>
        </div>

        {/* Agency Over Automation Pill */}
        <div className="glass rounded-2xl p-4 max-w-xs text-xs space-y-1 self-start sm:self-center shrink-0">
          <div className="flex items-center gap-1.5 font-bold text-amber-600">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Agency Over Automation</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            We never auto-apply with spam bots. High match means you are ready to review and submit yourself.
          </p>
        </div>
      </div>

      {/* Input Section: Curated Samples or Custom Paste */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900">
            Choose a Curated Opening or Paste Any Internship JD
          </h2>

          {/* Sample quick buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold text-[10px] uppercase">Curated:</span>
            {sampleJobDescriptions.map((sample, idx) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(idx)}
                className={`max-w-full px-3 py-1.5 rounded-lg border transition-colors text-left leading-snug break-words ${
                  selectedSampleIndex === idx
                    ? 'bg-brand-50 border-brand-300 text-brand-700 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sample.company.split(' ')[0]} ({sample.stipend})
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleAnalyzeCustomJd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Backend Developer Intern"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none font-medium text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company / Team</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Hyderabad SaaS Startup"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              Job Description Text
            </label>
            <textarea
              rows={5}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job requirements from LinkedIn, Internshala, Unstop, or company careers page..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-brand-500 outline-none font-mono text-xs text-slate-800 leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 transition-all shadow-soft"
          >
            <ScanSearch className="w-4 h-4" />
            <span>Analyze Match Against My Proof Locker</span>
          </button>
        </form>
      </div>

      {/* Match Report Output */}
      {matchReport && (
        <div className="space-y-6">
          {/* Top Verdict Row */}
          <div className="glass rounded-4xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex max-w-full items-center gap-x-2 bg-brand-50/80 text-brand-700 text-xs px-3 py-1 rounded-full border border-brand-200/70 shadow-soft">
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-brand-500" />
                <span className="break-words">Proof Alignment Audit: {matchReport.jobTitle}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">{matchReport.companyName}</h2>
              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                Verdict: <strong className="text-emerald-600">{matchReport.readinessVerdict}</strong>. We matched required skills directly against your verified repository commits, schemas, and live URLs.
              </p>
            </div>

            <div className="text-left md:text-right shrink-0 border-t md:border-t-0 md:border-l border-black/5 pt-4 md:pt-0 md:pl-6">
              <span className="text-xs text-slate-500">Demonstrated Alignment</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-5xl font-black text-emerald-600">
                  {matchReport.overallMatchPercentage}%
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                {matchReport.matchedSkills.length} of{' '}
                {matchReport.matchedSkills.length + matchReport.missingSkills.length} skills proven
              </span>
            </div>
          </div>

          {/* 2-Column: Matched vs Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Skills with Proof */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Demonstrated with Stored Proof</span>
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {matchReport.matchedSkills.length} Ready
                </span>
              </div>

              <div className="space-y-3">
                {matchReport.matchedSkills.map((m, idx) => (
                  <div key={idx} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-emerald-950">{m.skillName}</h4>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        PROOF LINKED
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{m.proofSummary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills with Action */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span>Gaps to Close Before Applying</span>
                </h3>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {matchReport.missingSkills.length} Missing
                </span>
              </div>

              <div className="space-y-3">
                {matchReport.missingSkills.map((m, idx) => (
                  <div key={idx} className="p-3 bg-amber-50/40 rounded-xl border border-amber-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-amber-950">{m.skillName}</h4>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        m.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {m.severity === 'critical' ? 'Critical Gap' : 'Nice to Have'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{m.learningAction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 7-Day Targeted Gap Closure Sprint Plan */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-600" />
                <span>7-Day Targeted Sprint Plan for This Role</span>
              </h3>
              <p className="text-xs text-slate-500">
                Follow this sequence to transform remaining gaps into verifiable artifacts within 7 days.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {matchReport.sevenDayGapPlan.map((step) => (
                <div key={step.day} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      Day {step.day}
                    </span>
                    <span className="text-[10px] text-slate-400">Deliverable:</span>
                  </div>
                  <p className="font-semibold text-slate-800 text-[11px] leading-snug">{step.action}</p>
                  <p className="text-[10px] font-mono text-slate-500 bg-white p-1.5 rounded border border-slate-200">
                    {step.deliverableProof}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Ethical Application Pitch Copy & Review */}
          <div className="glass rounded-4xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ready-to-Review Truthful Application Pitch</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Review the pitch below, customize personal details, and submit directly through the company's official portal.
                </p>
              </div>

              <button
                onClick={handleCopyApplicationPitch}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-white border border-black/10 shadow-soft hover:border-brand-300 hover:text-brand-700 transition-colors shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedAppText ? 'Copied Pitch!' : 'Copy Application Text'}</span>
              </button>
            </div>

            {/* Checklist items */}
            <div className="space-y-2 pt-2 text-xs">
              {matchReport.applicationChecklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.done ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <span className={item.done ? 'text-slate-800 font-medium' : 'text-slate-500'}>
                    {item.item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
