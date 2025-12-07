const axios = require('axios');
require('dotenv').config();

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const SERPAPI_URL = 'https://serpapi.com/search.json';

/**
 * Search for company details using SerpAPI (Google Search)
 * @param {string} query - Company name or domain
 * @returns {Promise<Object>} - Enriched data (website, social links, location, rating)
 */
const searchCompany = async (query) => {
  if (!SERPAPI_KEY) {
    console.error('SERPAPI_KEY is not defined in environment variables.');
    throw new Error('SerpAPI key is missing.');
  }

  try {
    const params = {
      engine: 'google',
      q: query,
      api_key: SERPAPI_KEY,
      num: 5, // We don't need many results
    };

    const response = await axios.get(SERPAPI_URL, { params });
    const data = response.data;

    const enrichedData = {
      website: '',
      socialLinks: [],
      location: '',
      rating: null,
      reviews: 0,
      rating: null,
      reviews: 0,
      snippet: '',
      keyPeople: []
    };

    // Extract Knowledge Graph data if available (best source)
    if (data.knowledge_graph) {
      const kg = data.knowledge_graph;
      if (kg.website) enrichedData.website = kg.website;
      if (kg.description) enrichedData.snippet = kg.description;
      if (kg.headquarters) enrichedData.location = kg.headquarters;
      if (kg.rating) enrichedData.rating = kg.rating;
      if (kg.review_count) enrichedData.reviews = kg.review_count;
      
      // Social profiles from knowledge graph
      if (kg.profiles) {
        enrichedData.socialLinks = kg.profiles.map(p => p.link);
      }
      if (kg.profiles) {
        enrichedData.socialLinks = kg.profiles.map(p => p.link);
      }

      // Extract Key People (Founders, CEO)
      // Founders can be an array or string or missing
      if (kg.founders) {
         const foundersList = Array.isArray(kg.founders) ? kg.founders : [kg.founders];
         foundersList.forEach(founder => {
            const name = typeof founder === 'string' ? founder : founder.name;
            const link = (typeof founder === 'object' && founder.link) ? founder.link : '';
            if (name) {
                enrichedData.keyPeople.push({ name, role: 'Founder', link });
            }
         });
      }
      
      if (kg.ceo) {
         const ceoList = Array.isArray(kg.ceo) ? kg.ceo : [kg.ceo];
         ceoList.forEach(ceo => {
             const name = typeof ceo === 'string' ? ceo : ceo.name;
             const link = (typeof ceo === 'object' && ceo.link) ? ceo.link : '';
             if (name) {
                 enrichedData.keyPeople.push({ name, role: 'CEO', link });
             }
         });
      }
    }

    // Extract organic results for backup
    if (data.organic_results && data.organic_results.length > 0) {
      const firstResult = data.organic_results[0];
      if (!enrichedData.website) enrichedData.website = firstResult.link;
      if (!enrichedData.snippet) enrichedData.snippet = firstResult.snippet;

      // Scan organic results for social media links if not found in KG
      if (enrichedData.socialLinks.length === 0) {
        const socialDomains = ['linkedin.com', 'twitter.com', 'facebook.com', 'instagram.com'];
        data.organic_results.forEach(result => {
           if (socialDomains.some(domain => result.link.includes(domain))) {
             enrichedData.socialLinks.push(result.link);
           }
        });
      }
    }

    // Scan organic results for LinkedIn profiles of people if KG didn't yield much
    if (enrichedData.keyPeople.length === 0 && data.organic_results) {
         data.organic_results.forEach(result => {
             const title = result.title || '';
             // Simple heuristic: "Name - Role - Company | LinkedIn"
             if (result.link && result.link.includes('linkedin.com/in/')) {
                 if (title.includes('CEO') || title.includes('Founder') || title.includes('President') || title.includes('Director')) {
                     // Try to extract name: usually "Name - Role..."
                     const parts = title.split(/[-|]/);
                     if (parts.length > 0) {
                         const name = parts[0].trim();
                         // Guess role
                         let role = 'Key Executive';
                         if (title.includes('CEO')) role = 'CEO';
                         else if (title.includes('Founder')) role = 'Founder';
                         
                         enrichedData.keyPeople.push({ name, role, link: result.link });
                     }
                 }
             }
         });
    }

    // Attempt to find location/address if present in KG or local results
    if (data.knowledge_graph) {
       // Sometimes address is a specific field
       // We can iterate keys to find "address" or similar
       // But simpler: check if 'address' exists directly
    }

    return enrichedData;

  } catch (error) {
    console.error('SerpAPI Search Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch company details from SerpAPI.');
  }
};

module.exports = {
  searchCompany
};
