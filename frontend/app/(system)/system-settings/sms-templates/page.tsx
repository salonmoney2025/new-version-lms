'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { MessageSquare, Edit, Trash2, Plus, Search, Eye, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface SMSTemplate {
  id: number;
  name: string;
  template_type: string;
  template_type_display: string;
  message: string;
  description: string;
  is_active: boolean;
  available_placeholders: string[];
  message_length: number;
  created_at: string;
}

export default function SMSTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<SMSTemplate[]>([]);
  const [templateTypes, setTemplateTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SMSTemplate | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    template_type: '',
    message: '',
    description: '',
    is_active: true,
    available_placeholders: [] as string[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [templatesRes, typesRes] = await Promise.all([
        api.get('/communications/sms-templates/'),
        api.get('/communications/sms-templates/types/')
      ]);
      setTemplates(templatesRes.data.results || templatesRes.data);
      setTemplateTypes(typesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await api.patch(`/communications/sms-templates/${editingTemplate.id}/`, formData);
        toast.success('Template updated successfully');
      } else {
        await api.post('/communications/sms-templates/', formData);
        toast.success('Template added successfully');
      }
      setShowAddModal(false);
      setEditingTemplate(null);
      resetForm();
      fetchData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Operation failed';
      toast.error(errorMessage);
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete template "${name}"?`)) return;

    try {
      await api.delete(`/communications/sms-templates/${id}/`);
      toast.success('Template deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const handlePreview = async (template: SMSTemplate) => {
    try {
      // Sample context data for preview
      const sampleContext: any = {};
      template.available_placeholders.forEach(placeholder => {
        sampleContext[placeholder] = `[${placeholder}]`;
      });

      const response = await api.post(`/communications/sms-templates/${template.id}/preview/`, {
        context: sampleContext
      });
      setPreviewData(response.data);
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Error previewing template:', error);
      toast.error('Failed to preview template');
    }
  };

  const handleEdit = (template: SMSTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      template_type: template.template_type,
      message: template.message,
      description: template.description,
      is_active: template.is_active,
      available_placeholders: template.available_placeholders,
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      template_type: '',
      message: '',
      description: '',
      is_active: true,
      available_placeholders: [],
    });
  };

  const addPlaceholder = (placeholder: string) => {
    if (!formData.available_placeholders.includes(placeholder)) {
      setFormData({
        ...formData,
        available_placeholders: [...formData.available_placeholders, placeholder]
      });
    }
  };

  const removePlaceholder = (placeholder: string) => {
    setFormData({
      ...formData,
      available_placeholders: formData.available_placeholders.filter(p => p !== placeholder)
    });
  };

  const commonPlaceholders = [
    'student_name', 'student_id', 'amount', 'date', 'time',
    'course_name', 'campus_name', 'semester', 'grade', 'status'
  ];

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.template_type_display.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-portal-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-portal-teal-600" />
                SMS Templates
              </h1>
              <p className="mt-2 text-base text-gray-600">
                Manage SMS message templates with dynamic placeholders
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingTemplate(null);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-portal-teal-600 text-white rounded-lg hover:bg-portal-teal-700 font-medium transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Template
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates by name, type, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Templates Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-portal-teal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading templates...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No templates found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Length</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTemplates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{template.name}</div>
                        {template.description && (
                          <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          {template.template_type_display}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-md truncate">
                          {template.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {template.message_length} chars
                          <div className="text-xs text-gray-500">
                            ({Math.ceil(template.message_length / 160)} SMS)
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {template.is_active ? (
                          <span className="px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            <XCircle className="h-3 w-3" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePreview(template)}
                            className="text-green-600 hover:text-green-900"
                            title="Preview"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(template)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(template.id, template.name)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingTemplate ? 'Edit SMS Template' : 'Add New SMS Template'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500"
                    required
                    placeholder="e.g., Payment Reminder"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.template_type}
                    onChange={(e) => setFormData({...formData, template_type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500"
                    required
                  >
                    <option value="">Select Type</option>
                    {templateTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500"
                  placeholder="Brief description of when to use this template"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 font-mono text-sm"
                  rows={4}
                  required
                  placeholder="Use placeholders like {student_name}, {amount}, {date}"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">Use curly braces for placeholders: {'{placeholder}'}</p>
                  <p className="text-xs text-gray-600">{formData.message.length} chars ({Math.ceil(formData.message.length / 160)} SMS)</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Placeholders</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.available_placeholders.map(placeholder => (
                    <span key={placeholder} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center gap-1">
                      {'{' + placeholder + '}'}
                      <button
                        type="button"
                        onClick={() => removePlaceholder(placeholder)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {commonPlaceholders.map(placeholder => (
                    <button
                      key={placeholder}
                      type="button"
                      onClick={() => addPlaceholder(placeholder)}
                      disabled={formData.available_placeholders.includes(placeholder)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      + {placeholder}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-4 h-4 text-portal-teal-600 border-gray-300 rounded focus:ring-portal-teal-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Template is active
                </label>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-6 py-2 bg-portal-teal-600 text-white rounded-lg hover:bg-portal-teal-700 font-medium"
                >
                  {editingTemplate ? 'Update Template' : 'Add Template'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTemplate(null);
                    resetForm();
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">SMS Preview</h2>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-800 whitespace-pre-wrap font-mono text-sm">{previewData.message}</p>
              </div>
              <div className="mt-4 flex justify-between text-sm text-gray-600">
                <span>{previewData.length} characters</span>
                <span>{previewData.sms_count} SMS message(s)</span>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="w-full px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
