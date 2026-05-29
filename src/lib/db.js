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
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Migrate Products
    const products = await Product.find({ image: { $regex: /^data:image/ } });
    if (products.length > 0) {
      await fs.mkdir(uploadDir, { recursive: true });
      console.log(`[Migration] Found ${products.length} products with base64 images. Starting migration...`);
      for (const prod of products) {
        const matches = prod.image.match(/^data:(image\/\w+);base64,(.+)$/);
        if (matches) {
          const type = matches[1];
          const base64Data = matches[2];
          const ext = '.' + type.split('/')[1];
          const filename = `migrated-prod-${prod._id}-${Date.now()}${ext}`;
          const filepath = path.join(uploadDir, filename);
          await fs.writeFile(filepath, Buffer.from(base64Data, 'base64'));
          
          prod.image = `/uploads/${filename}`;
          await prod.save();
          console.log(`[Migration] Migrated product "${prod.name}" image to filesystem.`);
        }
      }
    }

    // Migrate Categories
    const categories = await Category.find({ image: { $regex: /^data:image/ } });
    if (categories.length > 0) {
      await fs.mkdir(uploadDir, { recursive: true });
      console.log(`[Migration] Found ${categories.length} categories with base64 images. Starting migration...`);
      for (const cat of categories) {
        const matches = cat.image.match(/^data:(image\/\w+);base64,(.+)$/);
        if (matches) {
          const type = matches[1];
          const base64Data = matches[2];
          const ext = '.' + type.split('/')[1];
          const filename = `migrated-cat-${cat._id}-${Date.now()}${ext}`;
          const filepath = path.join(uploadDir, filename);
          await fs.writeFile(filepath, Buffer.from(base64Data, 'base64'));
          
          cat.image = `/uploads/${filename}`;
          await cat.save();
          console.log(`[Migration] Migrated category "${cat.name}" image to filesystem.`);
        }
      }
    }
  } catch (error) {
    console.error('[Migration] Error migrating base64 images:', error);
  }
}

export async function ensureSeeded() {
  try {
    await connectDB();
    // Run base64 image migration in background to not block database ready event
    migrateBase64Images().catch(err => console.error('[Migration] Failed to migrate base64 images:', err));
  } catch (error) {
    console.error('[Database Connection] Warning: Failed to connect to database:', error);
  }
}

export default connectDB;

