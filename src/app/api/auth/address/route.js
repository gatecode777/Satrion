import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { protect } from '@/lib/auth';

// POST: Add new address
export async function POST(req) {
  try {
    await connectDB();
    const authorizedUser = await protect(req);
    const { addressData } = await req.json();

    if (!addressData) {
      return NextResponse.json({ message: 'Address data is required' }, { status: 400 });
    }

    if (addressData.phone) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(addressData.phone)) {
        return NextResponse.json({ message: 'Phone number must be exactly 10 digits and contain only numbers' }, { status: 400 });
      }
    }

    const user = await User.findById(authorizedUser._id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Initialize addresses array if it doesn't exist
    if (!Array.isArray(user.addresses)) {
      user.addresses = [];
    }

    user.addresses.push(addressData);
    await user.save();

    return NextResponse.json(user.addresses);
  } catch (error) {
    console.error('Address POST Route Error:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 401 });
  }
}

// PUT: Update existing address
export async function PUT(req) {
  try {
    await connectDB();
    const authorizedUser = await protect(req);
    const { id, addressData } = await req.json();

    if (!id || !addressData) {
      return NextResponse.json({ message: 'Address ID and data are required' }, { status: 400 });
    }

    if (addressData.phone) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(addressData.phone)) {
        return NextResponse.json({ message: 'Phone number must be exactly 10 digits and contain only numbers' }, { status: 400 });
      }
    }

    const user = await User.findById(authorizedUser._id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Find subdocument and update
    const address = user.addresses.id(id);
    if (!address) {
      return NextResponse.json({ message: 'Address not found' }, { status: 404 });
    }

    // Update fields
    address.fullName = addressData.fullName || address.fullName;
    address.street = addressData.street || address.street;
    address.city = addressData.city || address.city;
    address.state = addressData.state || address.state;
    address.zip = addressData.zip || address.zip;
    address.phone = addressData.phone || address.phone;

    await user.save();
    return NextResponse.json(user.addresses);
  } catch (error) {
    console.error('Address PUT Route Error:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 401 });
  }
}

// DELETE: Remove address
export async function DELETE(req) {
  try {
    await connectDB();
    const authorizedUser = await protect(req);
    
    // Support parsing from body or URL parameters
    let id;
    try {
      const body = await req.json();
      id = body.id;
    } catch (e) {
      const { searchParams } = new URL(req.url);
      id = searchParams.get('id');
    }

    if (!id) {
      return NextResponse.json({ message: 'Address ID is required' }, { status: 400 });
    }

    const user = await User.findById(authorizedUser._id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.addresses.pull(id);
    await user.save();

    return NextResponse.json(user.addresses);
  } catch (error) {
    console.error('Address DELETE Route Error:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 401 });
  }
}
