'use client';

import React, { useState, useRef, useEffect } from 'react';
import api from '@/lib/api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const FloatingChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hi! I'm your AI Shopping Assistant. Ask me anything about your scraped products or the market!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    // Listen for product-specific chat triggers from other components
    useEffect(() => {
        const handleProductChat = (e: any) => {
            const { productName, productPrice, productDomain } = e.detail;

            // Short, clean message shown in the chat UI
            const displayMsg = `Tell me about **${productName}**`;

            // Full detailed query sent ONLY to the AI, not shown in the chat bubble
            const apiQuery = `I found a product on ${productDomain}: "${productName}" priced at ${productPrice}. Is this a good deal? What are the key specs and who is it best suited for? Keep your answer concise.`;

            setIsOpen(true);

            // Add the friendly visible message to the chat
            const visibleMessages: Message[] = [
                ...messages,
                { role: 'user', content: displayMsg }
            ];
            setMessages(visibleMessages);
            setIsLoading(true);

            // Send the full detailed query to the AI (not the display message)
            const apiMessages: Message[] = [
                ...messages,
                { role: 'user', content: apiQuery }
            ];

            api.post('/chat', { messages: apiMessages }).then(res => {
                if (res.data.reply) {
                    setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
                }
            }).catch(() => {
                setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't analyze that product right now. Please try again." }]);
            }).finally(() => {
                setIsLoading(false);
            });
        };

        window.addEventListener('open-chat-with-product', handleProductChat);
        return () => window.removeEventListener('open-chat-with-product', handleProductChat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const res = await api.post('/chat', { messages: newMessages });
            if (res.data.reply) {
                setMessages([...newMessages, { role: 'assistant', content: res.data.reply }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages([...newMessages, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting to Groq AI right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 flex flex-col w-80 sm:w-96 h-[500px] max-h-[70vh] rounded-2xl bg-white shadow-2xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800 overflow-hidden transition-all transform origin-bottom-right">
                    
                    {/* Header */}
                    <div className="bg-brand-500 p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">✨</span>
                            <div>
                                <h3 className="font-bold text-sm">AI Shopping Assistant</h3>
                                <p className="text-xs text-brand-100">Powered by Groq Llama-3</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-brand-100 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-brand-500 text-white rounded-br-sm' 
                                        : 'bg-white border border-gray-100 text-gray-800 shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 rounded-bl-sm'
                                }`}>
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <form onSubmit={handleSend} className="flex gap-2 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question..."
                                className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
                            >
                                <svg className="h-4 w-4 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-105 ${
                    isOpen ? 'bg-gray-800 text-white dark:bg-gray-700' : 'bg-brand-500 text-white hover:bg-brand-600 ring-4 ring-brand-500/20'
                }`}
                style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
            >
                {isOpen ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </button>
            {/* Ping effect when closed */}
            {!isOpen && (
                <div className="absolute top-0 right-0 h-14 w-14 rounded-full bg-brand-500/50 animate-ping -z-10" style={{ animationDuration: '3s' }}></div>
            )}
        </div>
    );
};
