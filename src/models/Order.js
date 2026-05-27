import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
  price: { type: String }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: String,
    required: true
  },
  total: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    default: 'PENDING'
  },
  transactionInfo: {
    id: { type: String },
    upiId: { type: String },
    cardNumber: { type: String },
    cardName: { type: String }
  },
  items: [OrderItemSchema],
  returnRequest: {
    upiId: { type: String },
    reason: { type: String },
    requestedAt: { type: Date },
    status: { type: String, default: 'Pending' }
  },
  exchangeRequest: {
    reason: { type: String },
    requestedAt: { type: Date },
    status: { type: String, default: 'Pending' }
  },
  shippingInfo: {
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    phone: { type: String, required: true }
  }
}, {
  timestamps: true
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;
