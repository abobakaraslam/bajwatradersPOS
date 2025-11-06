
import { connectToDatabase } from "@/lib/mongodb";
import Session from "@/models/Session";
import { cookies } from "next/headers";

export async function GET() {
  const connected2DB  = await connectToDatabase();
  if (!connected2DB) {
    return Response.json({ valid: false, reason: "not connected to DB" });
  }
  const sessionId = cookies().get("sessionId")?.value;
  if (!sessionId)
    return Response.json({ valid: false, reason: "No session get from cookies" });

  const session = await Session.findOne({ sessionId });
  if (!session)
    return Response.json({ valid: false, reason: "Invalid session according to our database" });

  return Response.json({ valid: true });
}
