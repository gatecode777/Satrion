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
    const { username, email, password, phone } = await req.json();

    if (!username || !email || !password || !phone) {
      return NextResponse.json({ message: 'Please fill in all fields' }, { status: 400 });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Please enter a valid email address' }, { status: 400 });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ message: 'Phone number must be exactly 10 digits and contain only numbers' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const user = await User.create({
      username,
      email,
      password,
      phone,
      addresses: [],
      cart: [],
      wishlist: []
    });

    if (user) {
      return NextResponse.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses,
        cart: user.cart,
        wishlist: user.wishlist,
        token: generateToken(user._id)
      }, { status: 201 });
    } else {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
    }
  } catch (error) {
    console.error('Signup Route Error:', error);
    return NextResponse.json({ message: 'Server error during registration' }, { status: 500 });
  }
}
