import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

const sampleCategories = [
  { name: "Processors", slug: 'processors', image: '/category_processors.png', description: 'High-performance AMD Ryzen and Intel Core processors.' },
  { name: "Graphics Cards", slug: 'gpus', image: '/category_gpus.png', description: 'NVIDIA GeForce and AMD Radeon graphics cards.' },
  { name: "Gaming Laptops", slug: 'laptops', image: '/category_laptops.png', description: 'Powerful portable gaming laptops and notebooks.' },
  { name: "Custom Gaming PCs", slug: 'gaming-pcs', image: '/category_gaming_pcs.png', description: 'Custom built pre-assembled gaming desktops.' },
  { name: "Monitors", slug: 'monitors', image: '/category_monitors.png', description: 'Ultra-fast refresh rate gaming monitors.' },
  { name: "Keyboards & Mice", slug: 'peripherals', image: '/category_peripherals.png', description: 'Precision gaming mechanical keyboards and mice.' },
  { name: "Audio & Headsets", slug: 'audio', image: '/category_audio.png', description: 'Immersive studio-grade headsets and microphones.' },
  { name: "PC Cabinets", slug: 'cases', image: '/category_cases.png', description: 'Premium PC cabinets with tempered glass and RGB.' },
  { name: "Storage", slug: 'storage', image: '/category_storage.png', description: 'High-speed PCIe 4.0 NVMe SSDs and high-capacity HDDs.' },
  { name: "Cooling & Fans", slug: 'cooling', image: '/category_cooling.png', description: 'AIO liquid CPU coolers and high-airflow RGB fans.' }
];

// GET /api/categories — public endpoint to list active categories
export async function GET() {
  try {
    await connectDB();
    let categories = await Category.find({ isActive: true })
      .select('name slug image')
      .sort({ name: 1 })
      .lean();

    // Seed categories if collection is completely empty
    if (categories.length === 0) {
      await Category.insertMany(sampleCategories);
      categories = await Category.find({ isActive: true })
        .select('name slug image')
        .sort({ name: 1 })
        .lean();
    }

    return NextResponse.json({ categories });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

