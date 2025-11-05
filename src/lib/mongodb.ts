import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectToDatabase(): Promise<Connection> {
  if (cached.conn && cached.conn.readyState === 1) {
    return cached.conn;
  }

  const opts = {
    bufferCommands: false,
    maxPoolSize: 10,
    autoCreate: true,
    autoIndex: true,
    serverSelectionTimeoutMS: 10000,
  };

  const maxRetries = 3;
  let attempt = 0;

  async function tryConnect(): Promise<Connection> {
    attempt++;
    try {
      const mongooseInstance = await mongoose.connect(MONGODB_URI, opts);
      return mongooseInstance.connection;
    } catch (err) {
      console.warn(`MongoDB connection attempt ${attempt} failed`);
      if (attempt < maxRetries) {
        const delay = 2000 * attempt;
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
        return tryConnect();
      }
      console.error("MongoDB failed after 3 retries:", err);
      throw err;
    }
  }

  if (!cached.promise) {
    cached.promise = tryConnect();
  }

  try {
    cached.conn = await cached.promise;

    if (process.env.NODE_ENV !== "production") {
      console.log("Connected to MongoDB Atlas");
    }

    cached.conn.on("disconnected", async () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
      try {
        const reconnected = await mongoose.connect(MONGODB_URI, opts);
        cached.conn = reconnected.connection; // fixed
        console.log("MongoDB reconnected successfully");
      } catch (err) {
        console.error("MongoDB reconnection failed:", err);
      }
    });

    cached.conn.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    const gracefulExit = async () => {
      if (cached.conn && cached.conn.readyState === 1) {
        try {
          await mongoose.connection.close();
          console.log("MongoDB connection closed gracefully");
          process.exit(0);
        } catch (err) {
          console.error("Error during MongoDB graceful shutdown:", err);
          process.exit(1);
        }
      } else {
        process.exit(0);
      }
    };

    process.on("SIGINT", gracefulExit);
    process.on("SIGTERM", gracefulExit);
    process.on("SIGQUIT", gracefulExit);
  } catch (err) {
    cached.promise = null;
    console.error("MongoDB connection error:", err);
    throw err;
  }

  return cached.conn;
}
