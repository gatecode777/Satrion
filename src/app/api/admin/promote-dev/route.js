import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

// GET /api/admin/promote-dev?email=YOUR_EMAIL
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Please provide an email query parameter (e.g. ?email=user@example.com)' }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { isAdmin: true } },
      { returnDocument: 'after' }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ error: `User with email "${email}" not found. Please register the user first at /signup.` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `User ${user.username} (${user.email}) has been successfully promoted to Admin! You can now log in and access the Admin Panel.`,
      user
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
