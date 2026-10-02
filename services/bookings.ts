import { api } from "./api";
import type { Booking } from "@/types";

export const bookingService = {
  create: (slotId: string, sport?: string) =>
    api<Booking>("/bookings", { method: "POST", body: { slotId, sport } }),

  /** The signed-in customer's own bookings. */
  list: () => api<Booking[]>("/bookings"),

  get: (id: string) => api<Booking>(`/bookings/${id}`),
};
