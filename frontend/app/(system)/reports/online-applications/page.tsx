'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Filter,
  Home,
  RefreshCw,
  Search,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
interface OnlineApplication {
  id: number;
  applicationId: string;
  applicantName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  firstChoice: string;
  secondChoice: string;
  faculty: string;
  examType: string;
  examScore: number;
  applicationDate: string;
  applicationFee: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  status: 'submitted' | 'under-review' | 'approved' | 'rejected';
  reviewedBy: string;
  reviewDate: string;
}

export default function OnlineApplicationsReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock data - replace with API call
  const applications: OnlineApplication[] = [
    {
      id: 1,
      applicationId: 'APP-2026-0001',
      applicantName: 'Abdul Rahman Kamara',
      email: 'akamara@example.com',
      phone: '+232 76 123 456',
      gender: 'Male',
      dateOfBirth: '2005-03-15',
      firstChoice: 'BSc Computer Science',
      secondChoice: 'BSc Information Technology',
      faculty: 'Faculty of Basic Sciences',
      examType: 'WASSCE',
      examScore: 85,
      applicationDate: '2026-02-10',
      applicationFee: 300000,
      paymentStatus: 'paid',
      status: 'approved',
      reviewedBy: 'Admissions Officer 1',
      reviewDate: '2026-03-01',
    },
    {
      id: 2,
      applicationId: 'APP-2026-0002',
      applicantName: 'Mariatu Sesay',
      email: 'msesay@example.com',
      phone: '+232 77 234 567',
      gender: 'Female',
      dateOfBirth: '2006-07-22',
      firstChoice: 'BEng Civil Engineering',
      secondChoice: 'BEng Mechanical Engineering',
      faculty: 'Faculty of Engineering',
      examType: 'WASSCE',
      examScore: 92,
      applicationDate: '2026-02-12',
      applicationFee: 300000,
      paymentStatus: 'paid',
      status: 'approved',
      reviewedBy: 'Admissions Officer 2',
      reviewDate: '2026-03-05',
    },
    {
      id: 3,
      applicationId: 'APP-2026-0003',
      applicantName: 'Joseph Bangura',
      email: 'jbangura@example.com',
      phone: '+232 78 345 678',
      gender: 'Male',
      dateOfBirth: '2005-11-08',
      firstChoice: 'BSc Business Management',
      secondChoice: 'BSc Accounting',
      faculty: 'Faculty of Business Administration',
      examType: 'WASSCE',
      examScore: 78,
      applicationDate: '2026-02-15',
      applicationFee: 300000,
      paymentStatus: 'paid',
      status: 'under-review',
      reviewedBy: '',
      reviewDate: '',
    },
    {
      id: 4,
      applicationId: 'APP-2026-0004',
      applicantName: 'Hawa Conteh',
      email: 'hconteh@example.com',
      phone: '+232 79 456 789',
      gender: 'Female',
      dateOfBirth: '2006-01-30',
      firstChoice: 'BSc Mathematics',
      secondChoice: 'BSc Physics',
      faculty: 'Faculty of Basic Sciences',
      examType: 'A-Level',
      examScore: 88,
      applicationDate: '2026-02-18',
      applicationFee: 300000,
      paymentStatus: 'pending',
      status: 'submitted',
      reviewedBy: '',
      reviewDate: '',
    },
  ];

  const stats = {
    totalApplications: 2847,
    approved: 1456,
    underReview: 892,
    rejected: 287,
  };

  const faculties = ['All', 'Faculty of Basic Sciences', 'Faculty of Engineering', 'Faculty of Business Administration'];
  const statuses = ['All', 'Submitted', 'Under-Review', 'Approved', 'Rejected'];
  const paymentStatuses = ['All', 'Paid', 'Pending', 'Failed'];

  const getStatusBadge = (status: string) => {
    const badges = {
      'submitted': 'bg-blue-100 text-blue-800',
      'under-review': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || badges.submitted;
  };

  const getPaymentBadge = (status: string) => {
    const badges = {
      'paid': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFaculty = facultyFilter === 'All' || app.faculty === facultyFilter;
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter.toLowerCase().replace('-', '-');
    const matchesPayment = paymentStatusFilter === 'All' || app.paymentStatus === paymentStatusFilter.toLowerCase();

    return matchesSearch && matchesFaculty && matchesStatus && matchesPayment;
  });

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
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
              <h1 className="text-3xl font-bold text-gray-900">Online Applications</h1>
              <p className="mt-2 text-base text-gray-600">
                Monitor and manage all online application submissions
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
              <ExportMenu data={filteredApplications} filename="online-applications-report" />
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
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Approved</p>
                <p className="text-4xl font-bold mt-2">{stats.approved.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <CheckCircle className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-yellow-100 uppercase tracking-wide">Under Review</p>
                <p className="text-4xl font-bold mt-2">{stats.underReview.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Clock className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-red-100 uppercase tracking-wide">Rejected</p>
                <p className="text-4xl font-bold mt-2">{stats.rejected.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <XCircle className="h-10 w-10" />
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
                  placeholder="Search applications..."
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Status</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Application ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Program Choices</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Exam Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Application Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">{app.applicationId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {app.applicantName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{app.applicantName}</div>
                          <div className="text-sm text-gray-500">{app.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{app.email}</div>
                      <div className="text-sm text-gray-500">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900 mb-1">
                        <BookOpen className="w-4 h-4 mr-1 text-blue-400" />
                        {app.firstChoice}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="w-4 h-4 mr-1 text-gray-400" />
                        {app.secondChoice}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-500">{app.examType}</div>
                      <div className="text-lg font-bold text-gray-900">{app.examScore}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {new Date(app.applicationDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPaymentBadge(app.paymentStatus)}`}>
                        {app.paymentStatus.charAt(0).toUpperCase() + app.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(app.status)}`}>
                        {app.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
              <span className="font-medium">{Math.min(currentPage * itemsPerPageedApplications.length)}</span> of{' '}
              <span className="font-medium">{filteredApplications.length}</span> results
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
