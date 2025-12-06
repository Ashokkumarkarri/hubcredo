const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
    enum: ['user_signup', 'lead_analyzed', 'high_score_lead'],
  },
  webhookUrl: {
    type: String,
    required: true,
  },
  payload: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success',
  },
  responseTime: {
    type: Number, // in milliseconds
  },
  error: {
    type: String,
  },
  triggeredAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
webhookLogSchema.index({ event: 1, triggeredAt: -1 });
webhookLogSchema.index({ status: 1 });

module.exports = mongoose.model('WebhookLog', webhookLogSchema);
