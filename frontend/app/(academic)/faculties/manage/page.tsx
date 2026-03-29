'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  BookOpen,
  Building,
  CheckCircle,
  Edit,
  Home,
  LayoutDashboard,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  XCircle
} from 'lucide-react';

interface Faculty {
  id: string;
  facultyCode: string;
  facultyName: string;
  dean: string;
  campus: string;
  establishedYear: string;
  totalDepartments: number;
  totalStudents: number;
  status: 'active' | 'inactive';
  createdDate: string;
}

export default function ManageFacultiesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [faculties, setFaculties] = useState<Faculty[]>([
    {
      id: '1',
      facultyCode: 'ENG',
      facultyName: 'Faculty of Engineering',
      dean: 'Prof. James Koroma',
      campus: 'Main Campus',
      establishedYear: '2015',
      totalDepartments: 5,
      totalStudents: 850,
      status: 'active',
      createdDate: '2015-09-01'
    },
    {
      id: '2',
      facultyCode: 'BUS',
      facultyName: 'Faculty of Business',
      dean: 'Dr. Sarah Bangura',
      campus: 'Main Campus',
      establishedYear: '2016',
      totalDepartments: 3,
      totalStudents: 620,
      status: 'active',
      createdDate: '2016-01-15'
    },
    {
      id: '3',
      facultyCode: 'MED',
      facultyName: 'Faculty of Medical Sciences',
      dean: 'Prof. Mohamed Sesay',
      campus: 'Bo Campus',
      establishedYear: '2017',
      totalDepartments: 4,
      totalStudents: 450,
      status: 'active',
      createdDate: '2017-03-20'
    },
    {
      id: '4',
      facultyCode: 'ART',
      facultyName: 'Faculty of Arts & Humanities',
      dean: 'Dr. Aminata Kamara',
      campus: 'Makeni Campus',
      establishedYear: '2018',
      totalDepartments: 6,
      totalStudents: 380,
      status: 'active',
      createdDate: '2018-06-10'
    }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [formData, setFormData] = useState({
    facultyCode: '',
    facultyName: '',
    dean: '',
    campus: '',
    establishedYear: ''
  });

  const handleRefresh = useCallback(() => {
    console.log('Refreshing data...');
  }, []);

  const handleAdd = useCallback(() => {
    setEditingFaculty(null);
    setFormData({
      facultyCode: '',
      facultyName: '',
      dean: '',
      campus: '',
      establishedYear: ''
    });
    setShowAddModal(true);
  }, []);

  const handleEdit = useCallback((faculty: Faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      facultyCode: faculty.facultyCode,
      facultyName: faculty.facultyName,
      dean: faculty.dean,
      campus: faculty.campus,
      establishedYear: faculty.establishedYear
    });
    setShowAddModal(true);
  }, []);

  const handleDelete = useCallback((faculty: Faculty) => {
    if (confirm(`Are you sure you want to delete ${faculty.facultyName}?`)) {
      setFaculties(prev => prev.filter(f => f.id !== faculty.id));
      alert(`${faculty.facultyName} has been deleted successfully.`);
    }
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (editingFaculty) {
      // Update existing faculty
      setFaculties(prev => prev.map(f =>
        f.id === editingFaculty.id
          ? {
              ...f,
              ...formData
            }
          : f
      ));
      alert(`${formData.facultyName} has been updated successfully.`);
    } else {
      // Add new faculty
      const newFaculty: Faculty = {
        id: String(Date.now()), // Better ID generation for scalability
        ...formData,
        totalDepartments: 0,
        totalStudents: 0,
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0]
      };
      setFaculties(prev => [...prev, newFaculty]);
      alert(`${formData.facultyName} has been added successfully.`);
    }

    setShowAddModal(false);
    setEditingFaculty(null);
  }, [editingFaculty, formData]);

  // Memoized filtering for better performance with large datasets
  const filteredFaculties = useMemo(() => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    return faculties.filter(faculty => {
      const matchesSearch = faculty.facultyName.toLowerCase().includes(lowerSearchQuery) ||
                           faculty.facultyCode.toLowerCase().includes(lowerSearchQuery) ||
                           faculty.dean.toLowerCase().includes(lowerSearchQuery);
      const matchesCampus = selectedCampus === 'all' || faculty.campus === selectedCampus;
      return matchesSearch && matchesCampus;
    });
  }, [faculties, searchQuery, selectedCampus]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Action Buttons Bar */}
        <div className="bg-white border-b border-gray-300 px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium transition-colors"
            >
              <Home className="h-4 w-4" />
              HOME
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              DASHBOARD
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              ADD
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-medium transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              REFRESH
            </button>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-portal-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Manage Faculties</h1>
              <p className="mt-2 text-base text-gray-600">
                Add, edit, and manage university faculties
              </p>
            
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center space-x-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
            <div className="flex gap-3">
              <ExportMenu data={faculties} filename="faculties" />
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Faculties</p>
                <p className="text-4xl font-bold mt-2">{faculties.length}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Building className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Active</p>
                <p className="text-4xl font-bold mt-2">{faculties.filter(f => f.status === 'active').length}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <CheckCircle className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Total Departments</p>
                <p className="text-4xl font-bold mt-2">{faculties.reduce((sum, f) => sum + f.totalDepartments, 0)}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <BookOpen className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide">Total Students</p>
                <p className="text-4xl font-bold mt-2">{faculties.reduce((sum, f) => sum + f.totalStudents, 0)}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Users className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campus Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Campus
              </label>
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
              >
                <option value="all">All Campuses</option>
                <option value="Main Campus">Main Campus</option>
                <option value="Bo Campus">Bo Campus</option>
                <option value="Makeni Campus">Makeni Campus</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Faculty
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, code, or dean..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Faculties Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 border-b-2 border-gray-400">
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    S/N
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Faculty Code
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Faculty Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Dean
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Campus
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Departments
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFaculties.map((faculty, index) => (
                  <tr key={faculty.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-900">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-900">{faculty.facultyCode}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-900">{faculty.facultyName}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-600">{faculty.dean}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-600">{faculty.campus}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-900">{faculty.totalDepartments}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-900">{faculty.totalStudents}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      {faculty.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          <XCircle className="h-3 w-3" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(faculty)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(faculty)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredFaculties.length === 0 && (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No faculties found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowAddModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-portal-teal-600 to-portal-teal-700 text-white p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    {editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-white hover:bg-opacity-10 rounded transition-colors"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>

                {/* Modal Content */}
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Faculty Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.facultyCode}
                        onChange={(e) => setFormData({ ...formData, facultyCode: e.target.value })}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                        placeholder="e.g., ENG"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Faculty Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.facultyName}
                        onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                        placeholder="e.g., Faculty of Engineering"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dean <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.dean}
                        onChange={(e) => setFormData({ ...formData, dean: e.target.value })}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                        placeholder="e.g., Prof. John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Campus <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.campus}
                        onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                      >
                        <option value="">Select Campus</option>
                        <option value="Main Campus">Main Campus</option>
                        <option value="Bo Campus">Bo Campus</option>
                        <option value="Makeni Campus">Makeni Campus</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Established Year <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.establishedYear}
                        onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                        placeholder="e.g., 2015"
                      />
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 bg-portal-teal-600 hover:bg-portal-teal-700 text-white rounded-lg font-medium transition-colors"
                    >
                      {editingFaculty ? (
                        <>
                          <Edit className="h-4 w-4" />
                          Update Faculty
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Add Faculty
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
