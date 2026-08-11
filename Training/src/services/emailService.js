const nodemailer = require('nodemailer');

function isEmailConfigured() {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!user || !pass) return false;

  return true;
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Sends welcome email. Never throws — user creation must not fail because of email.
 */
async function sendWelcomeEmail(user) {
  if (!isEmailConfigured()) {
    console.log('[Email skipped] Set SMTP_USER and SMTP_PASS in .env to send emails.');
    return { skipped: true, message: 'Email not configured' };
  }

  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: 'Welcome to API Training Project',
      text: `Hi ${user.name}, welcome! Your account was created successfully.`,
      html: `
        <h2>Welcome, ${user.name}!</h2>
        <p>Your account was created in our training project.</p>
        <p><strong>Email:</strong> ${user.email}</p>
      `,
    });

    return { skipped: false, sent: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email failed]', error.message);
    return { skipped: false, sent: false, message: error.message };
  }
}

module.exports = { sendWelcomeEmail };
