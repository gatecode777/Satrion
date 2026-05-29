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

// Global memory cache to bypass slow regional database network round trips
if (!global.dbCache) {
  global.dbCache = {
    categories: null,
    products: null,
    lastFetched: 0
  };
}

export async function getCachedData() {
  const CACHE_TTL = 15 * 1000; // 15 seconds Cache TTL to balance real-time sync with supersonic speed
  const now = Date.now();
  const cache = global.dbCache;

  if (cache.categories && cache.products && (now - cache.lastFetched < CACHE_TTL)) {
    return { categories: cache.categories, products: cache.products };
  }

  await connectDB();

  const [categories, products] = await Promise.all([
    Category.find({ isActive: { $ne: false } }).lean(),
    Product.find({ isActive: { $ne: false } }).select('-image').lean()
  ]);

  cache.categories = categories;
  cache.products = products;
  cache.lastFetched = now;

  return { categories, products };
}

export function invalidateCache() {
  if (global.dbCache) {
    global.dbCache.categories = null;
    global.dbCache.products = null;
    global.dbCache.lastFetched = 0;
  }
}

export async function ensureSeeded() {
  try {
    await connectDB();
  } catch (error) {
    console.error('[Database Connection] Warning: Failed to connect to database:', error);
  }
}

export default connectDB;

