"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PageSpinner } from "@/components/ui/Feedback";
import { useAuth } from "@/contexts/AuthContext";

/** Sends signed-out visitors to the login screen and brings them back afterwards. */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [ready, user, pathname, router]);

  if (!ready || !user) return <PageSpinner />;
  return <>{children}</>;
}
