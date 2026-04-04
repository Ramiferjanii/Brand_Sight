"use client";

import React, { useCallback } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { Joyride as JoyrideBase, STATUS, TooltipRenderProps } from "react-joyride";
import { useTour } from "@/context/TourContext";

// Cast Joyride to bypass strict type mismatch in this library build
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Joyride = JoyrideBase as unknown as React.FC<Record<string, any>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyStep = any;

// ----- Custom Tooltip -----
function CustomTooltip({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  size,
  skipProps,
}: TooltipRenderProps) {
  const isLast = index === size - 1;

  return (
    <div
      {...tooltipProps}
      style={{
        background:
          "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
        borderRadius: "16px",
        boxShadow:
          "0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(147,112,219,0.2)",
        padding: "0",
        maxWidth: "360px",
        width: "360px",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          background: "linear-gradient(90deg, #7c3aed, #4f46e5)",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
            }}
          >
            {(step.data as Record<string, string>)?.emoji || "🚀"}
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "11px",
              fontWeight: "600",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Platform Tour &bull; Step {index + 1} of {size}
          </span>
        </div>
        <button
          {...skipProps}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "none",
            color: "rgba(255,255,255,0.7)",
            cursor: "pointer",
            fontSize: "18px",
            lineHeight: "1",
            padding: "2px 6px",
            borderRadius: "6px",
          }}
          title="Skip tour"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 24px 24px" }}>
        {step.title && (
          <h3
            style={{
              color: "#fff",
              fontSize: "18px",
              fontWeight: "700",
              margin: "0 0 10px",
              letterSpacing: "-0.02em",
            }}
          >
            {step.title as React.ReactNode}
          </h3>
        )}
        <p
          style={{
            color: "rgba(199,210,254,0.9)",
            fontSize: "14px",
            lineHeight: "1.65",
            margin: "0 0 22px",
          }}
        >
          {step.content as React.ReactNode}
        </p>

        {/* Progress dots */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "20px",
          }}
        >
          {Array.from({ length: size }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === index ? "20px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background:
                  i === index ? "#818cf8" : "rgba(255,255,255,0.15)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
          }}
        >
          {index > 0 && (
            <button
              {...backProps}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px",
                color: "rgba(255,255,255,0.8)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "500",
                padding: "8px 16px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.08)";
              }}
            >
              ← Back
            </button>
          )}
          <button
            {...(continuous ? primaryProps : closeProps)}
            style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 15px rgba(124,58,237,0.4)",
              color: "#fff",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              padding: "8px 20px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.transform =
                "translateY(-1px)";
              (e.target as HTMLButtonElement).style.boxShadow =
                "0 6px 20px rgba(124,58,237,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.transform = "translateY(0)";
              (e.target as HTMLButtonElement).style.boxShadow =
                "0 4px 15px rgba(124,58,237,0.4)";
            }}
          >
            {isLast ? "🎉 Let's Go!" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ----- Tour Steps (typed loosely to avoid library type mismatch) -----
const tourSteps: AnyStep[] = [
  {
    target: "body",
    placement: "center",
    disableBeacon: true,
    title: "Welcome to the Platform! 👋",
    content:
      "Let's take a quick 60-second tour so you can hit the ground running. We'll show you the key features one by one.",
    data: { emoji: "👋" },
  },
  {
    target: "[data-tour='sidebar']",
    placement: "right",
    disableBeacon: true,
    title: "Your Navigation Sidebar",
    content:
      "This sidebar is your main control panel. Hover over it to expand, or click the hamburger icon to pin it. All major sections live here.",
    data: { emoji: "🗂️" },
  },
  {
    target: "[data-tour='sidebar-scraping']",
    placement: "right",
    disableBeacon: true,
    title: "Scraping Hub 🕷️",
    content:
      "Start by creating a scraping task. Add a target URL and our engine will extract product data — prices, titles, ratings and more — automatically.",
    data: { emoji: "🕷️" },
  },
  {
    target: "[data-tour='sidebar-analysis']",
    placement: "right",
    disableBeacon: true,
    title: "Analysis & Reports 📊",
    content:
      "Once you have data, run AI-powered analysis. Compare competitors in the Competitor Battle, or generate deep Market Reports using Groq AI.",
    data: { emoji: "📊" },
  },
  {
    target: "[data-tour='ai-insights']",
    placement: "bottom",
    disableBeacon: true,
    title: "AI-Powered Insights 🤖",
    content:
      "Your personal AI analyst reviews all scraped data and surfaces actionable insights. No manual analysis needed — it does the heavy lifting.",
    data: { emoji: "🤖" },
  },
  {
    target: "[data-tour='dashboard-metrics']",
    placement: "top",
    disableBeacon: true,
    title: "Live Dashboard Metrics",
    content:
      "These cards give you real-time totals: active scrapes, products tracked, reviews collected, and average market price — all updated live.",
    data: { emoji: "📈" },
  },
  {
    target: "[data-tour='header-tour-btn']",
    placement: "bottom",
    disableBeacon: true,
    title: "Replay This Tour Anytime",
    content:
      "You can restart this tour at any time by clicking this button in the top bar. That's it — you're all set. Welcome aboard! 🚀",
    data: { emoji: "🎓" },
  },
];

// ----- Main Component -----
export default function ProductTour() {
  const { runTour, stopTour } = useTour();

  const handleCallback = useCallback(
    (data: { status: string }) => {
      if (
        data.status === STATUS.FINISHED ||
        data.status === STATUS.SKIPPED
      ) {
        stopTour();
      }
    },
    [stopTour]
  );

  return (
    <Joyride
      steps={tourSteps}
      run={runTour}
      continuous
      showSkipButton
      scrollToFirstStep
      callback={handleCallback}
      tooltipComponent={CustomTooltip}
      spotlightRadius={12}
      styles={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.55)",
        },
      }}
      floaterProps={{
        styles: {
          floater: { zIndex: 999999 },
          arrow: { color: "#1e1b4b" },
        },
      }}
    />
  );
}
