'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  Award,
  Calendar,
  CheckCircle,
  Edit,
  GraduationCap,
  Home,
  LayoutDashboard,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  XCircle
} from 'lucide-react';

interface Program {
  id: string;
  programCode: string;
  programName: string;
  department: string;
  faculty: string;
  degree: string;
  duration: string;
  campus: string;
  totalStudents: number;
  status: 'active' | 'inactive';
  createdDate: string;
}

export default function ManageProgramsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedDegree, setSelectedDegree] = useState('all');
  const [programs, setPrograms] = useState<Program[]>([
    {
      id: '1',
      programCode: 'BSC-CS',
      programName: 'BSc. Computer Science',
      department: 'Computer Science',
      faculty: 'Faculty of Engineering',
      degree: 'Bachelor',
      duration: '4 Years',
      campus: 'Main Campus',
      totalStudents: 185,
      status: 'active',
      createdDate: '2015-09-01'
    },
    {
      id: '2',
      programCode: 'BSC-CVE',
      programName: 'BSc. Civil Engineering',
      department: 'Civil Engineering',
      faculty: 'Faculty of Engineering',
      degree: 'Bachelor',
      duration: '5 Years',
      campus: 'Main Campus',
      totalStudents: 145,
      status: 'active',
      createdDate: '2015-09-01'
    },
    {
      id: '3',
      programCode: 'MBA',
      programName: 'MBA - Business Administration',
      department: 'Business Administration',
      faculty: 'Faculty of Business',
      degree: 'Masters',
      duration: '2 Years',
      campus: 'Main Campus',
      totalStudents: 95,
      status: 'active',
      createdDate: '2016-01-15'
    },
    {
      id: '4',
      programCode: 'MBBS',
      programName: 'MBBS - Medicine & Surgery',
      department: 'Medicine',
      faculty: 'Faculty of Medical Sciences',
      degree: 'Bachelor',
      duration: '6 Years',
      campus: 'Bo Campus',
      totalStudents: 140,
      status: 'active',
      createdDate: '2017-03-20'
    },
    {
      id: '5',
      programCode: 'BA-ENG',
      programName: 'BA. English Language',
      department: 'English Language',
      faculty: 'Faculty of Arts & Humanities',
      degree: 'Bachelor',
      duration: '3 Years',
      campus: 'Makeni Campus',
      totalStudents: 68,
      status: 'active',
      createdDate: '2018-06-10'
    },
    {
      id: '6',
      programCode: 'MSC-CS',
      programName: 'MSc. Computer Science',
      department: 'Computer Science',
      faculty: 'Faculty of Engineering',
      degree: 'Masters',
      duration: '2 Years',
      campus: 'Main Campus',
      totalStudents: 35,
      status: 'active',
      createdDate: '2019-09-01'
    }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({
    programCode: '',
    programName: '',
    department: '',
    faculty: '',
    degree: '',
    duration: '',
    campus: ''
  });

  const handleRefresh = () => {
    console.log('Refreshing data...');
  };

  const handleAdd = () => {
    setEditingProgram(null);
    setFormData({
      programCode: '',
      programName: '',
      department: '',
      faculty: '',
      degree: '',
      duration: '',
      campus: ''
    });
    setShowAddModal(true);
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      programCode: program.programCode,
      programName: program.programName,
      department: program.department,
      faculty: program.faculty,
      degree: program.degree,
      duration: program.duration,
      campus: program.campus
    });
    setShowAddModal(true);
  };

  const handleDelete = (program: Program) => {
    if (confirm(`Are you sure you want to delete ${program.programName}?`)) {
      setPrograms(programs.filter(p => p.id !== program.id));
      alert(`${program.programName} has been deleted successfully.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProgram) {
      // Update existing program
      setPrograms(programs.map(p =>
        p.id === editingProgram.id
          ? {
              ...p,
              ...formData
            }
          : p
      ));
      alert(`${formData.programName} has been updated successfully.`);
    } else {
      // Add new program
      const newProgram: Program = {
        id: String(programs.length + 1),
        ...formData,
        totalStudents: 0,
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0]
      };
      setPrograms([...programs, newProgram]);
      alert(`${formData.programName} has been added successfully.`);
    }

    setShowAddModal(false);
    setEditingProgram(null);
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.programCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFaculty = selectedFaculty === 'all' || program.faculty === selectedFaculty;
    const matchesDegree = selectedDegree === 'all' || program.degree === selectedDegree;
    return matchesSearch && matchesFaculty && matchesDegree;
  });

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
              <h1 className="text-3xl font-bold text-gray-800">Manage Academic Programs</h1>
              <p className="mt-2 text-base text-gray-600">
                Add, edit, and manage degree programs across all faculties
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
              <ExportMenu data={programs} filename="programs" />
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Programs</p>
                <p className="text-4xl font-bold mt-2">{programs.length}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <GraduationCap className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Active Programs</p>
                <p className="text-4xl font-bold mt-2">{programs.filter(p => p.status === 'active').length}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <CheckCircle className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Bachelor Programs</p>
                <p className="text-4xl font-bold mt-2">{programs.filter(p => p.degree === 'Bachelor').length}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Award className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide">Total Students</p>
                <p className="text-4xl font-bold mt-2">{programs.reduce((sum, p) => sum + p.totalStudents, 0)}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Users className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Faculty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Faculty
              </label>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
              >
                <option value="all">All Faculties</option>
                <option value="Faculty of Engineering">Faculty of Engineering</option>
                <option value="Faculty of Business">Faculty of Business</option>
                <option value="Faculty of Medical Sciences">Faculty of Medical Sciences</option>
                <option value="Faculty of Arts & Humanities">Faculty of Arts & Humanities</option>
              </select>
            </div>

            {/* Degree Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree Level
              </label>
              <select
                value={selectedDegree}
                onChange={(e) => setSelectedDegree(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
              >
                <option value="all">All Degrees</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Masters">Masters</option>
                <option value="PhD">PhD</option>
                <option value="Diploma">Diploma</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Program
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, code, or department..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Programs Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 border-b-2 border-gray-400">
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    S/N
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Program Code
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Program Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Faculty
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Degree
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Duration
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
                {filteredPrograms.map((program, index) => (
                  <tr key={program.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-900">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-900">{program.programCode}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-900">{program.programName}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-600">{program.department}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-600">{program.faculty}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {program.degree}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{program.duration}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-900">{program.totalStudents}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      {program.status === 'active' ? (
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
                          onClick={() => handleEdit(program)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(program)}
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

          {filteredPrograms.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No programs found</p>
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
              <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-portal-teal-600 to-portal-teal-700 text-white p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    {editingProgram ? 'Edit Program' : 'Add New Program'}
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
                        Program Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.programCode}
                        onChange={(e) => setFormData({ ...formData, programCode: e.target.value })}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                        placeholder="e.g., BSC-CS"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Program Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.programName}
                        onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                        placeholder="e.g., BSc. Computer Science"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Faculty <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.faculty}
                        onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                      >
                        <option value="">Select Faculty</option>
                        <option value="Faculty of Engineering">Faculty of Engineering</option>
                        <option value="Faculty of Business">Faculty of Business</option>
                        <option value="Faculty of Medical Sciences">Faculty of Medical Sciences</option>
                        <option value="Faculty of Arts & Humanities">Faculty of Arts & Humanities</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                        placeholder="e.g., Computer Science"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Degree Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.degree}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                      >
                        <option value="">Select Degree</option>
                        <option value="Bachelor">Bachelor</option>
                        <option value="Masters">Masters</option>
                        <option value="PhD">PhD</option>
                        <option value="Diploma">Diploma</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                        placeholder="e.g., 4 Years"
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
                      {editingProgram ? (
                        <>
                          <Edit className="h-4 w-4" />
                          Update Program
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Add Program
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
