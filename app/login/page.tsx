import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import { PageSpinner } from "@/components/ui/Feedback";

export const metadata: Metadata = { title: "Sign in | TurfBari" };

export default function LoginPage() {
  // LoginForm reads ?next= from the URL
  return (
    <Suspense fallback={<PageSpinner />}>
      <LoginForm />
    </Suspense>
  );
}
