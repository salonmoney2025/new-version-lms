'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  Award,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle,
  Eye,
  Filter,
  GraduationCap,
  Home,
  RefreshCw,
  Search,
  Users
} from 'lucide-react';
import Link from 'next/link';
interface RegisteredStudent {
  id: number;
  studentId: string;
  fullName: string;
  faculty: string;
  department: string;
  program: string;
  level: string;
  academicYear: string;
  semester: string;
  registrationDate: string;
  coursesRegistered: number;
  totalCredits: number;
  registrationStatus: 'confirmed' | 'pending' | 'incomplete';
  feesStatus: 'paid' | 'partial' | 'unpaid';
  advisor: string;
  gpa: number;
}

export default function RegisteredStudentsReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock data - replace with API call
  const registeredStudents: RegisteredStudent[] = [
    {
      id: 1,
      studentId: 'STU-2024-001',
      fullName: 'Mohamed Kamara',
      faculty: 'Faculty of Basic Sciences',
      department: 'Computer Science',
      program: 'BSc Computer Science',
      level: 'Year 2',
      academicYear: '2025/2026',
      semester: 'Semester 1',
      registrationDate: '2025-09-15',
      coursesRegistered: 6,
      totalCredits: 18,
      registrationStatus: 'confirmed',
      feesStatus: 'paid',
      advisor: 'Dr. Samuel Kargbo',
      gpa: 3.45,
    },
    {
      id: 2,
      studentId: 'STU-2024-002',
      fullName: 'Fatmata Sesay',
      faculty: 'Faculty of Engineering',
      department: 'Civil Engineering',
      program: 'BEng Civil Engineering',
      level: 'Year 3',
      academicYear: '2025/2026',
      semester: 'Semester 1',
      registrationDate: '2025-09-16',
      coursesRegistered: 7,
      totalCredits: 21,
      registrationStatus: 'confirmed',
      feesStatus: 'paid',
      advisor: 'Prof. Mary Williams',
      gpa: 3.78,
    },
    {
      id: 3,
      studentId: 'STU-2024-003',
      fullName: 'Ibrahim Bangura',
      faculty: 'Faculty of Business Administration',
      department: 'Business Management',
      program: 'BSc Business Management',
      level: 'Year 1',
      academicYear: '2025/2026',
      semester: 'Semester 1',
      registrationDate: '2025-09-18',
      coursesRegistered: 5,
      totalCredits: 15,
      registrationStatus: 'pending',
      feesStatus: 'partial',
      advisor: 'Dr. Ibrahim Conteh',
      gpa: 0.00,
    },
    {
      id: 4,
      studentId: 'STU-2024-004',
      fullName: 'Aminata Conteh',
      faculty: 'Faculty of Basic Sciences',
      department: 'Mathematics',
      program: 'BSc Mathematics',
      level: 'Year 4',
      academicYear: '2025/2026',
      semester: 'Semester 2',
      registrationDate: '2026-01-20',
      coursesRegistered: 6,
      totalCredits: 18,
      registrationStatus: 'confirmed',
      feesStatus: 'paid',
      advisor: 'Dr. Fatmata Sesay',
      gpa: 3.89,
    },
    {
      id: 5,
      studentId: 'STU-2023-015',
      fullName: 'Abdul Rahman Koroma',
      faculty: 'Faculty of Engineering',
      department: 'Electrical Engineering',
      program: 'BEng Electrical Engineering',
      level: 'Year 2',
      academicYear: '2025/2026',
      semester: 'Semester 1',
      registrationDate: '2025-09-10',
      coursesRegistered: 4,
      totalCredits: 12,
      registrationStatus: 'incomplete',
      feesStatus: 'unpaid',
      advisor: 'Prof. Joseph Koroma',
      gpa: 2.95,
    },
  ];

  const stats = {
    totalRegistered: 4123,
    confirmed: 3856,
    pending: 178,
    averageCredits: 18,
  };

  const faculties = ['All', 'Faculty of Basic Sciences', 'Faculty of Engineering', 'Faculty of Business Administration'];
  const levels = ['All', 'Year 1', 'Year 2', 'Year 3', 'Year 4'];
  const semesters = ['All', 'Semester 1', 'Semester 2'];
  const statuses = ['All', 'Confirmed', 'Pending', 'Incomplete'];

  const getStatusBadge = (status: string) => {
    const badges = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      incomplete: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || badges.confirmed;
  };

  const getFeesStatusBadge = (status: string) => {
    const badges = {
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      unpaid: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || badges.unpaid;
  };

  const filteredStudents = registeredStudents.filter((student) => {
    const matchesSearch =
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFaculty = facultyFilter === 'All' || student.faculty === facultyFilter;
    const matchesLevel = levelFilter === 'All' || student.level === levelFilter;
    const matchesSemester = semesterFilter === 'All' || student.semester === semesterFilter;
    const matchesStatus = statusFilter === 'All' || student.registrationStatus === statusFilter.toLowerCase();

    return matchesSearch && matchesFaculty && matchesLevel && matchesSemester && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
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
              <h1 className="text-3xl font-bold text-gray-900">View Registered Students</h1>
              <p className="mt-2 text-base text-gray-600">
                Track all students who have completed course registration
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
              <ExportMenu data={filteredStudents} filename="registered-students-report" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Registered</p>
                <p className="text-4xl font-bold mt-2">{stats.totalRegistered.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <GraduationCap className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Confirmed</p>
                <p className="text-4xl font-bold mt-2">{stats.confirmed.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <CheckCircle className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-yellow-100 uppercase tracking-wide">Pending</p>
                <p className="text-4xl font-bold mt-2">{stats.pending}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Users className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Avg Credits</p>
                <p className="text-4xl font-bold mt-2">{stats.averageCredits}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Award className="h-10 w-10" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {semesters.map((semester) => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Registration Status</label>
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

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Faculty/Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Level/Semester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Registration Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Courses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">GPA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Reg. Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fees Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">{student.studentId}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Building2 className="w-4 h-4 mr-1 text-gray-400" />
                        {student.faculty}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <BookOpen className="w-4 h-4 mr-1 text-gray-400" />
                        {student.program}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.level}</div>
                      <div className="text-sm text-gray-500">{student.semester}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {new Date(student.registrationDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-lg font-bold text-blue-600">{student.coursesRegistered}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-lg font-bold text-purple-600">{student.totalCredits}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-gray-900">{student.gpa.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(student.registrationStatus)}`}>
                        {student.registrationStatus.charAt(0).toUpperCase() + student.registrationStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getFeesStatusBadge(student.feesStatus)}`}>
                        {student.feesStatus.charAt(0).toUpperCase() + student.feesStatus.slice(1)}
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
              <span className="font-medium">{Math.min(currentPage * itemsPerPageedStudents.length)}</span> of{' '}
              <span className="font-medium">{filteredStudents.length}</span> results
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
