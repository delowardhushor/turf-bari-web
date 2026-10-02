import { Suspense } from "react";
import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";
import { PageSpinner } from "@/components/ui/Feedback";

export const metadata: Metadata = { title: "Create account | TurfBari" };

export default function SignupPage() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <SignupForm />
    </Suspense>
  );
}
