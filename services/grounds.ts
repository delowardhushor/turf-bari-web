import { api } from "./api";
import type { Ground, SearchResult, Slot } from "@/types";

export type SearchParams = {
  date: string;
  sport?: string;
  startTime?: string;
  endTime?: string;
};

export const groundService = {
  list: () => api<Ground[]>("/grounds"),

  get: (id: string) => api<Ground>(`/grounds/${id}`),

  /** Active grounds that still have a free slot for the date / sport / time window. */
  search: (params: SearchParams) =>
    api<SearchResult[]>("/grounds/search", { query: { ...params } }),

  slots: (groundId: string, date: string) =>
    api<Slot[]>("/slots", { query: { groundId, date } }),
};
