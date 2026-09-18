import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { storage } from '../services/storage';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);

  // Step 1: Academic & Target Role
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [collegeName, setCollegeName] = useState('JNTUH College of Engineering, Hyderabad');
  const [degree, setDegree] = useState('B.Tech Computer Science');
  const [graduationYear, setGraduationYear] = useState('2027');
  const [currentSemester, setCurrentSemester] = useState('6th Semester');
  const [cgpa, setCgpa] = useState('7.92');
  const [targetRole, setTargetRole] = useState('Backend Developer Intern');

  // Step 2: Time budget & Exams
  const [weekdayHours, setWeekdayHours] = useState(2.5);
  const [weekendHours, setWeekendHours] = useState(5.0);
  const [examName, setExamName] = useState('Operating Systems Mid-Term');
  const [examDate, setExamDate] = useState('2026-09-20');

  // Step 3: Links, DPDP Consent & Age
  const [githubUrl, setGithubUrl] = useState('https://github.com/rahul-sharma-dev');
  const [age, setAge] = useState('20');
  const [dpdpAgreed, setDpdpAgreed] = useState(true);

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();

    const currentProfile = storage.getProfile();
    const updatedProfile = {
      ...currentProfile,
      fullName,
      collegeName,
      degree,
      graduationYear: Number(graduationYear),
      currentSemester,
      cgpa: Number(cgpa),
      githubUrl,
      age: Number(age),
      parentalConsentAcknowledged: true,
    };
    storage.updateProfile(updatedProfile);

    const currentGoal = storage.getGoal();
    storage.updateGoal({
      ...currentGoal,
      targetRole,
    });

    const currentConstraints = storage.getConstraints();
    storage.updateConstraints({
      ...currentConstraints,
      weekdayHours,
      weekendHours,
      upcomingExams: [
        {
          id: `exam_${Date.now()}`,
          title: examName,
          subject: 'Core Engineering Coursework',
          date: examDate,
          priority: 'high',
        },
      ],
    });

    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-500/30">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Setup Your Student Growth Passport
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Fast, useful 3-step setup. We only ask what is necessary to build your 7-day adaptive plan and proof locker.
        </p>
      </div>

      {/* Stepper Progress */}
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs font-bold">
        {[
          { num: 1, label: 'Academic & Role' },
          { num: 2, label: 'Schedule & Exams' },
          { num: 3, label: 'Proof & Privacy' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                step >= s.num
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {s.num}
            </span>
            <span className={`hidden min-[520px]:inline ${step >= s.num ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
              {s.label}
            </span>
            {s.num < 3 && <span className="text-slate-300">→</span>}
          </div>
        ))}
      </div>

      {/* Step Form Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft">
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Step 1: Academic Reality & Target Role</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">College / University</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Degree & Branch</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Semester</label>
                <input
                  type="text"
                  value={currentSemester}
                  onChange={(e) => setCurrentSemester(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">CGPA (Self-reported)</label>
                <input
                  type="text"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none font-bold text-slate-800"
              >
                <option value="Backend Developer Intern">Backend Developer Intern</option>
                <option value="Full-Stack Developer Intern">Full-Stack Developer Intern</option>
                <option value="Frontend Developer Intern">Frontend Developer Intern</option>
                <option value="Data Engineering Intern">Data Engineering Intern</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Step 2: Realistic Schedule & Upcoming Exams</h3>
            <p className="text-slate-500">
              We respect your college calendar. Missed days reschedule automatically without streak shame.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  Available Weekday Study Hours: {weekdayHours}h / day
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={weekdayHours}
                  onChange={(e) => setWeekdayHours(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  Available Weekend Study Hours: {weekendHours}h / day
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="0.5"
                  value={weekendHours}
                  onChange={(e) => setWeekendHours(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 space-y-2 border-t border-slate-100">
              <label className="block font-bold text-slate-700">
                Nearest College Exam or Major Deadline
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g. Operating Systems Mid-Term"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none font-medium"
                />
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none font-medium text-slate-700"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Proofa will automatically reduce coding milestones on this date to protect your CGPA.
              </p>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-slate-600 font-bold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
              >
                <span>Continue to Step 3</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleComplete} className="space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Step 3: Verification Link & DPDP Consent</h3>

            <div>
              <label className="block font-bold text-slate-700 mb-1">GitHub Username or Profile URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/your-username"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none"
                />
              </div>
              <div className="flex items-center pt-5">
                <span className="text-[11px] text-slate-500">
                  {Number(age) >= 18 ? 'Adult student (DPDP direct consent)' : 'Parental consent required for minor'}
                </span>
              </div>
            </div>

            {/* DPDP Consent Notice */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  required
                  id="dpdp-agree"
                  checked={dpdpAgreed}
                  onChange={(e) => setDpdpAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-brand-600 rounded"
                />
                <label htmlFor="dpdp-agree" className="text-[11px] text-slate-700 leading-relaxed">
                  I give explicit purpose-specific consent under India DPDP Act 2023 for Proofa to process my timetable and academic goals. My chats remain private and isolated. I can withdraw consent or delete my data anytime.
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-slate-600 font-bold"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!dpdpAgreed}
                className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate My Plan & Enter Passport</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
