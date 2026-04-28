"use client";

import React from "react";
import Link from "next/link";

export default function HelpCenterButton() {
  return (
    <Link
      href="/help"
      data-tour="header-help-btn"
      title="Open Help Center"
      className="inline-flex items-center gap-1.5 bg-gradient-to-br from-sky-500 to-sky-700 border-none rounded-lg shadow-[0_2px_8px_rgba(14,165,233,0.35)] text-white cursor-pointer text-xs font-semibold p-1.5 sm:px-3 sm:py-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(14,165,233,0.55)] active:translate-y-0 whitespace-nowrap no-underline"
    >
      {/* Question-mark / Help icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
        <path
          d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-1.5 2-2.5 2.5V13"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16.5" r="0.75" fill="white" />
      </svg>
      <span className="hidden sm:inline">Help Center</span>
    </Link>
  );
}
