
import { connectToDatabase } from "@/lib/mongodb";
import Session from "@/models/Session";
import { cookies } from "next/headers";

export async function GET() {
  await connectToDatabase();
  const sessionId = cookies().get("sessionId")?.value;
  if (!sessionId)
    return Response.json({ valid: false, reason: "No session" });

  const session = await Session.findOne({ sessionId });
  if (!session)
    return Response.json({ valid: false, reason: "Invalid session" });

  return Response.json({ valid: true });
}
