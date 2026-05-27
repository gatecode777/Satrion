// seed-admin.cjs — Run with: node seed-admin.cjs
const dns = require('dns');

// Override DNS to fix Windows SRV lookup issue (same fix as db.js)
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://balramsuman997_db_user:m0dDKqnvCA4K7TJs@cluster0.l7xeac9.mongodb.net/Satrion';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  isAdmin:  { type: Boolean, default: false },
  addresses: {
    billing:  { type: Object, default: {} },
    shipping: { type: Object, default: {} }
  },
  cart:     { type: Array, default: [] },
  wishlist: { type: Array, default: [] }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedAdmin() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');

  const adminEmail    = 'admin@satrion.com';
  const adminPassword = 'Admin@123';

  const existing = await User.findOne({ email: adminEmail });

  if (existing) {
    if (!existing.isAdmin) {
      existing.isAdmin = true;
      await existing.save();
      console.log(`Promoted existing user "${adminEmail}" to admin.`);
    } else {
      console.log(`Admin user "${adminEmail}" already exists.`);
    }
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      username: 'Admin',
      email:    adminEmail,
      password: hashedPassword,
      isAdmin:  true,
    });
    console.log('Admin user created successfully!');
    console.log('   Email:   ', adminEmail);
    console.log('   Password:', adminPassword);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

seedAdmin().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
