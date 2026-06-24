import mongoose from 'mongoose';
import dns from 'node:dns';
import Product from '../models/Product';
import Category from '../models/Category';

// Fix Windows SRV DNS lookup failures and broken IPv6 network hangs for MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');


let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Lazy check: only throw at runtime (when actually connecting), not during build
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
      family: 4, // Force IPv4 resolution on mongoose/mongodb driver level
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
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL in memory to prevent slow Atlas DB handshakes
  const now = Date.now();
  const cache = global.dbCache;

  if (cache.categories && cache.products && (now - cache.lastFetched < CACHE_TTL)) {
    return { categories: cache.categories, products: cache.products };
  }

  await connectDB();

  const [categories, products] = await Promise.all([
    Category.find({ isActive: { $ne: false } }).lean(),
    Product.find({ isActive: { $ne: false } }).lean()
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
