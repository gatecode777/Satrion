import { NextResponse } from 'next/server';
import connectDB, { ensureSeeded } from '@/lib/db';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await ensureSeeded();
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

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

