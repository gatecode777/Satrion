import React, { Suspense } from 'react';
import connectDB, { ensureSeeded, getCachedData } from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ShopClient from '@/components/ShopClient';

export const revalidate = 60; // ISR: rebuild page every 60 seconds

// Static SEO metadata
export const metadata = {
  title: 'Satrion Shop - Premium Gaming Gear & Custom PCs',
  description: 'Shop top-tier custom gaming PCs, mechanical keyboards, precision mice, monitors, and components at Satrion. High-performance gaming gear designed to win.',
  openGraph: {
    title: 'Satrion Shop - Premium Gaming Gear & Custom PCs',
    description: 'Shop top-tier custom gaming PCs, mechanical keyboards, precision mice, monitors, and components at Satrion.',
    type: 'website',
    url: 'https://satrion.in/shop',
  }
};

export default async function ShopPage() {
  await ensureSeeded();

  // Fetch ALL categories and active products from memory cache (0ms DB network round trips!)
  const { categories, products } = await getCachedData();

  const categoryNames = categories.map(c => c.name);

  // Filter products by active categories
  const activeProducts = products.filter(p => categoryNames.includes(p.category));

  // Format MongoDB documents for secure Next.js Server-Client serialization
  const serializedProducts = activeProducts.map((p) => {
    return {
      ...p,
      id: p._id ? p._id.toString() : '',
      _id: p._id ? p._id.toString() : '',
      image: p.image || '',
      createdAt: p.createdAt ? (p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt) : null,
      updatedAt: p.updatedAt ? (p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt) : null,
    };
  });

  const serializedCategories = categories.map((c) => {
    return {
      ...c,
      id: c._id ? c._id.toString() : '',
      _id: c._id ? c._id.toString() : '',
    };
  });

  return (
    <Suspense fallback={<div className="container py-5 text-center"><h4>Loading shop...</h4></div>}>
      <ShopClient 
        allCategories={serializedCategories} 
        allProducts={serializedProducts}
      />
    </Suspense>
  );
}
