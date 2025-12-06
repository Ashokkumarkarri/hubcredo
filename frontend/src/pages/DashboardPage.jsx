import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { leadsAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [error, setError] = useState('');
  const [industryData, setIndustryData] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const navigate = useNavigate();
  const COLORS = ['#60A5FA', '#34D399', '#F472B6', '#FBBF24', '#818CF8'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsRes = await leadsAPI.getStats();
      setStats(statsRes.data.data);

      // Fetch leads for charts (get up to 100 for better data)
      const leadsRes = await leadsAPI.getAll({ limit: 100 });
      const leads = leadsRes.data.data.leads;
      setRecentLeads(leads.slice(0, 5));

      // Process Industry Data
      const industries = {};
      leads.forEach(lead => {
        const ind = lead.industry || 'Unknown';
        industries[ind] = (industries[ind] || 0) + 1;
      });
      const indChartData = Object.keys(industries)
        .map(name => ({ name, count: industries[name] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 industries
      setIndustryData(indChartData);

      // Process Score Data
      const scores = { 'High (8-10)': 0, 'Medium (5-7)': 0, 'Low (0-4)': 0 };
      leads.forEach(lead => {
        const score = lead.leadScore || 0;
        if (score >= 8) scores['High (8-10)']++;
        else if (score >= 5) scores['Medium (5-7)']++;
        else scores['Low (0-4)']++;
      });
      const scoreChartData = Object.keys(scores).map(name => ({ name, value: scores[name] }));
      setScoreData(scoreChartData);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [isBulk, setIsBulk] = useState(false);
  const [bulkUrls, setBulkUrls] = useState('');
  const [analysisProgress, setAnalysisProgress] = useState({ current: 0, total: 0 });

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError('');
    setAnalyzing(true);

    try {
      const response = await leadsAPI.analyze(url);
      const leadId = response.data.data.lead.id;
      navigate(`/leads?id=${leadId}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to analyze website');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleBulkAnalyze = async (e) => {
    e.preventDefault();
    setError('');
    
    const urls = bulkUrls.split('\n').filter(u => u.trim());
    if (urls.length === 0) {
      setError('Please enter at least one URL');
      return;
    }

    setAnalyzing(true);
    setAnalysisProgress({ current: 0, total: urls.length });
    
    let successCount = 0;
    
    try {
      for (let i = 0; i < urls.length; i++) {
        try {
          await leadsAPI.analyze(urls[i].trim());
          successCount++;
        } catch (err) {
          console.error(`Failed to analyze ${urls[i]}:`, err);
        }
        setAnalysisProgress(prev => ({ ...prev, current: i + 1 }));
      }
      
      // Refresh data
      await fetchDashboardData();
      
      if (successCount > 0) {
        alert(`Successfully analyzed ${successCount} of ${urls.length} websites!`);
        setBulkUrls('');
        setIsBulk(false);
      } else {
        setError('Failed to analyze all provided websites. Please check the URLs and try again.');
      }
    } catch (error) {
      setError('An error occurred during batch analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold gradient-text">Dashboard</h1>
          <p className="text-gray-400 mt-2">Analyze leads and get AI-powered insights</p>
        </div>

        {/* Stats */}
        {loading ? (
          <LoadingSpinner />
        ) : stats ? (
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-400">{stats.totalLeads}</div>
                <div className="text-gray-300 mt-2 font-medium">Total Leads</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-400">{stats.avgScore}</div>
                <div className="text-gray-300 mt-2 font-medium">Avg Lead Score</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-400">{stats.highScoreLeads}</div>
                <div className="text-gray-300 mt-2 font-medium">High-Score Leads</div>
              </div>
            </Card>
          </div>
        ) : null}

        {/* Analytics Charts */}
        {stats && (
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-xl font-bold mb-6 text-white">Top Industries</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={industryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#E5E7EB" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tick={{ fill: '#D1D5DB' }}
                    />
                    <YAxis 
                      stroke="#E5E7EB" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tick={{ fill: '#D1D5DB' }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                      itemStyle={{ color: '#F3F4F6' }}
                      cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                    />
                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold mb-6 text-white">Lead Quality Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scoreData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {scoreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.2)" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                      itemStyle={{ color: '#F3F4F6' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {scoreData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      {entry.name}: <span className="font-semibold text-white">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* URL Analyzer */}
        <Card className="bg-gradient-to-r from-primary-900/20 to-blue-900/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Analyze Website</h2>
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                className={`px-4 py-2 rounded-md transition-all ${
                  !isBulk ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setIsBulk(false)}
              >
                Single URL
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-all ${
                  isBulk ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setIsBulk(true)}
              >
                Bulk Upload
              </button>
            </div>
          </div>

          <form onSubmit={isBulk ? handleBulkAnalyze : handleAnalyze} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              {isBulk ? (
                <textarea
                  required
                  className="input-field text-lg h-32 font-mono"
                  placeholder={`https://example.com\nhttps://another-startup.com\nhttps://tech-company.io`}
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  disabled={analyzing}
                />
              ) : (
                <input
                  type="url"
                  required
                  className="input-field text-lg"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={analyzing}
                />
              )}
            </div>

            {analyzing && isBulk && (
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-primary-500 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${(analysisProgress.current / analysisProgress.total) * 100}%` }}
                ></div>
                <div className="text-center text-sm text-gray-400 mt-2">
                  Processing {analysisProgress.current} of {analysisProgress.total} websites...
                </div>
              </div>
            )}
            
            <Button type="submit" className="w-full text-lg py-4" disabled={analyzing}>
              {analyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  {isBulk ? 'Analyzing Batch...' : 'Analyzing...'}
                </span>
              ) : (
                isBulk ? '🚀 Analyze Multiple Sites' : '🔍 Analyze Website'
              )}
            </Button>
          </form>
        </Card>

        {/* Recent Leads */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Analyses</h2>
            <Button variant="secondary" onClick={() => navigate('/leads')}>
              View All
            </Button>
          </div>
          
          {recentLeads.length > 0 ? (
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <Card key={lead._id} className="hover:border-primary-500 transition-colors cursor-pointer"
                  onClick={() => navigate(`/leads?id=${lead._id}`)}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{lead.companyName || 'Unknown Company'}</h3>
                      <p className="text-gray-300 text-sm">{lead.industry || 'Unknown Industry'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-400">{lead.leadScore}/10</div>
                      <div className="text-gray-400 text-xs">
                        {new Date(lead.analyzedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <p className="text-center text-gray-400">No leads analyzed yet. Start by analyzing a website above!</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
