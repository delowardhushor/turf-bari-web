import { Suspense } from "react";
import type { Metadata } from "next";
import GroundDetail from "@/components/turf/GroundDetail";
import { PageSpinner } from "@/components/ui/Feedback";

export const metadata: Metadata = { title: "Turf details | TurfBari" };

export default async function GroundPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // GroundDetail keeps the chosen date / sport / slot in the URL
  return (
    <Suspense fallback={<PageSpinner />}>
      <GroundDetail id={id} />
    </Suspense>
  );
}
