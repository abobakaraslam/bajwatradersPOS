import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Session from "@/models/Session";

export async function middleware(req: NextRequest) {
  const protectedRoutes = ["/userData/ProfileUser", "/profile"];
  const path = req.nextUrl.pathname;

  const requiresAuth = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  if (!requiresAuth) return NextResponse.next();

  const sessionId = req.cookies.get("sessionId")?.value;
  if (!sessionId) {
    return NextResponse.redirect(new URL("/userData/LoginUser", req.url));
  }

  await connectToDatabase();
  const session = await Session.findOne({ sessionId });

  if (!session) {
    return NextResponse.redirect(new URL("/userData/LoginUser", req.url));
  }

  const now = new Date();

  if (session.expiresAt < now) {
    await Session.deleteOne({ sessionId });
    return NextResponse.redirect(new URL("/userData/LoginUser", req.url));
  }

  // Extend expiry if user is active
  session.lastActivity = now;
  session.expiresAt = new Date(Date.now() + 1000 * 60 * 30);
  await session.save();

  return NextResponse.next();
}

export const config = {
  matcher: ["/userData/ProfileUser/:path*", "/profile/:path*"],
};
