import { useState, useRef, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

export const useChatStream = (propertyId) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(({ role, content }) => ({ role, content }));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chatbot/property/${propertyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text, history }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('এই মুহূর্তে অনেক রিকোয়েস্ট আসছে, একটু পর আবার চেষ্টা করুন।');
        } else if (response.status === 404) {
          throw new Error('Property not found.');
        } else {
          throw new Error('Failed to connect to chatbot.');
        }
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.error) {
                toast.error(data.error);
                break;
              }
              if (data.done) {
                break;
              }
              if (data.content) {
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastIndex = newMessages.length - 1;
                  const lastMessage = newMessages[lastIndex];
                  if (lastMessage.role === 'assistant') {
                    newMessages[lastIndex] = {
                      ...lastMessage,
                      content: lastMessage.content + data.content
                    };
                  }
                  return newMessages;
                });
                scrollToBottom();
              }
            } catch (e) {
              console.error('Error parsing SSE chunk', e);
            }
          }
        }
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  }, [messages, propertyId]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    isOpen,
    setIsOpen,
    sendMessage,
    messagesEndRef
  };
};
