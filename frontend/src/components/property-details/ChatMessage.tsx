import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'model';
  content: string;
  isStreaming?: boolean;
}

export default function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
          isUser
            ? 'bg-[var(--indigo-900)] text-white'
            : 'bg-[var(--amber-100)] text-[var(--amber-800)] border border-[var(--amber-200)]'
        }`}
      >
        {isUser ? (
          <User size={16} strokeWidth={2.5} />
        ) : (
          <Bot size={16} strokeWidth={2.5} />
        )}
      </div>

    
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-[var(--indigo-900)] text-white rounded-tr-md'
            : 'bg-white text-[var(--text-primary)] rounded-tl-md border border-[var(--border-color)]'
        }`}
      >
      
        <div className="whitespace-pre-wrap break-words chat-message-content">
          {content}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 bg-[var(--indigo-500)] ml-0.5 animate-pulse rounded-sm" />
          )}
        </div>
      </div>
    </div>
  );
}
