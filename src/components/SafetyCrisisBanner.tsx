import React from 'react';
import { HeartHandshake, PhoneCall, ShieldAlert } from 'lucide-react';

export const SafetyCrisisBanner: React.FC = () => {
  return (
    <div className="bg-rose-50 border-2 border-rose-300/80 rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-center space-x-2.5 text-rose-800">
        <div className="w-8 h-8 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center shrink-0">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-sm">Mental Health Support & Student Wellbeing</h4>
          <p className="text-xs text-rose-700">
            College exams and career milestones can be overwhelming. You are not alone, and help is free, confidential, and 24x7.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
        <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200 flex items-center space-x-2">
          <PhoneCall className="w-4 h-4 text-rose-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-900">Tele-MANAS (Govt of India)</p>
            <p className="text-rose-700 font-extrabold text-sm">14416 / 1800 891 4416</p>
            <p className="text-[10px] text-slate-500">24x7 Multi-lingual, Toll Free</p>
          </div>
        </div>

        <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200 flex items-center space-x-2">
          <PhoneCall className="w-4 h-4 text-rose-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-900">Kiran Helpline</p>
            <p className="text-rose-700 font-extrabold text-sm">1800-599-0019</p>
            <p className="text-[10px] text-slate-500">Ministry of Social Justice</p>
          </div>
        </div>

        <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200 flex items-center space-x-2">
          <PhoneCall className="w-4 h-4 text-rose-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-900">Vandrevala Foundation</p>
            <p className="text-rose-700 font-extrabold text-sm">+91 9999 666 555</p>
            <p className="text-[10px] text-slate-500">Free 24x7 Chat & Call</p>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-rose-600/90 italic">
        Proofa will never penalize your streak or readiness score when you prioritize your health and well-being.
      </p>
    </div>
  );
};
