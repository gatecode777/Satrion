import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { protect } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await protect(req);
    return NextResponse.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      addresses: user.addresses,
      cart: user.cart,
      wishlist: user.wishlist
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

export async function PUT(req) {
  try {
    const authorizedUser = await protect(req);
    const { username, phone } = await req.json();

    const user = await User.findById(authorizedUser._id);

    if (user) {
      user.username = username || user.username;
      if (phone !== undefined) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
          return NextResponse.json({ message: 'Phone number must be exactly 10 digits and contain only numbers' }, { status: 400 });
        }
        user.phone = phone;
      }

      const updatedUser = await user.save();

      return NextResponse.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        addresses: updatedUser.addresses,
        cart: updatedUser.cart,
        wishlist: updatedUser.wishlist
      });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Profile PUT Route Error:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 401 });
  }
}
