require('dotenv').config();
const axios = require('axios');

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

async function testWebhooks() {
  console.log(`${colors.cyan}🚀 Starting n8n Webhook Tests...${colors.reset}\n`);

  // 1. Test Signup Webhook
  const signupUrl = process.env.N8N_WEBHOOK_SIGNUP;
  if (!signupUrl) {
    console.log(`${colors.yellow}⚠️  Skipping Signup Test: N8N_WEBHOOK_SIGNUP not found in .env${colors.reset}`);
  } else {
    console.log(`Testing Signup Webhook...`);
    try {
      await axios.post(signupUrl, {
        event: 'user_signup',
        timestamp: new Date().toISOString(),
        data: {
          userId: 'test_user_123',
          name: 'Test User',
          email: 'test_user@example.com',
          createdAt: new Date().toISOString(),
        },
      });
      console.log(`${colors.green}✅ Signup Webhook Triggered Successfully!${colors.reset}`);
      console.log(`   Check your Email/Slack/Sheets for "Test User"\n`);
    } catch (error) {
      console.log(`${colors.red}❌ Signup Webhook Failed: ${error.message}${colors.reset}\n`);
    }
  }

  // 2. Test Lead Analysis Webhook
  const analysisUrl = process.env.N8N_WEBHOOK_LEAD_ANALYSIS;
  if (!analysisUrl) {
    console.log(`${colors.yellow}⚠️  Skipping Analysis Test: N8N_WEBHOOK_LEAD_ANALYSIS not found in .env${colors.reset}`);
  } else {
    console.log(`Testing Lead Analysis Webhook...`);
    try {
      await axios.post(analysisUrl, {
        event: 'lead_analyzed',
        timestamp: new Date().toISOString(),
        data: {
          leadId: 'test_lead_456',
          userId: 'test_user_123',
          companyName: 'Test Corp Inc.',
          industry: 'Artificial Intelligence',
          leadScore: 7.5,
          url: 'https://test-corp.example.com',
          contacts: { emails: ['contact@test-corp.com'], phones: ['+1-555-0123'] },
          analyzedAt: new Date().toISOString(),
        },
      });
      console.log(`${colors.green}✅ Analysis Webhook Triggered Successfully!${colors.reset}`);
      console.log(`   Check your Sheets/Slack for "Test Corp Inc."\n`);
    } catch (error) {
      console.log(`${colors.red}❌ Analysis Webhook Failed: ${error.message}${colors.reset}\n`);
    }
  }

  // 3. Test High Score Webhook
  const highScoreUrl = process.env.N8N_WEBHOOK_HIGH_SCORE;
  if (!highScoreUrl) {
    console.log(`${colors.yellow}⚠️  Skipping High Score Test: N8N_WEBHOOK_HIGH_SCORE not found in .env${colors.reset}`);
  } else {
    console.log(`Testing High Score Webhook...`);
    try {
      await axios.post(highScoreUrl, {
        event: 'high_score_lead',
        timestamp: new Date().toISOString(),
        data: {
          leadId: 'test_lead_789',
          userId: 'test_user_123',
          companyName: 'Unicorn Startup Ltd',
          industry: 'SaaS',
          leadScore: 9.5,
          url: 'https://unicorn.example.com',
          contacts: { emails: ['ceo@unicorn.example.com'] },
          generatedEmail: {
            subject: 'Scaling Unicorn Startup Ltd',
            body: 'Hi CEO,\n\nI saw what you are doing at Unicorn Startup...'
          },
        },
      });
      console.log(`${colors.green}✅ High Score Webhook Triggered Successfully!${colors.reset}`);
      console.log(`   Check for Priority Alert in Slack/Email\n`);
    } catch (error) {
      console.log(`${colors.red}❌ High Score Webhook Failed: ${error.message}${colors.reset}\n`);
    }
  }

  console.log(`${colors.cyan}✨ Tests Completed!${colors.reset}`);
}

testWebhooks();
