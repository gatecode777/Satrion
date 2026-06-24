import React from 'react';
import { getCachedData } from '@/lib/db';
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
  // getCachedData() properly awaits connectDB() and propagates connection errors
  // instead of silently swallowing them like ensureSeeded() did.
  const { categories, products: allProducts } = await getCachedData();

  // Fetch only products belonging to homepage sections
  const homepageSections = new Set(['Featured Products', 'Bestsellers', 'Our Range of Gaming Products']);
  const products = allProducts.filter(p => homepageSections.has(p.homepageSection));

  // Format MongoDB documents for secure Next.js Server-Client serialization
  const serializedProducts = products.map((p) => {
    const obj = p.toObject ? p.toObject() : p;
    return {
      ...obj,
      id: obj._id ? obj._id.toString() : '',
      _id: obj._id ? obj._id.toString() : '',
      image: obj.image || '', // Compressed Base64 payload is fully lightweight now
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
