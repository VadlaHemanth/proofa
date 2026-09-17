import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import {
  Compass,
  FolderGit2,
  FileText,
  ScanSearch,
  MessageSquareQuote,
  Menu,
  X,
  Award,
  BookOpen,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { DailyCheckInModal } from './components/DailyCheckInModal';
import { DashboardPage } from './pages/DashboardPage';
import { ProofLockerPage } from './pages/ProofLockerPage';
import { ReadinessPage } from './pages/ReadinessPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { JdMatchPage } from './pages/JdMatchPage';
import { AiCompanionPage } from './pages/AiCompanionPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { PrivacyCenterPage } from './pages/PrivacyCenterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { PublicPassportPage } from './pages/PublicPassportPage';

const AppContent: React.FC = () => {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();

  const isPublicPassport = location.pathname.startsWith('/passport');

  const moreLinks = [
    { path: '/readiness', label: 'Role Readiness', desc: 'Explainable 6-point audit', icon: Award },
    { path: '/resources', label: 'Curated Hub', desc: 'Free verified guides', icon: BookOpen },
    { path: '/privacy', label: 'DPDP Privacy', desc: 'Consents, export & delete', icon: ShieldCheck },
    { path: '/onboarding', label: 'Setup Passport', desc: '3-step plan generator', icon: UserPlus },
  ];

  const isMoreActive = moreLinks.some((l) => location.pathname === l.path);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {!isPublicPassport && (
        <Navbar onOpenCheckIn={() => setIsCheckInOpen(true)} />
      )}

      <main className="flex-1 min-w-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 lg:pb-10">
        <Routes>
          <Route path="/" element={<DashboardPage onOpenCheckIn={() => setIsCheckInOpen(true)} />} />
          <Route path="/proof-locker" element={<ProofLockerPage />} />
          <Route path="/readiness" element={<ReadinessPage />} />
          <Route path="/resume" element={<ResumeBuilderPage />} />
          <Route path="/jd-match" element={<JdMatchPage />} />
          <Route path="/companion" element={<AiCompanionPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/privacy" element={<PrivacyCenterPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/passport/:id" element={<PublicPassportPage />} />
        </Routes>
      </main>

      {/* Bottom tab bar — phones + tablets use this, laptop/desktop use top Navbar */}
      {!isPublicPassport && (
        <>
          {isMoreOpen && (
            <div
              className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsMoreOpen(false)}
            />
          )}
          {isMoreOpen && (
            <div className="lg:hidden fixed bottom-[76px] inset-x-3 z-50 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 space-y-1">
              {moreLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMoreOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-slate-600" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold leading-tight">{item.label}</span>
                      <span className="block text-[11px] text-slate-500 leading-tight">{item.desc}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
          <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
            <div className="grid grid-cols-6 gap-0.5">
              {[
                { path: '/', label: 'Today', icon: Compass },
                { path: '/proof-locker', label: 'Proof', icon: FolderGit2 },
                { path: '/resume', label: 'Résumé', icon: FileText },
                { path: '/jd-match', label: 'JD Match', icon: ScanSearch },
                { path: '/companion', label: 'AI Chat', icon: MessageSquareQuote },
              ].map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMoreOpen(false)}
                    className={`flex flex-col items-center gap-0.5 py-1.5 px-0.5 rounded-xl text-[10px] font-semibold min-h-[52px] justify-center transition-colors ${
                      isActive ? 'text-brand-700 bg-brand-50' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="leading-none truncate max-w-full">{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={() => setIsMoreOpen((v) => !v)}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-0.5 rounded-xl text-[10px] font-semibold min-h-[52px] justify-center transition-colors ${
                  isMoreOpen || isMoreActive ? 'text-brand-700 bg-brand-50' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {isMoreOpen ? <X className="w-5 h-5 shrink-0" /> : <Menu className="w-5 h-5 shrink-0" />}
                <span className="leading-none">More</span>
              </button>
            </div>
          </nav>
        </>
      )}

      {!isPublicPassport && (
        <footer className="hidden lg:block mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="flex items-center gap-1">
              <span className="font-bold text-slate-800">Proofa</span> • Private Student Growth Passport • Hyderabad Tech Wedge
            </p>
            <div className="flex items-center space-x-4 text-[11px]">
              <span className="text-emerald-700 font-semibold">DPDP Act 2023 Compliant</span>
              <span>•</span>
              <span>Truth over Polish</span>
              <span>•</span>
              <span>No Auto-Apply Bots</span>
            </div>
          </div>
        </footer>
      )}

      <DailyCheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSuccess={() => {
          // Trigger a re-render or notification if needed
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
