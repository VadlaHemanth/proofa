import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareQuote,
  Send,
  ShieldCheck,
  Sparkles,
  Bot,
  User,
  AlertTriangle,
  Info,
  HeartHandshake,
} from 'lucide-react';
import { storage } from '../services/storage';
import { processCompanionQuery } from '../services/aiCompanion';
import { SafetyCrisisBanner } from '../components/SafetyCrisisBanner';
import { ChatMessage } from '../types';

export const AiCompanionPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(storage.getChat());
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [hasCrisisNotice, setHasCrisisNotice] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const profile = storage.getProfile();
  const goal = storage.getGoal();
  const constraints = storage.getConstraints();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const quickPrompts = [
    'Can I get a 40 LPA package in 2 months?',
    'I have my OS mid-term on Sunday, how should I balance it?',
    'Should I use an auto-apply bot on LinkedIn?',
    'I got rejected from a coding assessment.',
    'How do I containerize my FastAPI project with Docker?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const studentMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'student',
      content: query.trim(),
      timestamp: new Date().toISOString(),
    };

    storage.addChatMessage(studentMessage);
    setMessages((prev) => [...prev, studentMessage]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(async () => {
      const response = await processCompanionQuery(query, profile, goal, constraints);

      const assistantMessage: ChatMessage = {
        id: `msg_resp_${Date.now()}`,
        sender: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
        containsCrisisHelp: response.containsCrisisHelp,
      };

      storage.addChatMessage(assistantMessage);
      setMessages((prev) => [...prev, assistantMessage]);
      setIsThinking(false);

      if (response.containsCrisisHelp) {
        setHasCrisisNotice(true);
      }
    }, 500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Privacy Isolation Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <span>Private Growth Companion</span>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  DPDP Isolated
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                Grounds advice in your academic calendar ({constraints.upcomingExams[0]?.title || 'Exams'}). Never leaks data to recruiters or peers.
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 flex items-center space-x-2 self-start sm:self-center">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Zero Cross-Student Memory</span>
          </div>
        </div>

        {/* Safety banner if crisis detected */}
        {hasCrisisNotice && <SafetyCrisisBanner />}
      </div>

      {/* Chat Area Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft flex flex-col h-[62dvh] min-h-[430px] max-h-[620px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isStudent = msg.sender === 'student';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isStudent ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isStudent
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {isStudent ? profile.fullName.charAt(0) : <Bot className="w-4 h-4 text-brand-600" />}
                </div>

                <div
                  className={`rounded-2xl p-3.5 sm:p-4 max-w-[85%] sm:max-w-xl min-w-0 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    isStudent
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 pl-11">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce delay-100"></span>
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce delay-200"></span>
              <span className="ml-1 font-medium">Checking academic calendar & stored proof...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Test Prompt Chips */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Try asking:</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-200 transition-colors text-[11px]"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about your study schedule, exam balance, or next proof task..."
              className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-xs sm:text-sm text-slate-800"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isThinking}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            Private & confidential • DPDP India compliant • Chats are excluded from recruiter queries by architecture.
          </p>
        </div>
      </div>
    </div>
  );
};
