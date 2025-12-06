# n8n Workflow Templates for Lead Intelligence Platform

This directory contains ready-to-import n8n workflow templates that integrate with your Lead Intelligence Platform.

## 📋 Available Workflows

### 1. **New User Signup Workflow**
**File**: `signup-workflow.json`

**Triggers on**: Every new user registration

**Actions**:
- ✉️ Send welcome email via Gmail/SendGrid
- 📊 Log to Google Sheets
- 💬 Post to Slack channel
- 📝 Create contact in HubSpot/Pipedrive

**Webhook URL**: Set in `N8N_WEBHOOK_SIGNUP`

---

### 2. **Lead Analysis Workflow**
**File**: `lead-analysis-workflow.json`

**Triggers on**: Every website analysis completion

**Actions**:
- 📊 Log lead data to Google Sheets
- 💬 Notify team in Slack
- 📧 Send summary email to user
- 💾 Backup to Airtable/Notion

**Webhook URL**: Set in `N8N_WEBHOOK_LEAD_ANALYSIS`

---

### 3. **High-Score Lead Alert**
**File**: `high-score-lead-workflow.json`

**Triggers on**: Lead score ≥ 8.0

**Actions**:
- 🚨 Priority Slack notification
- 📧 Email sales team
- 📋 Create task in project management tool
- 🔔 SMS alert (via Twilio)

**Webhook URL**: Set in `N8N_WEBHOOK_HIGH_SCORE`

---

## 🚀 Quick Setup Guide

### Step 1: Create n8n Account
1. Go to https://n8n.io/cloud/
2. Sign up for free (5000 executions/month)
3. Or self-host: `npx n8n`

### Step 2: Import Workflows
1. In n8n, click **"Workflows"** → **"Import from File"**
2. Select one of the JSON files from this directory
3. The workflow will be created with all nodes

### Step 3: Configure Credentials
Each workflow needs credentials for:
- **Gmail/SendGrid**: For email sending
- **Google Sheets**: For data logging
- **Slack**: For notifications
- **HubSpot/Pipedrive**: For CRM integration (optional)

### Step 4: Activate Webhook
1. Open the workflow
2. Click on the **Webhook** node
3. Copy the **Production URL**
4. Add to your backend `.env` file:
   ```
   N8N_WEBHOOK_SIGNUP=https://your-n8n-instance.app.n8n.cloud/webhook/...
   ```

### Step 5: Test
1. Sign up a new user in your app
2. Check n8n workflow executions
3. Verify email/Slack/Sheets received data

---

## 📊 Workflow Details

### Signup Workflow Structure
```
Webhook Trigger
    ↓
Extract User Data
    ↓
├─→ Send Welcome Email (Gmail)
├─→ Add to Google Sheets
├─→ Post to Slack
└─→ Create CRM Contact
```

### Lead Analysis Workflow Structure
```
Webhook Trigger
    ↓
Extract Lead Data
    ↓
├─→ Log to Google Sheets
├─→ Notify Slack Channel
├─→ Send Summary Email
└─→ Backup to Airtable
```

### High-Score Lead Workflow Structure
```
Webhook Trigger
    ↓
Check Score ≥ 8.0
    ↓
├─→ Priority Slack Alert
├─→ Email Sales Team
├─→ Create Urgent Task
└─→ SMS Notification
```

---

## 🔧 Customization Tips

### Add More Actions
You can extend workflows with:
- **Zapier**: Trigger Zapier workflows
- **Make (Integromat)**: Connect to 1000+ apps
- **Discord**: Post to Discord channels
- **Twitter**: Auto-tweet high-score leads
- **Notion**: Create database entries
- **Airtable**: Sync lead data
- **Calendly**: Schedule follow-up meetings
- **LinkedIn**: Auto-connect with prospects

### Conditional Logic
Add **IF** nodes to:
- Send different emails based on industry
- Route high-value leads to senior sales
- Skip weekends for notifications
- Filter by company size or location

### Data Transformation
Use **Function** nodes to:
- Format data for specific tools
- Calculate additional metrics
- Enrich lead data with APIs
- Clean and validate information

