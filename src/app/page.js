import React from 'react';
import connectDB, { ensureSeeded } from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import HomeClient from '@/components/HomeClient';

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
  await ensureSeeded();

  // Fetch registered active categories first
  const categories = await Category.find({ isActive: { $ne: false } }).lean();
  const categoryNames = categories.map(c => c.name);

  // Fetch only products belonging to the active categories
  const products = await Product.find({
    homepageSection: { 
      $in: ['Featured Products', 'Bestsellers', 'Our Range of Gaming Products'] 
    },
    isActive: { $ne: false },
    category: { $in: categoryNames }
  }).sort({ createdAt: -1 }).lean();

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
