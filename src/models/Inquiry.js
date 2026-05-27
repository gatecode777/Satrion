import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  productName: { type: String },
  subject: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  quantity: { type: Number, default: 1 },
  message: { type: String, default: '' },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Contacted', 'Resolved'] }
}, {
  timestamps: true
});

const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);

export default Inquiry;
