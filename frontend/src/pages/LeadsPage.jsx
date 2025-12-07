import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmailEditorModal from '../components/leads/EmailEditorModal';

const LeadsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const leadId = searchParams.get('id');
  const navigate = useNavigate();
  
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (leadId) {
      console.log('Fetching lead detail for:', leadId);
      fetchLeadById(leadId);
    } else {
      setSelectedLead(null);
    }
  }, [leadId]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadsAPI.getAll({ limit: 50 });
      setLeads(response.data.data.leads);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      setError('Failed to load leads. The server might be restarting or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadById = async (id) => {
    try {
      const response = await leadsAPI.getById(id);
      setSelectedLead(response.data.data.lead);
    } catch (error) {
      console.error('Failed to fetch lead:', error);
      setError('Failed to load lead details. ' + (error.response?.data?.message || error.message));
      // If fetching detail fails, maybe go back to list?
      // For now just stay on page, maybe show alert
    }
  };

  const handleCopyEmail = () => {
    if (selectedLead?.generatedEmail) {
      const emailText = `Subject: ${selectedLead.generatedEmail.subject}\n\n${selectedLead.generatedEmail.body}`;
      navigator.clipboard.writeText(emailText);
      alert('Email copied to clipboard!');
    }
  };

  const handleSendEmail = async (emailData) => {
    try {
      await leadsAPI.sendEmail({
        leadId: selectedLead._id,
        ...emailData,
      });
      alert('Email sent successfully via n8n! 🚀');
      setIsEmailModalOpen(false);
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please try again.');
    }
  };

  const handleEnrichLead = async () => {
    try {
      if (!selectedLead) return;
      setLoading(true); // Maybe use a separate loading state or local one
      const response = await leadsAPI.enrich(selectedLead._id);
      setSelectedLead(response.data.data.lead); // Update local state with enriched lead
      alert('Lead enriched successfully! 🎉');
    } catch (error) {
      console.error('Failed to enrich lead:', error);
      alert('Failed to enrich lead. ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
        setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!leads.length) return alert('No leads to export');

    const headers = [
      'Company Name',
      'Industry',
      'Lead Score',
      'URL',
      'Location',
      'Company Size',
      'Email',
      'Phone',
      'Tech Stack',
      'Analyzed At'
    ];

    const csvContent = leads.map(lead => [
      lead.companyName || '',
      lead.industry || '',
      lead.leadScore || '',
      lead.url || '',
      lead.location || '',
      lead.companySize || '',
      lead.contacts?.emails?.join('; ') || '',
      lead.contacts?.phones?.join('; ') || '',
      lead.techStack?.join('; ') || '',
      new Date(lead.analyzedAt).toLocaleDateString()
    ].map(field => `"${field}"`).join(','));

    const csv = [headers.join(','), ...csvContent].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredLeads = leads.filter(lead =>
    lead.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    lead.industry?.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedLead) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-4 mb-6">
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
          <Button variant="secondary" onClick={() => setSearchParams({})}>
            ← Back to List
          </Button>
        </div>

        <div className="space-y-6">
          {/* Company Profile */}
          <Card>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{selectedLead.companyName}</h1>
                <p className="text-gray-400 mt-1">{selectedLead.url}</p>
              </div>
                <div className="text-right">
                <div className="text-4xl font-bold text-primary-400">{selectedLead.leadScore}/10</div>
                <div className="text-gray-500 text-sm">Lead Score</div>
                
                {selectedLead.aiInsights?.rating && (
                   <div className="mt-2 text-sm text-yellow-500">
                      ⭐ {selectedLead.aiInsights.rating} ({selectedLead.aiInsights.reviews || 0} reviews)
                   </div>
                )}

                <Button variant="secondary" className="mt-2 text-sm" onClick={handleEnrichLead}>
                    ✨ Enrich Lead
                </Button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div>
                <div className="text-gray-500 text-sm">Industry</div>
                <div className="font-semibold">{selectedLead.industry || 'N/A'}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Company Size</div>
                <div className="font-semibold">{selectedLead.companySize || 'N/A'}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Location</div>
                <div className="font-semibold">{selectedLead.location || 'N/A'}</div>
              </div>
            </div>
          </Card>

          {/* Contacts */}
          {(selectedLead.contacts?.emails?.length > 0 || selectedLead.contacts?.phones?.length > 0) && (
            <Card>
              <h2 className="text-xl font-bold mb-4">📧 Contact Information</h2>
              <div className="space-y-2">
                {selectedLead.contacts.emails?.map((email, i) => (
                  <div key={i} className="text-primary-400">{email}</div>
                ))}
                {selectedLead.contacts.phones?.map((phone, i) => (
                  <div key={i} className="text-gray-300">{phone}</div>
                ))}
              </div>
            </Card>
          )}
          
          {/* Key People */}
          {selectedLead.keyPeople?.length > 0 && (
            <Card>
              <h2 className="text-xl font-bold mb-4">👥 People You Can Reach Out To</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {selectedLead.keyPeople.map((person, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">{person.name}</div>
                      <div className="text-gray-400 text-sm">{person.role}</div>
                    </div>
                    {person.link && (
                      <a 
                        href={person.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300 text-sm"
                      >
                        view profile →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Tech Stack */}
          {selectedLead.techStack?.length > 0 && (
            <Card>
              <h2 className="text-xl font-bold mb-4">🛠️ Technology Stack</h2>
              <div className="flex flex-wrap gap-2">
                {selectedLead.techStack.map((tech, i) => (
                  <span key={i} className="bg-primary-500/20 text-primary-300 px-3 py-1 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Services */}
          {selectedLead.services?.length > 0 && (
            <Card>
              <h2 className="text-xl font-bold mb-4">💼 Services Offered</h2>
              <ul className="space-y-2">
                {selectedLead.services.map((service, i) => (
                  <li key={i} className="text-gray-300">• {service}</li>
                ))}
              </ul>
            </Card>
          )}

          {/* Pain Points */}
          {selectedLead.painPoints?.length > 0 && (
            <Card>
              <h2 className="text-xl font-bold mb-4">🎯 Pain Points</h2>
              <ul className="space-y-2">
                {selectedLead.painPoints.map((point, i) => (
                  <li key={i} className="text-gray-300">• {point}</li>
                ))}
              </ul>
            </Card>
          )}

          {/* AI Executive Summary */}
          {selectedLead.summary && (
            <Card className="bg-primary-900/10 border-primary-800/50">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span>🤖</span> AI Executive Summary
              </h2>
              <p className="text-gray-200 leading-relaxed">
                {selectedLead.summary}
              </p>
            </Card>
          )}

          {/* Generated Email */}
          {selectedLead.generatedEmail && (
            <Card className="bg-gradient-to-r from-primary-900/20 to-blue-900/20">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">✉️ Personalized Cold Email</h2>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={handleCopyEmail}>Copy</Button>
                  <Button onClick={() => setIsEmailModalOpen(true)}>✉️ Draft & Send</Button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-gray-500 text-sm">Subject:</div>
                  <div className="font-semibold text-lg">{selectedLead.generatedEmail.subject}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Body:</div>
                  <div className="whitespace-pre-wrap text-gray-300 mt-2">
                    {selectedLead.generatedEmail.body}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Email Editor Modal */}
          <EmailEditorModal
            isOpen={isEmailModalOpen}
            onClose={() => setIsEmailModalOpen(false)}
            onSend={handleSendEmail}
            initialData={{
              to: selectedLead.contacts?.emails?.[0] || '',
              subject: selectedLead.generatedEmail?.subject || '',
              message: selectedLead.generatedEmail?.body || '',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold gradient-text">All Leads</h1>
            <p className="text-gray-400 mt-2">View and manage your analyzed leads</p>
          </div>
          <Button onClick={handleExportCSV} variant="secondary">
            📥 Export CSV
          </Button>
        </div>

        {/* Search */}
        <Card>
          <input
            type="text"
            className="input-field"
            placeholder="Search by company name or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Card>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Leads List */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredLeads.length > 0 ? (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <Card
                key={lead._id}
                className="hover:border-primary-500 transition-colors cursor-pointer"
                onClick={() => setSearchParams({ id: lead._id })}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{lead.companyName || 'Unknown Company'}</h3>
                    <p className="text-gray-400">{lead.industry || 'Unknown Industry'}</p>
                    <p className="text-gray-500 text-sm mt-1">{lead.url}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-3xl font-bold text-primary-400">{lead.leadScore}/10</div>
                    <div className="text-gray-500 text-xs mt-1">
                      {new Date(lead.analyzedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-center text-gray-400">No leads found. Start analyzing websites from the dashboard!</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LeadsPage;
