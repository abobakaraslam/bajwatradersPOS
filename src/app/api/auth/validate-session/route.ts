/* File: src/app/api/auth/validate-session/route.ts */

import { connectToDatabase } from "@/lib/mongodb";
import Session from "@/models/Session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Connect to MongoDB
    const connected2DB = await connectToDatabase();
    if (!connected2DB) {
      return NextResponse.json({ valid: false, reason: "not connected to DB" });
    }

    // Get session cookie
    const sessionId = cookies().get("sessionId")?.value;
    if (!sessionId) {
      return NextResponse.json({ valid: false, reason: "No session get from cookies" });
    }

    // Verify session in DB
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return NextResponse.json({ valid: false, reason: "Invalid session according to our database" });
    }

    // Optionally check expiry
    if (session.expiresAt && session.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, reason: "Session expired" });
    }

    return NextResponse.json({ valid: true });
  } catch (err) {
    console.error("validate-session error:", err);
    return NextResponse.json({ valid: false, reason: "Server error" });
  }
}
