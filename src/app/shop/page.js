import React, { Suspense } from 'react';
import connectDB, { ensureSeeded } from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ShopClient from '@/components/ShopClient';

export const dynamic = 'force-dynamic';

// Dynamic SEO metadata based on search parameters
export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  const category = resolvedParams?.category ? decodeURIComponent(resolvedParams.category) : '';
  const query = resolvedParams?.q ? decodeURIComponent(resolvedParams.q) : '';

  let title = 'Satrion Shop - Premium Gaming Gear & Custom PCs';
  let description = 'Shop top-tier custom gaming PCs, mechanical keyboards, precision mice, monitors, and components at Satrion. High-performance gaming gear designed to win.';

  if (category) {
    title = `Shop ${category} - Satrion Shop`;
    description = `Explore high-performance ${category} at Satrion. Quality gaming gear and computer components designed for ultimate speed and reliability.`;
  } else if (query) {
    title = `Search results for "${query}" - Satrion Shop`;
    description = `Browse search results for "${query}" at Satrion. Find premium PC hardware and accessories.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: 'https://satrion.in/shop',
    }
  };
}

export default async function ShopPage() {
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
    <Suspense fallback={<div className="container py-5 text-center"><h4>Loading shop...</h4></div>}>
      <ShopClient 
        initialCategories={serializedCategories} 
        initialProducts={serializedProducts} 
      />
    </Suspense>
  );
}
