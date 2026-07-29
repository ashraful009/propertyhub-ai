import React from 'react';
import { useChatStream } from '../../hooks/useChatStream';

const SUGGESTIONS = [
  "এর দাম কত?",
  "কয়টা বেডরুম?",
  "একই এলাকায় আর কিছু আছে?"
];

const PropertyChatbot = ({ propertyId }) => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    isOpen,
    setIsOpen,
    sendMessage,
    messagesEndRef
  } = useChatStream(propertyId);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {}
      {isOpen && (
        <div className="bg-white w-[320px] sm:w-[380px] h-[450px] shadow-2xl rounded-2xl border border-gray-100 flex flex-col mb-4 overflow-hidden animate-fade-in-up">
          {}
          <div className="bg-primary-600 text-white p-4 flex justify-between items-center rounded-t-2xl">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="font-semibold text-sm">Property Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-primary-100 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 text-sm mt-4">
                 Hello! How can I help you with this property?
                
                <div className="mt-6 flex flex-col gap-2">
                  {SUGGESTIONS.map((text, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(text)}
                      className="text-xs bg-white border border-primary-200 text-primary-600 py-2 px-3 rounded-xl hover:bg-primary-50 transition-colors text-left shadow-sm"
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-bl-sm whitespace-pre-wrap'}`}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 text-gray-400 px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {}
          <div className="p-3 bg-white border-t border-gray-100">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about this property..."
                className="w-full bg-gray-100 text-sm rounded-full py-2.5 pl-4 pr-10 outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all border border-transparent focus:border-primary-300"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 w-8 h-8 flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white rounded-full disabled:opacity-50 transition-colors"
              >
                <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary-600 hover:bg-primary-700 shadow-xl shadow-primary-600/20 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default PropertyChatbot;
