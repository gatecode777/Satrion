import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { sampleCategories, generateAllProducts } from '@/lib/sampleData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Clearing existing collections...');
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log('Inserting sample categories...');
    await Category.insertMany(sampleCategories);

    console.log('Generating 100 products...');
    const allProducts = generateAllProducts();

    console.log('Inserting 100 products...');
    await Product.insertMany(allProducts);

    console.log('Database reset and seed complete.');
    return NextResponse.json({
      success: true,
      message: 'Database reset and seeded with 10 categories and 100 products (10 per category) successfully!',
      count: allProducts.length
    });
  } catch (err) {
    console.error('Error seeding database:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
