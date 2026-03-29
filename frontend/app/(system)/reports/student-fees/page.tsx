'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  BookOpen,
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  Home,
  RefreshCw,
  Search,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
interface StudentFee {
  id: number;
  studentId: string;
  fullName: string;
  faculty: string;
  program: string;
  level: string;
  semester: string;
  totalFees: number;
  amountPaid: number;
  balance: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid' | 'overdue';
  lastPaymentDate: string;
  lastPaymentAmount: number;
  paymentMethod: string;
  academicYear: string;
}

export default function StudentFeesReports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock data - replace with API call
  const studentFees: StudentFee[] = [
    {
      id: 1,
      studentId: 'STU-2024-001',
      fullName: 'Mohamed Kamara',
      faculty: 'Faculty of Basic Sciences',
      program: 'BSc Computer Science',
      level: 'Year 2',
      semester: 'Semester 1',
      totalFees: 6500000,
      amountPaid: 6500000,
      balance: 0,
      paymentStatus: 'paid',
      lastPaymentDate: '2026-03-15',
      lastPaymentAmount: 3000000,
      paymentMethod: 'Bank Transfer',
      academicYear: '2025/2026',
    },
    {
      id: 2,
      studentId: 'STU-2024-002',
      fullName: 'Fatmata Sesay',
      faculty: 'Faculty of Engineering',
      program: 'BEng Civil Engineering',
      level: 'Year 3',
      semester: 'Semester 1',
      totalFees: 7200000,
      amountPaid: 4000000,
      balance: 3200000,
      paymentStatus: 'partial',
      lastPaymentDate: '2026-03-10',
      lastPaymentAmount: 2000000,
      paymentMethod: 'Mobile Money',
      academicYear: '2025/2026',
    },
    {
      id: 3,
      studentId: 'STU-2024-003',
      fullName: 'Ibrahim Bangura',
      faculty: 'Faculty of Business Administration',
      program: 'BSc Business Management',
      level: 'Year 1',
      semester: 'Semester 1',
      totalFees: 5800000,
      amountPaid: 0,
      balance: 5800000,
      paymentStatus: 'unpaid',
      lastPaymentDate: '',
      lastPaymentAmount: 0,
      paymentMethod: '',
      academicYear: '2025/2026',
    },
    {
      id: 4,
      studentId: 'STU-2024-004',
      fullName: 'Aminata Conteh',
      faculty: 'Faculty of Basic Sciences',
      program: 'BSc Mathematics',
      level: 'Year 4',
      semester: 'Semester 2',
      totalFees: 6800000,
      amountPaid: 5500000,
      balance: 1300000,
      paymentStatus: 'partial',
      lastPaymentDate: '2026-02-20',
      lastPaymentAmount: 2500000,
      paymentMethod: 'Cash',
      academicYear: '2025/2026',
    },
    {
      id: 5,
      studentId: 'STU-2023-015',
      fullName: 'Adama Koroma',
      faculty: 'Faculty of Engineering',
      program: 'BEng Electrical Engineering',
      level: 'Year 2',
      semester: 'Semester 1',
      totalFees: 7000000,
      amountPaid: 2000000,
      balance: 5000000,
      paymentStatus: 'overdue',
      lastPaymentDate: '2025-11-15',
      lastPaymentAmount: 2000000,
      paymentMethod: 'Bank Transfer',
      academicYear: '2025/2026',
    },
  ];

  const stats = {
    totalRevenue: 18500000000,
    collected: 14200000000,
    collectionRate: 76.8,
    outstanding: 4300000000,
  };

  const faculties = ['All', 'Faculty of Basic Sciences', 'Faculty of Engineering', 'Faculty of Business Administration'];
  const levels = ['All', 'Year 1', 'Year 2', 'Year 3', 'Year 4'];
  const statuses = ['All', 'Paid', 'Partial', 'Unpaid', 'Overdue'];
  const semesters = ['All', 'Semester 1', 'Semester 2'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SL', {
      style: 'currency',
      currency: 'SLL',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      unpaid: 'bg-red-100 text-red-800',
      overdue: 'bg-red-200 text-red-900',
    };
    return badges[status as keyof typeof badges] || badges.unpaid;
  };

  const getPaymentPercentage = (paid: number, total: number) => {
    return Math.round((paid / total) * 100);
  };

  const filteredFees = studentFees.filter((fee) => {
    const matchesSearch =
      fee.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.fullName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFaculty = facultyFilter === 'All' || fee.faculty === facultyFilter;
    const matchesLevel = levelFilter === 'All' || fee.level === levelFilter;
    const matchesStatus = statusFilter === 'All' || fee.paymentStatus === statusFilter.toLowerCase();
    const matchesSemester = semesterFilter === 'All' || fee.semester === semesterFilter;

    return matchesSearch && matchesFaculty && matchesLevel && matchesStatus && matchesSemester;
  });

  const totalPages = Math.ceil(filteredFees.length / itemsPerPage);
  const paginatedFees = filteredFees.slice(
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
              <h1 className="text-3xl font-bold text-gray-900">Students Fees Reports</h1>
              <p className="mt-2 text-base text-gray-600">
                Track and monitor student fee payments and outstanding balances
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
              <ExportMenu data={filteredFees} filename="student-fees-report" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Revenue</p>
                <p className="text-4xl font-bold mt-2">{formatCurrency(stats.totalRevenue).slice(0, -3)}B</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <DollarSign className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Collected</p>
                <p className="text-4xl font-bold mt-2">{formatCurrency(stats.collected).slice(0, -3)}B</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <CheckCircle className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Collection Rate</p>
                <p className="text-4xl font-bold mt-2">{stats.collectionRate}%</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <TrendingUp className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide">Outstanding</p>
                <p className="text-4xl font-bold mt-2">{formatCurrency(stats.outstanding).slice(0, -3)}B</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Clock className="h-10 w-10" />
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
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
          </div>
        </div>

        {/* Student Fees Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Faculty/Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total Fees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount Paid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedFees.map((fee) => {
                  const percentage = getPaymentPercentage(fee.amountPaid, fee.totalFees);
                  return (
                    <tr key={fee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">{fee.studentId}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{fee.fullName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Building2 className="w-4 h-4 mr-1 text-gray-400" />
                          {fee.faculty}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <BookOpen className="w-4 h-4 mr-1 text-gray-400" />
                          {fee.program}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{fee.level}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(fee.totalFees)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-600">{formatCurrency(fee.amountPaid)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${fee.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(fee.balance)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                percentage === 100 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(fee.paymentStatus)}`}>
                          {fee.paymentStatus.charAt(0).toUpperCase() + fee.paymentStatus.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPageedFees.length)}</span> of{' '}
              <span className="font-medium">{filteredFees.length}</span> results
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
