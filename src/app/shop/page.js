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
  const maxPrice = parseInt(resolvedParams?.maxPrice || '200000', 10);

  const itemsPerPage = 9;

  // Define sort option for the indexed query
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

  // Fetch only categories and active products in parallel to optimize redirection speed
  const [categories, allActiveProducts] = await Promise.all([
    Category.find({ isActive: { $ne: false } }).lean(),
    Product.find({ isActive: { $ne: false } }).sort(sortOption).lean()
  ]);

  const categoryNames = categories.map(c => c.name);

  // 1. Filter by active category names in memory
  let filtered = allActiveProducts.filter(p => categoryNames.includes(p.category));

  // 2. Search filter in memory
  if (query) {
    const qLower = query.toLowerCase();
    filtered = filtered.filter(p => 
      (p.name && p.name.toLowerCase().includes(qLower)) || 
      (p.description && p.description.toLowerCase().includes(qLower)) || 
      (p.category && p.category.toLowerCase().includes(qLower))
    );
  }

  // 3. Price filter in memory
  filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

  // 4. Compute dynamic sidebar category counts based on search and price filters
  const countsMap = {};
  filtered.forEach(p => {
    countsMap[p.category] = (countsMap[p.category] || 0) + 1;
  });

  const totalProductsCount = filtered.length;

  // 5. Apply Category filter in memory
  if (category !== 'All') {
    filtered = filtered.filter(p => p.category === category);
  }

  const totalItems = filtered.length;

  // 6. Paginate products in memory
  const products = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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
