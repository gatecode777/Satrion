import mongoose from 'mongoose';
import fs from 'node:fs/promises';
import path from 'node:path';
import Product from '../models/Product';
import Category from '../models/Category';

// Custom DNS configuration removed to prevent SRV lookup failures on restricted networks

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

export async function migrateBase64Images() {
  // Disabled: Storing large images locally is not compatible with read-only/serverless platforms like Vercel.
  // Instead, the application now saves highly-compressed, lightweight Base64 strings in the database.
}

export async function ensureSeeded() {
  try {
    await connectDB();
  } catch (error) {
    console.error('[Database Connection] Warning: Failed to connect to database:', error);
  }
}

export default connectDB;

