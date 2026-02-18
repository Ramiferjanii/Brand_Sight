"use strict";
"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import { account } from "@/lib/appwrite";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // If userId and secret are present, we are in "Update Password" mode
  const isResetMode = !!(userId && secret);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
        // Appwrite requires a valid URL to redirect back to.
        // Assuming the route is /reset-password
        const redirectUrl = `${window.location.origin}/reset-password`;
        await account.createRecovery(email, redirectUrl);
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
        if (!userId || !secret) throw new Error("Missing reset tokens.");
        // Correct signature: userId, secret, password (confirmation checked above)
        await account.updateRecovery(userId, secret, password);
        setSuccess("Password updated successfully! Redirecting to login...");
        setTimeout(() => {
            router.push("/signin");
        }, 2000);
    } catch (err: any) {
         console.error("Reset Update Error:", err);
         setError(err.message || "Failed to update password. content link may be expired.");
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
          {isResetMode ? "Set New Password" : "Reset Password"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {isResetMode 
            ? "Enter your new secure password below." 
            : "Enter your email to receive a reset link."}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-500 text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-500 text-sm font-medium border border-green-100">
          {success}
        </div>
      )}

      {!isResetMode ? (
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
