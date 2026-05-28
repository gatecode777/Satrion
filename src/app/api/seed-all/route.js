import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { sampleCategories, generateAllProducts } from '@/lib/sampleData';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: false,
    message: 'Seeding has been permanently disabled to protect your custom products and categories from being overwritten.'
  }, { status: 403 });
}
