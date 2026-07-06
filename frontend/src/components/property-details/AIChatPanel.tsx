import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, Trash2, X } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { streamChatMessage } from '../../services/chat.service';
import type { IProperty } from '../../types/shared.types';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  isStreaming?: boolean;
}

interface AIChatPanelProps {
  isOpen: boolean;
  property: IProperty;
  onClose: () => void;
}

export default function AIChatPanel({ isOpen, property, onClose }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const clearChat = () => {
    setMessages([]);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);


    const chatHistory = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));


    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'model',
      content: '',
      isStreaming: true,
    };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      const stream = streamChatMessage(property.id, trimmed, chatHistory);

      for await (const chunk of stream) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMessageId
              ? { ...m, content: m.content + chunk }
              : m
          )
        );
      }


      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMessageId ? { ...m, isStreaming: false } : m
        )
      );
    } catch  {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMessageId
            ? {
                ...m,
                content: 'Sorry, something went wrong. Please try again.',
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    'এই property-র দাম কত?',
    'Installment plan কেমন?',
    'Location কেমন?',
    'How to book?',
  ];

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-40 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col bg-white/95 backdrop-blur-3xl shadow-[0_0_50px_rgba(38,33,92,0.15)] border-l border-[var(--border-color)]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border-color)] bg-[var(--bg-base)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--indigo-500)] to-[var(--indigo-700)] flex items-center justify-center shadow-lg shadow-[var(--indigo-500)]/30">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-[var(--indigo-900)] font-bold text-base flex items-center gap-1.5">
                  PropertyHub AI
                  <Sparkles size={16} className="text-[var(--amber-600)]" />
                </h3>
                <p className="text-[var(--text-secondary)] text-xs font-medium truncate max-w-[200px]">
                  {property.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="p-2.5 rounded-full hover:bg-[var(--bg-base)] transition-colors text-[var(--text-muted)] hover:text-red-500 shadow-sm border border-transparent hover:border-[var(--border-color)]"
                  title="Clear chat"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-[var(--indigo-50)] hover:bg-[var(--indigo-100)] transition-colors text-[var(--indigo-900)] shadow-sm border border-[var(--indigo-200)] ml-1 flex items-center justify-center"
                title="Turn off Assistant"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
          {messages.length === 0 ? (
            /* Welcome Screen */
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-20 h-20 rounded-3xl bg-[var(--indigo-50)] flex items-center justify-center mb-6 shadow-sm border border-[var(--indigo-100)]">
                <Bot size={40} className="text-[var(--indigo-500)]" />
              </div>
              <h4 className="text-[var(--indigo-900)] font-extrabold text-xl mb-3">
                Hi! I'm your AI Assistant 👋
              </h4>
              <p className="text-[var(--text-secondary)] text-sm mb-8 leading-relaxed max-w-[260px]">
                Ask me anything about <span className="text-[var(--indigo-700)] font-bold">"{property.title}"</span> — pricing, features, booking, installments, and more!
              </p>
              {/* Suggested Questions */}
              <div className="w-full space-y-3">
                <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest font-bold mb-4">
                  Try asking
                </p>
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(q);
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                    className="w-full text-left px-5 py-3.5 rounded-xl bg-[var(--bg-base)] hover:bg-[var(--indigo-50)] text-[var(--indigo-900)] text-sm font-medium transition-all duration-200 border border-[var(--border-color)] hover:border-[var(--indigo-200)] shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Chat Messages */
            messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                isStreaming={msg.isStreaming}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-5 py-5 border-t border-[var(--border-color)] bg-white">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? 'AI is thinking...' : 'Ask about this property...'}
              disabled={isLoading}
              className="flex-1 bg-[var(--bg-base)] text-[var(--text-primary)] placeholder-[var(--text-muted)] rounded-2xl px-5 py-4 text-sm outline-none border border-[var(--border-color)] focus:border-[var(--indigo-500)] focus:ring-4 focus:ring-[var(--indigo-50)] transition-all disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-14 h-14 rounded-2xl bg-[var(--indigo-900)] text-white flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:shadow-[var(--indigo-900)]/20 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:300ms]" />
                </div>
              ) : (
                <Send size={20} className="ml-1" />
              )}
            </button>
          </div>
          <p className="text-[var(--text-muted)] text-[11px] text-center mt-4 font-medium flex items-center justify-center gap-1">
            <Sparkles size={12}/> Powered by PropertyHub AI
          </p>
        </div>
      </div>
    </div>
  );
}
