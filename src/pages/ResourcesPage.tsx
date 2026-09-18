import React, { useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Clock,
  Globe,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { storage } from '../services/storage';
import { CuratedResource } from '../types';

export const ResourcesPage: React.FC = () => {
  const allResources = storage.getResources();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  const allTopics = Array.from(new Set(allResources.flatMap((r) => r.topics)));

  const filteredResources = allResources.filter((res) => {
    if (selectedLanguage !== 'all' && res.language !== selectedLanguage && res.language !== 'Multilingual') {
      return false;
    }
    if (selectedTopic !== 'all' && !res.topics.includes(selectedTopic)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          <BookOpen className="w-4 h-4 text-brand-600" />
          <span>Curated Resource Engine • Zero Spam / No Paid Course Funnels</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Curated Learning & Placement Hub
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          The open web is flooded with outdated tutorials and paid marketing funnels. Proofa provides hand-verified, high-yield free guides (MDN, roadmap.sh, Striver DSA Sheet, FastAPI official docs, Gate Smashers OS) that map directly to your role-readiness criteria.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Language Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1 shrink-0">
            Language:
          </span>
          {['all', 'English', 'Hindi', 'Multilingual'].map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedLanguage === lang
                  ? 'bg-gradient-to-b from-brand-500 to-brand-700 text-white font-bold shadow-pop ring-1 ring-black/10'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {lang === 'all' ? 'All Languages' : lang}
            </button>
          ))}
        </div>

        {/* Topic Filter */}
        <div className="flex items-center gap-2 text-xs min-w-0">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] shrink-0">Topic:</span>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="min-w-0 max-w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-brand-500 outline-none font-medium"
          >
            <option value="all">All Topics</option>
            {allTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {res.provider}
                </span>
                <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  100% Free
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug hover:text-brand-600 transition-colors">
                {res.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {res.description}
              </p>

              {/* Topics tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {res.topics.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>~{res.estimatedHours}h</span>
                <span>•</span>
                <span>{res.language}</span>
              </div>

              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 font-bold text-brand-600 hover:text-brand-700"
              >
                <span>Access Guide</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
