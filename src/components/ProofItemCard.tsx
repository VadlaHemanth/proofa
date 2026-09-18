import React, { useState } from 'react';
import {
  FolderGit2,
  Globe,
  Code2,
  Award,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { ProofItem } from '../types';

interface ProofItemCardProps {
  item: ProofItem;
  onToggleShare: (id: string, shareable: boolean) => void;
  onDelete: (id: string) => void;
}

export const ProofItemCard: React.FC<ProofItemCardProps> = ({ item, onToggleShare, onDelete }) => {
  const [showCode, setShowCode] = useState(false);

  const getIcon = () => {
    switch (item.type) {
      case 'github_repo':
        return <FolderGit2 className="w-5 h-5 text-slate-600" />;
      case 'deployed_demo':
        return <Globe className="w-5 h-5 text-slate-600" />;
      case 'code_snippet':
        return <Code2 className="w-5 h-5 text-slate-600" />;
      case 'certificate':
        return <Award className="w-5 h-5 text-slate-600" />;
      case 'mentor_note':
        return <UserCheck className="w-5 h-5 text-slate-600" />;
      default:
        return <FolderGit2 className="w-5 h-5 text-slate-600" />;
    }
  };

  const getBadgeLabel = () => {
    switch (item.type) {
      case 'github_repo':
        return 'GitHub Repo';
      case 'deployed_demo':
        return 'Live Cloud Demo';
      case 'code_snippet':
        return 'Code DDL / Schema';
      case 'certificate':
        return 'Verified Certificate';
      case 'mentor_note':
        return 'Mentor Attestation';
      default:
        return 'Proof Artifact';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-soft hover:shadow-md transition-all p-4 flex flex-col justify-between group">
      <div>
        {/* Top bar: Type + Verification status */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-200/60 transition-colors">
              {getIcon()}
            </div>
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              {getBadgeLabel()}
            </span>
          </div>

          {/* Verification Badge */}
          {item.verificationStatus === 'verified' ? (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Verified Proof</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200">
              <span>Unverified</span>
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors flex items-center gap-1.5">
          {item.title}
        </h3>
        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Verification details pill */}
        {item.verificationDetails?.notes && (
          <div className="mt-2 text-[11px] bg-slate-50 text-slate-600 p-2 rounded-lg border border-slate-200 font-mono leading-tight">
            {item.verificationDetails.notes}
          </div>
        )}

        {/* Code Snippet expand toggle if present */}
        {item.codeSnippet && (
          <div className="mt-2">
            <button
              onClick={() => setShowCode(!showCode)}
              className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center space-x-1"
            >
              <span>{showCode ? 'Hide Code' : 'View Code Snippet'}</span>
            </button>
            {showCode && (
              <pre className="mt-1 p-2 bg-slate-900 text-slate-100 rounded-lg text-[10px] overflow-x-auto font-mono">
                {item.codeSnippet}
              </pre>
            )}
          </div>
        )}

        {/* Skills Tagged */}
        <div className="flex flex-wrap gap-1 mt-3">
          {item.skillsTagged.map((skill) => (
            <span
              key={skill}
              className="text-[10px] font-medium bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-100"
            >
              #{skill}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Footer: External link, Recruiter Share toggle, Delete */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-slate-600 hover:text-brand-600 font-medium transition-colors"
            >
              <span>Inspect Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Recruiter Visibility Toggle */}
          <button
            onClick={() => onToggleShare(item.id, !item.shareableWithRecruiter)}
            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
              item.shareableWithRecruiter
                ? 'bg-brand-50 text-brand-700 border border-brand-200'
                : 'bg-slate-100 text-slate-400 border border-slate-200 line-through'
            }`}
            title={item.shareableWithRecruiter ? 'Shared on recruiter passport' : 'Hidden from recruiters'}
          >
            {item.shareableWithRecruiter ? (
              <>
                <Eye className="w-3 h-3 text-brand-600" />
                <span>Recruiter View ON</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3" />
                <span>Private</span>
              </>
            )}
          </button>

          {/* Delete action */}
          <button
            onClick={() => onDelete(item.id)}
            className="text-slate-300 hover:text-slate-500 p-1 rounded transition-colors"
            title="Remove proof item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
