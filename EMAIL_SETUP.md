# 📧 Email Notification Setup

Your portfolio is now configured to send you email notifications whenever someone visits your site OR downloads your resume! Here's how to set it up:

## 🚀 Quick Setup

### 1. Configure Gmail App Password

1. **Enable 2-Factor Authentication** on your Gmail account (if not already enabled)
2. Go to [Google Account Settings](https://myaccount.google.com/security)
3. Click **2-Step Verification** → **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password (something like: `abcd efgh ijkl mnop`)

### 2. Update Environment Variables

Edit the `.env.local` file in your project root:

```bash
# Replace with your actual Gmail address
EMAIL_USER=jsgokul123@gmail.com

# Replace with the app password you generated (remove spaces)
EMAIL_PASS=abcdefghijklmnop
```

### 3. Deploy or Test Locally

```bash
# Test locally
npm run dev

# Or deploy to Vercel/Netlify and add the environment variables there
```

## ✅ What You'll Get

### 🔔 Page Visit Notifications
When someone visits your portfolio, you'll receive an email with:

- 📍 **Page visited** (/, /projects, etc.)
- ⏰ **Timestamp** of the visit
- 🌍 **Country/Location** (if available)
- 🖥️ **Device/Browser** information
- 🔗 **Referrer** (how they found your site)
- 🌐 **IP address**

### 📄 Resume Download Notifications (Special!)
When someone downloads your resume, you'll get a **special email** with:

- 📄 **Action**: Resume Downloaded
- ⏰ **Timestamp** of download
- 🌍 **Country/Location** (if available)
- 🖥️ **Device/Browser** information
- 🔗 **Referrer** (how they found your site)
- 🎯 **Special note**: "This visitor is interested enough to download your resume! Consider this a hot lead."

The resume download emails have a different design (blue theme) to make them stand out from regular page visits!

## 🛡️ Privacy & Performance

- Only tracks real users (filters out bots/crawlers)
- Lightweight tracking (no impact on site performance)
- Secure (email credentials stored server-side only)
- No cookies or persistent tracking

## 🔧 Customization

Want to modify what gets tracked? Edit:
- `src/app/api/track-visit/route.ts` - Email content and logic
- `src/components/VisitTracker.tsx` - What data gets collected for page visits
- `src/app/ui/components/Navbar/Navbar.tsx` - Resume download tracking

## 🚨 Troubleshooting

- **Not receiving emails?** Check your spam folder
- **Gmail errors?** Make sure you're using an App Password, not your regular password
- **No notifications on Vercel?** Add the environment variables to your Vercel dashboard

Enjoy tracking your portfolio visitors AND resume downloads! 🎉 