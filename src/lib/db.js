import mongoose from 'mongoose';
// Custom DNS configuration removed to prevent SRV lookup failures on restricted networks

import dns from 'node:dns/promises';

if (!process.env.VERCEL) {
  try {
    dns.setServers(['1.1.1.1']);
  } catch (err) {
    console.warn('Failed to set custom DNS servers:', err);
  }
}

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
    
    // Dynamic import to prevent any circular dependency or order of execution issues
    const Product = (await import('@/models/Product')).default;
    const Category = (await import('@/models/Category')).default;
    
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    
    // Only seed if the collections are completely empty to prevent overwriting user modifications
    if (productCount === 0 && categoryCount === 0) {
      console.log(`[Database Seeding] Database is empty. Seeding with default categories and products...`);
      
      const { sampleCategories, generateAllProducts } = await import('./sampleData');
      const allProducts = generateAllProducts();
      
      // Seed fresh records
      await Category.insertMany(sampleCategories);
      await Product.insertMany(allProducts);
      
      console.log('[Database Seeding] Database successfully seeded with 10 categories and 100 products!');
    }
  } catch (error) {
    console.error('[Database Seeding] Warning: Failed to ensure database seeding:', error);
  }
}

export default connectDB;

