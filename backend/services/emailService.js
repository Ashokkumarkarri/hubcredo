const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      console.log('📧 Email Service Initialized');
    } else {
      console.log('⚠️ Email Service Warning: SMTP credentials missing in .env');
    }
  }

  async sendEmail(to, subject, html) {
    if (!this.transporter) {
      console.log('⚠️ Cannot send email: Transporter not initialized');
      return false;
    }

    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"LeadIntel AI" <noreply@leadintel.ai>',
        to,
        subject,
        html,
      });
      console.log(`✅ Email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return false;
    }
  }

  async sendWelcomeEmail(user) {
    const subject = 'Welcome to LeadIntel AI! 🚀';
    
    // Modern, responsive email template
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 8px; margin-top: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { color: #2563eb; font-size: 24px; font-weight: bold; text-decoration: none; }
          .content { color: #374151; line-height: 1.6; font-size: 16px; }
          .button { display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 20px; }
          .features { background: #f8fafc; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .feature-item { margin: 10px 0; display: flex; align-items: center; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #f0f0f0; text-align: center; color: #9ca3af; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a href="${process.env.FRONTEND_URL}" class="logo">LeadIntel AI</a>
          </div>
          <div class="content">
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>Welcome to LeadIntel AI! We're thrilled to have you on board.</p>
            
            <p>You now have access to powerful AI tools to supercharge your lead generation:</p>
            
            <div class="features">
              <div class="feature-item">🔍 <strong>Instant Website Analysis</strong> - Get deep insights in seconds</div>
              <div class="feature-item">🤖 <strong>AI Lead Scoring</strong> - Focus on high-value prospects</div>
              <div class="feature-item">📧 <strong>Cold Email Generation</strong> - Personalized drafts ready to send</div>
              <div class="feature-item">📊 <strong>Tech Stack Detection</strong> - Know what tools they use</div>
            </div>

            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
            </p>
            
            <p>Ready to find your next customer? Start by pasting a website URL in the dashboard.</p>
            
            <p>Best regards,<br>The LeadIntel Team</p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} LeadIntel AI. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(user.email, subject, html);
  }
}

module.exports = new EmailService();
