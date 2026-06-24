import { MessageCircle, X } from 'lucide-react';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function ChatButton({ isOpen, onClick }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out group shadow-2xl ${
        isOpen
          ? 'bg-gradient-to-br from-red-500 to-red-600 rotate-0 shadow-red-500/30'
          : 'bg-gradient-to-br from-violet-600 to-purple-700 shadow-violet-600/40 hover:shadow-violet-600/60 hover:scale-110'
      }`}
      title={isOpen ? 'Close Chat' : 'Ask AI about this property'}
    >
      {isOpen ? (
        <X size={22} className="text-white" />
      ) : (
        <>
          <MessageCircle size={22} className="text-white" />
         
          <span className="absolute inset-0 rounded-full bg-violet-500 opacity-30 animate-ping" />
        </>
      )}
    </button>
  );
}
