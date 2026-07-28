import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DBNAME || process.env.BDNAME;

function getMongoUri(): string {
  if (!uri) {
    throw new Error("Please add your MONGODB_URI to .env");
  }
  return uri;
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };

if (!global._mongooseCache) {
  global._mongooseCache = cached;
}

/**
 * Cached Mongoose connection for Next.js (avoids hot-reload connection storms).
 * Pattern aligned with production MongoDB setups (pool + optional Atlas Server API).
 */
export async function dbConnect(): Promise<typeof mongoose> {
  const connectionUri = getMongoUri();

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 5,
    };

    if (dbName) {
      options.dbName = dbName;
    }

    if (connectionUri.includes("mongodb.net")) {
      options.serverApi = {
        version: "1",
        strict: true,
        deprecationErrors: true,
      };
    }

    cached.promise = mongoose.connect(connectionUri, options).then((instance) => {
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[db] Mongoose connected${dbName ? ` (database: ${dbName})` : ""}`,
        );
      }
      return instance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("Global MongoDB Connection Error:", error);
    throw error;
  }

  return cached.conn;
}
