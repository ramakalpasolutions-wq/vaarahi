import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Hero from '@/models/Hero';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    if (page) {
      const hero = await Hero.findOne({ page });
      return NextResponse.json({ success: true, data: hero });
    }

    const heroes = await Hero.find();
    return NextResponse.json({ success: true, data: heroes });
  } catch (error) {
    console.error('GET Hero Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    console.log('💾 Saving hero for:', body.page, '| Slides:', body.slides?.length);

    if (!Array.isArray(body.slides)) {
      return NextResponse.json({ success: false, error: 'Slides must be an array' }, { status: 400 });
    }

    const validSlides = body.slides.filter(s => s.mediaUrl);

    const hero = await Hero.findOneAndUpdate(
      { page: body.page },
      {
        page: body.page,
        slides: validSlides,
        autoScrollSeconds: body.autoScrollSeconds || 5,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log('✅ Saved! Slides:', hero.slides.length);

    return NextResponse.json({ success: true, data: hero });
  } catch (error) {
    console.error('❌ POST Hero Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}