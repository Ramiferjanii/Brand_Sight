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
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
        border: "none",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(124,58,237,0.35)",
        color: "#fff",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "600",
        padding: "6px 12px",
        transition: "all 0.2s ease",
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget).style.transform = "translateY(-1px)";
        (e.currentTarget).style.boxShadow = "0 4px 15px rgba(124,58,237,0.5)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget).style.transform = "translateY(0)";
        (e.currentTarget).style.boxShadow = "0 2px 8px rgba(124,58,237,0.35)";
      }}
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
      Take a Tour
    </button>
  );
}
