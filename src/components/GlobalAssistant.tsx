import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  ShieldCheck,
  Bot,
  X,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { storage } from '../services/storage';
import { processCompanionQuery } from '../services/aiCompanion';
import { SafetyCrisisBanner } from './SafetyCrisisBanner';
import { ChatMessage } from '../types';

interface GlobalAssistantProps {
  open: boolean;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  'What should I focus on today?',
  'I have an exam coming up — rebalance me',
  'What proof task gets me closest to ready?',
];

export const GlobalAssistant: React.FC<GlobalAssistantProps> = ({ open, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => storage.getChat());
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const profile = storage.getProfile();
  const goal = storage.getGoal();
  const constraints = storage.getConstraints();

  // Seed a welcome message on first ever open
  useEffect(() => {
    if (open && storage.getChat().length === 0) {
      const welcome: ChatMessage = {
        id: `msg_welcome_${Date.now()}`,
        sender: 'assistant',
        content: `Hey ${profile.fullName.split(' ')[0]}! I'm your private growth companion — I know your goal (${goal.targetRole}) and your exam calendar, so my advice always fits your real week. Ask me anything, or tap a shortcut below.`,
        timestamp: new Date().toISOString(),
      };
      storage.addChatMessage(welcome);
      setMessages([welcome]);
    } else if (open) {
      setMessages(storage.getChat());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open ]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, thinking, open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const send = async (raw?: string) => {
    const query = (raw ?? input).trim();
    if (!query || thinking) return;
    const mine: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'student',
      content: query,
      timestamp: new Date().toISOString(),
    };
    storage.addChatMessage(mine);
    setMessages((p) => [...p, mine]);
    setInput('');
    setThinking(true);
    setTimeout(async () => {
      const res = await processCompanionQuery(query, profile, goal, constraints);
      const reply: ChatMessage = {
        id: `msg_resp_${Date.now()}`,
        sender: 'assistant',
        content: res.message,
        timestamp: new Date().toISOString(),
        containsCrisisHelp: res.containsCrisisHelp,
      };
      storage.addChatMessage(reply);
      setMessages((p) => [...p, reply]);
      setThinking(false);
      if (res.containsCrisisHelp) setCrisis(true);
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-label="Proofa quick assistant"
      className="fixed z-50 glass-deep rounded-[24px] flex flex-col overflow-hidden dock-in inset-x-3 bottom-[104px] top-14 sm:inset-x-auto sm:top-[76px] sm:bottom-4 sm:right-4 sm:w-[386px]"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-black/5 bg-white/50">
        <div className="w-9 h-9 rounded-full bg-gradient-to-b from-zinc-500 to-zinc-900 flex items-center justify-center text-white shadow-pop ring-1 ring-black/10 shrink-0 relative overflow-hidden">
          <span className="absolute inset-x-1.5 top-0 h-1/2 rounded-full bg-white/40 blur-[2px] pointer-events-none"></span>
          <Bot className="w-5 h-5 relative" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 leading-tight flex items-center gap-1.5">
            <span className="truncate">Proofa Assistant</span>
            <span className="text-[9px] font-bold bg-slate-500/10 text-slate-700 px-1.5 py-0.5 rounded-full border border-slate-500/20 whitespace-nowrap">
              DPDP Isolated
            </span>
          </p>
          <p className="text-[11px] text-slate-500 leading-tight truncate">
            Knows your plan • Private to you
          </p>
        </div>
        <Link
          to="/companion"
          onClick={onClose}
          title="Open full-page chat"
          className="p-2 rounded-full text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </Link>
        <button
          onClick={onClose}
          title="Minimize assistant"
          className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {crisis && (
        <div className="px-3 pt-3">
          <SafetyCrisisBanner />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3.5 py-3 space-y-3">
        {messages.map((m) => {
          const mine = m.sender === 'student';
          return (
            <div key={m.id} className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
              {!mine && (
                <div className="w-6 h-6 rounded-full bg-white border border-black/5 shadow-soft flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 text-brand-600" />
                </div>
              )}
              <div
                className={`max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap break-words ${
                  mine
                    ? 'text-white rounded-[18px] rounded-br-md bg-gradient-to-b from-zinc-600 to-zinc-950 shadow-pop'
                    : 'text-slate-800 bg-white/85 border border-black/5 shadow-soft rounded-[18px] rounded-bl-md'
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}
        {thinking && (
          <div className="flex items-center gap-1.5 pl-8 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce delay-100"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce delay-200"></span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-3 pb-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {QUICK_PROMPTS.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="shrink-0 text-[11px] font-medium px-2.5 py-1.5 rounded-full bg-white/80 border border-black/5 shadow-soft text-slate-600 hover:text-brand-700 hover:border-brand-200 transition-colors whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 pt-1.5 border-t border-black/5 bg-white/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything…"
            aria-label="Ask the assistant"
            className="flex-1 min-w-0 px-4 py-2.5 rounded-full bg-white border border-black/10 shadow-inner text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            aria-label="Send message"
            className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-b from-zinc-500 to-zinc-900 text-white flex items-center justify-center shadow-pop ring-1 ring-black/10 transition active:scale-95 disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-1.5 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Private • Never shared with recruiters
        </p>
      </div>
    </div>
  );
};
