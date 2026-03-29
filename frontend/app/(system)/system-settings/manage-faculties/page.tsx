'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { GraduationCap, Edit, Trash2, Plus, Search, Building2, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface Faculty {
  id: number;
  name: string;
  code: string;
  campus: number;
  campus_name: string;
  dean: number | null;
  dean_name: string | null;
  description: string;
  created_at: string;
}

interface Campus {
  id: number;
  name: string;
  code: string;
}

export default function ManageFacultiesPage() {
  const router = useRouter();
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    campus: '',
    dean: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [facultiesRes, campusesRes] = await Promise.all([
        api.get('/campuses/faculties/'),
        api.get('/campuses/')
      ]);
      setFaculties(facultiesRes.data.results || facultiesRes.data);
      setCampuses(campusesRes.data.results || campusesRes.data);
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
      if (editingFaculty) {
        await api.patch(`/campuses/faculties/${editingFaculty.id}/`, formData);
        toast.success('Faculty updated successfully');
      } else {
        await api.post('/campuses/faculties/', formData);
        toast.success('Faculty added successfully');
      }
      setShowAddModal(false);
      setEditingFaculty(null);
      resetForm();
      fetchData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Operation failed';
      toast.error(errorMessage);
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await api.delete(`/campuses/faculties/${id}/`);
      toast.success('Faculty deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting faculty:', error);
      toast.error('Failed to delete faculty');
    }
  };

  const handleEdit = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name,
      code: faculty.code,
      campus: faculty.campus.toString(),
      dean: faculty.dean?.toString() || '',
      description: faculty.description,
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      campus: '',
      dean: '',
      description: '',
    });
  };

  const filteredFaculties = faculties.filter(faculty =>
    faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.campus_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-portal-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-portal-teal-600" />
                Manage Faculties
              </h1>
              <p className="mt-2 text-base text-gray-600">
                Manage academic faculties across all campuses
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingFaculty(null);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-portal-teal-600 text-white rounded-lg hover:bg-portal-teal-700 font-medium transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Faculty
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search faculties by name, code, or campus..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Faculties Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-portal-teal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading faculties...</p>
            </div>
          ) : filteredFaculties.length === 0 ? (
            <div className="p-8 text-center">
              <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No faculties found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campus</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dean</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFaculties.map((faculty) => (
                    <tr key={faculty.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          {faculty.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{faculty.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Building2 className="h-4 w-4" />
                          {faculty.campus_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          {faculty.dean_name || 'Not assigned'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {faculty.description || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(faculty)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(faculty.id, faculty.name)}
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Faculty Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 uppercase"
                    required
                    maxLength={20}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campus <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.campus}
                  onChange={(e) => setFormData({...formData, campus: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500"
                  required
                >
                  <option value="">Select Campus</option>
                  {campuses.map(campus => (
                    <option key={campus.id} value={campus.id}>
                      {campus.name} ({campus.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500"
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-6 py-2 bg-portal-teal-600 text-white rounded-lg hover:bg-portal-teal-700 font-medium"
                >
                  {editingFaculty ? 'Update Faculty' : 'Add Faculty'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingFaculty(null);
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
    </DashboardLayout>
  );
}
