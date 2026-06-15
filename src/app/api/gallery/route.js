import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Gallery from '@/models/Gallery';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const query = category ? { category } : {};
    const gallery = await Gallery.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: gallery });
  } catch (error) {
    console.error('GET Gallery Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    console.log('📥 Gallery POST received:', body);
    
    // ✅ Build the document explicitly
    const itemData = {
      title: body.title || '',
      description: body.description || '',
      imageUrl: body.imageUrl || '',
      category: body.category || 'project',
      mediaType: body.mediaType || 'image',
      youtubeUrl: body.youtubeUrl || '',
      youtubeId: body.youtubeId || '',
    };
    
    console.log('💾 Saving to DB:', itemData);
    
    const item = await Gallery.create(itemData);
    
    console.log('✅ Saved successfully:', item);
    
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error('❌ POST Gallery Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ FIXED PUT method - preserves all fields
export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID required' },
        { status: 400 }
      );
    }

    // ✅ Build update object dynamically (only update provided fields)
    const updateFields = {};
    if (updateData.title !== undefined) updateFields.title = updateData.title;
    if (updateData.description !== undefined) updateFields.description = updateData.description;
    if (updateData.imageUrl !== undefined) updateFields.imageUrl = updateData.imageUrl;
    if (updateData.category !== undefined) updateFields.category = updateData.category;
    if (updateData.mediaType !== undefined) updateFields.mediaType = updateData.mediaType;
    if (updateData.youtubeUrl !== undefined) updateFields.youtubeUrl = updateData.youtubeUrl;
    if (updateData.youtubeId !== undefined) updateFields.youtubeId = updateData.youtubeId;

    const item = await Gallery.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: false }
    );

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error('❌ PUT Gallery Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID required' },
        { status: 400 }
      );
    }
    
    await Gallery.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ DELETE Gallery Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}