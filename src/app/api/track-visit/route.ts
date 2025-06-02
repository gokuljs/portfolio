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

    // Different email content based on event type
    const isResumeDownload = eventType === 'resume_download';

    const subject = isResumeDownload
      ? '📄 Someone Downloaded Your Resume!'
      : '🔔 New Portfolio Visitor!';

    const emoji = isResumeDownload ? '📄' : '🎉';
    const actionText = isResumeDownload
      ? 'downloaded your resume'
      : 'visited your portfolio';

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'jsgokul123@gmail.com',
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Someone ${actionText}! ${emoji}</h2>
          
          <div style="background: ${
            isResumeDownload ? '#e6f3ff' : '#f5f5f5'
          }; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${
        isResumeDownload ? '#007acc' : '#666'
      };">
            <h3 style="margin-top: 0; color: #555;">${
              isResumeDownload ? 'Resume Download Details:' : 'Visit Details:'
            }</h3>
            ${
              isResumeDownload
                ? '<p><strong>📄 Action:</strong> Resume Downloaded (GokulJS.pdf)</p>'
                : `<p><strong>📍 Page:</strong> ${pathname}</p>`
            }
            <p><strong>⏰ Time:</strong> ${new Date(
              timestamp,
            ).toLocaleString()}</p>
            <p><strong>🌍 Location:</strong> ${country}</p>
            <p><strong>🖥️ Device:</strong> ${userAgent}</p>
            <p><strong>🔗 Came from:</strong> ${referrer || 'Direct visit'}</p>
            <p><strong>🌐 IP:</strong> ${ip}</p>
          </div>
          
          ${
            isResumeDownload
              ? '<p style="color: #007acc; font-weight: bold;">🎯 This visitor is interested enough to download your resume! Consider this a hot lead.</p>'
              : ''
          }
          
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
