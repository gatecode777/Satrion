import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AddressSchema = new mongoose.Schema({
  fullName: { type: String, default: '' },
  street: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  zip: { type: String, default: '' },
  phone: { type: String, default: '' }
});

const CartItemSchema = new mongoose.Schema({
  product: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    category: { type: String }
  },
  quantity: { type: Number, default: 1, min: 1 }
}, { _id: false });

const WishlistItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  category: { type: String }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    default: ''
  },
  password: {
    type: String,
    required: true
  },
  addresses: {
    type: [AddressSchema],
    default: []
  },
  isAdmin: { type: Boolean, default: false },
  cart: [CartItemSchema],
  wishlist: [WishlistItemSchema]
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
