"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ResetPasswordForm() {
  const router = useRouter();
  const { user } = useAuth(); // If user is logged in (via reset link), we show update form
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    // Check if we are in recovery mode (Supabase sets a session after clicking the link)
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
      }
    });

    // Check for errors in the URL hash or query params
    const params = new URLSearchParams(window.location.search);
    const errorDescription = params.get("error_description");
    if (errorDescription) {
        setError(decodeURIComponent(errorDescription));
    }

    // Handle PKCE Code Exchange if present (though supabase-js usually handles this)
    const code = params.get("code");
    if (code && !user) {
        supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
            if (!error && data.session) {
                setRecoveryMode(true);
            } else if (error) {
                setError(error.message);
            }
        });
    }

    // If user is already authenticated (and presumably here to reset password from link)
    if (user) {
        setRecoveryMode(true);
    }
  }, [user]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
        const redirectUrl = `${window.location.origin}/reset-password`;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl,
        });
        if (error) throw error;
        setSuccess("Check your email for a password reset link.");
    } catch (err: any) {
        console.error("Reset Request Error:", err);
        setError(err.message || "Failed to send reset email.");
    } finally {
        setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }
    
    if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
    }

    setLoading(true);

    try {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        
        setSuccess("Password updated successfully! Redirecting to dashboard...");
        setTimeout(() => {
            router.push("/dashboard");
        }, 2000);
    } catch (err: any) {
         console.error("Reset Update Error:", err);
         setError(err.message || "Failed to update password. Please try again.");
    } finally {
         setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-10">
        <Link
          href="/signin"
          className="inline-flex items-center text-sm font-medium text-gray-400 transition-colors hover:text-brand-500 dark:text-gray-500 dark:hover:text-brand-400 mb-6 group"
        >
          <ChevronLeftIcon className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Sign In
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white/90 mb-2">
          {recoveryMode ? "Set New Password" : "Reset Password"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {recoveryMode 
            ? "Enter your new secure password below." 
            : "Enter your email to receive a reset link."}
        </p>
        
        {user && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-200 text-sm rounded-lg flex justify-between items-center">
                <span>Logged in as <strong>{user.email}</strong></span>
                <button 
                    onClick={() => { supabase.auth.signOut(); window.location.reload(); }}
                    className="underline hover:text-blue-800 dark:hover:text-blue-100"
                >
                    Sign Out
                </button>
            </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-500 text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 rounded-lg bg-green-50 text-green-700 text-sm border border-green-100 shadow-sm">
          <p className="font-semibold mb-1">Email Sent!</p>
          <p>{success}</p>
          <ul className="list-disc list-inside mt-2 text-xs text-green-600 space-y-1">
            <li>Check your <strong>Spam</strong> or <strong>Junk</strong> folder.</li>
            <li>It may take a few minutes to arrive.</li>
          </ul>
        </div>
      )}

      {!recoveryMode ? (
        // Request Reset Form
        <form className="space-y-5" onSubmit={handleRequestReset}>
            <div>
            <Label>Email Address</Label>
            <Input
                placeholder="name@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            </div>
            <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/20 active:scale-[0.98]"
            >
            {loading ? "Sending..." : "Send Reset Link"}
            </Button>
        </form>
      ) : (
        // Update Password Form
        <form className="space-y-5" onSubmit={handleUpdatePassword}>
            <div>
            <Label>New Password</Label>
            <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </div>
            <div>
            <Label>Confirm Password</Label>
            <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            </div>
            <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/20 active:scale-[0.98]"
            >
            {loading ? "Updating..." : "Update Password"}
            </Button>
        </form>
      )}
    </div>
  );
}

