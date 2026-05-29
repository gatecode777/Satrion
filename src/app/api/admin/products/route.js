import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';
import Category from '@/models/Category';

async function protectAdmin(req) {
  await connectDB();
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer')) throw new Error('No token');
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  if (!user || !user.isAdmin) throw new Error('Not admin');
  return user;
}

// GET /api/admin/products - Get all products with details (for admin list)
export async function GET(req) {
  try {
    await protectAdmin(req);
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    // Fetch registered active categories first to restrict products query dynamically
    const categories = await Category.find({ isActive: { $ne: false } }).lean();
    const categoryNames = categories.map(c => c.name);

    let query = {};
    if (category) {
      query.category = category;
    } else {
      query.category = { $in: categoryNames };
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

// POST /api/admin/products - Create a new product
export async function POST(req) {
  try {
    await protectAdmin(req);
    const body = await req.json();

    const { name, price, originalPrice, description, image, category, brand, stock, homepageSection } = body;
    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
    }

    const product = await Product.create({
      name,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      description,
      image,
      category,
      brand,
      stock: parseInt(stock || 0),
      homepageSection: homepageSection || 'None',
      isFeatured: homepageSection === 'Featured Products'
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
