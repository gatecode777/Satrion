import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Inquiry from '@/models/Inquiry';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const newInquiry = new Inquiry({
      name: body.name,
      email: body.email,
      phone: 'N/A', // fallback to bypass cached mongoose schema validation
      subject: body.subject,
      productName: body.subject || 'General Inquiry', // Fallback for admin display
      message: body.message,
    });
    
    await newInquiry.save();
    return NextResponse.json({ success: true, message: 'Inquiry saved successfully' }, { status: 201 });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
