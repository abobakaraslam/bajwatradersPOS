import { connectToDatabase } from "@/lib/mongodb";
import Session from "@/models/Session";
import { cookies } from "next/headers";

export async function POST() {
  await connectToDatabase();
  const sessionId = cookies().get("sessionId")?.value;
  console.log("obtained sessionId for logout", sessionId);

  if (sessionId) {
    const sessionId_get = await Session.deleteOne({ sessionId });
    if(sessionId_get){
      console.log("session id obtained from database", sessionId_get)
      cookies().delete("sessionId");
    }else{
      console.log("No sessionID in database");
    }
    
  }

  return Response.json({ status: "OK", message: "Logged out" });
}
