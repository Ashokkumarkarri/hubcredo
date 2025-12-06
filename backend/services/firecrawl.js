const axios = require('axios');

class FirecrawlService {
  constructor() {
    this.apiKey = process.env.FIRECRAWL_API_KEY;
    this.baseUrl = 'https://api.firecrawl.dev/v1';
  }

  async scrapeWebsite(url) {
    try {
      console.log(`🔍 Scraping website: ${url}`);

      const response = await axios.post(
        `${this.baseUrl}/scrape`,
        {
          url: url,
          formats: ['markdown', 'html'],
          onlyMainContent: true,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds
        }
      );

      if (response.data && response.data.success) {
        const data = response.data.data;
        
        return {
          success: true,
          data: {
            url: url,
            title: data.metadata?.title || '',
            description: data.metadata?.description || '',
            content: data.markdown || data.html || '',
            metadata: data.metadata || {},
            links: data.links || [],
          },
        };
      }

      throw new Error('Failed to scrape website');
    } catch (error) {
      console.error('Firecrawl Error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to scrape website',
      };
    }
  }

  // Extract emails from content
  extractEmails(content) {
    const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
    const emails = content.match(emailRegex) || [];
    return [...new Set(emails)]; // Remove duplicates
  }

  // Extract phone numbers from content
  extractPhones(content) {
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phones = content.match(phoneRegex) || [];
    return [...new Set(phones)];
  }

  // Extract social media links
  extractSocialLinks(links) {
    const socialPlatforms = ['linkedin', 'twitter', 'facebook', 'instagram', 'youtube'];
    return links.filter(link => 
      socialPlatforms.some(platform => link.toLowerCase().includes(platform))
    );
  }
}

module.exports = new FirecrawlService();
