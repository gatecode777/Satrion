import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Please fill in all fields' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return NextResponse.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        addresses: user.addresses,
        cart: user.cart,
        wishlist: user.wishlist,
        token: generateToken(user._id)
      });
    } else {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login Route Error:', error);
    console.error('Login Error Stack:', error.stack);
    return NextResponse.json({ message: `Server error: ${error.message}` }, { status: 500 });
  }
}
