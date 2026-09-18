import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  FolderGit2,
  Globe,
  ExternalLink,
  Code2,
  Mail,
  Briefcase,
  FolderGit2 as GithubIcon,
  Filter,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { storage } from '../services/storage';

export const PublicPassportPage: React.FC = () => {
  const profile = storage.getProfile();
  const goal = storage.getGoal();
  const readiness = storage.getRoleReadiness();
  const allProofs = storage.getProofItems();
  const dpdp = storage.getDPDP();

  // Filter for recruiter shareable items only
  const shareableProofs = allProofs.filter((p) => p.shareableWithRecruiter && p.verificationStatus === 'verified');

  const [activeFilter, setActiveFilter] = useState<'all' | 'demo' | 'repo'>('all');

  const filteredProofs = shareableProofs.filter((p) => {
    if (activeFilter === 'demo') return p.type === 'deployed_demo';
    if (activeFilter === 'repo') return p.type === 'github_repo';
    return true;
  });

  if (!dpdp.recruiterSharingConsent) {
    return (
      <div className="max-w-2xl mx-auto my-16 bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-soft">
        <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Passport Sharing is Currently Paused</h2>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          The student has currently disabled external recruiter sharing under DPDP privacy controls. All academic proof and profiles remain strictly private.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 pt-4">
      {/* Recruiter Verified Header Card */}
      <div className="glass rounded-4xl p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-brand-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="mb-4 sm:mb-0 sm:absolute sm:top-0 sm:right-0 sm:p-6 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-700 border border-slate-500/25 shadow-soft">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Verified Student Growth Passport</span>
          </span>
        </div>

        <div className="space-y-4 max-w-2xl relative">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Candidate Profile • Hyderabad Tech Wedge
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
              {profile.fullName}
            </h1>
            <p className="text-sm text-slate-600 font-medium mt-1">
              {profile.degree} • {profile.collegeName} (Class of {profile.graduationYear})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="px-3 py-1 rounded-lg bg-white/85 border border-black/5 shadow-soft text-slate-800 font-semibold">
              Target Role: {goal.targetRole}
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/85 border border-black/5 shadow-soft text-slate-600">
              Location: {profile.city}, {profile.state} (Open to Hybrid / Remote)
            </span>
            {profile.cgpaPublic && (
              <span className="px-3 py-1 rounded-lg bg-white/85 border border-black/5 shadow-soft text-slate-800 font-semibold">
                CGPA: {profile.cgpa} / 10.0
              </span>
            )}
          </div>

          {/* Recruiter Contact Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-b from-brand-400 to-brand-600 text-white font-bold shadow-pop ring-1 ring-black/10 transition hover:brightness-105 active:scale-95"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Connect for Internship</span>
            </a>

            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white/85 border border-black/10 shadow-soft text-slate-700 hover:border-brand-300 hover:text-brand-700 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}

            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white/85 border border-black/10 shadow-soft text-slate-700 hover:border-brand-300 hover:text-brand-700 transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Role-Readiness Audit Glance for Hiring Managers */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-brand-600 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Demonstrated Role Readiness</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              {goal.targetRole} Benchmark: {readiness.readinessScore} / 10
            </h2>
            <p className="text-xs text-slate-500">
              Evaluated against objective engineering requirements, not arbitrary algorithms.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
              {readiness.criteria.filter((c) => c.status === 'met').length} of {readiness.criteria.length} Standards Met
            </span>
          </div>
        </div>

        {/* Criteria Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {readiness.criteria.map((c) => (
            <div
              key={c.id}
              className={`p-3 rounded-xl border ${
                c.status === 'met'
                  ? 'bg-slate-50/50 border-slate-200 text-slate-950'
                  : c.status === 'partial'
                  ? 'bg-slate-50/50 border-slate-200 text-slate-950'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between gap-2 font-bold mb-1">
                <span className="truncate min-w-0">{c.title}</span>
                {c.status === 'met' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                ) : (
                  <span className="text-[10px] uppercase font-bold text-slate-700">In Progress</span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2">{c.evidenceNote || c.requirementDescription}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Living Proof Grid (Recruiter Filterable) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Living Proof Artifacts ({filteredProofs.length})
            </h2>
            <p className="text-xs text-slate-500">
              Inspect source code repositories, live cloud deployments, and verified database schemas.
            </p>
          </div>

          {/* Proof Filters for Recruiters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Filter Proof:</span>
            {[
              { id: 'all', label: 'All Artifacts' },
              { id: 'demo', label: 'Has Live Demo' },
              { id: 'repo', label: 'GitHub Repos' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeFilter === f.id
                    ? 'bg-gradient-to-b from-brand-500 to-brand-700 text-white font-bold shadow-pop ring-1 ring-black/10'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProofs.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {item.type.replace('_', ' ')}
                  </span>
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    <CheckCircle2 className="w-3 h-3 text-slate-600" />
                    <span>Verified</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                {item.verificationDetails?.notes && (
                  <div className="text-[10px] bg-slate-50 text-slate-700 p-2 rounded-lg font-mono border border-slate-200">
                    {item.verificationDetails.notes}
                  </div>
                )}

                <div className="flex flex-wrap gap-1 pt-1">
                  {item.skillsTagged.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-medium bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-100"
                    >
                      #{s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400">
                  Added {item.dateAdded}
                </span>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 font-bold text-brand-600 hover:text-brand-700"
                  >
                    <span>Inspect Artifact</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
