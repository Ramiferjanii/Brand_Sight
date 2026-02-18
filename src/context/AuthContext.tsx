"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { Models } from "appwrite";

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  login: (user: Models.User<Models.Preferences>) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    setIsLoading(true);
    let finalUser: Models.User<Models.Preferences> | null = null;

    const fetchSession = async () => {
      try {
        return await account.get();
      } catch (error) {
        return null;
      }
    };

    // First attempt
    finalUser = await fetchSession();
    
    // If failed but we see OAuth params, retry with backoff
    if (!finalUser && typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.has('userId') || params.has('secret')) {
             console.log("OAuth Redirect Detected - Waiting for session to sync...");
             for (let i = 0; i < 3; i++) {
                 await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                 finalUser = await fetchSession();
                 if (finalUser) {
                    console.log("Session sync success!");
                    break;
                 }
             }
        }
    }

    setUser(finalUser);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (userData: Models.User<Models.Preferences>) => {
    setUser(userData);
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
