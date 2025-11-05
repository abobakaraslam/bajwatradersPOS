import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  lastActivity: { type: Date, default: Date.now },
});

export default mongoose.models.Session ||
  mongoose.model("Session", sessionSchema);
