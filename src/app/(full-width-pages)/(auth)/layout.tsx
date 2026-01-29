import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0 overflow-hidden">
          {/* Form Side */}
          <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-20 xl:px-32 z-10 transition-all duration-500">
            {children}
          </div>

          {/* Banner/Brand Side */}
          <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-transparent pointer-events-none" />
            
            <div className="relative items-center justify-center flex flex-col z-1 text-white text-center px-12">
              {/* <!-- ===== Common Grid Shape Start ===== --> */}
              <GridShape />
              
              <div className="flex flex-col items-center max-w-sm">
                <Link href="/" className="block mb-8 hover:scale-105 transition-transform duration-300">
                  <Image
                    width={231}
                    height={48}
                    src="/images/logo/auth-logo.svg"
                    alt="Logo"
                    className="drop-shadow-xl"
                  />
                </Link>
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Welcome to our Premium Dashboard
                </h2>
                <p className="text-gray-400 dark:text-white/60 leading-relaxed">
                  Start your journey with the most advanced scraper and automation platform. Beautiful, powerful, and easy to use.
                </p>
                
                {/* Visual Decorative Element */}
                <div className="mt-12 flex gap-4">
                   <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                   <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse [animation-delay:200ms]" />
                   <div className="w-2 h-2 rounded-full bg-brand-300 animate-pulse [animation-delay:400ms]" />
                </div>
              </div>
            </div>

            {/* Background decorative circles */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-700/10 rounded-full blur-3xl" />
          </div>

          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
