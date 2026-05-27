import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Inquiry from '@/models/Inquiry';

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

// PATCH /api/admin/inquiries/[id] - Update inquiry status
export async function PATCH(req, { params }) {
  try {
    await protectAdmin(req);
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { $set: { status } },
      { returnDocument: 'after' }
    );

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ inquiry });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

// DELETE /api/admin/inquiries/[id] - Delete an inquiry
export async function DELETE(req, { params }) {
  try {
    await protectAdmin(req);
    const { id } = await params;
    const inquiry = await Inquiry.findByIdAndDelete(id);
    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Inquiry deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
