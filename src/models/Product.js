import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  category: { type: String, required: true },
  brand: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  homepageSection: { 
    type: String, 
    default: 'None', 
    enum: ['None', 'Featured Products', 'Bestsellers', 'Our Range of Gaming Products'] 
  },
  tags: [{ type: String }],
}, {
  timestamps: true
});

// Index so Atlas can sort by createdAt without exceeding the 32MB in-memory sort limit
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ isActive: 1, createdAt: -1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ homepageSection: 1 });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
