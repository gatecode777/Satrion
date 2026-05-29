import React, { Suspense } from 'react';
import connectDB, { ensureSeeded, getCachedData } from '@/lib/db';
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

  // 1. Fetch only categories and active products from memory cache (0ms DB network round trips!)
  const { categories, products: allActiveProducts } = await getCachedData();

  const categoryNames = categories.map(c => c.name);

  // 2. Filter by active category names in memory
  let filtered = allActiveProducts.filter(p => categoryNames.includes(p.category));

  // 3. Search filter in memory
  if (query) {
    const qLower = query.toLowerCase();
    filtered = filtered.filter(p => 
      (p.name && p.name.toLowerCase().includes(qLower)) || 
      (p.description && p.description.toLowerCase().includes(qLower)) || 
      (p.category && p.category.toLowerCase().includes(qLower))
    );
  }

  // 4. Price filter in memory
  filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

  // 5. Compute dynamic sidebar category counts based on search and price filters
  const countsMap = {};
  filtered.forEach(p => {
    countsMap[p.category] = (countsMap[p.category] || 0) + 1;
  });

  const totalProductsCount = filtered.length;

  // 6. Apply Category filter in memory
  if (category !== 'All') {
    filtered = filtered.filter(p => p.category === category);
  }

  const totalItems = filtered.length;

  // 7. Sort products in memory
  if (sort === 'A to Z') {
    filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else if (sort === 'Price: Low to High') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'Price: High to Low') {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    // Featured / default: sort by createdAt descending
    filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  // 8. Paginate products in memory
  const products = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // 9. Fetch the images only for the 9 paginated products on the current page to bypass database network lag
  const paginatedIds = products.map(p => p._id);
  const imagesData = await Product.find({ _id: { $in: paginatedIds } }).select('image').lean();
  
  const imagesMap = {};
  imagesData.forEach(img => {
    imagesMap[img._id.toString()] = img.image;
  });

  // Format MongoDB documents for secure Next.js Server-Client serialization
  const serializedProducts = products.map((p) => {
    return {
      ...p,
      id: p._id ? p._id.toString() : '',
      _id: p._id ? p._id.toString() : '',
      image: imagesMap[p._id.toString()] || '', // Map the fetched image back
      createdAt: p.createdAt ? (p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt) : null,
      updatedAt: p.updatedAt ? (p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt) : null,
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
