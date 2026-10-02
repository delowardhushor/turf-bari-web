import type { Metadata } from "next";
import FaqView from "@/components/pages/FaqView";

export const metadata: Metadata = { title: "FAQs | TurfBari" };

export default function FaqPage() {
  return <FaqView />;
}
