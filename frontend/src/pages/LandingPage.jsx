import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-blue-900/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="gradient-text">AI-Powered</span>
              <br />
              Lead Intelligence Platform
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              Analyze any website instantly. Get company insights, contact information, and personalized cold emails powered by AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button className="text-lg px-8 py-4">Get Started Free</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="text-lg px-8 py-4">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Powerful Features
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center space-y-4">
            <div className="text-4xl">🤖</div>
            <h3 className="text-xl font-semibold">AI Analysis</h3>
            <p className="text-gray-400">
              Extract company info, services, pain points, and tech stack using advanced AI
            </p>
          </div>
          
          <div className="card text-center space-y-4">
            <div className="text-4xl">📧</div>
            <h3 className="text-xl font-semibold">Email Generation</h3>
            <p className="text-gray-400">
              Get personalized cold email templates tailored to each company
            </p>
          </div>
          
          <div className="card text-center space-y-4">
            <div className="text-4xl">📊</div>
            <h3 className="text-xl font-semibold">Lead Scoring</h3>
            <p className="text-gray-400">
              Automatically score leads from 1-10 based on fit and data quality
            </p>
          </div>
          
          <div className="card text-center space-y-4">
            <div className="text-4xl">🔍</div>
            <h3 className="text-xl font-semibold">Contact Discovery</h3>
            <p className="text-gray-400">
              Extract emails, phone numbers, and social media profiles
            </p>
          </div>
          
          <div className="card text-center space-y-4">
            <div className="text-4xl">🔄</div>
            <h3 className="text-xl font-semibold">n8n Automation</h3>
            <p className="text-gray-400">
              Trigger workflows on signup and lead analysis events
            </p>
          </div>
          
          <div className="card text-center space-y-4">
            <div className="text-4xl">💾</div>
            <h3 className="text-xl font-semibold">Export & Save</h3>
            <p className="text-gray-400">
              Save leads to your database and export to CSV for CRM import
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              1
            </div>
            <h3 className="text-xl font-semibold">Enter URL</h3>
            <p className="text-gray-400">
              Simply paste any company website URL
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              2
            </div>
            <h3 className="text-xl font-semibold">AI Analyzes</h3>
            <p className="text-gray-400">
              Our AI scrapes and analyzes the website in seconds
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              3
            </div>
            <h3 className="text-xl font-semibold">Get Insights</h3>
            <p className="text-gray-400">
              Receive comprehensive insights and personalized emails
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="card text-center space-y-6 bg-gradient-to-r from-primary-900/30 to-blue-900/30">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to supercharge your lead generation?
          </h2>
          <p className="text-xl text-gray-400">
            Start analyzing leads with AI today. No credit card required.
          </p>
          <Link to="/signup">
            <Button className="text-lg px-8 py-4">Get Started Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
