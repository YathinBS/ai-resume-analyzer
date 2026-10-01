import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  Copy,
  Check,
  User,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Zap,
  Eye,
} from 'lucide-react';
import { api } from '../../lib/api';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { ThinkingOrb } from '../ui/ThinkingOrb';
import { ThinkingOrbExplorerModal } from '../ui/ThinkingOrbExplorerModal';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-init',
    role: 'assistant',
    content: `Hello! I'm your **ResumeAI Career & ATS Coach** powered by Gemini 3.8 Flash.\n\nI can help you:\n- **Critique & rewrite bullet points** using the Google X-Y-Z formula\n- **Check ATS compatibility** for layout, fonts, and column formats\n- **Tailor keywords** to match your target job descriptions\n- **Prep for technical interviews** (system design & behavioral stories)\n\nPaste an experience bullet or ask me anything to get started!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const PROMPT_SUGGESTIONS = [
  'How do I rewrite a bullet point to show measurable metrics?',
  'What are the most common ATS formatting mistakes?',
  'How should I structure my Technical Skills section?',
  'How do I tailor my resume for a Staff or Senior Engineer role?',
];

export const ChatbotPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isOrbExplorerOpen, setIsOrbExplorerOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (!customText) setInput('');
    setIsLoading(true);

    try {
      // Send conversation history to server
      const payload = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.sendChatMessage(
        payload,
        user ? `User Profile: Name: ${user.name}, Target Role: ${user.targetRole || 'Software Engineer'}, Preferred Industry: ${user.preferredIndustry || 'Tech'}` : undefined
      );

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an issue: ${err.message || 'Could not connect to AI service'}. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Reset conversation?')) {
      setMessages(INITIAL_MESSAGES);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[550px] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-6 py-4 shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                ResumeAI Career & ATS Coach
              </h2>
              <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive multi-turn guidance for ATS scoring, bullet rewrites, and interview answers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsOrbExplorerOpen(true)}
            leftIcon={<Eye className="w-3.5 h-3.5 text-indigo-500" />}
          >
            <span className="hidden sm:inline">Explore Orb States</span>
            <span className="sm:hidden">Orbs</span>
          </Button>
          <button
            onClick={handleClearChat}
            className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Clear Conversation"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-5 shadow-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 text-sm ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/50 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-2xs relative group leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-tr-xs'
                  : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs'
              }`}
            >
              {/* Formatted Message Content */}
              <div className="space-y-2 whitespace-pre-wrap font-sans">
                {msg.content.split('\n').map((line, idx) => {
                  if (line.startsWith('### ')) {
                    return (
                      <h4 key={idx} className="font-bold text-base mt-2 mb-1 text-slate-900 dark:text-white">
                        {line.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (line.startsWith('#### ')) {
                    return (
                      <h5 key={idx} className="font-bold text-sm mt-1.5 mb-1 text-slate-800 dark:text-slate-200">
                        {line.replace('#### ', '')}
                      </h5>
                    );
                  }
                  if (line.startsWith('> ')) {
                    return (
                      <blockquote
                        key={idx}
                        className="pl-3 border-l-2 border-indigo-500 italic text-slate-600 dark:text-slate-300 my-1 bg-indigo-50/50 dark:bg-indigo-950/20 py-1 rounded-r"
                      >
                        {line.replace('> ', '')}
                      </blockquote>
                    );
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <div key={idx} className="flex items-start gap-1.5 pl-1">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{line.replace('- ', '')}</span>
                      </div>
                    );
                  }
                  if (/^\d+\.\s/.test(line)) {
                    return (
                      <div key={idx} className="flex items-start gap-1.5 pl-1">
                        <span className="font-bold text-slate-500">{line.match(/^\d+\./)?.[0]}</span>
                        <span>{line.replace(/^\d+\.\s/, '')}</span>
                      </div>
                    );
                  }
                  return <p key={idx}>{line}</p>;
                })}
              </div>

              {/* Timestamp & Copy action */}
              <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-400 dark:text-slate-400">
                <span>{msg.timestamp}</span>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 text-sm justify-start items-center">
            <div className="shrink-0 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <ThinkingOrb state="weaving" size={64} />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-2xs text-slate-500 flex items-center gap-3">
              <ThinkingOrb state="composing" size={20} />
              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Career Coach is thinking...
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Synthesizing ATS best practices and tailored career advice
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap gap-1.5 shrink-0 px-1">
        {PROMPT_SUGGESTIONS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-all text-left shadow-2xs hover:-translate-y-0.5"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 shadow-xs shrink-0 flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or paste a resume bullet point... (Press Enter to send)"
          rows={2}
          disabled={isLoading}
          className="w-full resize-none bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none px-2 py-1"
        />

        <Button
          size="md"
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          isLoading={isLoading}
          className="shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Interactive ThinkingOrb Explorer Modal */}
      <ThinkingOrbExplorerModal
        isOpen={isOrbExplorerOpen}
        onClose={() => setIsOrbExplorerOpen(false)}
      />
    </div>
  );
};
