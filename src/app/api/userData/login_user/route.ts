/* File: src/app/api/userData/login_user/route.ts */

import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { cookies } from "next/headers";
import crypto from "crypto";
import Session from "@/models/Session";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: "Email and password are required.",
      });
    }

    await connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Create session
    const sessionId = crypto.randomBytes(32).toString("hex");
    const token = crypto.randomBytes(64).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min expiry

    await Session.create({ sessionId, userId: user._id, token, expiresAt });

    // Cookie settings
    const isProduction = process.env.NODE_ENV === "production";

    cookies().set("sessionId", sessionId, {
      httpOnly: true,
      secure: false,                 
      sameSite: isProduction ? "none" : "lax", // Allow cross-site cookies in prod
      maxAge: 60 * 30,                      // 30 minutes
      path: "/",                            // Available across site
      domain: isProduction ? ".edu2skill.online" : undefined, // enables subdomain sharing
    });

    return NextResponse.json({
      success: "OK",
      message: "Login successful",
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to log in. Please try again later.",
    });
  }
}


