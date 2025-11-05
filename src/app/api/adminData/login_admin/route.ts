import { NextResponse } from "next/server";
import Admin from "@/models/Admin";
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

    // Connect to the MongoDB database
    await connectToDatabase();
    // Find the admin with the matching email
    const admin = await Admin.findOne({ email });

    // If user is not found or password is incorrect
    if (!admin) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare hashed password with provided password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }
    
      const sessionId = crypto.randomBytes(32).toString("hex");
      //console.log("sessionId: ", sessionId)
      const token = crypto.randomBytes(64).toString("hex");
      //console.log("token: ", token)
    
      const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min
    
      const session_create = await Session.create({ sessionId, userId: admin._id, token, expiresAt });
      
    
      cookies().set("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 30,
        path: "/",
      });
    
      return Response.json({ status: "OK", message: "Login successful" });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to log in. Please try again later.",
    });
  } finally {
  }
}
