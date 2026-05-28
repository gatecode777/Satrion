import { NextResponse } from 'next/server';
import connectDB, { ensureSeeded } from '@/lib/db';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

// GET /api/categories — public endpoint to list active categories
export async function GET() {
  try {
    await ensureSeeded();
    const categories = await Category.find({ isActive: true })
      .select('name slug image')
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({ categories });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


