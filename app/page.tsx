"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Search,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  Flame,
  Star,
  Users,
  Award,
  ArrowRight,
} from "lucide-react";

// Mock featured turfs
const FEATURED_TURFS = [
  {
    id: 1,
    name: "Uttara Arena Turf",
    location: "Sector 11, Uttara, Dhaka",
    rating: 4.8,
    reviews: 124,
    price: 1500,
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop",
    type: "5-a-Side & 7-a-Side",
    tags: ["Indoor", "Floodlights", "Free Parking"],
  },
  {
    id: 2,
    name: "Campion Sports Complex",
    location: "Mirpur 12, Dhaka",
    rating: 4.9,
    reviews: 98,
    price: 1800,
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=600&auto=format&fit=crop",
    type: "7-a-Side Only",
    tags: ["Natural Grass", "Shower Room", "Cafeteria"],
  },
  {
    id: 3,
    name: "Green Field Turf",
    location: "Gulshan 2, Dhaka",
    rating: 4.7,
    reviews: 156,
    price: 2200,
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=600&auto=format&fit=crop",
    type: "5-a-Side Only",
    tags: ["Rooftop", "Floodlights", "Waiting Lounge"],
  },
];

export default function Home() {
  const [sport, setSport] = useState("football");
  const [location, setLocation] = useState("Uttara");
  const [date, setDate] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-950">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.50),white)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.zinc.900),theme(colors.zinc.950))] opacity-70" />
        <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center lg:max-w-4xl lg:mx-auto">
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
            >
              <Flame className="h-3.5 w-3.5 fill-current animate-pulse" />
              Easy Turf Booking in Bangladesh
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl dark:text-zinc-50"
            >
              Book Your Perfect Game in{" "}
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 bg-clip-text text-transparent">
                Seconds
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400 max-w-2xl"
            >
              Discover high-quality football fields and cricket pitches near you. Choose your slot, book online, and get ready to play.
            </motion.p>

            {/* Search / Booking Bar */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 w-full max-w-3xl rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Searching for ${sport} turfs in ${location}...`);
                }}
                className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-2 items-center"
              >
                {/* Sport Selection */}
                <div className="flex flex-col items-start px-2 py-1 text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Sport
                  </span>
                  <select
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="mt-1 w-full bg-transparent text-sm font-semibold text-zinc-800 focus:outline-none dark:text-zinc-100"
                  >
                    <option value="football">Football</option>
                    <option value="cricket">Cricket</option>
                    <option value="futsal">Futsal</option>
                  </select>
                </div>

                {/* Location Selection */}
                <div className="flex flex-col items-start px-2 py-1 text-left md:border-l md:border-zinc-200 dark:md:border-zinc-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Location
                  </span>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 w-full bg-transparent text-sm font-semibold text-zinc-800 focus:outline-none dark:text-zinc-100"
                  >
                    <option value="Uttara">Uttara, Dhaka</option>
                    <option value="Mirpur">Mirpur, Dhaka</option>
                    <option value="Gulshan">Gulshan, Dhaka</option>
                    <option value="Banani">Banani, Dhaka</option>
                    <option value="Dhanmondi">Dhanmondi, Dhaka</option>
                  </select>
                </div>

                {/* Date Input */}
                <div className="flex flex-col items-start px-2 py-1 text-left md:border-l md:border-zinc-200 dark:md:border-zinc-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Date
                  </span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full bg-transparent text-sm font-semibold text-zinc-800 focus:outline-none dark:text-zinc-100"
                  />
                </div>

                {/* Submit Button */}
                <div className="h-full pt-2 md:pt-0">
                  <button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-[0.98]"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Why Book Through TurfBari?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">
              We provide the smoothest sports booking experience with premium facilities.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* Feature 1 */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-zinc-200/50 bg-white shadow-sm transition-all hover:shadow-md hover:scale-[1.02] dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Instant Confirmation
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                No more phone calls. Select your desired time slot and receive immediate confirmation.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-zinc-200/50 bg-white shadow-sm transition-all hover:shadow-md hover:scale-[1.02] dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Verified Locations
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                We verify turf dimensions, pitch quality, and onsite amenities so you get exactly what you see.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-zinc-200/50 bg-white shadow-sm transition-all hover:shadow-md hover:scale-[1.02] dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Secure Payments
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Pay safely via bKash, Nagad, cards, or other gateways with flexible refund options.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-zinc-200/50 bg-white shadow-sm transition-all hover:shadow-md hover:scale-[1.02] dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Reward Points
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Earn booking loyalty points and redeem them for free matches and discounts on tournaments.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Turfs Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Featured Venues
              </h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Top-rated arenas with active bookings right now.
              </p>
            </div>
            <Link
              href="/turfs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {FEATURED_TURFS.map((turf) => (
              <motion.div
                key={turf.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Image & Type tag */}
                <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={turf.image}
                    alt={turf.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-zinc-900 shadow-sm dark:bg-zinc-900/95 dark:text-zinc-50">
                    {turf.type}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <div className="flex items-center gap-1 text-emerald-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-bold">{turf.rating}</span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      ({turf.reviews} reviews)
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {turf.name}
                  </h3>

                  <p className="mt-1 flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {turf.location}
                  </p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {turf.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                    <div>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">Price Starts At</span>
                      <p className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                        ৳{turf.price} <span className="text-xs font-normal text-zinc-400">/ Hour</span>
                      </p>
                    </div>
                    <Link
                      href={`/turfs/${turf.id}`}
                      className="rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/60"
                    >
                      Book Slot
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action banner */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-12 shadow-xl sm:px-12 sm:py-20">
            {/* Background elements */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(30rem_30rem_at_right,theme(colors.teal.500),transparent)] opacity-40" />
            
            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Ready to dominate the pitch?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-100">
                Secure your slot, invite your friends, and make every match count.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/turfs"
                  className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-md transition-all hover:bg-emerald-50 hover:scale-[1.02]"
                >
                  Find a Turf Near You
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl border border-white px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  Register as Turf Owner
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
