import type { Metadata } from "next";
import AboutView from "@/components/pages/AboutView";

export const metadata: Metadata = { title: "About us | TurfBari" };

export default function AboutPage() {
  return <AboutView />;
}
