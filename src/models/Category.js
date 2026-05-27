import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name:  { type: String, required: true, unique: true, trim: true },
  slug:  { type: String, required: true, unique: true, lowercase: true, trim: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

// Auto-generate slug from name before save
CategorySchema.pre('validate', function () {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default Category;
