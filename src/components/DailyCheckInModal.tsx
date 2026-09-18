import React, { useState } from 'react';
import { X, CheckCircle2, Clock, AlertTriangle, CalendarPlus, Sparkles, Send } from 'lucide-react';
import { storage } from '../services/storage';
import { DailyCheckIn } from '../types';

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const plan = storage.getWeeklyPlan();
  const constraints = storage.getConstraints();
  const todayPlan = plan.days.find((d) => d.dayOfWeek.includes('Today')) || plan.days[0];

  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>(
    todayPlan.tasks.filter((t) => t.status === 'completed').map((t) => t.id)
  );
  const [selectedBlocker, setSelectedBlocker] = useState<string>('Smooth day, no major blocker');
  const [customBlocker, setCustomBlocker] = useState<string>('');
  const [minutesTomorrow, setMinutesTomorrow] = useState<number>(Math.round(constraints.weekdayHours * 60));
  const [newDeadline, setNewDeadline] = useState<string>('');
  const [deadlineDate, setDeadlineDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const commonBlockers = [
    'Smooth day, no major blocker',
    'College lab/assignments ran late',
    'OS Mid-term / theory revision needed extra time',
    'Stuck debugging async database queries',
    'Low energy / needed rest',
  ];

  const toggleTask = (id: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const blockerText = customBlocker.trim() || selectedBlocker;

    const checkIn: DailyCheckIn = {
      id: `checkin_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      completedTaskIds: selectedTaskIds,
      blockers: blockerText,
      availableMinutesTomorrow: minutesTomorrow,
      newDeadlinesOrExams: newDeadline.trim() ? `${newDeadline} (${deadlineDate || 'Upcoming'})` : 'None',
      createdAt: new Date().toISOString(),
    };

    // If new exam was entered, append to constraints
    if (newDeadline.trim() && deadlineDate) {
      const updatedConstraints = {
        ...constraints,
        upcomingExams: [
          ...constraints.upcomingExams,
          {
            id: `exam_${Date.now()}`,
            title: newDeadline.trim(),
            subject: 'Academic Deadline',
            date: deadlineDate,
            priority: 'high' as const,
          },
        ],
      };
      storage.updateConstraints(updatedConstraints);
    }

    storage.submitCheckIn(checkIn);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onSuccess();
        onClose();
      }, 1200);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="glass-deep rounded-[24px] max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">60-Second Daily Check-in</h2>
              <p className="text-xs text-slate-500">No shame, no streak penalty. Just adapt tomorrow.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Plan Adapted Successfully!</h3>
            <p className="text-sm text-slate-600 max-w-xs mx-auto">
              Your tomorrow timetable has been adjusted for {minutesTomorrow} minutes. Great work showing up today!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-5">
            {/* Question 1: What did you finish? */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>1. What did you finish today?</span>
                <span className="text-[11px] font-normal text-slate-500">
                  {selectedTaskIds.length} of {todayPlan.tasks.length} selected
                </span>
              </label>
              <div className="space-y-2">
                {todayPlan.tasks.map((task) => {
                  const isChecked = selectedTaskIds.includes(task.id);
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-start space-x-3 p-2.5 rounded-xl border text-sm cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-slate-50/70 border-slate-300 text-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-slate-600 focus:ring-slate-500 w-4 h-4 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium leading-snug ${isChecked ? 'line-through text-slate-500' : ''}`}>
                          {task.title}
                        </p>
                        <span className="text-[11px] text-slate-400">
                          {task.estimatedMinutes} mins • {task.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Question 2: What blocked you? */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                2. What blocked or delayed you?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {commonBlockers.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setSelectedBlocker(b);
                      setCustomBlocker('');
                    }}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all text-left ${
                      selectedBlocker === b && !customBlocker
                        ? 'bg-brand-50 border-brand-300 text-brand-700 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={customBlocker}
                onChange={(e) => setCustomBlocker(e.target.value)}
                placeholder="Or write custom blocker..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </div>

            {/* Question 3: Minutes available tomorrow */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  3. Minutes you can realistically study tomorrow?
                </label>
                <span className="text-sm font-extrabold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  {minutesTomorrow} mins ({Number((minutesTomorrow / 60).toFixed(1))}h)
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="240"
                step="15"
                value={minutesTomorrow}
                onChange={(e) => setMinutesTomorrow(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>30m (Exam/Busy)</span>
                <span>60m (Light)</span>
                <span>120m (Standard)</span>
                <span>180m+ (Weekend)</span>
              </div>
            </div>

            {/* Question 4: New deadline or surprise exam */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1">
                <CalendarPlus className="w-3.5 h-3.5 text-slate-500" />
                <span>4. Any surprise exam, lab viva, or project deadline?</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  placeholder="e.g. Computer Networks Quiz"
                  className="text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none"
                />
                <input
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-brand-500 outline-none text-slate-600"
                />
              </div>
            </div>

            {/* Submit Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-soft shadow-brand-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Adapting Plan...' : 'Save & Adapt Schedule'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
