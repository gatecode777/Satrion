import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

// POST /api/upload — accepts a multipart/form-data file upload
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique name keeping original extension
    const ext = path.extname(file.name) || '.png';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}${ext}`;
    const filepath = path.join(uploadDir, filename);

    await fs.writeFile(filepath, buffer);

    const fileUrl = `/uploads/${filename}`;

    // Return the filesystem static URL
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
