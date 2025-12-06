import React, { useState } from 'react';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const EmailEditorModal = ({ isOpen, onClose, onSend, initialData }) => {
  const [formData, setFormData] = useState({
    to: initialData?.to || '',
    subject: initialData?.subject || '',
    message: initialData?.message || '',
  });

  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await onSend(formData);
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700 bg-gray-800/50">
          <h3 className="text-xl font-semibold text-white">Draft Email</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">To</label>
            <input
              type="text"
              required
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
            <input
              type="text"
              required
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Message Body</label>
            <textarea
              required
              rows={12}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 font-mono text-sm leading-relaxed"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700 mt-6">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={sending}>
              {sending ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" /> Sending...
                </span>
              ) : (
                '🚀 Send via n8n'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailEditorModal;
