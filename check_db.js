const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Fix Windows SRV lookup issue
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

const mongoose = require('mongoose');

// Read .env.local manually
const envLocal = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const match = envLocal.match(/MONGODB_URI=(.*)/);
const MONGODB_URI = match ? match[1].trim() : null;

if (!MONGODB_URI) {
  console.error('Could not find MONGODB_URI in .env.local');
  process.exit(1);
}

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  isActive: Boolean
});
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function run() {
  console.log('Connecting to:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const total = await Product.countDocuments();
  console.log('Total Products in DB:', total);

  const active = await Product.countDocuments({ isActive: { $ne: false } });
  console.log('Active Products in DB:', active);

  const counts = await Product.aggregate([
    { $group: { _id: '$category', total: { $sum: 1 }, active: { $sum: { $cond: [{ $ne: ['$isActive', false] }, 1, 0] } } } }
  ]);
  console.log('Counts grouped by Category:');
  console.log(JSON.stringify(counts, null, 2));

  await mongoose.connection.close();
}

run().catch(console.error);
