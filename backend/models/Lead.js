const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    default: '',
  },
  industry: {
    type: String,
    default: '',
  },
  companySize: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  summary: {
    type: String,
    default: '',
  },
  leadScore: {
    type: Number,
    min: 1,
    max: 10,
    default: 5,
  },
  contacts: {
    emails: [String],
    phones: [String],
    socialLinks: [String],
  },
  keyPeople: [{
    name: String,
    role: String,
    link: String
  }],
  techStack: [String],
  services: [String],
  painPoints: [String],
  aiInsights: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  generatedEmail: {
    subject: String,
    body: String,
  },
  scrapedContent: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  analyzedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
leadSchema.index({ userId: 1, analyzedAt: -1 });
leadSchema.index({ companyName: 'text' });

module.exports = mongoose.model('Lead', leadSchema);
