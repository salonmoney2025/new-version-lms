'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  BookOpen,
  Building2,
  FileText,
  Filter,
  Home,
  RefreshCw,
  Search,
  TrendingUp,
  UserCheck,
  Users
} from 'lucide-react';
import Link from 'next/link';
interface AdmissionRecord {
  id: number;
  applicantId: string;
  fullName: string;
  gender: string;
  phone: string;
  email: string;
  faculty: string;
  program: string;
  level: string;
  admissionYear: string;
  admissionType: string;
  applicationDate: string;
  admissionDate: string;
  status: 'admitted' | 'pending' | 'rejected' | 'deferred';
  entryMode: string;
  examScore: number;
}

export default function AdmissionReports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [admissionTypeFilter, setAdmissionTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock data - replace with API call
  const admissionRecords: AdmissionRecord[] = [
    {
      id: 1,
      applicantId: 'APP-2026-001',
      fullName: 'Mohamed Kamara',
      gender: 'Male',
      phone: '+232 76 123 456',
      email: 'mkamara@example.com',
      faculty: 'Faculty of Basic Sciences',
      program: 'BSc Computer Science',
      level: 'Year 1',
      admissionYear: '2026',
      admissionType: 'Regular Admission',
      applicationDate: '2026-02-15',
      admissionDate: '2026-03-01',
      status: 'admitted',
      entryMode: 'WASSCE',
      examScore: 85,
    },
    {
      id: 2,
      applicantId: 'APP-2026-002',
      fullName: 'Fatmata Sesay',
      gender: 'Female',
      phone: '+232 77 234 567',
      email: 'fsesay@example.com',
      faculty: 'Faculty of Engineering',
      program: 'BEng Civil Engineering',
      level: 'Year 1',
      admissionYear: '2026',
      admissionType: 'Direct Entry',
      applicationDate: '2026-02-20',
      admissionDate: '2026-03-05',
      status: 'admitted',
      entryMode: 'A-Level',
      examScore: 92,
    },
    {
      id: 3,
      applicantId: 'APP-2026-003',
      fullName: 'Ibrahim Bangura',
      gender: 'Male',
      phone: '+232 78 345 678',
      email: 'ibangura@example.com',
      faculty: 'Faculty of Business Administration',
      program: 'BSc Business Management',
      level: 'Year 1',
      admissionYear: '2026',
      admissionType: 'Regular Admission',
      applicationDate: '2026-03-01',
      admissionDate: '',
      status: 'pending',
      entryMode: 'WASSCE',
      examScore: 78,
    },
    {
      id: 4,
      applicantId: 'APP-2026-004',
      fullName: 'Aminata Conteh',
      gender: 'Female',
      phone: '+232 79 456 789',
      email: 'aconteh@example.com',
      faculty: 'Faculty of Basic Sciences',
      program: 'BSc Mathematics',
      level: 'Year 1',
      admissionYear: '2026',
      admissionType: 'Regular Admission',
      applicationDate: '2026-02-10',
      admissionDate: '2026-02-28',
      status: 'admitted',
      entryMode: 'WASSCE',
      examScore: 88,
    },
  ];

  const stats = {
    totalApplications: 2847,
    admitted: 2156,
    admissionRate: 75.7,
    pending: 456,
  };

  const faculties = ['All', 'Faculty of Basic Sciences', 'Faculty of Engineering', 'Faculty of Business Administration'];
  const statuses = ['All', 'Admitted', 'Pending', 'Rejected', 'Deferred'];
  const years = ['All', '2026', '2025', '2024', '2023'];
  const admissionTypes = ['All', 'Regular Admission', 'Direct Entry', 'Transfer', 'Postgraduate'];

  const getStatusBadge = (status: string) => {
    const badges = {
      admitted: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      deferred: 'bg-blue-100 text-blue-800',
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const filteredRecords = admissionRecords.filter((record) => {
    const matchesSearch =
      record.applicantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFaculty = facultyFilter === 'All' || record.faculty === facultyFilter;
    const matchesStatus = statusFilter === 'All' || record.status === statusFilter.toLowerCase();
    const matchesYear = yearFilter === 'All' || record.admissionYear === yearFilter;
    const matchesType = admissionTypeFilter === 'All' || record.admissionType === admissionTypeFilter;

    return matchesSearch && matchesFaculty && matchesStatus && matchesYear && matchesType;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
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
              <h1 className="text-3xl font-bold text-gray-900">Admission Reports</h1>
              <p className="mt-2 text-base text-gray-600">
                Comprehensive admission statistics and student enrollment data
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center space-x-2 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <ExportMenu data={filteredRecords} filename="admission-report" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Applications</p>
                <p className="text-4xl font-bold mt-2">{stats.totalApplications.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <FileText className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Admitted</p>
                <p className="text-4xl font-bold mt-2">{stats.admitted.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <UserCheck className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Admission Rate</p>
                <p className="text-4xl font-bold mt-2">{stats.admissionRate}%</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <TrendingUp className="h-10 w-10" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applicants..."
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admission Year</label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admission Type</label>
              <select
                value={admissionTypeFilter}
                onChange={(e) => setAdmissionTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {admissionTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Admission Records Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Applicant ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Faculty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Admission Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Entry Mode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Exam Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">{record.applicantId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {record.fullName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{record.fullName}</div>
                          <div className="text-sm text-gray-500">{record.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{record.phone}</div>
                      <div className="text-sm text-gray-500">{record.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Building2 className="w-4 h-4 mr-1 text-gray-400" />
                        {record.faculty}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <BookOpen className="w-4 h-4 mr-1 text-gray-400" />
                        {record.program}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{record.admissionType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{record.entryMode}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{record.examScore}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
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
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredRecords.length)}</span> of{' '}
              <span className="font-medium">{filteredRecords.length}</span> results
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
