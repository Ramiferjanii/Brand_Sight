"use client";

import React, { useCallback, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { Joyride as JoyrideBase, STATUS, TooltipRenderProps } from "react-joyride";

// Cast Joyride to bypass strict type mismatch in this library build
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Joyride = JoyrideBase as unknown as React.FC<Record<string, any>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TourStep = any;

// ----- Custom Tooltip (same design as ProductTour) -----
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
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
        borderRadius: "16px",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(147,112,219,0.2)",
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
            Page Guide &bull; Step {index + 1} of {size}
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
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}>
          {Array.from({ length: size }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === index ? "20px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: i === index ? "#818cf8" : "rgba(255,255,255,0.15)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
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
              onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)"; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"; }}
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
              (e.target as HTMLButtonElement).style.transform = "translateY(-1px)";
              (e.target as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(124,58,237,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.transform = "translateY(0)";
              (e.target as HTMLButtonElement).style.boxShadow = "0 4px 15px rgba(124,58,237,0.4)";
            }}
          >
            {isLast ? "🎉 Got it!" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ----- Page Tour Button -----
interface PageTourProps {
  steps: TourStep[];
  label?: string;
}

export default function PageTour({ steps, label = "Take a Tour" }: PageTourProps) {
  const [run, setRun] = useState(false);

  const handleCallback = useCallback((data: { status: string }) => {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      setRun(false);
    }
  }, []);

  return (
    <>
      <Joyride
        steps={steps}
        run={run}
        continuous
        showSkipButton
        scrollToFirstStep
        callback={handleCallback}
        tooltipComponent={CustomTooltip}
        spotlightRadius={12}
        styles={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.55)" } }}
        floaterProps={{
          styles: {
            floater: { zIndex: 999999 },
            arrow: { color: "#1e1b4b" },
          },
        }}
      />
      <button
        onClick={() => setRun(true)}
        title={label}
        style={{
          display: "inline-flex",
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
          padding: "6px 14px",
          transition: "all 0.2s ease",
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(124,58,237,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(124,58,237,0.35)";
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
          <path d="M12 8v4M12 16h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {label}
      </button>
    </>
  );
}
