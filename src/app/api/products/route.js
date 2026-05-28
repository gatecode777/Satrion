import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

import { generateAllProducts } from '@/lib/sampleData';

const sampleProducts = generateAllProducts();

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || '';
    const featuredOnly = searchParams.get('featured') === 'true';

    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (featuredOnly) {
      query.isFeatured = true;
    }

    let products = await Product.find(query).sort({ createdAt: -1 });

    // Seed products if collection is completely empty
    if (products.length === 0 && !category && !featuredOnly) {
      await Product.insertMany(sampleProducts);
      products = await Product.find({}).sort({ createdAt: -1 });
    }

    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
