import mongoose from 'mongoose';
// Custom DNS configuration removed to prevent SRV lookup failures on restricted networks

import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1']);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('MongoDB Connected via Next.js connection caching');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export async function ensureSeeded() {
  try {
    await connectDB();
  } catch (error) {
    console.error('[Database Connection] Warning: Failed to connect to database:', error);
  }
}

export default connectDB;

