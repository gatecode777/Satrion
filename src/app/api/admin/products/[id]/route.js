import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';

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

// PATCH /api/admin/products/[id] - Update a product
export async function PATCH(req, { params }) {
  try {
    await protectAdmin(req);
    const { id } = await params;
    const body = await req.json();

    // Sanitize prices and stock if present
    if (body.price !== undefined) body.price = parseFloat(body.price);
    if (body.originalPrice !== undefined) body.originalPrice = parseFloat(body.originalPrice);
    if (body.stock !== undefined) body.stock = parseInt(body.stock);
    if (body.homepageSection !== undefined) {
      body.isFeatured = body.homepageSection === 'Featured Products';
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

// DELETE /api/admin/products/[id] - Delete a product
export async function DELETE(req, { params }) {
  try {
    await protectAdmin(req);
    const { id } = await params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
