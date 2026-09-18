import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Eye,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { storage } from '../services/storage';
import { DPDPPreferences } from '../types';

export const PrivacyCenterPage: React.FC = () => {
  const [dpdp, setDpdp] = useState<DPDPPreferences>(storage.getDPDP());
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleToggle = (key: keyof DPDPPreferences) => {
    const updated = {
      ...dpdp,
      [key]: !dpdp[key],
      consentTimestamp: new Date().toISOString(),
    };
    setDpdp(updated);
    storage.updateDPDP(updated);
    setSavedFeedback('Privacy consent preferences updated.');
    setTimeout(() => setSavedFeedback(null), 2500);
  };

  const handleExportData = () => {
    const jsonString = storage.exportFullDataJSON();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Proofa-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePurgeAllData = () => {
    if (
      window.confirm(
        'DPDP Right to Erasure: Are you sure you want to permanently delete all your data, chats, plans, and proof from this device? This action cannot be undone.'
      )
    ) {
      storage.purgeAllData();
      alert('All personal data has been completely erased. Reloading page...');
      window.location.reload();
    }
  };

  const handleResetToSeed = () => {
    if (window.confirm('Reset all demo data back to the default Rahul Sharma / JNTUH seed state?')) {
      storage.resetToSeedData();
      alert('Reset to default seed state! Reloading...');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>India DPDP Act 2023 & DPDP Rules 2025 Compliant</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Privacy & Data Governance Center
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Proofa treats your privacy as a foundational architectural boundary. Your private chats, timetable, exam anxieties, and family constraints are completely isolated. You control purpose-specific consents with 1-click withdrawal.
        </p>
      </div>

      {savedFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{savedFeedback}</span>
        </div>
      )}

      {/* Purpose-Specific Consent Toggles */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Purpose-Specific Consent Controls
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            As required by DPDP Rules, consent is unbundled. You may toggle individual data processing purposes anytime.
          </p>
        </div>

        <div className="divide-y divide-slate-100 space-y-4 text-xs">
          {/* 1. Planning Data Consent */}
          <div className="pt-4 first:pt-0 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">
                1. Academic Planning & Timetable Processing
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Allows Proofa's private algorithm to schedule daily study blocks around your university exam dates. Never shared with recruiters or colleges.
              </p>
              <span className="inline-block text-[10px] text-slate-400 font-mono">
                Purpose: Academic scheduling & daily check-in
              </span>
            </div>

            <button
              onClick={() => handleToggle('planningDataProcessingConsent')}
              className={`shrink-0 w-11 h-6 rounded-full transition-colors relative ${
                dpdp.planningDataProcessingConsent ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  dpdp.planningDataProcessingConsent ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 2. GitHub Public Sync Consent */}
          <div className="pt-4 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">
                2. GitHub Public Metadata Verification
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Permits reading public repository commit counts, programming language distribution, and README documentation via official GitHub API to verify proof items.
              </p>
              <span className="inline-block text-[10px] text-slate-400 font-mono">
                Purpose: Automated proof verification (read-only)
              </span>
            </div>

            <button
              onClick={() => handleToggle('githubSyncConsent')}
              className={`shrink-0 w-11 h-6 rounded-full transition-colors relative ${
                dpdp.githubSyncConsent ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  dpdp.githubSyncConsent ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 3. Recruiter Passport Sharing Consent */}
          <div className="pt-4 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">
                3. Recruiter Proof Passport Visibility
              </h4>
              <p className="text-slate-600 leading-relaxed">
                When enabled, verified projects, skills, and role-readiness scores are visible to verified recruiters via your shareable link. Private chats and timetable are strictly excluded.
              </p>
              <span className="inline-block text-[10px] text-slate-400 font-mono">
                Purpose: Verified internship discovery
              </span>
            </div>

            <button
              onClick={() => handleToggle('recruiterSharingConsent')}
              className={`shrink-0 w-11 h-6 rounded-full transition-colors relative ${
                dpdp.recruiterSharingConsent ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  dpdp.recruiterSharingConsent ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 4. Strict Isolation Guarantee */}
          <div className="pt-4 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">
                4. Cross-Student Isolation & Zero Training Leakage
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Guarantees that your questions, reflections, and timetable are never used as training context for another student's session.
              </p>
              <span className="inline-block text-[10px] text-emerald-600 font-bold">
                Always active by architectural constraint
              </span>
            </div>

            <span className="shrink-0 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold">
              LOCKED ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* DPDP Data Rights: Portability & Erasure */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Export Data */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Right to Data Portability
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Download a complete JSON export of all your academic goals, verified proof items, weekly plans, and truthful résumé records.
            </p>
          </div>

          <button
            onClick={handleExportData}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2"
          >
            <FileCode className="w-4 h-4" />
            <span>{downloadSuccess ? 'JSON Export Downloaded!' : 'Download All My Data (JSON)'}</span>
          </button>
        </div>

        {/* Right to Erasure */}
        <div className="bg-white rounded-3xl border border-rose-200 p-6 shadow-soft flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Right to Erasure (Forget Me)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Permanently purge all stored profiles, chats, verified proof items, and plans from this device immediately.
            </p>
          </div>

          <button
            onClick={handlePurgeAllData}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center space-x-2"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Permanently Delete All Data</span>
          </button>
        </div>
      </div>

      {/* Seed Reset Helper for Demo Evaluation */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="text-slate-600">
          <p className="font-bold text-slate-800">Testing & Prototype Demo State</p>
          <p>Reset the application back to the standard Rahul Sharma / JNTUH 3rd Year Persona.</p>
        </div>
        <button
          onClick={handleResetToSeed}
          className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold transition-colors flex items-center space-x-1.5 self-start sm:self-center shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset to Default Persona</span>
        </button>
      </div>
    </div>
  );
};
