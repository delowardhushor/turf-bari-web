import Container from "@/components/ui/Container";
import type { ReactNode } from "react";

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative flex flex-1 items-center overflow-hidden py-12 sm:py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_30rem_at_top,theme(colors.emerald.50),transparent)] dark:bg-[radial-gradient(40rem_30rem_at_top,theme(colors.zinc.900),transparent)]" />
      <Container width="md">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">{footer}</div>}
      </Container>
    </div>
  );
}
