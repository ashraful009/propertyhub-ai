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
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30'
            : 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30'
        }`}
      >
        {isUser ? (
          <User size={16} className="text-white" />
        ) : (
          <Bot size={16} className="text-white" />
        )}
      </div>

    
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-md shadow-lg shadow-blue-500/20'
            : 'bg-white/10 text-gray-100 rounded-tl-md backdrop-blur-sm border border-white/10'
        }`}
      >
      
        <div className="whitespace-pre-wrap break-words chat-message-content">
          {content}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 bg-violet-400 ml-0.5 animate-pulse rounded-sm" />
          )}
        </div>
      </div>
    </div>
  );
}
