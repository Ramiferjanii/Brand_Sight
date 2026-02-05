"use client";
import React from "react";
import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSignUp = pathname?.includes("/signup");

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        {/* Main Flex Container */}
        <motion.div 
           className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0 overflow-hidden"
           initial={false} // Disable initial animation on first load
        >
          
          {/* Banner/Brand Side */}
          {/* We keep the key STABLE so Framer Motion slides it instead of remounting it */}
          <motion.div
            layout
            key="auth-banner-panel" 
            transition={{ type: "spring", stiffness: 200, damping: 25, mass: 1 }}
            className={`lg:w-1/2 w-full h-full lg:grid items-center hidden relative overflow-hidden ${
              isSignUp ? 'lg:order-first' : 'lg:order-last'
            }`}
          >
             <BrandBanner isSignUp={isSignUp} />
          </motion.div>

          {/* Form Side */}
          <motion.div 
             layout
             key="auth-form-panel"
             transition={{ type: "spring", stiffness: 200, damping: 25, mass: 1 }}
             className={`flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-20 xl:px-32 z-10 bg-white dark:bg-gray-900 ${
               isSignUp ? 'lg:order-last' : 'lg:order-first'
             }`}
          >
             {/* 
                The children (Form content) change, but we want the CONTAINER to slide. 
                We use a simple fade for the content change to decouple it from the slide.
             */}
             <AnimatePresence mode="wait">
                <motion.div
                  key={isSignUp ? "signup-form" : "signin-form"}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  {children}
                </motion.div>
             </AnimatePresence>
          </motion.div>

          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </motion.div>
      </ThemeProvider>
    </div>
  );
}

function BrandBanner({ isSignUp }: { isSignUp: boolean }) {
  return (
    <motion.div 
      className="w-full h-full relative overflow-hidden"
      animate={{
        background: isSignUp 
          ? [
              "linear-gradient(135deg, #3C50E0 0%, #0FADCF 100%)", // Blue to Cyan
              "linear-gradient(135deg, #10B981 0%, #3C50E0 100%)", // Green to Blue
              "linear-gradient(135deg, #3C50E0 0%, #0FADCF 100%)" 
            ]
          : [
              "linear-gradient(135deg, #0FADCF 0%, #3C50E0 100%)", 
              "linear-gradient(135deg, #3C50E0 0%, #10B981 100%)", 
              "linear-gradient(135deg, #0FADCF 0%, #3C50E0 100%)"
            ]
      }}
      transition={{ 
        duration: 10, 
        repeat: Infinity, 
        repeatType: "mirror" 
      }}
    >
      <div className="absolute inset-0 bg-white/10 pointer-events-none" />
      
      <div className="relative h-full items-center justify-center flex flex-col z-1 text-white text-center px-12">
        <GridShape />
        
        <div className="flex flex-col items-center max-w-sm">
          <Link href="/" className="block mb-8 hover:scale-105 transition-transform duration-300">
            <Image
              width={280}
              height={60}
              src="/images/logo/logo-name.svg"
              alt="Logo"
              className="drop-shadow-xl"
              style={{ height: "auto" }}
            />
          </Link>
          <motion.div
            key={isSignUp ? "signup-text" : "signin-text"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
              {isSignUp ? "Join the Revolution" : "Welcome Back"}
            </h2>
            <p className="text-gray-100/80 leading-relaxed shadow-sm">
              {isSignUp 
                ? "Create an account to start scraping specifically tailored data for your business needs."
                : "Sign in to manage your scrapers, view analytics, and export your data."
              }
            </p>
          </motion.div>
          
          <div className="mt-12 flex gap-4">
             <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
             <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse [animation-delay:200ms]" />
             <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse [animation-delay:400ms]" />
          </div>
        </div>
      </div>

      {/* Animated blobs for "mix effect" */}
      <motion.div 
        animate={{ 
          x: [0, 100, 0], 
          y: [0, -50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" 
      />
      <motion.div 
         animate={{ 
          x: [0, -100, 0], 
          y: [0, 50, 0],
          scale: [1, 1.5, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-400/20 rounded-full blur-3xl" 
      />
    </motion.div>
  );
}
