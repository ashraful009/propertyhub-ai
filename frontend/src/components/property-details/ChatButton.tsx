import { MessageCircle, X } from 'lucide-react';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function ChatButton({ isOpen, onClick }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out group shadow-2xl bg-gradient-to-br from-[var(--indigo-500)] to-[var(--indigo-700)] shadow-[var(--indigo-500)]/40 hover:shadow-[var(--indigo-500)]/60 hover:scale-110 ${
        isOpen ? 'rotate-90 bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/40 hover:shadow-red-500/60' : ''
      }`}
      title={isOpen ? 'Close AI Assistant' : 'Ask AI about this property'}
    >
      {isOpen ? (
        <X size={24} className="text-white transition-transform duration-300" strokeWidth={2.5} />
      ) : (
        <>
          <MessageCircle size={22} className="text-white" />
          <span className="absolute inset-0 rounded-full bg-[var(--indigo-400)] opacity-30 animate-ping" />
        </>
      )}
    </button>
  );
}
