"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const LandingCTAAuthButtons: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    return (
      <Link href="/dashboard" className="w-full sm:w-auto">
        <button className="w-full sm:w-auto h-12 px-8 rounded-lg bg-brand-500 text-white font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/25">
          Return to Dashboard
        </button>
      </Link>
    );
  }

  return (
    <>
      <Link href="/signup" className="w-full sm:w-auto">
        <button className="w-full sm:w-auto h-12 px-8 rounded-lg bg-brand-500 text-white font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/25">
          Get Started for Free
        </button>
      </Link>
      <Link href="/signin" className="w-full sm:w-auto">
        <button className="w-full sm:w-auto h-12 px-8 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-all backdrop-blur-md border border-white/10">
          Sign In instead
        </button>
      </Link>
    </>
  );
};

export default LandingCTAAuthButtons;
