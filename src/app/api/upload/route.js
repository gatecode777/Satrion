import { NextResponse } from 'next/server';

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

    // Convert file to base64 Data URL
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64Data}`;

    // Return the data URL
    return NextResponse.json({ url: dataUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
