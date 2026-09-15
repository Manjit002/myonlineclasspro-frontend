import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create Your Account",
  description:
    "Create a MyOnlineClassPro account to place orders and track your classes.",
  alternates: { canonical: "/signup" },
  robots: { index: false, follow: true },
};

export default function SignupPage() {
  return (
    <AuthLayout
      title="Get started in a minute"
      lead="Create an account to place orders, track progress and talk to your expert directly."
    >
      <SignupForm />
    </AuthLayout>
  );
}
