import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { protect } from '@/lib/auth';

export async function POST(req) {
  try {
    const authorizedUser = await protect(req);
    const { cart } = await req.json();

    const user = await User.findById(authorizedUser._id);
    if (user) {
      user.cart = cart || [];
      await user.save();
      return NextResponse.json(user.cart);
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Cart POST Route Error:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 401 });
  }
}
