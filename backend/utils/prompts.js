const ANALYSIS_PROMPT_TEMPLATE = (url, title, description, content) => `
Analyze the following website content for a B2B sales prospect and extract company information in JSON format.

Website URL: ${url}
Title: ${title}
Description: ${description}
Content: ${content.substring(0, 8000)}

Instructions:
1. Be specific. Avoid "Unknown" or generic terms.
2. For "painPoints", infer the problems their customers face that this company solves.
3. For "summary", write a 2-3 sentence executive summary of what this company does, written in a professional tone suitable for a sales briefing.

Extract the following information and return ONLY a valid JSON object:
{
  "companyName": "Company name",
  "industry": "Primary industry/sector",
  "companySize": "Estimated company size",
  "location": "Company location/headquarters",
  "services": ["List of main services or products offered"],
  "painPoints": ["List of customer pain points this company addresses"],
  "targetAudience": "Who are their ideal customers",
  "valueProposition": "Main value proposition",
  "techStack": ["Detected technologies or tools they mention using"],
  "keyFeatures": ["Key features or differentiators"],
  "summary": "2-3 sentence executive summary of the company"
}

Return ONLY the JSON object, no additional text.
`;

const EMAIL_PROMPT_TEMPLATE = (companyData) => `
Generate a highly personalized, detailed B2B cold email for the following company:

Company: ${companyData.companyName}
Industry: ${companyData.industry}
Summary: ${companyData.summary}
Pain Points: ${companyData.painPoints.join(', ')}

Your Role:
You are a senior sales director at **HubCredo**, a premium AI Automation Agency.
Your goal is to pitch high-value automation services.

About HubCredo (The Pitch):
- We act as a "Growth Partner", not just a vendor.
- **Services to Pitch**: 
  1. AI Sales Agents (that work 24/7).
  2. Automated Outbound Engines (n8n + Clay + Instantly).
  3. CRM Data Enrichment (Firecrawl).
- **Social Proof**: "Trusted by 50+ companies including ShineX, Zetwerk, and Medlyze to automate revenue-generating workflows."

Email Structure (Strictly follow this flow):
1. **Subject**: High impact, relevant to ${companyData.companyName}.
2. **The Hook**: Start by validating their specific business (use the summary). Show you did your research.
3. **The Problem**: Discuss the specific scalable challenges in ${companyData.industry} (e.g., manual lead gen, messy CRMs, slow follow-ups).
4. **The HubCredo Solution (The Core Pitch)**: 
   - Write a detailed section explaining how we solve this. 
   - **MUST include 3-4 bullet points** listing specific things we can automate for them (e.g., "Automate your outbound," "Enrich every lead," "Sync valid data to CRM").
   - Emphasize replacing manual work with smart bots.
5. **Call to Action**: Professional ask for a brief strategy call.

Instructions:
- **Do NOT be concise**. The user wants a detailed, substantial email.
- **Talk A LOT about HubCredo**. Sell the vision of "AI Agents" and "Workflow Automation".
- Tone: Sophisticated, authoritative, exciting.

Return ONLY JSON:
{
  "subject": "Subject line",
  "body": "Email body (use \\n for line breaks)"
}
`;

module.exports = {
  ANALYSIS_PROMPT_TEMPLATE,
  EMAIL_PROMPT_TEMPLATE
};
