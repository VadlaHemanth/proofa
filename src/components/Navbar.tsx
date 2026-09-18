import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  FolderGit2,
  Award,
  FileText,
  ScanSearch,
  BookOpen,
  MessageSquareQuote,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { storage } from '../services/storage';

interface NavbarProps {
  onOpenCheckIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCheckIn }) => {
  const location = useLocation();
  const profile = storage.getProfile();
  const dpdp = storage.getDPDP();

  const navItems = [
    { path: '/', label: 'Today', icon: Compass },
    { path: '/proof-locker', label: 'Proof', icon: FolderGit2 },
    { path: '/readiness', label: 'Ready', icon: Award },
    { path: '/resume', label: 'Résumé', icon: FileText },
    { path: '/jd-match', label: 'JD Match', icon: ScanSearch },
    { path: '/companion', label: 'AI Chat', icon: MessageSquareQuote },
    { path: '/resources', label: 'Hub', icon: BookOpen },
    { path: '/privacy', label: 'Privacy', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-2 sm:top-3 z-40 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 h-16">
          {/* Brand Logo & Wedge Tagline */}
          <div className="flex items-center space-x-3 shrink-0 min-w-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-[14px] bg-[conic-gradient(from_210deg,#7dd3fc,#818cf8,#e879f9,#7dd3fc)] flex items-center justify-center text-white shadow-pop ring-1 ring-white/60 group-hover:scale-105 group-hover:rotate-3 transition-transform relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-black/10 pointer-events-none"></span>
                <span className="absolute inset-x-2 top-0.5 h-1/2 rounded-full bg-white/50 blur-[3px] pointer-events-none"></span>
                <ShieldCheck className="w-6 h-6 relative drop-shadow" />
              </div>
              <div>
                <span className="font-display font-bold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                  <span>Proof<span className="text-brand-600">a</span></span>
                  <span className="text-[10px] font-semibold tracking-wide bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded border border-brand-200 uppercase">
                    Passport
                  </span>
                </span>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block leading-none">
                  Private Growth & Verified Evidence
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links (desktop/tablet: scrollable strip, never overflows page) */}
          <nav className="hidden lg:flex flex-1 min-w-0 items-center gap-0.5 overflow-x-auto scrollbar-none px-2 text-xs font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-2 rounded-full transition-all ${
                    isActive
                      ? 'bg-gradient-to-b from-brand-400 to-brand-700 text-white font-semibold shadow-pop ring-1 ring-black/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* 60s Check-in Button */}
            <button
              onClick={onOpenCheckIn}
              className="shrink-0 relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-soft shadow-emerald-600/20 hover:shadow-md transition-all active:scale-95"
              title="Quick 60-second daily check-in"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200"></span>
              </span>
              <span className="whitespace-nowrap">60s Check-in</span>
            </button>

            {/* Recruiter Passport Link */}
            <Link
              to={`/passport/${dpdp.shareablePassportId || 'preview'}`}
              target="_blank"
              className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 whitespace-nowrap"
              title="View recruiter-facing passport link"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Recruiter View</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            {/* Student Persona Badge */}
            <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-slate-200 text-xs">
              <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center border border-brand-200">
                {profile.fullName.charAt(0)}
              </div>
              <div className="text-left leading-tight hidden 2xl:block">
                <p className="font-semibold text-slate-800">{profile.fullName}</p>
                <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                  JNTUH • {profile.currentSemester}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
