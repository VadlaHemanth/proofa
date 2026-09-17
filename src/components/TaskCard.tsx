import React from 'react';
import { CheckCircle2, Circle, Clock, ArrowRight, BookOpen, ShieldAlert, Sparkles } from 'lucide-react';
import { PlanTask } from '../types';

interface TaskCardProps {
  task: PlanTask;
  onToggle: (id: string) => void;
  onRescheduleTomorrow: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onRescheduleTomorrow }) => {
  const isCompleted = task.status === 'completed';

  const getCategoryColor = () => {
    switch (task.category) {
      case 'College Exam Prep':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Coding':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Project':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'DSA':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Revision':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isCompleted
          ? 'bg-slate-50/80 border-slate-200 text-slate-500'
          : task.isExamDayTask
          ? 'bg-purple-50/30 border-purple-200 hover:border-purple-300'
          : 'bg-white border-slate-200 hover:border-brand-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Toggle Checkbox + Title */}
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <button
            onClick={() => onToggle(task.id)}
            className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
            title={isCompleted ? 'Mark as incomplete' : 'Mark task complete'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getCategoryColor()}`}>
                {task.category}
              </span>
              {task.isExamDayTask && (
                <span className="text-[10px] font-semibold bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">
                  College Exam Priority
                </span>
              )}
              {task.proofRequired && (
                <span className="text-[10px] font-semibold bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded border border-brand-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-500" />
                  Proof Milestone
                </span>
              )}
            </div>

            <p
              className={`text-sm font-semibold mt-1.5 leading-snug break-words ${
                isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
              }`}
            >
              {task.title}
            </p>

            {task.notes && (
              <p className="text-xs text-slate-500 mt-1 italic break-words">
                {task.notes}
              </p>
            )}

            {/* Skills addressed & Estimated time */}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 shrink-0">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="whitespace-nowrap">{task.estimatedMinutes} mins</span>
              </span>

              <div className="flex flex-wrap items-center gap-1 min-w-0">
                {task.skillsAddressed.map((s) => (
                  <span key={s} className="text-[11px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded break-words">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reschedule action if not completed */}
        {!isCompleted && (
          <div className="shrink-0 flex items-center">
            <button
              onClick={() => onRescheduleTomorrow(task.id)}
              className="whitespace-nowrap text-[11px] text-slate-500 hover:text-brand-600 px-2 py-1 rounded hover:bg-slate-100 flex items-center gap-1 transition-colors"
              title="Reschedule to tomorrow (Compassion over streak theatre)"
            >
              <span className="hidden min-[420px]:inline">Shift tomorrow</span>
              <span className="min-[420px]:hidden">Shift</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
