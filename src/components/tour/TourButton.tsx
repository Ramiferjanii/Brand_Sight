"use client";

import React from "react";
import { useTour } from "@/context/TourContext";

export default function TourButton() {
  const { startTour } = useTour();

  return (
    <button
      data-tour="header-tour-btn"
      onClick={startTour}
      title="Start Platform Tour"
      className="flex items-center gap-1.5 bg-gradient-to-br from-purple-600 to-indigo-600 border-none rounded-lg shadow-[0_2px_8px_rgba(124,58,237,0.35)] text-white cursor-pointer text-xs font-semibold p-1.5 sm:px-3 sm:py-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(124,58,237,0.5)] active:translate-y-0 whitespace-nowrap"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
        <path
          d="M12 8v4M12 16h.01"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="hidden sm:inline">Take a Tour</span>
    </button>
  );
}
