/* File: route.ts located in src/app/auth/login/    */

import { connectToDatabase } from "@/lib/mongodb";
import Session from "@/models/Session";
import User from "@/models/User";
import crypto from "crypto";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await connectToDatabase();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user || user.password !== password)
    return Response.json({ error: "Invalid credentials", success: false,
        message: "Email and password are required.", }, { status: 401 });

  const sessionId = crypto.randomBytes(32).toString("hex");
  const token = crypto.randomBytes(64).toString("hex");

  const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min

  await Session.create({ sessionId, userId: user._id, token, expiresAt });

  cookies().set("sessionId", sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 30,
    path: "/",
  });

  return Response.json({ message: "Login successful" });
}
