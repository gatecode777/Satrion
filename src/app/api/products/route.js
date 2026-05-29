import { NextResponse } from 'next/server';
import connectDB, { ensureSeeded } from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await ensureSeeded();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || '';
    const featuredOnly = searchParams.get('featured') === 'true';

    // 1. Fetch registered active categories first to restrict products query dynamically
    const categories = await Category.find({ isActive: { $ne: false } }).lean();
    const categoryNames = categories.map(c => c.name);

    let query = { isActive: { $ne: false } };
    if (category && category !== 'All') {
      query.category = category;
    } else {
      query.category = { $in: categoryNames };
    }

    if (featuredOnly) {
      query.isFeatured = true;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

