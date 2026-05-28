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

export default async function ShopPage({ searchParams }) {
  await ensureSeeded();

  const resolvedParams = await searchParams;
  const category = resolvedParams?.category || 'All';
  const query = resolvedParams?.q || '';
  const sort = resolvedParams?.sort || 'Featured';
  const page = parseInt(resolvedParams?.page || '1', 10);
  const minPrice = parseInt(resolvedParams?.minPrice || '50000', 10);
  const maxPrice = parseInt(resolvedParams?.maxPrice || '150000', 10);

  const itemsPerPage = 9;

  // Build MongoDB query
  const dbQuery = { isActive: { $ne: false } };

  // Category filter
  if (category !== 'All') {
    dbQuery.category = category;
  }

  // Price filter
  dbQuery.price = {
    $gte: minPrice,
    $lte: maxPrice
  };

  // Search filter
  if (query) {
    dbQuery.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } }
    ];
  }

  // Define sort option
  let sortOption = {};
  if (sort === 'A to Z') {
    sortOption = { name: 1 };
  } else if (sort === 'Price: Low to High') {
    sortOption = { price: 1 };
  } else if (sort === 'Price: High to Low') {
    sortOption = { price: -1 };
  } else {
    // Featured / default
    sortOption = { createdAt: -1 };
  }

  // Fetch paginated products and total count
  const products = await Product.find(dbQuery)
    .sort(sortOption)
    .skip((page - 1) * itemsPerPage)
    .limit(itemsPerPage)
    .lean();

  const totalItems = await Product.countDocuments(dbQuery);
  const categories = await Category.find({}).lean();

  // Fetch product counts per category (using server-side aggregation for speed)
  const categoryCounts = await Product.aggregate([
    { $match: { isActive: { $ne: false } } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  const countsMap = {};
  categoryCounts.forEach(c => {
    if (c._id) countsMap[c._id] = c.count;
  });

  const totalProductsCount = await Product.countDocuments({ isActive: { $ne: false } });

  // Format MongoDB documents for secure Next.js Server-Client serialization
  const serializedProducts = products.map((p) => {
    return {
      ...p,
      id: p._id ? p._id.toString() : '',
      _id: p._id ? p._id.toString() : '',
      createdAt: p.createdAt ? p.createdAt.toISOString() : null,
      updatedAt: p.updatedAt ? p.updatedAt.toISOString() : null,
    };
  });

  const serializedCategories = categories.map((c) => {
    return {
      ...c,
      id: c._id ? c._id.toString() : '',
      _id: c._id ? c._id.toString() : '',
      count: countsMap[c.name] || 0
    };
  });

  return (
    <Suspense fallback={<div className="container py-5 text-center"><h4>Loading shop...</h4></div>}>
      <ShopClient 
        initialCategories={serializedCategories} 
        initialProducts={serializedProducts}
        totalItems={totalItems}
        totalProductsCount={totalProductsCount}
      />
    </Suspense>
  );
}
