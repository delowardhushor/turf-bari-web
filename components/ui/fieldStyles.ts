export const controlClass =
  "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm transition-all " +
  "placeholder:text-zinc-400 focus:outline-none focus:ring-1 " +
  "dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

export const stateClass = (error?: string) =>
  error
    ? "border-red-400 focus:border-red-500 focus:ring-red-500 dark:border-red-500/70"
    : "border-zinc-300 focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-800 dark:focus:border-emerald-500";
