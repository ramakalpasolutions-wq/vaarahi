import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const project = await Project.create({
      title: body.title || '',
      location: body.location || '',
      status: body.status || 'ongoing',
      heroImage: body.heroImage || '',
      description: body.description || '',
      about: body.about || '',
      video: body.video || '',
      ctaImage: body.ctaImage || '',
     brochurePdf: updateData.brochurePdf || '',
      amenities: Array.isArray(body.amenities) ? body.amenities : [],
      highlights: Array.isArray(body.highlights) ? body.highlights : [],
      locationHighlights: Array.isArray(body.locationHighlights) ? body.locationHighlights : [],
      images: Array.isArray(body.images) ? body.images : [],
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

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

    const project = await Project.findByIdAndUpdate(
      id,
      {
        $set: {
          title: updateData.title || '',
          location: updateData.location || '',
          status: updateData.status || 'ongoing',
          heroImage: updateData.heroImage || '',
          description: updateData.description || '',
          about: updateData.about || '',
          video: updateData.video || '',
          ctaImage: updateData.ctaImage || '',
          brochurePdf: updateData.brochurePdf || '',
          amenities: Array.isArray(updateData.amenities) ? updateData.amenities : [],
          highlights: Array.isArray(updateData.highlights) ? updateData.highlights : [],
          locationHighlights: Array.isArray(updateData.locationHighlights) ? updateData.locationHighlights : [],
          images: Array.isArray(updateData.images) ? updateData.images : [],
        },
      },
      { new: true, runValidators: true, strict: false }
    );

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('PUT Error:', error);
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
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}