import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Student Login",
  description:
    "Sign in to track your orders, follow progress, and message your expert.",
  alternates: { canonical: "/login" },
  // Account pages shouldn't be indexed.
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Your work, all in one place"
      lead="Sign in to pick up where you left off — orders, deadlines, payments and messages."
    >
      <LoginForm />
    </AuthLayout>
  );
}
