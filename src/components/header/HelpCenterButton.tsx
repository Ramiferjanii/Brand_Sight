"use client";

import React from "react";
import Link from "next/link";

export default function HelpCenterButton() {
  return (
    <Link
      href="/help"
      data-tour="header-help-btn"
      title="Open Help Center"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
        border: "none",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(14,165,233,0.35)",
        color: "#fff",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "600",
        padding: "6px 12px",
        transition: "all 0.2s ease",
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
          "0 4px 15px rgba(14,165,233,0.55)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
          "0 2px 8px rgba(14,165,233,0.35)";
      }}
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
      Help Center
    </Link>
  );
}
