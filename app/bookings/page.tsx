import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import BookingsView from "@/components/bookings/BookingsView";

export const metadata: Metadata = { title: "My bookings | TurfBari" };

export default function BookingsPage() {
  return (
    <RequireAuth>
      <BookingsView />
    </RequireAuth>
  );
}
