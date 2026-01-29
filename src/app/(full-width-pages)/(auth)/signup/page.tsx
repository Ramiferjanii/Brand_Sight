import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Premium Dashboard",
  description: "Create your account to get started.",
};

export default function SignUp() {
  return <SignUpForm />;
}
