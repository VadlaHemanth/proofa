import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  Award,
  FolderGit2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';
import { storage } from '../services/storage';
import { TaskCard } from '../components/TaskCard';
import { WeeklyPlan, PlanTask } from '../types';

interface DashboardPageProps {
  onOpenCheckIn: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onOpenCheckIn }) => {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(storage.getWeeklyPlan());
  const profile = storage.getProfile();
  const goal = storage.getGoal();
  const readiness = storage.getRoleReadiness();
  const constraints = storage.getConstraints();

  // Find today's plan
  const todayIndex = weeklyPlan.days.findIndex((d) => d.dayOfWeek.includes('Today'));
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(todayIndex !== -1 ? todayIndex : 0);
  const selectedDay = weeklyPlan.days[selectedDayIndex] || weeklyPlan.days[0];

  // Refresh plan state
  const refreshPlan = () => {
    setWeeklyPlan(storage.getWeeklyPlan());
  };

  const handleToggleTask = (taskId: string) => {
    storage.toggleTaskCompletion(taskId);
    refreshPlan();
  };

  const handleRescheduleTomorrow = (taskId: string) => {
    const nextDay = weeklyPlan.days[Math.min(selectedDayIndex + 1, weeklyPlan.days.length - 1)];
    if (nextDay) {
      storage.rescheduleTask(taskId, nextDay.date);
      refreshPlan();
    }
  };

  // Quick stats
  const allTasks = weeklyPlan.days.flatMap((d) => d.tasks);
  const completedTasks = allTasks.filter((t) => t.status === 'completed');
  const todayTasks = weeklyPlan.days[todayIndex !== -1 ? todayIndex : 0]?.tasks || [];
  const todayCompleted = todayTasks.filter((t) => t.status === 'completed');

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome & Academic Context Banner */}
      <div className="glass rounded-4xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-brand-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex max-w-full items-center gap-x-2 bg-brand-50/80 text-brand-700 text-xs px-3 py-1 rounded-full border border-brand-200/70 shadow-soft">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-brand-500" />
              <span className="hidden min-[480px]:inline">Private Student Growth Passport • Hyderabad JNTUH Wedge</span>
              <span className="min-[480px]:hidden">Student Growth Passport</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile.fullName.split(' ')[0]}
            </h1>
            <p className="text-sm text-slate-600 max-w-xl break-words">
              Targeting <span className="font-semibold text-slate-900">{goal.targetRole}</span> ({goal.stipendExpectation}). Your timetable prioritizes your college mid-terms while building verifiable proof every week.
            </p>
          </div>

          <div className="flex flex-row flex-wrap md:flex-col md:flex-nowrap items-start md:items-end justify-between gap-3 border-t md:border-t-0 md:border-l border-black/5 pt-4 md:pt-0 md:pl-6">
            <div className="text-left md:text-right">
              <span className="text-xs text-slate-500">Role Readiness</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-emerald-600">{readiness.readinessScore}</span>
                <span className="text-xs text-slate-500">/ 10</span>
              </div>
            </div>

            <button
              onClick={onOpenCheckIn}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 transition-all active:scale-95"
            >
              <Clock className="w-4 h-4" />
              <span>60s Daily Check-in</span>
            </button>
          </div>
        </div>

        {/* Exam Alert Reminder Bar */}
        {constraints.upcomingExams.length > 0 && (
          <div className="mt-6 pt-4 border-t border-black/5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
              <span className="font-semibold text-amber-700">Upcoming Academic Checkpoint:</span>
              <span className="break-words">{constraints.upcomingExams[0].title} on {constraints.upcomingExams[0].date}</span>
            </div>
            <span className="text-[11px] text-slate-500 italic">
              Plan automatically lowered coding load on exam day.
            </span>
          </div>
        )}
      </div>

      {/* CORE 1: Today's 3 Tasks (First and foremost as required by spec) */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <span>Today's 3 Focus Tasks</span>
              <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                {todayCompleted.length} of {todayTasks.length} done
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Bite-sized, high-yield tasks that keep you moving forward without academic overwhelm.
            </p>
          </div>

          <button
            onClick={() => {
              // Reschedule uncompleted today tasks to tomorrow
              const uncompleted = todayTasks.filter((t) => t.status === 'pending');
              const tomorrow = weeklyPlan.days[todayIndex + 1];
              if (tomorrow && uncompleted.length > 0) {
                uncompleted.forEach((t) => storage.rescheduleTask(t.id, tomorrow.date));
                refreshPlan();
              }
            }}
            className="text-xs font-medium text-slate-600 hover:text-brand-600 flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            title="Shift unfinished tasks to tomorrow without guilt"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reschedule Unfinished (No Shame)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {todayTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggleTask}
              onRescheduleTomorrow={handleRescheduleTomorrow}
            />
          ))}
        </div>
      </section>

      {/* CORE 2: Weekly Proof Milestone & Readiness Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Proof Milestone */}
        <div className="lg:col-span-2 bg-gradient-to-br from-brand-50/70 via-white to-slate-50 rounded-2xl border border-brand-100 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
              <FolderGit2 className="w-4 h-4 text-brand-600" />
              This Week's Verifiable Proof Milestone
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Proof &gt; Hours
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {weeklyPlan.weeklyProofMilestone}
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Companies hire proven ability, not claimed hours. Once you push this project to GitHub with passing unit tests or deploy it on Render, add it to your Proof Locker to unlock ATS bullet verification.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <Link
              to="/proof-locker"
              className="inline-flex items-center space-x-1 font-semibold text-brand-600 hover:text-brand-700"
            >
              <span>Go to Proof Locker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-slate-400">Target: Saturday Sept 19</span>
          </div>
        </div>

        {/* Explainable Readiness Quick Glance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Target Role Fit
              </span>
              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                {goal.targetRole}
              </span>
            </div>

            <div className="mt-4 flex items-baseline space-x-2">
              <span className="text-4xl font-black text-slate-900">{readiness.readinessScore}</span>
              <span className="text-slate-400 font-medium">/ 10</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded ml-auto">
                {readiness.readinessScore >= 7 ? 'Interview Ready' : 'In Progress'}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${readiness.readinessScore * 10}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-600 mt-3 line-clamp-2">
              <span className="font-semibold text-slate-800">Next Best Action:</span> {readiness.nextBestAction}
            </p>
          </div>

          <Link
            to="/readiness"
            className="w-full text-center py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
          >
            Inspect 6 Benchmark Criteria
          </Link>
        </div>
      </div>

      {/* CORE 3: 7-Day Adaptive Timetable with Exam Integration */}
      <section className="space-y-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-600" />
              <span>7-Day Adaptive Weekly Plan</span>
            </h2>
            <p className="text-xs text-slate-500">
              Week Theme: <span className="font-semibold text-slate-700">{weeklyPlan.theme}</span>
            </p>
          </div>

          <div className="text-xs text-slate-500 flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>Exam Prep</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Coding / Dev</span>
            </span>
          </div>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-none">
          {weeklyPlan.days.map((day, idx) => {
            const isSelected = idx === selectedDayIndex;
            const isToday = day.dayOfWeek.includes('Today');
            return (
              <button
                key={day.date}
                onClick={() => setSelectedDayIndex(idx)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold text-left transition-all border ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600 shadow-soft'
                    : day.isExamDay
                    ? 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
                    : isToday
                    ? 'bg-brand-50 text-brand-800 border-brand-200 hover:bg-brand-100'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <span>{day.dayOfWeek.split(' ')[0]}</span>
                  {day.isExamDay && (
                    <span className="text-[10px] px-1 bg-purple-200 text-purple-900 rounded font-bold">
                      EXAM
                    </span>
                  )}
                </div>
                <div className={`text-[11px] font-normal ${isSelected ? 'text-brand-100' : 'text-slate-500'}`}>
                  {day.availableHours}h • {day.tasks.length} tasks
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Day Tasks Display */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              {selectedDay.dayOfWeek} Schedule ({selectedDay.date})
            </h3>
            {selectedDay.isExamDay && (
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                Exam Day: {selectedDay.examName || 'College Exam'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedDay.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onRescheduleTomorrow={handleRescheduleTomorrow}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
