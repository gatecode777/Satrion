import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

const sampleCategories = [
  { name: "Processor's", slug: 'processors', image: '/shop_01.jpg', description: 'Genuine Intel and AMD processors' },
  { name: "Monitors's", slug: 'monitors', image: '/shop_03.jpg', description: 'Curved and flat screen monitors' },
  { name: 'Accessories', slug: 'accessories', image: '/category_img_02.jpg', description: 'Gaming keyboard, mouse, and other gear' },
  { name: 'Storage', slug: 'storage', image: '/shop_09.jpg', description: 'High speed SSDs and HDD drives' }
];

// GET /api/categories — public endpoint to list active categories
export async function GET() {
  try {
    await connectDB();
    let categories = await Category.find({ isActive: true })
      .select('name slug image')
      .sort({ name: 1 })
      .lean();

    // Seed categories if collection is completely empty
    if (categories.length === 0) {
      await Category.insertMany(sampleCategories);
      categories = await Category.find({ isActive: true })
        .select('name slug image')
        .sort({ name: 1 })
        .lean();
    }

    return NextResponse.json({ categories });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

