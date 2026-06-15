import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BrochureLead from '@/models/BrochureLead';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, phone, projectTitle, projectId, brochureUrl } = body;

    // ✅ Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // ✅ Save lead to BrochureLead collection
    const lead = await BrochureLead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      projectTitle: projectTitle || '',
      projectId: projectId || '',
      brochureUrl: brochureUrl || '',
    });

    console.log('✅ Lead saved:', lead._id);

    // ✅ Send emails (non-blocking - won't fail if email is misconfigured)
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // Email to ADMIN
        await transporter.sendMail({
          from: `"Varahi Website" <${process.env.EMAIL_USER}>`,
          to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
          subject: `🔔 New Brochure Download - ${projectTitle}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fdf6ec;padding:30px;border-radius:12px;">
              <h2 style="color:#0d7377;border-bottom:2px solid #ff6b35;padding-bottom:10px;">
                📥 New Brochure Download Request
              </h2>
              <div style="background:white;padding:20px;border-radius:8px;margin:20px 0;">
                <p><strong>Project:</strong> ${projectTitle}</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
                <p><strong>Downloaded At:</strong> ${new Date().toLocaleString('en-IN')}</p>
              </div>
              <p style="color:#666;font-size:12px;">
                Follow up with this lead soon for best conversion!
              </p>
            </div>
          `,
        });

        // Email to USER with brochure link
        await transporter.sendMail({
          from: `"Varahi Developers" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `📄 Your ${projectTitle} Brochure is Ready!`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fdf6ec;padding:30px;border-radius:12px;">
              <div style="text-align:center;margin-bottom:20px;">
                <h1 style="color:#0d7377;font-family:Georgia,serif;margin:0;">VARAHI</h1>
              </div>
              <h2 style="color:#0d7377;">Hi ${name}, 👋</h2>
              <p style="color:#3a5a5c;font-size:15px;line-height:1.6;">
                Thank you for your interest in <strong>${projectTitle}</strong>! 
                Your brochure link is below.
              </p>
              <div style="text-align:center;margin:30px 0;">
                <a href="${brochureUrl}" 
                   style="background:linear-gradient(135deg,#0d7377,#14919b);color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;display:inline-block;">
                  📥 Download Brochure
                </a>
              </div>
              <p style="color:#5a7a7c;font-size:13px;">
                Our team will reach out to you shortly!
              </p>
              <hr style="border:none;border-top:1px solid #e8dfd0;margin:20px 0;">
              <p style="color:#999;font-size:11px;text-align:center;">
                © ${new Date().getFullYear()} Varahi Developers. All rights reserved.
              </p>
            </div>
          `,
        });

        console.log('✅ Emails sent successfully');
      } else {
        console.log('⚠️ Email not configured (skipping email)');
      }
    } catch (emailErr) {
      console.error('⚠️ Email error (non-blocking):', emailErr.message);
    }

    return NextResponse.json({
      success: true,
      brochureUrl,
      leadId: lead._id,
      message: 'Lead saved successfully',
    });
  } catch (error) {
    console.error('❌ Brochure lead error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const leads = await BrochureLead.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
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
    await BrochureLead.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}