"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error);
        router.push("/signin?error=auth_failed");
        return;
      }

      if (data.session?.user) {
        const user = data.session.user;
        
        // Sync user to backend
        try {
          await api.post('/auth/sync-user', {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name
          });
        } catch (syncError) {
          console.error("OAuth Sync failed:", syncError);
        }

        login(user); // Update context
        router.push("/dashboard");
      } else {
        router.push("/signin");
      }
    };

    handleCallback();
  }, [router, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Completing login...</h2>
        <p className="text-gray-500 mt-2">Please wait while we set up your session.</p>
      </div>
    </div>
  );
}
