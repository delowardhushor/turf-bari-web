import { api } from "./api";
import type { Sport } from "@/types";

// The list is small and changes rarely, so every component shares one request per page load
let cached: Promise<Sport[]> | null = null;

export const sportService = {
  list: () => {
    cached ??= api<Sport[]>("/sports").catch((err) => {
      cached = null; // let the next caller retry
      throw err;
    });
    return cached;
  },
};
