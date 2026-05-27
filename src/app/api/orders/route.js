import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import { protect } from '@/lib/auth';

export async function POST(req) {
  try {
    const authorizedUser = await protect(req);
    const { orderId, date, total, items, shippingInfo, paymentMethod, paymentDetails } = await req.json();

    if (!orderId || !date || !total || !items || items.length === 0 || !shippingInfo) {
      return NextResponse.json({ message: 'Order details are incomplete' }, { status: 400 });
    }

    const isCod = !paymentMethod || paymentMethod === 'Cash on Delivery' || paymentMethod === 'COD';
    const finalMethod = isCod ? 'COD' : (paymentMethod === 'UPI / Net Banking' ? 'UPI' : 'Card');
    const finalPaymentStatus = isCod ? 'PENDING' : 'COMPLETED';

    let finalTxnInfo = undefined;
    if (!isCod) {
      finalTxnInfo = {
        id: 'TXN' + Math.floor(100000000000 + Math.random() * 900000000000),
        upiId: paymentDetails?.upiId || '',
        cardNumber: paymentDetails?.cardNumber ? ('****-****-****-' + paymentDetails.cardNumber.slice(-4)) : '',
        cardName: paymentDetails?.nameOnCard || ''
      };
    }

    const order = await Order.create({
      userId: authorizedUser._id,
      orderId,
      date,
      total,
      items,
      shippingInfo,
      paymentMethod: finalMethod,
      paymentStatus: finalPaymentStatus,
      transactionInfo: finalTxnInfo
    });

    if (order) {
      // Clear user cart in DB
      const user = await User.findById(authorizedUser._id);
      if (user) {
        user.cart = [];
        await user.save();
      }
      return NextResponse.json(order, { status: 201 });
    } else {
      return NextResponse.json({ message: 'Invalid order data' }, { status: 400 });
    }
  } catch (error) {
    console.error('Order POST Route Error:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 401 });
  }
}

export async function GET(req) {
  try {
    const authorizedUser = await protect(req);
    const orders = await Order.find({ userId: authorizedUser._id }).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Order GET Route Error:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 401 });
  }
}

export async function PUT(req) {
  try {
    const authorizedUser = await protect(req);
    const { orderId, action, upiId, reason } = await req.json();

    if (!orderId || !action) {
      return NextResponse.json({ message: 'Order ID and Action are required' }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findOne({ orderId, userId: authorizedUser._id });

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Check if within 7 days
    const orderDate = new Date(order.createdAt || order.date);
    const currentDate = new Date();
    orderDate.setHours(0,0,0,0);
    currentDate.setHours(0,0,0,0);
    const diffTime = Math.abs(currentDate - orderDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      return NextResponse.json({ message: 'Return/Exchange window has closed (valid for 7 days only)' }, { status: 400 });
    }

    if (action === 'return') {
      if (!upiId) {
        return NextResponse.json({ message: 'UPI ID is required for refund' }, { status: 400 });
      }
      if (!upiId.includes('@')) {
        return NextResponse.json({ message: 'Please enter a valid UPI ID' }, { status: 400 });
      }

      order.status = 'Return Requested';
      order.returnRequest = {
        upiId,
        reason: reason || 'Not specified',
        requestedAt: new Date(),
        status: 'Pending'
      };
    } else if (action === 'exchange') {
      order.status = 'Exchange Requested';
      order.exchangeRequest = {
        reason: reason || 'Not specified',
        requestedAt: new Date(),
        status: 'Pending'
      };
    } else {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }

    await order.save();
    return NextResponse.json(order);
  } catch (error) {
    console.error('Order PUT Route Error:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 401 });
  }
}
