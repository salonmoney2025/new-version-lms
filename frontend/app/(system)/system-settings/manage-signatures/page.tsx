'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { FileSignature, Edit, Trash2, Plus, Search, Upload, Building2, CheckCircle, XCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Signature {
  id: number;
  official_name: string;
  title: string;
  department: string;
  signature_image: string;
  signature_url: string;
  campus: number | null;
  campus_name: string | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

interface Campus {
  id: number;
  name: string;
  code: string;
}

export default function ManageSignaturesPage() {
  const router = useRouter();
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSignature, setEditingSignature] = useState<Signature | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    official_name: '',
    title: '',
    department: '',
    campus: '',
    is_default: false,
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [signaturesRes, campusesRes] = await Promise.all([
        api.get('/communications/signatures/'),
        api.get('/campuses/')
      ]);
      setSignatures(signaturesRes.data.results || signaturesRes.data);
      setCampuses(campusesRes.data.results || campusesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingSignature && !selectedFile) {
      toast.error('Please select a signature image');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('official_name', formData.official_name);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('department', formData.department);
      if (formData.campus) {
        formDataToSend.append('campus', formData.campus);
      }
      formDataToSend.append('is_default', formData.is_default.toString());
      formDataToSend.append('is_active', formData.is_active.toString());

      if (selectedFile) {
        formDataToSend.append('signature_image', selectedFile);
      }

      if (editingSignature) {
        await api.patch(`/communications/signatures/${editingSignature.id}/`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Signature updated successfully');
      } else {
        await api.post('/communications/signatures/', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Signature added successfully');
      }
      setShowAddModal(false);
      setEditingSignature(null);
      resetForm();
      fetchData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Operation failed';
      toast.error(errorMessage);
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete signature for ${name}?`)) return;

    try {
      await api.delete(`/communications/signatures/${id}/`);
      toast.success('Signature deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting signature:', error);
      toast.error('Failed to delete signature');
    }
  };

  const handleSetAsDefault = async (id: number) => {
    try {
      await api.post(`/communications/signatures/${id}/set_as_default/`);
      toast.success('Signature set as default successfully');
      fetchData();
    } catch (error) {
      console.error('Error setting default signature:', error);
      toast.error('Failed to set default signature');
    }
  };

  const handleEdit = (signature: Signature) => {
    setEditingSignature(signature);
    setFormData({
      official_name: signature.official_name,
      title: signature.title,
      department: signature.department,
      campus: signature.campus?.toString() || '',
      is_default: signature.is_default,
      is_active: signature.is_active,
    });
    setSelectedFile(null);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      official_name: '',
      title: '',
      department: '',
      campus: '',
      is_default: false,
      is_active: true,
    });
    setSelectedFile(null);
  };

  const filteredSignatures = signatures.filter(sig =>
    sig.official_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sig.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-portal-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FileSignature className="h-8 w-8 text-portal-teal-600" />
                Manage Signatures
              </h1>
              <p className="mt-2 text-base text-gray-600">
                Manage official signatures for letters and documents
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingSignature(null);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-portal-teal-600 text-white rounded-lg hover:bg-portal-teal-700 font-medium transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Signature
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search signatures by name, title, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Signatures Grid */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-portal-teal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading signatures...</p>
            </div>
          ) : filteredSignatures.length === 0 ? (
            <div className="p-8 text-center">
              <FileSignature className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No signatures found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSignatures.map((signature) => (
                <div key={signature.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{signature.official_name}</h3>
                      <p className="text-sm text-gray-600">{signature.title}</p>
                      {signature.department && (
                        <p className="text-xs text-gray-500 mt-1">{signature.department}</p>
                      )}
                    </div>
                    {signature.is_default && (
                      <Star className="h-5 w-5 text-yellow-500 fill-current" title="Default Signature" />
                    )}
                  </div>

                  {signature.signature_url && (
                    <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-3 flex items-center justify-center" style={{minHeight: '120px'}}>
                      <img
                        src={signature.signature_url}
                        alt={`Signature of ${signature.official_name}`}
                        className="max-h-24 max-w-full object-contain"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3 text-xs">
                    {signature.campus_name && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        <Building2 className="h-3 w-3" />
                        {signature.campus_name}
                      </span>
                    )}
                    {signature.is_active ? (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded">
                        <CheckCircle className="h-3 w-3" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded">
                        <XCircle className="h-3 w-3" />
                        Inactive
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                    {!signature.is_default && signature.is_active && (
                      <button
                        onClick={() => handleSetAsDefault(signature.id)}
                        className="flex-1 text-xs px-3 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 font-medium"
                        title="Set as Default"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(signature)}
                      className="flex-1 text-xs px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 font-medium"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(signature.id, signature.official_name)}
                      className="flex-1 text-xs px-3 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 font-medium"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
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
                {editingSignature ? 'Edit Signature' : 'Add New Signature'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Official Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.official_name}
                    onChange={(e) => setFormData({...formData, official_name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500"
                    required
                    placeholder="e.g., Registrar, Vice Chancellor"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campus</label>
                  <select
                    value={formData.campus}
                    onChange={(e) => setFormData({...formData, campus: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500"
                  >
                    <option value="">All Campuses</option>
                    {campuses.map(campus => (
                      <option key={campus.id} value={campus.id}>
                        {campus.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signature Image {!editingSignature && <span className="text-red-500">*</span>}
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200">
                    <Upload className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">Choose File</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      required={!editingSignature}
                    />
                  </label>
                  {selectedFile && (
                    <span className="text-sm text-gray-600">{selectedFile.name}</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">Upload PNG, JPG, or GIF (max 2MB)</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({...formData, is_default: e.target.checked})}
                    className="w-4 h-4 text-portal-teal-600 border-gray-300 rounded focus:ring-portal-teal-500"
                  />
                  <label htmlFor="is_default" className="text-sm font-medium text-gray-700">
                    Set as default signature
                  </label>
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
                    Signature is active
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-6 py-2 bg-portal-teal-600 text-white rounded-lg hover:bg-portal-teal-700 font-medium"
                >
                  {editingSignature ? 'Update Signature' : 'Add Signature'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingSignature(null);
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
