import { Suspense } from "react";
import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import BookingDetail from "@/components/bookings/BookingDetail";
import { PageSpinner } from "@/components/ui/Feedback";

export const metadata: Metadata = { title: "Booking details | TurfBari" };

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // BookingDetail reads ?new=1 (set right after booking) from the URL
  return (
    <RequireAuth>
      <Suspense fallback={<PageSpinner />}>
        <BookingDetail id={id} />
      </Suspense>
    </RequireAuth>
  );
}
