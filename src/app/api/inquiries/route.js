import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Inquiry from '@/models/Inquiry';

// POST /api/inquiries - Submit a new quote request
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { productName, name, email, phone, quantity, message } = body;

    if (!productName || !name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const inquiry = await Inquiry.create({
      productName,
      name,
      email,
      phone,
      quantity: parseInt(quantity || 1),
      message
    });

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
