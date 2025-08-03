// src/app/api/upgrade-tier/route.ts

import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { NextResponse } from "next/server";

const TIER_ORDER = ["free", "silver", "gold", "platinum"];

// Clerk client initialized
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const currentTier = (user.publicMetadata?.tier as string) || "free";
    const nextTier = TIER_ORDER[TIER_ORDER.indexOf(currentTier) + 1];

    if (!nextTier) {
      return NextResponse.json({ message: "Already at top tier" });
    }

    await clerkClient.users.updateUser(userId, {
      publicMetadata: { tier: nextTier },
    });

    return NextResponse.json({ message: `Upgraded to ${nextTier}` });
  } catch (error: any) {
    console.error("Upgrade failed:", error);
    return NextResponse.json({ error: "Upgrade failed" }, { status: 500 });
  }
}
