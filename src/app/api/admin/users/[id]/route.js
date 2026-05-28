import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

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

// PATCH /api/admin/users/[id] - Toggle admin or ban user
export async function PATCH(req, { params }) {
  try {
    await protectAdmin(req);
    const { id } = await params;
    const body = await req.json();
    const user = await User.findByIdAndUpdate(
      id,
      { $set: body },
      { returnDocument: 'after' }
    ).select('-password');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

// DELETE /api/admin/users/[id]
export async function DELETE(req, { params }) {
  try {
    await protectAdmin(req);
    const { id } = await params;
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: 'User deleted' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
