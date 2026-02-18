import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password | BrandSight",
  description: "Reset your account password.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