---

## 📧 Email Template Examples

### Welcome Email
```
Subject: Welcome to LeadIntel AI! 🚀

Hi {{name}},

Thanks for signing up! You're now ready to analyze websites and get AI-powered lead insights.

Here's what you can do:
✓ Analyze any company website
✓ Get contact information
✓ Generate personalized cold emails
✓ Score leads automatically

Start analyzing: https://your-app.com/dashboard

Best,
LeadIntel Team
```

### Lead Analysis Summary
```
Subject: New Lead Analyzed: {{companyName}}

Lead Score: {{leadScore}}/10
Industry: {{industry}}
Contacts Found: {{emailCount}} emails

View full details: https://your-app.com/leads/{{leadId}}
```

### High-Score Alert
```
Subject: 🔥 High-Score Lead Alert: {{companyName}}

Score: {{leadScore}}/10
Company: {{companyName}}
Industry: {{industry}}

This is a hot lead! Review immediately.

Generated Email:
{{generatedEmail}}

View: https://your-app.com/leads/{{leadId}}
```

---

## 🎯 Google Sheets Setup

### Create Spreadsheet
1. Go to Google Sheets
2. Create new spreadsheet: "LeadIntel Data"
3. Create sheets:
   - **Users** (columns: Name, Email, Signup Date)
   - **Leads** (columns: Company, Industry, Score, URL, Date)
   - **High Score Leads** (columns: Company, Score, Contacts, Email Template)

### Connect to n8n
1. In n8n workflow, add **Google Sheets** node
2. Authenticate with Google account
3. Select spreadsheet and sheet
4. Map fields from webhook data

---

## 💬 Slack Setup

### Create Slack App
1. Go to https://api.slack.com/apps
2. Create new app
3. Add **Incoming Webhooks**
4. Copy webhook URL
5. Add to n8n Slack node

### Channel Recommendations
- `#new-signups` - User registrations
- `#lead-analysis` - All analyzed leads
- `#hot-leads` - High-score leads only
- `#automation-logs` - Workflow execution logs

---

## 🔔 Advanced Features

### 1. Lead Enrichment
Add **Clearbit/Hunter.io** nodes to:
- Find additional contact emails
- Get company employee count
- Fetch social media profiles
- Verify email deliverability

### 2. CRM Auto-Sync
Connect to:
- **HubSpot**: Create contacts and companies
- **Pipedrive**: Add deals automatically
- **Salesforce**: Sync lead data
- **Zoho CRM**: Update records

### 3. Follow-Up Sequences
Create multi-step workflows:
- Day 1: Send initial email
- Day 3: Follow-up if no response
- Day 7: Final touch point
- Track opens and clicks

### 4. Analytics & Reporting
- Daily summary emails
- Weekly performance reports
- Monthly lead quality analysis
- Export to BI tools (Tableau, Looker)

---

## 🐛 Troubleshooting

### Webhook Not Triggering
- Check webhook URL is correct in `.env`
- Verify n8n workflow is **activated**
- Test with n8n's "Test URL" feature
- Check backend logs for errors

### Data Not Appearing
- Verify field mappings in n8n nodes
- Check credentials are valid
- Test each node individually
- Review execution logs in n8n

### Rate Limits
- Free tier: 5000 executions/month
- Add delays between actions
- Use conditional logic to reduce calls
- Upgrade to paid plan if needed

---

## 📚 Resources

- **n8n Documentation**: https://docs.n8n.io/
- **Workflow Library**: https://n8n.io/workflows/
- **Community Forum**: https://community.n8n.io/
- **Video Tutorials**: https://www.youtube.com/@n8n-io

---

## 🎓 Learning Path

1. **Beginner**: Import templates, activate webhooks
2. **Intermediate**: Customize email templates, add Slack
3. **Advanced**: Build custom workflows, add enrichment
4. **Expert**: Multi-step sequences, CRM integration

---

**Ready to automate? Import a workflow and start connecting your tools!** 🚀
