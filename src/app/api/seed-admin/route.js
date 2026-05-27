import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  // Safety: only allow seeding in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'Seeding not allowed in production' }, { status: 403 });
  }

  try {
    await connectDB();

    const adminEmail = 'admin@satrion.com';
    const adminPassword = 'Admin@123';

    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      // If exists but not admin, promote them
      if (!existing.isAdmin) {
        existing.isAdmin = true;
        await existing.save();
        return NextResponse.json({ message: `User ${adminEmail} promoted to admin successfully.` });
      }
      return NextResponse.json({ message: `Admin user already exists: ${adminEmail}` });
    }

    // Create fresh admin user (password will be hashed by pre-save hook)
    const admin = new User({
      username: 'Admin',
      email: adminEmail,
      password: adminPassword,
      isAdmin: true,
    });

    await admin.save();

    return NextResponse.json({
      message: 'Admin user seeded successfully!',
      credentials: {
        email: adminEmail,
        password: adminPassword,
      },
    });
  } catch (error) {
    console.error('Seed Admin Error:', error);
    return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
  }
}
