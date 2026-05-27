import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
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

// PATCH /api/admin/categories/[id] — update category
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    await protectAdmin(req);
    const { id } = await params;
    const body = await req.json();
    const category = await Category.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    return NextResponse.json({ category });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/categories/[id] — delete category
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await protectAdmin(req);
    const { id } = await params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    return NextResponse.json({ message: 'Category deleted' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
