import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Premium Dashboard",
  description: "Securely sign in to your account.",
};

export default function SignIn() {
  return <SignInForm />;
}
