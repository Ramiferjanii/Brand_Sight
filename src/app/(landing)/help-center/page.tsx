'use client';

import React, { useState, useRef, useEffect } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

// SVG Icons
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
  </svg>
);

const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M16.5 7.5h-9v9h9v-9z" />
    <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75h1.5A3 3 0 0121 6.75v.75h.75a.75.75 0 010 1.5H21v2.25h.75a.75.75 0 010 1.5H21v2.25h.75a.75.75 0 010 1.5H21v2.25h.75a.75.75 0 010 1.5H21a3 3 0 01-3 3h-1.5v.75a.75.75 0 01-1.5 0v-.75h-2.25v.75a.75.75 0 01-1.5 0v-.75H9v.75a.75.75 0 01-1.5 0v-.75H6a3 3 0 01-3-3v-1.5h-.75a.75.75 0 010-1.5H3v-2.25h-.75a.75.75 0 010-1.5H3v-2.25h-.75a.75.75 0 010-1.5H3v-2.25h-.75a.75.75 0 010-1.5H3a3 3 0 013-3h1.5V3a.75.75 0 01.75-.75zM6 6.75A.75.75 0 016.75 6h10.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V6.75z" clipRule="evenodd" />
  </svg>
);


const SendIcon = () => (
  <svg className="h-5 w-5 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function HelpCenterPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AI Customer Support assistant. I have access to our entire knowledge base. How can I help supercharge your e-commerce platform today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [topQuestions, setTopQuestions] = useState<{ question: string; count: number }[]>([]);

  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages]);

  // Fetch top asked questions for the sidebar
  useEffect(() => {
    api.get('/chat/top-questions')
      .then(res => { if (res.data?.questions) setTopQuestions(res.data.questions); })
      .catch(() => {});
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    // Save question to shared DB so Help Center dashboard shows it
    try {
      await api.post('/chat', { messages: newMessages });
    } catch (_) { /* ignore — just tracking */ }

    try {
      const res = await api.post('/chatbot/query', { message: userMsg });
      if (res.data.answer) {
        setMessages([...newMessages, { role: 'assistant', content: res.data.answer }]);
        // Refresh top questions after new one is saved
        api.get('/chat/top-questions')
          .then(r => { if (r.data?.questions) setTopQuestions(r.data.questions); })
          .catch(() => {});
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, I'm experiencing connection issues with the knowledge base. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-purple-50 flex flex-col items-center pt-28 pb-12 mt-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Animated Decorative Background Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, 20, 0] }} 
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }} 
        className="absolute top-10 left-1/4 w-[30rem] h-[30rem] bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 z-0 pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, 30, 0] }} 
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut", delay: 2 }} 
        className="absolute top-20 right-1/4 w-[28rem] h-[28rem] bg-purple-300/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 z-0 pointer-events-none" 
      />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full text-center mb-8 z-10"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 tracking-tight pb-1">AI Help Center</h1>
        <p className="mt-2 text-gray-500 font-medium text-lg">Your intelligent RAG-powered assistant.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-5xl z-10 flex flex-col lg:flex-row gap-6"
      >
        {/* ── Top Questions Sidebar ── */}
        {topQuestions.length > 0 && (
          <div className="lg:w-64 flex-shrink-0">
            <div className="backdrop-blur-xl bg-white/70 rounded-2xl border border-white shadow-[0_15px_50px_-12px_rgba(0,0,0,0.08)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base font-bold text-indigo-700">🔥 Most Asked</span>
                <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-semibold">LIVE</span>
              </div>
              <ul className="space-y-2">
                {topQuestions.map((q, i) => (
                  <li key={i}>
                    <button
                      onClick={() => setInput(q.question)}
                      title="Click to use this question"
                      className="w-full text-left text-xs text-gray-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl px-3 py-2.5 transition-all flex justify-between items-start gap-2 group"
                    >
                      <span className="leading-snug group-hover:text-indigo-700">{q.question}</span>
                      <span className="flex-shrink-0 text-[10px] bg-white text-indigo-500 border border-indigo-100 rounded-full px-1.5 py-0.5 font-semibold">×{q.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── Chat Window ── */}
        <div className="flex-1 backdrop-blur-xl bg-white/70 rounded-[2rem] shadow-[0_15px_50px_-12px_rgba(0,0,0,0.1)] border border-white overflow-hidden flex flex-col h-[70vh] min-h-[600px]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth hide-scrollbar">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                key={idx} 
                className={`flex gap-4 md:gap-5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Assistant Avatar */}
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 flex-shrink-0 mt-1">
                    <BotIcon />
                  </div>
                )}
                
                {/* Message Bubble */}
                <div className={`max-w-[85%] md:max-w-[75%] px-6 py-4 text-[15px] md:text-base leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-3xl rounded-tr-sm shadow-[0_10px_25px_-5px_rgba(79,70,229,0.3)]'
                    : 'bg-white text-gray-800 rounded-3xl rounded-tl-sm border border-gray-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.03)]'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* User Avatar */}
                {msg.role === 'user' && (
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white border border-brand-100 flex items-center justify-center text-brand-600 shadow-md shadow-brand-100 flex-shrink-0 mt-1">
                    <UserIcon />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Loading Indicator */}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start gap-4 md:gap-5"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 flex-shrink-0 mt-1">
                <BotIcon />
              </div>
              <div className="bg-white border border-gray-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.03)] rounded-3xl rounded-tl-sm px-6 py-5 flex items-center gap-2">
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-2.5 h-2.5 rounded-full bg-brand-400"></motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2.5 h-2.5 rounded-full bg-brand-400"></motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2.5 h-2.5 rounded-full bg-brand-400"></motion.div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white/50 backdrop-blur-lg border-t border-white/50 rounded-b-[2rem]">
          <form onSubmit={handleSend} className="flex gap-3 md:gap-4 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full rounded-2xl border border-gray-200/80 bg-white/90 focus:bg-white px-6 py-4 md:py-5 text-gray-800 shadow-[0_5px_20px_-5px_rgba(0,0,0,0.05)] focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:outline-none transition-all text-base placeholder:text-gray-400"
              disabled={isLoading}
            />
            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading}
              whileHover={{ scale: input.trim() && !isLoading ? 1.05 : 1 }}
              whileTap={{ scale: input.trim() && !isLoading ? 0.95 : 1 }}
              className="absolute right-2 top-2 bottom-2 aspect-square rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-md transition-all disabled:opacity-40 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none flex items-center justify-center group"
            >
              <SendIcon />
            </motion.button>
          </form>
        </div>
        </div>
      </motion.div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .hide-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .hide-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
        }
        .hide-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }
      `}} />
    </div>
  );
}
