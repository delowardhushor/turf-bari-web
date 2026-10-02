import { Suspense } from "react";
import type { Metadata } from "next";
import TurfSearch from "@/components/turf/TurfSearch";
import { PageSpinner } from "@/components/ui/Feedback";

export const metadata: Metadata = {
  title: "Find a turf | TurfBari",
  description: "Search turfs by date, sport and time and book an open slot.",
};

export default function TurfsPage() {
  // TurfSearch keeps its filters in the URL
  return (
    <Suspense fallback={<PageSpinner />}>
      <TurfSearch />
    </Suspense>
  );
}
