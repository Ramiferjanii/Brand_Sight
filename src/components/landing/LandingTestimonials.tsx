"use client";
import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "E-commerce Director",
    content: "The best scraping infrastructure we've used. Side-by-side battle comparison saved us weeks of manual research.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Sarah Chen",
    role: "Market Analyst",
    content: "The level of data extraction is insane. We've scaled our tracking to thousands of items without any blocks.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Michael Smith",
    role: "Product Manager",
    content: "The AI verdicts on products are incredibly accurate. It's like having a market expert in my pocket.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

const LandingTestimonials: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-gray-50 dark:bg-gray-900/30 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight"
          >
            Trusted by the <span className="text-brand-500">Market Leaders</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-gray-500 dark:text-gray-400"
          >
            Join hundreds of teams making data-driven decisions every single day.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 relative group"
            >
              <div className="absolute top-10 right-10 text-brand-500/10 group-hover:text-brand-500/20 transition-colors">
                 <svg width="40" height="30" viewBox="0 0 40 30" fill="currentColor">
                    <path d="M12.125 0L19 5.83333L12.125 15H18.375L12.75 30H0L8.125 15H1.25L12.125 0ZM33.375 0L40.25 5.83333L33.375 15H39.625L34 30H21.25L29.375 15H22.5L33.375 0Z" />
                 </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-10 text-lg font-medium italic relative z-10">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4">
                <img 
                  src={t.avatar} 
                  alt={t.name}
                  className="w-14 h-14 rounded-2xl border-4 border-gray-50 dark:border-gray-900 shadow-md object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-base">{t.name}</h4>
                  <p className="text-brand-500 dark:text-brand-400 text-sm font-bold">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingTestimonials;
