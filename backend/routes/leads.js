const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');
const { urlValidation, validate } = require('../utils/validation');
const firecrawlService = require('../services/firecrawl');
const geminiService = require('../services/gemini');
const n8nWebhook = require('../services/n8nWebhook');

// @route   POST /api/leads/analyze
// @desc    Analyze a website URL
// @access  Private
router.post('/analyze', protect, urlValidation, validate, async (req, res, next) => {
  try {
    const { url } = req.body;

    // Step 1: Scrape website with Firecrawl
    const scrapeResult = await firecrawlService.scrapeWebsite(url);

    if (!scrapeResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to scrape website',
        error: scrapeResult.error,
      });
    }

    const scrapedData = scrapeResult.data;

    // Step 2: Extract contacts from scraped content
    const emails = firecrawlService.extractEmails(scrapedData.content);
    const phones = firecrawlService.extractPhones(scrapedData.content);
    const socialLinks = firecrawlService.extractSocialLinks(scrapedData.links);

    const contacts = {
      emails,
      phones,
      socialLinks,
    };

    // Step 3: Analyze company with Gemini AI
    const analysisResult = await geminiService.analyzeCompany(scrapedData);
    const companyData = analysisResult.data;

    // Step 4: Calculate lead score
    const leadScore = geminiService.calculateLeadScore(companyData, contacts);

    // Step 5: Generate personalized cold email
    const emailResult = await geminiService.generateColdEmail(companyData, scrapedData);
    const generatedEmail = emailResult.data;

    // Step 6: Save lead to database
    const lead = await Lead.create({
      userId: req.user._id,
      url,
      companyName: companyData.companyName,
      industry: companyData.industry,
      companySize: companyData.companySize,
      location: companyData.location,
      summary: companyData.summary,
      leadScore,
      contacts,
      techStack: companyData.techStack || [],
      services: companyData.services || [],
      painPoints: companyData.painPoints || [],
      aiInsights: {
        targetAudience: companyData.targetAudience,
        valueProposition: companyData.valueProposition,
        keyFeatures: companyData.keyFeatures || [],
      },
      generatedEmail,
      scrapedContent: {
        title: scrapedData.title,
        description: scrapedData.description,
        metadata: scrapedData.metadata,
      },
    });

    // Step 7: Trigger n8n webhooks
    await n8nWebhook.triggerLeadAnalysis(lead);
    await n8nWebhook.triggerHighScoreLead(lead);

    res.status(201).json({
      success: true,
      message: 'Website analyzed successfully',
      data: {
        lead: {
          id: lead._id,
          url: lead.url,
          companyName: lead.companyName,
          industry: lead.industry,
          companySize: lead.companySize,
          location: lead.location,
          leadScore: lead.leadScore,
          contacts: lead.contacts,
          techStack: lead.techStack,
          services: lead.services,
          painPoints: lead.painPoints,
          aiInsights: lead.aiInsights,
          generatedEmail: lead.generatedEmail,
          analyzedAt: lead.analyzedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/leads
// @desc    Get all user's leads
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const { search, industry, minScore, maxScore, sortBy, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { userId: req.user._id };

    // Search by company name
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by industry
    if (industry) {
      query.industry = new RegExp(industry, 'i');
    }

    // Filter by score range
    if (minScore || maxScore) {
      query.leadScore = {};
      if (minScore) query.leadScore.$gte = parseFloat(minScore);
      if (maxScore) query.leadScore.$lte = parseFloat(maxScore);
    }

    // Sorting
    let sort = { analyzedAt: -1 }; // Default: newest first
    if (sortBy === 'score-high') sort = { leadScore: -1 };
    if (sortBy === 'score-low') sort = { leadScore: 1 };
    if (sortBy === 'name') sort = { companyName: 1 };

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const leads = await Lead.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-scrapedContent'); // Exclude large scraped content

    const total = await Lead.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        leads,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/leads/:id
// @desc    Get single lead by ID
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const lead = await Lead.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/leads/:id
// @desc    Delete a lead
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const lead = await Lead.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/leads/stats/overview
// @desc    Get user's lead statistics
// @access  Private
router.get('/stats/overview', protect, async (req, res, next) => {
  try {
    const totalLeads = await Lead.countDocuments({ userId: req.user._id });
    
    const avgScoreResult = await Lead.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, avgScore: { $avg: '$leadScore' } } },
    ]);

    const avgScore = avgScoreResult.length > 0 ? avgScoreResult[0].avgScore : 0;

    const highScoreLeads = await Lead.countDocuments({
      userId: req.user._id,
      leadScore: { $gte: 8 },
    });

    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        avgScore: Math.round(avgScore * 10) / 10,
        highScoreLeads,
      },
    });
  } catch (error) {
    next(error);
  }
});

const emailService = require('../services/emailService');

// @route   POST /api/leads/send-email
// @desc    Trigger email sending via Backend (Nodemailer)
// @access  Private
router.post('/send-email', protect, async (req, res, next) => {
  try {
    const { leadId, to, subject, message } = req.body;

    if (!leadId || !to || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Verify lead ownership
    const lead = await Lead.findOne({ _id: leadId, userId: req.user._id });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Convert newlines to HTML breaks if message is plain text
    const htmlMessage = message.replace(/\n/g, '<br>');

    // Send email using internal service
    const success = await emailService.sendEmail(to, subject, htmlMessage);

    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send email. Check SMTP logs.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email sent successfully via Backend!',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
