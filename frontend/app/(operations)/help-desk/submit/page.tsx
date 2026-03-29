'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { HelpCircle, Send, Upload, Home } from 'lucide-react';
import Link from 'next/link';

export default function SubmitTicketPage() {
  const [formData, setFormData] = useState({
    category: '',
    priority: 'medium',
    subject: '',
    description: '',
    email: '',
    phone: '',
  });

  const categories = [
    'Technical Support',
    'Account Issues',
    'Payment Issues',
    'Application Issues',
    'Registration Problems',
    'Course Enrollment',
    'Portal Access',
    'Document Request',
    'General Inquiry',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Support ticket submitted successfully! Ticket ID: TKT-2026-001');
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6 flex items-center space-x-3">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black">Submit Support Ticket</h1>
            <p className="text-sm text-black">Get help from our support team</p>
          
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center space-x-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-black mb-4">Ticket Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-portal-teal-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Priority *
                </label>
                <select
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-portal-teal-500"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Need assistance</option>
                  <option value="high">High - Urgent issue</option>
                  <option value="critical">Critical - System down</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-portal-teal-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  placeholder="Provide detailed information about your issue..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-portal-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-black mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-portal-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+232 XX XXX XXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-portal-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-black mb-4">Attachments (Optional)</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-black mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-black">
                PNG, JPG, PDF up to 10MB
              </p>
              <input type="file" multiple accept="image/*,.pdf" className="hidden" />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 border border-gray-300 text-black rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-portal-teal-600 text-white rounded-lg hover:bg-portal-teal-700 flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
