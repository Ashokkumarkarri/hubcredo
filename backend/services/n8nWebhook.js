const axios = require('axios');
const WebhookLog = require('../models/WebhookLog');

class N8nWebhookService {
  async triggerWebhook(event, webhookUrl, data) {
    if (!webhookUrl) {
      console.log(`⚠️ n8n webhook URL not configured for ${event}`);
      return { success: false, reason: 'not_configured' };
    }

    const startTime = Date.now();
    
    try {
      console.log(`🔔 Triggering n8n webhook: ${event}...`);
      
      const payload = {
        event,
        timestamp: new Date().toISOString(),
        data,
      };

      await axios.post(webhookUrl, payload, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseTime = Date.now() - startTime;

      // Log success
      await WebhookLog.create({
        event,
        webhookUrl,
        payload,
        status: 'success',
        responseTime,
      });

      console.log(`✅ ${event} webhook triggered successfully (${responseTime}ms)`);
      return { success: true, responseTime };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      // Log failure
      await WebhookLog.create({
        event,
        webhookUrl,
        payload: { event, data },
        status: 'failed',
        responseTime,
        error: error.message,
      });

      console.error(`❌ ${event} webhook error:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async triggerSignup(userData) {
    const webhookUrl = process.env.N8N_WEBHOOK_SIGNUP;
    return this.triggerWebhook('user_signup', webhookUrl, {
      userId: userData._id,
      name: userData.name,
      email: userData.email,
      createdAt: userData.createdAt,
    });
  }

  async triggerLeadAnalysis(leadData) {
    const webhookUrl = process.env.N8N_WEBHOOK_LEAD_ANALYSIS;
    return this.triggerWebhook('lead_analyzed', webhookUrl, {
      leadId: leadData._id,
      userId: leadData.userId,
      companyName: leadData.companyName,
      industry: leadData.industry,
      leadScore: leadData.leadScore,
      url: leadData.url,
      contacts: leadData.contacts,
      analyzedAt: leadData.analyzedAt,
    });
  }

  async triggerHighScoreLead(leadData) {
    if (leadData.leadScore < 8.0) {
      return { success: false, reason: 'score_too_low' };
    }

    const webhookUrl = process.env.N8N_WEBHOOK_HIGH_SCORE;
    return this.triggerWebhook('high_score_lead', webhookUrl, {
      leadId: leadData._id,
      userId: leadData.userId,
      companyName: leadData.companyName,
      industry: leadData.industry,
      leadScore: leadData.leadScore,
      url: leadData.url,
      contacts: leadData.contacts,
      generatedEmail: leadData.generatedEmail,
    });
  }

  async triggerSendEmail(emailData) {
    const webhookUrl = process.env.N8N_WEBHOOK_SEND_EMAIL;
    return this.triggerWebhook('send_email', webhookUrl, {
      to: emailData.to,
      subject: emailData.subject,
      message: emailData.message,
      leadId: emailData.leadId,
    });
  }

  // Get webhook activity logs
  async getActivityLogs(filters = {}) {
    const query = {};
    
    if (filters.event) query.event = filters.event;
    if (filters.status) query.status = filters.status;
    
    const logs = await WebhookLog.find(query)
      .sort({ triggeredAt: -1 })
      .limit(filters.limit || 50);
    
    return logs;
  }

  // Get webhook statistics
  async getStats() {
    const total = await WebhookLog.countDocuments();
    const successful = await WebhookLog.countDocuments({ status: 'success' });
    const failed = await WebhookLog.countDocuments({ status: 'failed' });
    
    const avgResponseTime = await WebhookLog.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, avg: { $avg: '$responseTime' } } },
    ]);

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? ((successful / total) * 100).toFixed(1) : 0,
      avgResponseTime: avgResponseTime[0]?.avg || 0,
    };
  }
}

module.exports = new N8nWebhookService();
