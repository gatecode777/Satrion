import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

// Sample products to seed if DB is empty
const sampleProducts = [
  {
    name: 'Intel Core i9-13900K Processor',
    price: 58500.00,
    originalPrice: 65000.00,
    description: 'Genuine Intel 24-core desktop processor with 5.8GHz max turbo frequency, ideal for gaming and content creation.',
    rating: 5,
    image: '/shop_01.jpg',
    category: "Processor's",
    brand: 'Intel',
    stock: 12,
    isFeatured: true
  },
  {
    name: 'AMD Ryzen 9 7950X Processor',
    price: 52999.00,
    originalPrice: 59999.00,
    description: 'Genuine AMD 16-core processor with 5.7GHz max boost, featuring advanced AI acceleration for ultimate performance.',
    rating: 5,
    image: '/shop_02.jpg',
    category: "Processor's",
    brand: 'AMD',
    stock: 8,
    isFeatured: true
  },
  {
    name: 'Samsung Odyssey G9 Gaming Monitor',
    price: 149990.00,
    originalPrice: 175000.00,
    description: 'Genuine Samsung 49-inch curved gaming monitor with 240Hz refresh rate and 1ms response time for immersive gameplay.',
    rating: 4,
    image: '/shop_03.jpg',
    category: "Monitors's",
    brand: 'Samsung',
    stock: 5,
    isFeatured: true
  },
  {
    name: 'LG UltraFine 4K Monitor',
    price: 45990.00,
    originalPrice: 49990.00,
    description: 'Genuine LG 27-inch 4K UHD monitor with IPS display, perfect for professional photo and video editing.',
    rating: 5,
    image: '/shop_04.jpg',
    category: "Monitors's",
    brand: 'LG',
    stock: 15,
    isFeatured: false
  },
  {
    name: 'Razer DeathAdder V3 Mouse',
    price: 7999.00,
    originalPrice: 9999.00,
    description: 'Genuine Razer ergonomic gaming mouse with 30K optical sensor and ultra-lightweight design for competitive gaming.',
    rating: 4,
    image: '/shop_05.jpg',
    category: 'Accessories',
    brand: 'Razer',
    stock: 25,
    isFeatured: true
  },
  {
    name: 'Logitech MX Master 3S Mouse',
    price: 9495.00,
    originalPrice: 11999.00,
    description: 'Genuine Logitech wireless mouse with 8K DPI sensor, quiet clicks, and ergonomic design for productivity.',
    rating: 5,
    image: '/shop_06.jpg',
    category: 'Accessories',
    brand: 'Logitech',
    stock: 30,
    isFeatured: false
  },
  {
    name: 'Corsair K70 RGB Pro Keyboard',
    price: 15999.00,
    originalPrice: 19999.00,
    description: 'Genuine Corsair mechanical gaming keyboard with Cherry MX switches, aluminum frame, and per-key RGB lighting.',
    rating: 4,
    image: '/shop_07.jpg',
    category: 'Accessories',
    brand: 'Corsair',
    stock: 18,
    isFeatured: true
  },
  {
    name: 'Audio-Technica ATH-M50x Headphones',
    price: 12990.00,
    originalPrice: 14990.00,
    description: 'Genuine Audio-Technica professional studio monitor headphones with exceptional clarity and deep bass response.',
    rating: 5,
    image: '/shop_08.jpg',
    category: 'Accessories',
    brand: 'Audio-Technica',
    stock: 22,
    isFeatured: false
  },
  {
    name: 'Samsung 980 Pro NVMe SSD',
    price: 14999.00,
    originalPrice: 18999.00,
    description: 'Genuine Samsung 1TB PCIe 4.0 NVMe SSD with read speeds up to 7000MB/s, perfect for gaming and professional workloads.',
    rating: 5,
    image: '/shop_09.jpg',
    category: 'Storage',
    brand: 'Samsung',
    stock: 40,
    isFeatured: true
  }
];

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || '';
    const featuredOnly = searchParams.get('featured') === 'true';

    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (featuredOnly) {
      query.isFeatured = true;
    }

    let products = await Product.find(query).sort({ createdAt: -1 });

    // Seed products if collection is completely empty
    if (products.length === 0 && !category && !featuredOnly) {
      await Product.insertMany(sampleProducts);
      products = await Product.find({}).sort({ createdAt: -1 });
    }

    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
