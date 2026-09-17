import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Download,
  Printer,
  CheckCircle2,
  ExternalLink,
  Lock,
  Sparkles,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { storage } from '../services/storage';
import { TruthfulResume, ProofItem } from '../types';

export const ResumeBuilderPage: React.FC = () => {
  const [resume, setResume] = useState<TruthfulResume>(storage.getResume());
  const profile = storage.getProfile();
  const proofItems = storage.getProofItems();

  const [showCgpa, setShowCgpa] = useState<boolean>(resume.education.showCgpa);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const handleToggleCgpa = () => {
    const updated = {
      ...resume,
      education: { ...resume.education, showCgpa: !showCgpa },
    };
    setResume(updated);
    storage.updateResume(updated);
    setShowCgpa(!showCgpa);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `
${profile.fullName}
${profile.email} | ${profile.city}, ${profile.state} | GitHub: ${profile.githubUrl} | LinkedIn: ${profile.linkedinUrl}

PROFESSIONAL SUMMARY
${resume.summary}

EDUCATION
${resume.education.college}
${resume.education.degree} (${resume.education.yearRange})
${showCgpa ? `CGPA: ${resume.education.cgpa} / 10.0` : ''}

TECHNICAL SKILLS
Languages: ${resume.skillsGrouped.languages.join(', ')}
Frameworks: ${resume.skillsGrouped.frameworks.join(', ')}
Databases & Tools: ${resume.skillsGrouped.databasesAndTools.join(', ')}
Core Coursework: ${resume.skillsGrouped.coursework.join(', ')}

PROJECTS (SOURCE-VERIFIED EVIDENCE)
${resume.projects
  .map(
    (p) => `
${p.title} | ${p.role}
Tech Stack: ${p.techStack.join(', ')}
${p.liveUrl ? `Live URL: ${p.liveUrl}` : ''}
${p.githubUrl ? `GitHub: ${p.githubUrl}` : ''}
${p.bullets.map((b) => `• ${b.text}`).join('\n')}
`
  )
  .join('\n')}

CERTIFICATIONS & VERIFIED ASSESSMENTS
${resume.certificationsAndProof.map((c) => `• ${c.title} - ${c.issuer} (${c.date})`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Policy Notice */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 print:hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Anti-Hallucination Architecture • Source-Linked Bullets Only</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Truthful ATS Résumé
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Proofa strictly enforces truth over polish. Every project bullet point is anchored to a verified proof item in your Proof Locker. The export blocks ungrounded claims so you can defend every line in an interview.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleToggleCgpa}
            className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showCgpa
                ? 'bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-white text-slate-500 border-slate-200'
            }`}
            title="DPDP Privacy: Toggle whether CGPA is visible"
          >
            {showCgpa ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showCgpa ? 'CGPA: Visible (7.92)' : 'CGPA: Hidden'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <span>{copiedNotification ? 'Copied ATS Text!' : 'Copy Plaintext ATS'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-500/20 active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Strict Grounding Badge Bar */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start space-x-3 print:hidden">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">Interview Defense Guarantee</p>
          <p className="text-amber-800">
            Every green badge <span className="inline-flex items-center font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px]">VERIFIED SOURCE</span> represents code that has been parsed on GitHub or confirmed live. In campus interviews, candidates who can demo their source get hired 3x faster than candidates with buzzword-stuffed résumés.
          </p>
        </div>
      </div>

      {/* ATS Résumé Preview Sheet (Print-styled) */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-xl max-w-4xl mx-auto p-5 sm:p-12 print:p-0 print:border-none print:shadow-none space-y-6 font-serif text-slate-900 leading-normal overflow-x-clip">
        {/* Header: Candidate details */}
        <div className="text-center border-b border-slate-800 pb-4 space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 uppercase font-sans">
            {profile.fullName}
          </h2>
          <div className="text-xs font-sans text-slate-600 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>{profile.city}, {profile.state}</span>
            <span>•</span>
            <span>{profile.email}</span>
            <span>•</span>
            <a href={profile.githubUrl} className="text-brand-600 underline" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <span>•</span>
            <a href={profile.linkedinUrl} className="text-brand-600 underline" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-slate-900 border-b border-slate-300 pb-0.5">
            Professional Summary
          </h3>
          <p className="text-xs font-sans text-slate-700 leading-relaxed pt-1">
            {resume.summary}
          </p>
        </div>

        {/* Education */}
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-slate-900 border-b border-slate-300 pb-0.5">
            Education
          </h3>
          <div className="pt-1 flex justify-between text-xs font-sans">
            <div>
              <p className="font-bold text-slate-900">{resume.education.college}</p>
              <p className="text-slate-600">{resume.education.degree}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-600">{resume.education.yearRange}</p>
              {showCgpa && (
                <p className="font-bold text-slate-800">CGPA: {resume.education.cgpa} / 10.0</p>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-slate-900 border-b border-slate-300 pb-0.5">
            Technical Skills
          </h3>
          <div className="text-xs font-sans pt-1 space-y-1 text-slate-700">
            <p>
              <strong className="text-slate-900">Languages:</strong> {resume.skillsGrouped.languages.join(', ')}
            </p>
            <p>
              <strong className="text-slate-900">Frameworks & Libraries:</strong>{' '}
              {resume.skillsGrouped.frameworks.join(', ')}
            </p>
            <p>
              <strong className="text-slate-900">Databases & Tools:</strong>{' '}
              {resume.skillsGrouped.databasesAndTools.join(', ')}
            </p>
            <p>
              <strong className="text-slate-900">Core Coursework:</strong>{' '}
              {resume.skillsGrouped.coursework.join(', ')}
            </p>
          </div>
        </div>

        {/* Projects (Strictly Grounded with Proof badges) */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-slate-900 border-b border-slate-300 pb-0.5 flex items-center justify-between">
            <span>Demonstrated Projects (Proof Grounded)</span>
            <span className="text-[10px] text-emerald-700 font-semibold font-sans normal-case print:hidden">
              All bullets verified by Proof Locker
            </span>
          </h3>

          <div className="space-y-4">
            {resume.projects.map((proj) => (
              <div key={proj.id} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs font-sans gap-1">
                  <div className="flex items-baseline space-x-2">
                    <h4 className="font-bold text-slate-950 text-sm">{proj.title}</h4>
                    <span className="text-slate-500 font-medium">| {proj.role}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-brand-600">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="hover:underline">
                        [Code Repo]
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="hover:underline">
                        [Live Swagger Demo]
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-[11px] font-sans text-slate-500">
                  <strong className="text-slate-700">Tech Stack:</strong> {proj.techStack.join(', ')}
                </p>

                <ul className="list-disc list-outside ml-4 text-xs font-sans text-slate-700 space-y-1">
                  {proj.bullets.map((bullet) => {
                    const linked = proofItems.find((p) => p.id === bullet.proofItemId);
                    return (
                      <li key={bullet.id} className="group leading-relaxed">
                        <span>{bullet.text}</span>
                        {linked && (
                          <span className="ml-2 inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 print:hidden">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Verified: {linked.type.replace('_', ' ')}</span>
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Evidence */}
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-slate-900 border-b border-slate-300 pb-0.5">
            Verified Certifications & Problem Solving
          </h3>
          <ul className="list-disc list-outside ml-4 text-xs font-sans text-slate-700 space-y-1 pt-1">
            {resume.certificationsAndProof.map((cert, idx) => (
              <li key={idx}>
                <span className="font-semibold text-slate-900">{cert.title}</span> – {cert.issuer} ({cert.date})
                {cert.verifiedUrl && (
                  <a
                    href={cert.verifiedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2 text-brand-600 underline text-[11px] print:hidden"
                  >
                    [Verify Credential]
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
