'use client';

import { useEffect, useState } from "react";
import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TIER_ORDER = ["free", "silver", "gold", "platinum"];

type Event = {
  id: number;
  title: string;
  description: string;
  event_date: string;
  image_url: string;
  tier: string;
};

export default function HomePage() {
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const userTier = (user?.publicMetadata?.tier as string) || "free";
  const allowedTiers = TIER_ORDER.slice(0, TIER_ORDER.indexOf(userTier) + 1);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("events")
        .select("*")
        .in("tier", allowedTiers)
        .order("event_date", { ascending: true });
      if (data) setEvents(data);
      setLoading(false);
    };

    if (user) fetchEvents();
  }, [user, userTier]);

const handleUpgrade = async () => {
  const res = await fetch("/api/upgrade-tier", {
    method: "POST",
  });

  if (!res.ok) {
    alert("Failed to upgrade tier.");
    return;
  }

  const json = await res.json();
  alert(json.message);
  window.location.reload();
};



  return (
    <main className="p-6 max-w-4xl mx-auto">
      <SignedOut>
  <div className="relative h-[100vh] w-full flex flex-col justify-center items-center text-center">
    {/* Center Content */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold mb-6">Tier Based-Event Showcase</h1>
      <SignInButton mode="modal">
        <button className="px-6 py-3 bg-blue-600 text-white text-lg rounded-xl shadow hover:bg-blue-700 transition">
          Sign In / Sign Up
        </button>
      </SignInButton>
    </motion.div>

    {/* Bottom Name */}
    <div className="absolute bottom-6 text-center">
      <h5 className="text-xl font-semibold">Debabrata</h5>
    </div>
  </div>
</SignedOut>


      <SignedIn>
        <h1 className="text-3xl font-bold mb-6">
          Welcome, {user?.firstName || user?.username}
        </h1>
        <p className="mb-4">
          Your Tier: <strong>{userTier}</strong>
        </p>
        <button
          onClick={handleUpgrade}
          disabled={userTier === "platinum"}
          className="mb-6 px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
        >
          {userTier !== "platinum"
            ? `Upgrade to ${TIER_ORDER[TIER_ORDER.indexOf(userTier) + 1]}`
            : "You're at the top tier"}
        </button>

        {loading && <p className="text-gray-500">Loading events...</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-2xl p-4 shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
              <p className="text-xs text-gray-400">Tier: {event.tier}</p>
              <p className="text-xs">
                Date: {new Date(event.event_date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </SignedIn>
    </main>
  );
}
