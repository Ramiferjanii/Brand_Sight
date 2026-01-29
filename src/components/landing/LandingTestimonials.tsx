"use client";
import React from "react";
import Image from "next/image";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Data Scientist at TechFlow",
    content: "The best scraping infrastructure we've used. Periodic tasks and webhook support saved us weeks of engineering time.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Sarah Chen",
    role: "Founder of ShopMonitor",
    content: "The level of reliability is insane. We've scaled to millions of requests daily without a single blocked session.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Michael Smith",
    role: "CTO at GrowthScale",
    content: "The UI is incredible, but the power under the hood is what truly matters. Highly recommend to any data-driven team.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

const LandingTestimonials: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by innovators worldwide
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Join hundreds of teams building the future with our data infrastructure.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 relative group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <svg width="40" height="30" viewBox="0 0 40 30" fill="currentColor">
                    <path d="M12.125 0L19 5.83333L12.125 15H18.375L12.75 30H0L8.125 15H1.25L12.125 0ZM33.375 0L40.25 5.83333L33.375 15H39.625L34 30H21.25L29.375 15H22.5L33.375 0Z" />
                 </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 relative z-10 italic">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4">
                <img 
                  src={t.avatar} 
                  alt={t.name}
                  className="w-12 h-12 rounded-full border-2 border-brand-500/20"
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</h4>
                  <p className="text-brand-500 dark:text-brand-400 text-xs font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingTestimonials;
