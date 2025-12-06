require('dotenv').config();
const emailService = require('./services/emailService');

async function testEmail() {
  console.log('📧 Testing Email Service...');
  
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('❌ Error: SMTP_USER or SMTP_PASS missing in .env');
    console.log('👉 Please add your Gmail/SMTP credentials to backend/.env');
    return;
  }

  console.log(`Using account: ${process.env.SMTP_USER}`);

  const success = await emailService.sendEmail(
    'ashok.ashok1999@gmail.com', // Target email
    'Test Email from LeadIntel AI',
    '<h1>It Works! 🎉</h1><p>Your backend email service is correctly configured and sending to external addresses.</p>'
  );

  if (success) {
    console.log('✅ Success! Check your inbox.');
  } else {
    console.log('❌ Failed to send. Check your credentials (use App Password for Gmail).');
  }
}

testEmail();
