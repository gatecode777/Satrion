import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

// GET /api/admin/setup-dev
export async function GET() {
  try {
    await connectDB();

    // Check if the admin account already exists
    const email = 'admin@satrion.com';
    let admin = await User.findOne({ email });

    if (admin) {
      // Make sure it has admin rights
      admin.isAdmin = true;
      await admin.save();
    } else {
      // Create new admin account
      admin = await User.create({
        username: 'Admin',
        email,
        password: 'adminpassword',
        isAdmin: true
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Demo Administrator Account has been configured!',
      credentials: {
        login_url: 'http://localhost:3000/login',
        email: email,
        password: 'adminpassword'
      }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
