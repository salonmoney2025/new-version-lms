'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { Building2, Edit, Trash2, Plus, Search, MapPin, Phone, Mail, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Campus {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  is_active: boolean;
  total_students: number;
  total_staff: number;
  created_at: string;
}

export default function ManageCampusesPage() {
  const router = useRouter();
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCampus, setEditingCampus] = useState<Campus | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchCampuses();
  }, []);

  const fetchCampuses = async () => {
    try {
      const response = await api.get('/campuses/');
      setCampuses(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching campuses:', error);
      toast.error('Failed to load campuses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await api.delete(`/campuses/${id}/`);
      toast.success('Campus deleted successfully');
      fetchCampuses();
    } catch (error) {
      console.error('Error deleting campus:', error);
      toast.error('Failed to delete campus');
    }
  };

  const handleEdit = (campus: Campus) => {
    setEditingCampus(campus);
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampus) return;

    try {
      await api.patch(`/campuses/${editingCampus.id}/`, editingCampus);
      toast.success('Campus updated successfully');
      setShowEditModal(false);
      setEditingCampus(null);
      fetchCampuses();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update campus';
      toast.error(errorMessage);
      console.error('Error updating campus:', error);
    }
  };

  const filteredCampuses = campuses.filter(campus =>
    campus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campus.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campus.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-portal-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Building2 className="h-8 w-8 text-portal-teal-600" />
                Manage Campuses
              </h1>
              <p className="mt-2 text-base text-gray-600">
                View and manage all university campus locations
              </p>
            </div>
            <button
              onClick={() => router.push('/system-settings/add-campus')}
              className="flex items-center gap-2 px-4 py-2 bg-portal-teal-600 text-white rounded-lg hover:bg-portal-teal-700 font-medium transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Campus
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search campuses by name, code, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Campuses Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-portal-teal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading campuses...</p>
            </div>
          ) : filteredCampuses.length === 0 ? (
            <div className="p-8 text-center">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No campuses found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCampuses.map((campus) => (
                    <tr key={campus.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-portal-teal-100 text-portal-teal-800">
                          {campus.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{campus.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-1 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <div>{campus.city}, {campus.state}</div>
                            <div className="text-xs text-gray-500">{campus.country}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {campus.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {campus.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          <div>{campus.total_students || 0} Students</div>
                          <div>{campus.total_staff || 0} Staff</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {campus.is_active ? (
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
                            onClick={() => handleEdit(campus)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(campus.id, campus.name)}
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

      {/* Edit Modal */}
      {showEditModal && editingCampus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Edit Campus</h2>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campus Name</label>
                  <input
                    type="text"
                    value={editingCampus.name}
                    onChange={(e) => setEditingCampus({...editingCampus, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
                  <input
                    type="text"
                    value={editingCampus.code}
                    onChange={(e) => setEditingCampus({...editingCampus, code: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 uppercase"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={editingCampus.address}
                  onChange={(e) => setEditingCampus({...editingCampus, address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500"
                  rows={2}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={editingCampus.city}
                    onChange={(e) => setEditingCampus({...editingCampus, city: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={editingCampus.state}
                    onChange={(e) => setEditingCampus({...editingCampus, state: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={editingCampus.country}
                    onChange={(e) => setEditingCampus({...editingCampus, country: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editingCampus.phone}
                    onChange={(e) => setEditingCampus({...editingCampus, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editingCampus.email}
                    onChange={(e) => setEditingCampus({...editingCampus, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="edit_is_active"
                  checked={editingCampus.is_active}
                  onChange={(e) => setEditingCampus({...editingCampus, is_active: e.target.checked})}
                  className="w-4 h-4 text-portal-teal-600 border-gray-300 rounded focus:ring-portal-teal-500"
                />
                <label htmlFor="edit_is_active" className="text-sm font-medium text-gray-700">
                  Campus is active
                </label>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-6 py-2 bg-portal-teal-600 text-white rounded-lg hover:bg-portal-teal-700 font-medium"
                >
                  Update Campus
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCampus(null);
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
    </DashboardLayout>
  );
}
