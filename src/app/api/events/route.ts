// src/app/api/events/route.ts

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TIER_ORDER = ["free", "silver", "gold", "platinum"];

interface ClaimsWithTier {
  publicMetadata?: {
    tier?: string;
  };
}

export async function GET() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const typedClaims = sessionClaims as ClaimsWithTier;
  const userTier = typedClaims.publicMetadata?.tier || "free";
  const allowedTiers = TIER_ORDER.slice(0, TIER_ORDER.indexOf(userTier) + 1);

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .in("tier", allowedTiers)
    .order("event_date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
