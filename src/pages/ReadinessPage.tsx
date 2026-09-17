import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  FolderGit2,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { storage } from '../services/storage';
import { RoleReadiness, RoleBenchmarkCriterion } from '../types';

export const ReadinessPage: React.FC = () => {
  const [readiness, setReadiness] = useState<RoleReadiness>(storage.getRoleReadiness());
  const [targetRole, setTargetRole] = useState<string>(storage.getGoal().targetRole);
  const proofItems = storage.getProofItems();

  const handleRoleChange = (role: string) => {
    setTargetRole(role);
    const goal = storage.getGoal();
    storage.updateGoal({ ...goal, targetRole: role });
    setReadiness(storage.recalculateReadiness());
  };

  const getStatusBadge = (status: RoleBenchmarkCriterion['status']) => {
    switch (status) {
      case 'met':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Demonstrated</span>
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>In Progress</span>
          </span>
        );
      case 'missing':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Missing Proof</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            <Award className="w-4 h-4 text-brand-600" />
            <span>Explainable Benchmark Engine • No Arbitrary Hidden Scores</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Role-Readiness Audit
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Proofa rejects black-box scores. Your readiness is an explainable checklist evaluated strictly against what real recruiters seek for this role family.
          </p>
        </div>

        {/* Target Role Selector */}
        <div className="shrink-0 space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Target Role Family:
          </label>
          <select
            value={targetRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:border-brand-500 outline-none cursor-pointer"
          >
            <option value="Backend Developer Intern">Backend Developer Intern</option>
            <option value="Full-Stack Developer Intern">Full-Stack Developer Intern</option>
            <option value="Frontend Developer Intern">Frontend Developer Intern</option>
            <option value="Data Engineering Intern">Data Engineering Intern</option>
          </select>
        </div>
      </div>

      {/* Big Score & Next Best Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Internship Readiness
              </span>
              <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Transparent Formula
              </span>
            </div>

            <div className="mt-4 flex items-baseline space-x-2">
              <span className="text-6xl font-black text-white">{readiness.readinessScore}</span>
              <span className="text-2xl text-slate-400 font-medium">/ 10</span>
            </div>

            <div className="w-full bg-slate-700/60 h-3 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${readiness.readinessScore * 10}%` }}
              ></div>
            </div>
          </div>

          <div className="text-xs text-slate-300 space-y-1 pt-4 border-t border-slate-700/60">
            <div className="flex justify-between">
              <span>Demonstrated Criteria:</span>
              <span className="font-bold text-emerald-400">
                {readiness.criteria.filter((c) => c.status === 'met').length} of {readiness.criteria.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Gap Closure:</span>
              <span className="font-bold text-white">
                ~{readiness.recommendedGapClosureTimeWeeks} weeks of proof work
              </span>
            </div>
          </div>
        </div>

        {/* Next Best Action Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-brand-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Highest-Yield Next Step</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 leading-snug">
              {readiness.nextBestAction}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Adding verified proof for this missing criterion will push your role readiness above 7.5, unlocking higher recruiter shortlist confidence.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <Link
              to="/proof-locker"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-sm"
            >
              <FolderGit2 className="w-4 h-4 shrink-0" />
              <span>Add Proof to Fulfill Criterion</span>
            </Link>

            <Link
              to="/resources"
              className="text-xs font-semibold text-slate-600 hover:text-brand-600 flex items-center gap-1"
            >
              <span>View Free Learning Guides</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>
        </div>
      </div>

      {/* Detailed Benchmark Checklist (Explainable Breakdown) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            6 Core Benchmarks for {targetRole}
          </h2>
          <p className="text-xs text-slate-500">
            Every item corresponds to an explicit evaluation metric used by engineering hiring teams.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {readiness.criteria.map((crit, idx) => {
            const linkedProof = crit.evidenceProofId
              ? proofItems.find((p) => p.id === crit.evidenceProofId)
              : null;

            return (
              <div key={crit.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{crit.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{crit.requirementDescription}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Weight: {crit.weight}x
                    </span>
                    {getStatusBadge(crit.status)}
                  </div>
                </div>

                {/* Evidence Note */}
                <div className="ml-0 sm:ml-9 text-xs bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col min-[420px]:flex-row min-[420px]:items-start items-stretch justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Evidence Grounding:
                    </span>
                    <p className="text-slate-700 font-mono text-[11px]">{crit.evidenceNote}</p>
                  </div>

                  {linkedProof && (
                    <Link
                      to="/proof-locker"
                      className="shrink-0 text-[11px] font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center space-x-1"
                    >
                      <span>View in Locker</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
