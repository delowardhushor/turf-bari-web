import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function Container({
  children,
  className,
  width = "7xl",
}: {
  children: ReactNode;
  className?: string;
  width?: "md" | "2xl" | "4xl" | "7xl";
}) {
  const max = { md: "max-w-md", "2xl": "max-w-2xl", "4xl": "max-w-4xl", "7xl": "max-w-7xl" }[width];
  return <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", max, className)}>{children}</div>;
}

export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
