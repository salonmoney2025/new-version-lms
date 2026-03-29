'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  Award,
  CheckCircle,
  Eye,
  Home,
  Plus,
  Printer,
  Search,
  UserPlus,
  Users,
  XCircle
} from 'lucide-react';

interface Student {
  id: string;
  studentId: string;
  name: string;
  program: string;
  faculty: string;
  admissionYear: string;
  matriculated: boolean;
  matriculationNumber?: string;
  matriculationDate?: string;
}

export default function MatriculationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [currentYear, setCurrentYear] = useState('2025/2026');

  // Mock data - replace with API call
  const students: Student[] = [
    {
      id: '1',
      studentId: 'STU-2025-001',
      name: 'John Doe',
      program: 'Computer Science',
      faculty: 'Engineering',
      admissionYear: '2025',
      matriculated: false
    },
    {
      id: '2',
      studentId: 'STU-2025-002',
      name: 'Jane Smith',
      program: 'Business Administration',
      faculty: 'Business',
      admissionYear: '2025',
      matriculated: true,
      matriculationNumber: 'MAT-2025-001',
      matriculationDate: '2025-09-15'
    },
    {
      id: '3',
      studentId: 'STU-2025-003',
      name: 'Michael Johnson',
      program: 'Civil Engineering',
      faculty: 'Engineering',
      admissionYear: '2025',
      matriculated: false
    },
    {
      id: '4',
      studentId: 'STU-2025-004',
      name: 'Sarah Williams',
      program: 'Medicine',
      faculty: 'Medical Sciences',
      admissionYear: '2025',
      matriculated: true,
      matriculationNumber: 'MAT-2025-002',
      matriculationDate: '2025-09-15'
    },
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'matriculated' && student.matriculated) ||
                         (filterStatus === 'pending' && !student.matriculated);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: students.length,
    matriculated: students.filter(s => s.matriculated).length,
    pending: students.filter(s => !s.matriculated).length,
    selected: selectedStudents.length
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleSelectStudent = (id: string) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(sid => sid !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const handleBatchMatriculation = () => {
    // Implement batch matriculation logic
    alert(`Matriculating ${selectedStudents.length} students for ${currentYear}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-portal-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Matriculation Management</h1>
              <p className="mt-2 text-base text-gray-600">
                Manage student matriculation and generate matriculation numbers
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
              <ExportMenu data={students} filename="matriculation-records" />
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-md">
                <Printer className="h-4 w-4" />
                Print Certificates
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Students</p>
                <p className="text-4xl font-bold mt-2">{stats.total}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Users className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Matriculated</p>
                <p className="text-4xl font-bold mt-2">{stats.matriculated}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <CheckCircle className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide">Pending</p>
                <p className="text-4xl font-bold mt-2">{stats.pending}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <XCircle className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Selected</p>
                <p className="text-4xl font-bold mt-2">{stats.selected}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Award className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Batch Actions & Filters */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or student ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-portal-teal-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('matriculated')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'matriculated'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Matriculated
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'pending'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
            </div>
          </div>

          {/* Batch Actions */}
          {selectedStudents.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    {selectedStudents.length} student(s) selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                  >
                    <option>2025/2026</option>
                    <option>2024/2025</option>
                    <option>2023/2024</option>
                  </select>
                  <button
                    onClick={handleBatchMatriculation}
                    className="flex items-center gap-2 px-4 py-2 bg-portal-teal-600 hover:bg-portal-teal-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    Matriculate Selected
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-portal-teal-600 rounded focus:ring-portal-teal-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Faculty
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Matriculation #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                        className="w-4 h-4 text-portal-teal-600 rounded focus:ring-portal-teal-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{student.studentId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{student.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{student.program}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{student.faculty}</span>
                    </td>
                    <td className="px-6 py-4">
                      {student.matriculated ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3" />
                          Matriculated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          <XCircle className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {student.matriculationNumber ? (
                        <span className="text-sm font-medium text-gray-900">{student.matriculationNumber}</span>
                      ) : (
                        <span className="text-sm text-gray-400">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {!student.matriculated && (
                          <button
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Matriculate"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        )}
                        {student.matriculated && (
                          <button
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Print Certificate"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No students found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
