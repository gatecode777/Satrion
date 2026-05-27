import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';

async function protectAdmin(req) {
  await connectDB();
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer')) throw new Error('No token');
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  if (!user || !user.isAdmin) throw new Error('Not admin');
  return user;
}

// PATCH /api/admin/orders/[id] - Update order status
export async function PATCH(req, { params }) {
  try {
    await protectAdmin(req);
    const { id } = await params;
    const body = await req.json();
    const { status, returnRequestStatus, exchangeRequestStatus } = body;

    const updateFields = {};
    if (status !== undefined) {
      updateFields.status = status;
      if (status === 'Returned') {
        updateFields['returnRequest.status'] = 'Refunded';
      } else if (status === 'Exchanged') {
        updateFields['exchangeRequest.status'] = 'Replaced';
      }
    }
    if (returnRequestStatus !== undefined) {
      updateFields['returnRequest.status'] = returnRequestStatus;
    }
    if (exchangeRequestStatus !== undefined) {
      updateFields['exchangeRequest.status'] = exchangeRequestStatus;
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    ).populate('userId', 'username email');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

// DELETE /api/admin/orders/[id] - Delete an order
export async function DELETE(req, { params }) {
  try {
    await protectAdmin(req);
    const { id } = await params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
