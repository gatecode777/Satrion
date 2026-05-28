import React from 'react';
import connectDB, { ensureSeeded } from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

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

  const products = await Product.find({}).sort({ createdAt: -1 });
  const categories = await Category.find({});


  // Format MongoDB documents for secure Next.js Server-Client serialization
  const serializedProducts = products.map((p) => {
    const obj = p.toObject ? p.toObject() : p;
    return {
      ...obj,
      id: obj._id ? obj._id.toString() : '',
      _id: obj._id ? obj._id.toString() : '',
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
