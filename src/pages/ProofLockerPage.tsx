import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Filter,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code2,
  Globe,
  Award,
  UserCheck,
} from 'lucide-react';
import { storage } from '../services/storage';
import { verifyProofItem } from '../services/proofVerification';
import { ProofItemCard } from '../components/ProofItemCard';
import { ProofItem, ProofType } from '../types';

export const ProofLockerPage: React.FC = () => {
  const [proofItems, setProofItems] = useState<ProofItem[]>(storage.getProofItems());
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddingProof, setIsAddingProof] = useState<boolean>(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ProofType>('github_repo');
  const [url, setUrl] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [mentorDesignation, setMentorDesignation] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  const refreshList = () => {
    setProofItems(storage.getProofItems());
  };

  const handleToggleShare = (id: string, shareable: boolean) => {
    const items = storage.getProofItems().map((p) => (p.id === id ? { ...p, shareableWithRecruiter: shareable } : p));
    // update in storage
    const target = items.find((p) => p.id === id);
    if (target) {
      storage.deleteProofItem(id);
      storage.addProofItem(target);
      refreshList();
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this proof item from your Proof Locker?')) {
      storage.deleteProofItem(id);
      refreshList();
    }
  };

  const handleAddProofSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationFeedback('Running automated verification engine...');

    try {
      const result = await verifyProofItem(type, url, codeSnippet, mentorName, mentorDesignation);

      const parsedSkills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const mergedSkills = Array.from(new Set([...parsedSkills, ...result.detectedSkills]));

      const newProof: ProofItem = {
        id: `proof_${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        type,
        url: url.trim() || undefined,
        codeSnippet: codeSnippet.trim() || undefined,
        skillsTagged: mergedSkills.length > 0 ? mergedSkills : ['Software Engineering'],
        dateAdded: new Date().toISOString().split('T')[0],
        verificationStatus: result.status,
        verificationDetails: result.details,
        shareableWithRecruiter: true,
      };

      storage.addProofItem(newProof);
      setVerificationFeedback(result.details.notes);

      setTimeout(() => {
        setIsVerifying(false);
        setIsAddingProof(false);
        // Reset form
        setTitle('');
        setDescription('');
        setUrl('');
        setCodeSnippet('');
        setSkillsInput('');
        setVerificationFeedback(null);
        refreshList();
      }, 1000);
    } catch (err) {
      setIsVerifying(false);
      setVerificationFeedback('Verification failed. Please check your URL or connection.');
    }
  };

  const filteredItems = proofItems.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const verifiedCount = proofItems.filter((p) => p.verificationStatus === 'verified').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Living Evidence Locker • DPDP Consent Protected</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Proof Locker
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Store verifiable proof of your work: public GitHub repositories, deployed cloud URLs, SQL schemas, and mentor attestations. Your truthful ATS résumé and role-readiness scores are grounded directly in these items.
          </p>
        </div>

        <button
          onClick={() => setIsAddingProof(true)}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 active:scale-95 transition-all self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Proof</span>
        </button>
      </div>

      {/* Filter and Count Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mr-1 shrink-0">
            Filter:
          </span>
          {[
            { id: 'all', label: `All Proof (${proofItems.length})` },
            { id: 'github_repo', label: 'GitHub Repos' },
            { id: 'deployed_demo', label: 'Live Demos' },
            { id: 'code_snippet', label: 'Code & Schemas' },
            { id: 'certificate', label: 'Certifications' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-600 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            <strong className="text-slate-900">{verifiedCount}</strong> of {proofItems.length} items verified
          </span>
        </div>
      </div>

      {/* Proof Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <ProofItemCard
            key={item.id}
            item={item}
            onToggleShare={handleToggleShare}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Add Proof Modal */}
      {isAddingProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Verifiable Proof</h3>
                  <p className="text-xs text-slate-500">Every proof item is verified automatically.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddingProof(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProofSubmit} className="mt-4 space-y-4 text-xs">
              {/* Type selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Proof Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'github_repo', label: 'GitHub Repository', icon: FolderGit2 },
                    { id: 'deployed_demo', label: 'Live Deployed URL', icon: Globe },
                    { id: 'code_snippet', label: 'Code / SQL Schema', icon: Code2 },
                    { id: 'certificate', label: 'Skill Certificate', icon: Award },
                    { id: 'mentor_note', label: 'Mentor Attestation', icon: UserCheck },
                  ].map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setType(t.id as ProofType)}
                        className={`flex items-center space-x-1.5 p-2 rounded-lg border text-left font-medium ${
                          type === t.id
                            ? 'bg-brand-50 border-brand-300 text-brand-700 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. FastAPI Task Tracker Service"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe what this demonstrates (architecture, testing, normalization, etc.)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none"
                />
              </div>

              {/* Conditional Inputs based on Type */}
              {type !== 'code_snippet' && type !== 'mentor_note' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {type === 'github_repo' ? 'GitHub Repository URL' : 'Live / Verification URL'}
                  </label>
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={
                      type === 'github_repo'
                        ? 'https://github.com/username/repo'
                        : 'https://your-project.onrender.com'
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none font-mono text-[11px]"
                  />
                </div>
              )}

              {type === 'code_snippet' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Code or SQL Snippet</label>
                  <textarea
                    rows={4}
                    required
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    placeholder="Paste your DDL, schema, or core algorithmic implementation..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none font-mono text-[11px]"
                  />
                </div>
              )}

              {type === 'mentor_note' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mentor Name</label>
                    <input
                      type="text"
                      required
                      value={mentorName}
                      onChange={(e) => setMentorName(e.target.value)}
                      placeholder="e.g. Dr. K. Srinivas"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      value={mentorDesignation}
                      onChange={(e) => setMentorDesignation(e.target.value)}
                      placeholder="e.g. Associate Prof, JNTUH"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Skills Tagged */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Skills Tagged (comma separated)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g. Python, FastAPI, PostgreSQL, Docker"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none"
                />
              </div>

              {verificationFeedback && (
                <div className="p-3 bg-brand-50 text-brand-900 rounded-lg border border-brand-200 flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                  <p className="text-[11px] leading-relaxed font-mono">{verificationFeedback}</p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingProof(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-white bg-brand-600 hover:bg-brand-700 rounded-lg font-bold shadow-sm active:scale-95 transition-all disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isVerifying ? 'Verifying Source...' : 'Verify & Add to Locker'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
