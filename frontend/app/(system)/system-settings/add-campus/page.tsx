'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { Building2, MapPin, Phone, Mail, Globe, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddCampusPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    country: 'Sierra Leone',
    phone: '',
    email: '',
    is_active: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/campuses/', formData);
      toast.success('Campus added successfully!');
      router.push('/system-settings/manage-campuses');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to add campus';
      toast.error(errorMessage);
      console.error('Error adding campus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      code: '',
      address: '',
      city: '',
      state: '',
      country: 'Sierra Leone',
      phone: '',
      email: '',
      is_active: true,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-portal-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Building2 className="h-8 w-8 text-portal-teal-600" />
                Add New Campus
              </h1>
              <p className="mt-2 text-base text-gray-600">
                Create a new campus location for the university system
              </p>
            </div>
            <button
              onClick={() => router.push('/system-settings/manage-campuses')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Back to Campuses
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campus Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
                    placeholder="e.g., Main Campus"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campus Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent uppercase"
                    placeholder="e.g., MC"
                    maxLength={20}
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-portal-teal-600" />
                Location Information
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
                    placeholder="Street address, building number, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
                      placeholder="e.g., Freetown"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
                      placeholder="e.g., Western Area"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                <Phone className="h-5 w-5 text-portal-teal-600" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
                    placeholder="+232 XX XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
                    placeholder="campus@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Status
              </h2>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 text-portal-teal-600 border-gray-300 rounded focus:ring-portal-teal-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Campus is active
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-portal-teal-600 text-white rounded-lg hover:bg-portal-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
              >
                <Save className="h-5 w-5" />
                {loading ? 'Saving...' : 'Save Campus'}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium transition-colors"
              >
                <X className="h-5 w-5" />
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
