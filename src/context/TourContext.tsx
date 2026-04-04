"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface TourContextType {
  runTour: boolean;
  startTour: () => void;
  stopTour: () => void;
  hasSeenTour: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [runTour, setRunTour] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(true); // default true to avoid flicker

  useEffect(() => {
    const seen = localStorage.getItem("platform_tour_completed");
    if (!seen) {
      // Mark as seen RIGHT NOW so any refresh won't re-trigger the auto-start
      localStorage.setItem("platform_tour_completed", "true");
      setHasSeenTour(false);
      // Auto-start after a short delay so the dashboard fully loads first
      const timer = setTimeout(() => {
        setRunTour(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const startTour = useCallback(() => {
    setRunTour(true);
  }, []);

  const stopTour = useCallback(() => {
    setRunTour(false);
    localStorage.setItem("platform_tour_completed", "true");
    setHasSeenTour(true);
  }, []);

  return (
    <TourContext.Provider value={{ runTour, startTour, stopTour, hasSeenTour }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};
