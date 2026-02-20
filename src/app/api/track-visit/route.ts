import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userAgent, referrer, pathname, timestamp, eventType } = body;

    // Get visitor information
    const ip =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'Unknown';
    const country =
      req.headers.get('cf-ipcountry') ||
      req.headers.get('x-vercel-ip-country') ||
      'Unknown';

    // Create transporter (using Gmail SMTP)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail app password
      },
    });

    const { blogTitle } = body;

    // Different email content based on event type
    const isResumeDownload = eventType === 'resume_download';
    const isBlogRead = eventType === 'blog_read';

    const subject = isResumeDownload
      ? '📄 Someone Downloaded Your Resume!'
      : isBlogRead
      ? `📖 Someone Read: ${blogTitle}`
      : '🔔 New Portfolio Visitor!';

    const accentColor = isResumeDownload ? '#007acc' : isBlogRead ? '#16a34a' : '#666';
    const bgColor = isResumeDownload ? '#e6f3ff' : isBlogRead ? '#f0fdf4' : '#f5f5f5';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'jsgokul123@gmail.com',
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">
            ${isResumeDownload ? '📄 Resume Downloaded' : isBlogRead ? `📖 Blog Read` : '🎉 New Visit'}
          </h2>

          <div style="background: ${bgColor}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${accentColor};">
            <h3 style="margin-top: 0; color: #555;">Details</h3>
            ${isBlogRead ? `<p><strong>📝 Post:</strong> ${blogTitle}</p>` : ''}
            ${isResumeDownload ? '<p><strong>📄 Action:</strong> Resume Downloaded (GokulJS.pdf)</p>' : `<p><strong>📍 Page:</strong> ${pathname}</p>`}
            <p><strong>⏰ Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
            <p><strong>🌍 Location:</strong> ${country}</p>
            <p><strong>🖥️ Device:</strong> ${userAgent}</p>
            <p><strong>🔗 Came from:</strong> ${referrer || 'Direct visit'}</p>
            <p><strong>🌐 IP:</strong> ${ip}</p>
          </div>

          <p style="color: #666; font-style: italic;">
            This notification was sent from your portfolio tracking system.
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 },
    );
  }
}
