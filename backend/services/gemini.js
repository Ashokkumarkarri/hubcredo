const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ANALYSIS_PROMPT_TEMPLATE, EMAIL_PROMPT_TEMPLATE } = require('../utils/prompts');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });
  }

  async analyzeCompany(scrapedData) {
    try {
      console.log('🤖 Analyzing company with Gemini AI...');

      const prompt = ANALYSIS_PROMPT_TEMPLATE(
        scrapedData.url,
        scrapedData.title,
        scrapedData.description,
        scrapedData.content
      );

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Clean and extract JSON
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          const analysis = JSON.parse(jsonMatch[0]);
          return {
            success: true,
            data: analysis,
          };
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
        }
      }

      throw new Error('Failed to parse AI response');
    } catch (error) {
      console.error('Gemini AI Error:', error.message);
      return {
        success: false,
        error: error.message,
        data: {
          companyName: scrapedData.title || 'Unknown',
          industry: 'Unknown',
          companySize: 'Unknown',
          location: 'Unknown',
          services: [],
          painPoints: [],
          targetAudience: 'Unknown',
          valueProposition: 'Unknown',
          techStack: [],
          keyFeatures: [],
          summary: '', // Empty summary on failure to avoid ugly UI
        },
      };
    }
  }

  async generateColdEmail(companyData, leadData) {
    try {
      console.log('✉️ Generating personalized cold email...');

      const prompt = EMAIL_PROMPT_TEMPLATE(companyData);

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Clean and extract JSON
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          const email = JSON.parse(jsonMatch[0]);
          return {
            success: true,
            data: email,
          };
        } catch (parseError) {
          console.error('Email JSON Parse Error:', parseError);
        }
      }

      throw new Error('Failed to parse email response');
    } catch (error) {
      console.error('Email Generation Error:', error.message);
      return {
        success: false,
        data: {
          subject: `Automating ${companyData.companyName}'s workflow with AI`,
          body: `Hi there,\n\nI've been analyzing ${companyData.companyName}'s presence in the ${companyData.industry} space.\n\nAt HubCredo, we help companies like yours automate repetitive tasks using AI agents and tools like n8n and Clay.\n\nI'd love to show you how we can save your team hours of manual work.\n\nOpen to a quick chat?\n\nBest regards,\nHubCredo Team`,
        },
      };
    }
  }

  calculateLeadScore(companyData, contacts) {
    // Simple lead scoring algorithm
    let score = 5; // Base score

    // Company size scoring
    if (companyData.companySize.includes('50-200') || companyData.companySize.includes('200+')) {
      score += 2;
    } else if (companyData.companySize.includes('10-50')) {
      score += 1;
    }

    // Contact information scoring
    if (contacts.emails && contacts.emails.length > 0) score += 1;
    if (contacts.phones && contacts.phones.length > 0) score += 0.5;
    if (contacts.socialLinks && contacts.socialLinks.length > 0) score += 0.5;

    // Services/features scoring
    if (companyData.services && companyData.services.length >= 3) score += 1;
    if (companyData.keyFeatures && companyData.keyFeatures.length >= 3) score += 0.5;

    // Tech stack scoring (shows they're tech-savvy)
    if (companyData.techStack && companyData.techStack.length >= 2) score += 0.5;

    // Cap at 10
    return Math.min(Math.round(score * 10) / 10, 10);
  }
}

module.exports = new GeminiService();
