import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

// Nodemailer transporter setup
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Email template for Admin
const getAdminEmailHTML = (data) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Poppins', Arial, sans-serif; background: #fdf6ec; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
      .header { background: linear-gradient(135deg, #0d7377, #14919b); padding: 30px; text-align: center; color: #fff; }
      .header h1 { margin: 0; font-size: 24px; font-family: 'Playfair Display', serif; }
      .header p { margin: 8px 0 0; opacity: 0.9; font-size: 13px; }
      .badge { display: inline-block; background: #ff6b35; color: #fff; padding: 4px 14px; border-radius: 50px; font-size: 11px; font-weight: 700; letter-spacing: 1px; margin-top: 10px; }
      .body { padding: 30px; }
      .field { margin-bottom: 18px; padding: 14px 18px; background: #fefaf4; border-left: 4px solid #0d7377; border-radius: 8px; }
      .label { font-size: 11px; color: #0d7377; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
      .value { font-size: 15px; color: #2d4647; font-weight: 500; }
      .message-box { background: linear-gradient(135deg, #fdf6ec, #fefaf4); padding: 18px; border-radius: 12px; border: 1px solid #e8dfd0; margin-top: 8px; line-height: 1.7; color: #2d4647; }
      .footer { background: #0a5c5f; padding: 20px; text-align: center; color: #fdf6ec; font-size: 12px; }
      .footer a { color: #ff8c5a; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🔔 New Contact Inquiry</h1>
        <p>Akshaya Builders & Developers Website</p>
        <div class="badge">NEW MESSAGE</div>
      </div>
      <div class="body">
        <div class="field">
          <div class="label">👤 Full Name</div>
          <div class="value">${data.name}</div>
        </div>
        <div class="field">
          <div class="label">📧 Email Address</div>
          <div class="value"><a href="mailto:${data.email}" style="color:#0d7377;text-decoration:none;">${data.email}</a></div>
        </div>
        <div class="field">
          <div class="label">📱 Phone Number</div>
          <div class="value"><a href="tel:${data.phone}" style="color:#0d7377;text-decoration:none;">${data.phone}</a></div>
        </div>
        ${data.subject ? `
        <div class="field">
          <div class="label">📋 Subject</div>
          <div class="value">${data.subject}</div>
        </div>
        ` : ''}
        <div class="field" style="border-left-color:#ff6b35;">
          <div class="label" style="color:#ff6b35;">💬 Message</div>
          <div class="message-box">${data.message.replace(/\n/g, '<br>')}</div>
        </div>
        <div style="margin-top:24px;padding:14px;background:#fefaf4;border-radius:10px;text-align:center;font-size:12px;color:#5a7a7c;">
          📅 Received on: ${new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Kolkata' })}
        </div>
      </div>
      <div class="footer">
        <strong style="font-family:'Playfair Display',serif;font-size:14px;">Akshaya Builders & Developers</strong><br>
        <span style="opacity:0.7;">Reply directly to this email to contact ${data.name}</span>
      </div>
    </div>
  </body>
  </html>
`;

// Email template for User (Auto-reply)
const getUserEmailHTML = (data) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Poppins', Arial, sans-serif; background: #fdf6ec; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
      .header { background: linear-gradient(135deg, #0d7377, #14919b); padding: 40px 30px; text-align: center; color: #fff; }
      .logo { width: 70px; height: 70px; background: linear-gradient(135deg, #ff6b35, #ff8c5a); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900; margin-bottom: 14px; }
      .header h1 { margin: 0; font-size: 26px; font-family: 'Playfair Display', serif; }
      .header p { margin: 8px 0 0; opacity: 0.9; }
      .body { padding: 30px; color: #2d4647; line-height: 1.7; }
      .body h2 { color: #0d7377; font-family: 'Playfair Display', serif; }
      .summary { background: #fefaf4; border-left: 4px solid #ff6b35; padding: 18px; border-radius: 10px; margin: 20px 0; }
      .btn { display: inline-block; background: linear-gradient(135deg, #ff6b35, #ff8c5a); color: #fff !important; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: 700; margin-top: 16px; }
      .contact-info { background: linear-gradient(135deg, #fdf6ec, #fefaf4); padding: 20px; border-radius: 12px; margin-top: 24px; }
      .footer { background: #0a5c5f; padding: 24px; text-align: center; color: #fdf6ec; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">V</div>
        <h1>Thank You, ${data.name}!</h1>
        <p>We've received your message</p>
      </div>
      <div class="body">
        <p>Dear <strong>${data.name}</strong>,</p>
        <p>Thank you for reaching out to <strong style="color:#0d7377;">Akshaya Builders & Developers</strong>! We've received your inquiry and our team will get back to you within <strong style="color:#ff6b35;">24 hours</strong>.</p>
        
        <div class="summary">
          <h3 style="margin:0 0 10px;color:#0d7377;font-size:14px;">📝 Your Message Summary:</h3>
          ${data.subject ? `<p style="margin:6px 0;"><strong>Subject:</strong> ${data.subject}</p>` : ''}
          <p style="margin:6px 0;"><strong>Message:</strong></p>
          <p style="margin:6px 0;color:#5a7a7c;font-style:italic;">"${data.message}"</p>
        </div>

        <p>In the meantime, feel free to explore our latest projects and offerings:</p>
        <center>
          <a href="https://Akshaya Builders & Developersinfra.com" class="btn">Visit Our Website</a>
        </center>

        <div class="contact-info">
          <h3 style="margin:0 0 12px;color:#0d7377;font-family:'Playfair Display',serif;">📞 Need Immediate Assistance?</h3>
          <p style="margin:6px 0;">📱 <strong>+91 98765 43210</strong></p>
          <p style="margin:6px 0;">📧 <strong>info@Akshaya Builders & Developersinfra.com</strong></p>
          <p style="margin:6px 0;">📍 Hyderabad, Telangana, India</p>
          <p style="margin:6px 0;">🕐 Mon-Sat: 9AM - 7PM</p>
        </div>

        <p style="margin-top:24px;color:#5a7a7c;font-size:13px;">Best Regards,<br><strong style="color:#0d7377;">Team Akshaya Builders & Developers</strong></p>
      </div>
      <div class="footer">
        <strong style="font-family:'Playfair Display',serif;font-size:16px;">Akshaya Builders & Developers</strong><br>
        <span style="opacity:0.7;margin-top:8px;display:inline-block;">Building Dreams, Crafting Futures</span>
      </div>
    </div>
  </body>
  </html>
`;

// GET - Fetch all contacts
export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error('GET contacts error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new contact + send emails
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, phone and message are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Save to MongoDB
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject?.trim() || '',
      message: message.trim(),
      isRead: false,
    });

    // Send emails (non-blocking - won't fail if email fails)
    try {
      const transporter = createTransporter();
      const contactData = {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        subject: contact.subject,
        message: contact.message,
      };

      // Email 1: Notification to Admin
      await transporter.sendMail({
        from: `"Akshaya Builders & Developers Website" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        replyTo: contact.email,
        subject: `🔔 New Contact: ${contact.name} ${contact.subject ? `- ${contact.subject}` : ''}`,
        html: getAdminEmailHTML(contactData),
      });

      // Email 2: Auto-reply to User
      await transporter.sendMail({
        from: `"Akshaya Builders & Developers" <${process.env.EMAIL_USER}>`,
        to: contact.email,
        subject: '✅ Thank you for contacting Akshaya Builders & Developers',
        html: getUserEmailHTML(contactData),
      });

      console.log('✅ Emails sent successfully');
    } catch (emailError) {
      console.error('⚠️ Email send error (data still saved):', emailError.message);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        data: contact,
        message: 'Message sent successfully! We will contact you soon.'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST contact error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Mark as read
export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, isRead } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { isRead: isRead !== undefined ? isRead : true },
      { new: true }
    );

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error('PUT contact error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete contact
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('DELETE contact error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}