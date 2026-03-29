'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  BookOpen,
  Building2,
  Eye,
  Filter,
  GraduationCap,
  Home,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Users
} from 'lucide-react';
import Link from 'next/link';
interface Department {
  id: number;
  departmentCode: string;
  departmentName: string;
  faculty: string;
  facultyCode: string;
  head: string;
  headEmail: string;
  headPhone: string;
  totalPrograms: number;
  totalStudents: number;
  totalLecturers: number;
  office: string;
  campus: string;
  status: 'active' | 'inactive';
}

export default function DepartmentsReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('All');
  const [campusFilter, setCampusFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Mock data - replace with API call
  const departments: Department[] = [
    {
      id: 1,
      departmentCode: 'CS',
      departmentName: 'Computer Science',
      faculty: 'Faculty of Basic Sciences',
      facultyCode: 'FBS',
      head: 'Dr. Samuel Kargbo',
      headEmail: 'cs.head@ebkust.edu.sl',
      headPhone: '+232 76 111 222',
      totalPrograms: 3,
      totalStudents: 456,
      totalLecturers: 12,
      office: 'FBS Building, Room 301',
      campus: 'Main Campus',
      status: 'active',
    },
    {
      id: 2,
      departmentCode: 'MATH',
      departmentName: 'Mathematics',
      faculty: 'Faculty of Basic Sciences',
      facultyCode: 'FBS',
      head: 'Prof. Mary Williams',
      headEmail: 'math.head@ebkust.edu.sl',
      headPhone: '+232 77 222 333',
      totalPrograms: 2,
      totalStudents: 234,
      totalLecturers: 8,
      office: 'FBS Building, Room 201',
      campus: 'Main Campus',
      status: 'active',
    },
    {
      id: 3,
      departmentCode: 'CE',
      departmentName: 'Civil Engineering',
      faculty: 'Faculty of Engineering',
      facultyCode: 'FENG',
      head: 'Dr. Ibrahim Conteh',
      headEmail: 'ce.head@ebkust.edu.sl',
      headPhone: '+232 78 333 444',
      totalPrograms: 2,
      totalStudents: 389,
      totalLecturers: 15,
      office: 'Engineering Block A, Room 401',
      campus: 'Main Campus',
      status: 'active',
    },
    {
      id: 4,
      departmentCode: 'EE',
      departmentName: 'Electrical Engineering',
      faculty: 'Faculty of Engineering',
      facultyCode: 'FENG',
      head: 'Prof. Fatmata Sesay',
      headEmail: 'ee.head@ebkust.edu.sl',
      headPhone: '+232 79 444 555',
      totalPrograms: 3,
      totalStudents: 412,
      totalLecturers: 14,
      office: 'Engineering Block B, Room 301',
      campus: 'Main Campus',
      status: 'active',
    },
    {
      id: 5,
      departmentCode: 'BA',
      departmentName: 'Business Administration',
      faculty: 'Faculty of Business Administration',
      facultyCode: 'FBA',
      head: 'Dr. Joseph Koroma',
      headEmail: 'ba.head@ebkust.edu.sl',
      headPhone: '+232 76 555 666',
      totalPrograms: 4,
      totalStudrams: 567,
      totalLecturers: 11,
      office: 'Business School, Room 201',
      campus: 'Main Campus',
      status: 'active',
    },
    {
      id: 6,
      departmentCode: 'ACC',
      departmentName: 'Accounting and Finance',
      faculty: 'Faculty of Business Administration',
      facultyCode: 'FBA',
      head: 'Dr. Aminata Bangura',
      headEmail: 'acc.head@ebkust.edu.sl',
      headPhone: '+232 77 666 777',
      totalPrograms: 2,
      totalStudents: 345,
      totalLecturers: 9,
      office: 'Business School, Room 301',
      campus: 'Main Campus',
      status: 'active',
    },
  ];

  const stats = {
    totalDepartments: 25,
    totalPrograms: 59,
    totalStudents: 5405,
    totalLecturers: 189,
  };

  const faculties = ['All', 'Faculty of Basic Sciences', 'Faculty of Engineering', 'Faculty of Business Administration'];
  const campuses = ['All', 'Main Campus', 'Makeni Campus', 'Bo Campus'];
  const statuses = ['All', 'Active', 'Inactive'];

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.departmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFaculty = facultyFilter === 'All' || dept.faculty === facultyFilter;
    const matchesCampus = campusFilter === 'All' || dept.campus === campusFilter;
    const matchesStatus = statusFilter === 'All' || dept.status === statusFilter.toLowerCase();

    return matchesSearch && matchesFaculty && matchesCampus && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">View Departments</h1>
              <p className="mt-2 text-base text-gray-600">
                Complete overview of all university departments
              </p>
            
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center space-x-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <ExportMenu data={filteredDepartments} filename="departments-report" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Departments</p>
                <p className="text-4xl font-bold mt-2">{stats.totalDepartments}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Building2 className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Total Programs</p>
                <p className="text-4xl font-bold mt-2">{stats.totalPrograms}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <BookOpen className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Total Students</p>
                <p className="text-4xl font-bold mt-2">{stats.totalStudents.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <GraduationCap className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide">Total Lecturers</p>
                <p className="text-4xl font-bold mt-2">{stats.totalLecturers}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Users className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Faculty</label>
              <select
                value={facultyFilter}
                onChange={(e) => setFacultyFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {faculties.map((faculty) => (
                  <option key={faculty} value={faculty}>{faculty}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campus</label>
              <select
                value={campusFilter}
                onChange={(e) => setCampusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {campuses.map((campus) => (
                  <option key={campus} value={campus}>{campus}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Departments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Department Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Faculty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Head of Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Programs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Lecturers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedDepartments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">{dept.departmentCode}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{dept.departmentName}</div>
                      <div className="text-sm text-gray-500">{dept.office}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Building2 className="w-4 h-4 mr-1 text-gray-400" />
                        {dept.faculty}
                      </div>
                      <div className="text-sm text-gray-500">{dept.campus}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{dept.head}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900 mb-1">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        {dept.headEmail}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                        {dept.headPhone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-lg font-bold text-blue-600">{dept.totalPrograms}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-lg font-bold text-purple-600">{dept.totalStudents}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-lg font-bold text-green-600">{dept.totalLecturers}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(dept.status)}`}>
                        {dept.status.charAt(0).toUpperCase() + dept.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPageedDepartments.length)}</span> of{' '}
              <span className="font-medium">{filteredDepartments.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
