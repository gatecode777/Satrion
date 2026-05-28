import React from 'react';
import connectDB, { ensureSeeded } from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import HomeClient from '@/components/HomeClient';
import { sampleCategories, generateAllProducts } from '@/lib/sampleData';

// ISR: page is statically cached, refreshes in background every 60 seconds
// This eliminates the 4,830ms document request latency from force-dynamic
export const revalidate = 60;

// Server-rendered metadata for search engine indexing
export const metadata = {
  title: 'Satrion Shop - Premium Gaming Gear & Custom PCs',
  description: 'Shop top-tier custom gaming PCs, mechanical keyboards, precision mice, monitors, and components at Satrion. High-performance gaming gear designed to win.',
  openGraph: {
    title: 'Satrion Shop - Premium Gaming Gear & Custom PCs',
    description: 'Shop top-tier custom gaming PCs, mechanical keyboards, precision mice, monitors, and components at Satrion.',
    type: 'website',
    url: 'https://satrion.in',
  }
};

export default async function Home() {
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

  let products = [];
  let categories = [];

  if (isBuildTime) {
    // Return mock data during compile-time static generation to guarantee lightning-fast builds
    // and prevent any database connection hangs/timeouts in the Vercel build container
    products = generateAllProducts();
    categories = sampleCategories;
  } else {
    try {
      await ensureSeeded();
      products = await Product.find({
        homepageSection: { 
          $in: ['Featured Products', 'Bestsellers', 'Our Range of Gaming Products'] 
        },
        isActive: { $ne: false }
      }).sort({ createdAt: -1 }).lean();
      categories = await Category.find({}).lean();
    } catch (err) {
      console.error('Database connection failed, falling back to sample data:', err);
      products = generateAllProducts();
      categories = sampleCategories;
    }
  }

  // Format MongoDB documents for secure Next.js Server-Client serialization
  const serializedProducts = products.map((p) => {
    const obj = p.toObject ? p.toObject() : p;
    return {
      ...obj,
      id: obj._id ? obj._id.toString() : '',
      _id: obj._id ? obj._id.toString() : '',
      image: '', // Strip massive Base64 payload on server to bypass Vercel ISR body size limits
      createdAt: obj.createdAt ? obj.createdAt.toISOString() : null,
      updatedAt: obj.updatedAt ? obj.updatedAt.toISOString() : null,
    };
  });

  const serializedCategories = categories.map((c) => {
    const obj = c.toObject ? c.toObject() : c;
    return {
      ...obj,
      id: obj._id ? obj._id.toString() : '',
      _id: obj._id ? obj._id.toString() : '',
    };
  });

  return (
    <HomeClient 
      initialCategories={serializedCategories} 
      initialProducts={serializedProducts} 
    />
  );
}
