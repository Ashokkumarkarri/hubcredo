# 🚀 AI-Powered Lead Intelligence Platform

A full-stack web application that analyzes any website URL and provides AI-powered insights including company information, contact details, technology stack, pain points, and personalized cold email templates.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based signup/login system
- 🤖 **AI Analysis** - Powered by Google Gemini for intelligent company insights
- 🌐 **Website Scraping** - Firecrawl API integration for content extraction
- 📧 **Email Generation** - Personalized cold email templates
- 📊 **Lead Scoring** - Automatic 1-10 scoring based on data quality
- 🔍 **Contact Discovery** - Extract emails, phones, and social profiles
- 🛠️ **Tech Stack Detection** - Identify technologies used by companies
- 🔄 **n8n Automation** - Webhook triggers for workflow automation
- 💾 **Lead Management** - Save, search, and filter analyzed leads
- 📱 **Responsive Design** - Modern dark theme UI with TailwindCSS

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Google Gemini AI
- Firecrawl API
- n8n Webhooks

### Frontend
- React 18
- Vite
- React Router
- Axios
- TailwindCSS

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account
- API keys for:
  - Firecrawl
  - Google Gemini
  - n8n (optional)

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd hubCredo
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd backend
npm install
\`\`\`

Create \`.env\` file in backend directory:

\`\`\`env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
FIRECRAWL_API_KEY=your_firecrawl_api_key
GEMINI_API_KEY=your_gemini_api_key
N8N_WEBHOOK_SIGNUP=your_n8n_webhook_url (optional)
N8N_WEBHOOK_LEAD_ANALYSIS=your_n8n_webhook_url (optional)
N8N_WEBHOOK_HIGH_SCORE=your_n8n_webhook_url (optional)
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
\`\`\`

Generate JWT secret:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
\`\`\`

Start backend server:
\`\`\`bash
npm run dev
\`\`\`

Backend will run on http://localhost:5000

### 3. Frontend Setup

\`\`\`bash
cd frontend
npm install
\`\`\`

Create \`.env\` file in frontend directory:

\`\`\`env
VITE_API_URL=http://localhost:5000
\`\`\`

Start frontend dev server:
\`\`\`bash
npm run dev
\`\`\`

Frontend will run on http://localhost:5173

## 🔑 Getting API Keys

### MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free cluster
3. Get your connection string
4. Replace password and database name

### Firecrawl API
1. Visit https://www.firecrawl.dev/
2. Sign up for free account
3. Get API key from dashboard
4. Free tier: 500 credits/month

### Google Gemini API
1. Go to https://aistudio.google.com/app/apikey
2. Create API key
3. Free tier: 1500 requests/day (forever free!)

### n8n Webhooks (Optional)
1. Sign up at https://n8n.io/cloud/
2. Create workflows with webhook triggers
3. Copy webhook URLs
4. Free tier: 5000 executions/month

## 📖 API Documentation

### Authentication Endpoints

#### Sign Up
\`\`\`
POST /api/auth/signup
Body: { name, email, password }
\`\`\`

#### Login
\`\`\`
POST /api/auth/login
Body: { email, password }
\`\`\`

#### Get Current User
\`\`\`
GET /api/auth/me
Headers: { Authorization: Bearer <token> }
\`\`\`

### Lead Endpoints

#### Analyze Website
\`\`\`
POST /api/leads/analyze
Headers: { Authorization: Bearer <token> }
Body: { url: "https://example.com" }
\`\`\`

#### Get All Leads
\`\`\`
GET /api/leads?search=&industry=&minScore=&maxScore=&sortBy=&page=1&limit=10
Headers: { Authorization: Bearer <token> }
\`\`\`

#### Get Lead by ID
\`\`\`
GET /api/leads/:id
Headers: { Authorization: Bearer <token> }
\`\`\`

#### Delete Lead
\`\`\`
DELETE /api/leads/:id
Headers: { Authorization: Bearer <token> }
\`\`\`

#### Get Stats
\`\`\`
GET /api/leads/stats/overview
Headers: { Authorization: Bearer <token> }
\`\`\`

## 🔄 n8n Workflow Setup

### Signup Workflow
1. Create new workflow in n8n
2. Add Webhook trigger node
3. Copy webhook URL to \`N8N_WEBHOOK_SIGNUP\`
4. Add actions (e.g., send email, log to Google Sheets)

### Lead Analysis Workflow
1. Create workflow with webhook trigger
2. Copy URL to \`N8N_WEBHOOK_LEAD_ANALYSIS\`
3. Add actions (e.g., notify Slack, update CRM)

### High-Score Lead Workflow
1. Create workflow for leads with score > 8.0
2. Copy URL to \`N8N_WEBHOOK_HIGH_SCORE\`
3. Add priority actions

## 🚢 Deployment

### Backend (Render)

1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect GitHub repository
5. Configure:
   - Build Command: \`npm install\`
   - Start Command: \`node server.js\`
   - Add environment variables
6. Deploy

### Frontend (Vercel)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import repository
4. Configure:
   - Framework: Vite
   - Root Directory: \`frontend\`
   - Add \`VITE_API_URL\` environment variable
5. Deploy

## 📁 Project Structure

\`\`\`
hubCredo/
├── backend/
│   ├── config/          # Database configuration
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & error handling
│   ├── services/        # Firecrawl, Gemini, n8n
│   ├── utils/           # JWT, validation
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   ├── services/    # API client
│   │   └── App.jsx      # Main app
│   └── index.html
└── README.md
\`\`\`

## 🎯 Usage

1. **Sign Up** - Create an account
2. **Dashboard** - View stats and recent analyses
3. **Analyze URL** - Enter any company website URL
4. **View Results** - See AI-powered insights:
   - Company profile
   - Contact information
   - Technology stack
   - Services offered
   - Pain points
   - Personalized cold email
5. **Manage Leads** - Search, filter, and view all analyzed leads

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify all environment variables are set
- Ensure port 5000 is not in use

### Frontend can't connect to backend
- Verify \`VITE_API_URL\` is correct
- Check CORS settings in backend
- Ensure backend is running

### API errors
- Verify API keys are valid
- Check API rate limits
- Review error messages in console

## 📝 License

MIT License

## 👤 Author

Created for Hubcredo job assignment

## 🙏 Acknowledgments

- Firecrawl for web scraping
- Google Gemini for AI analysis
- n8n for workflow automation
- TailwindCSS for styling

---

**Built with ❤️ using React, Node.js, and AI**
