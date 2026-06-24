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
      <div className="h-full flex flex-col bg-gradient-to-b from-[#0f0f23] via-[#1a1a3e] to-[#0f0f23] shadow-2xl shadow-black/50 border-l border-white/10">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                  PropertyHub AI
                  <Sparkles size={14} className="text-yellow-400" />
                </h3>
                <p className="text-gray-400 text-xs truncate max-w-[200px]">
                  {property.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-red-400"
                  title="Clear chat"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                title="Close chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
          {messages.length === 0 ? (
            /* Welcome Screen */
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center mb-4 border border-violet-500/20">
                <Bot size={32} className="text-violet-400" />
              </div>
              <h4 className="text-white font-semibold text-lg mb-2">
                Hi! I'm your AI Assistant 👋
              </h4>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Ask me anything about <span className="text-violet-400 font-medium">"{property.title}"</span> — pricing, features, booking, installments, and more!
              </p>
              {/* Suggested Questions */}
              <div className="w-full space-y-2">
                <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-3">
                  Try asking
                </p>
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(q);
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm transition-all duration-200 border border-white/5 hover:border-violet-500/30"
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
        <div className="px-4 py-4 border-t border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? 'AI is thinking...' : 'Ask about this property...'}
              disabled={isLoading}
              className="flex-1 bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none border border-white/10 focus:border-violet-500/50 transition-colors disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 text-white flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {isLoading ? (
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:300ms]" />
                </div>
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
          <p className="text-gray-600 text-[10px] text-center mt-2">
            Powered by Gemini AI · Property-specific answers only
          </p>
        </div>
      </div>
    </div>
  );
}
