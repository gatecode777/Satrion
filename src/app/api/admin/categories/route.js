import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB, { invalidateCache } from '@/lib/db';
import User from '@/models/User';
import Category from '@/models/Category';

async function protectAdmin(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer')) throw new Error('No token');
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('isAdmin');
  if (!user || !user.isAdmin) throw new Error('Not admin');
  return user;
}

// GET /api/admin/categories — list all categories
export async function GET(req) {
  try {
    await connectDB();
    await protectAdmin(req);
    const categories = await Category.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ categories });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

// POST /api/admin/categories — create new category
export async function POST(req) {
  try {
    await connectDB();
    await protectAdmin(req);
    const body = await req.json();
    const { name, image, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: 'A category with this name already exists' }, { status: 400 });
    }

    const category = await Category.create({ name, slug, image: image || '', description: description || '' });

    // Invalidate global DB cache
    invalidateCache();

    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    console.error('Category Create Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
