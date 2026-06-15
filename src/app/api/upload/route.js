import { NextResponse } from 'next/server';
import { uploadToR2 } from '@/lib/r2';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // ✅ Detect file type
    let fileType = 'image';
    let folder = 'images';

    if (file.type.startsWith('video/')) {
      fileType = 'video';
      folder = 'videos';
    } else if (file.type === 'application/pdf') {
      fileType = 'pdf';
      folder = 'pdfs';
    }

    // ✅ Validate file types
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm', 'video/quicktime',
      'application/pdf',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `File type ${file.type} not allowed` },
        { status: 400 }
      );
    }

    // ✅ Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Max 50MB allowed.' },
        { status: 400 }
      );
    }

    // ✅ Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const extension = originalName.split('.').pop();
    const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
    const fileName = `${folder}/${baseName}_${timestamp}_${randomStr}.${extension}`;

    // ✅ Upload using your existing R2 helper
    const publicUrl = await uploadToR2(file, fileName);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      type: fileType,
      fileName: originalName,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}