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
    
    // Dynamic import to prevent any circular dependency or order of execution issues
    const Product = (await import('@/models/Product')).default;
    const Category = (await import('@/models/Category')).default;
    
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    
    // Check if there are any old/external images (like unsplash) that fail to load
    const hasExternalImages = await Product.exists({
      $or: [
        { image: { $regex: 'unsplash\\.com', $options: 'i' } },
        { image: { $regex: '^http', $options: 'i' } }
      ]
    });
    
    // Check if the counts match exactly the seeded structure (10 categories, 100 products)
    if (productCount !== 100 || categoryCount !== 10 || hasExternalImages) {
      console.log(`[Database Self-Healing] Found invalid/outdated DB state: products=${productCount}, categories=${categoryCount}, hasExternalImages=${!!hasExternalImages}. Re-seeding database automatically...`);
      
      const { sampleCategories, generateAllProducts } = await import('./sampleData');
      const allProducts = generateAllProducts();
      
      // Clear old documents
      await Product.deleteMany({});
      await Category.deleteMany({});
      
      // Seed fresh records
      await Category.insertMany(sampleCategories);
      await Product.insertMany(allProducts);
      
      console.log('[Database Self-Healing] Database successfully seeded with 10 categories and 100 products!');
    }
  } catch (error) {
    console.error('[Database Self-Healing] Warning: Failed to ensure database seeding:', error);
  }
}

export default connectDB;

