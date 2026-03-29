'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  Building2,
  Calendar,
  CheckCircle,
  CreditCard,
  DollarSign,
  Eye,
  Filter,
  Home,
  RefreshCw,
  Search,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
interface FeePayment {
  id: number;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  faculty: string;
  program: string;
  level: string;
  paymentDate: string;
  academicYear: string;
  semester: string;
  feeType: string;
  amount: number;
  paymentMethod: string;
  bankName: string;
  transactionRef: string;
  status: 'verified' | 'pending' | 'rejected';
  collectedBy: string;
}

export default function FeesPaymentReports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('All');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
  const [statusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock data - replace with API call
  const feePayments: FeePayment[] = [
    {
      id: 1,
      receiptNumber: 'RCP-2026-0001',
      studentId: 'STU-2024-001',
      studentName: 'Mohamed Kamara',
      faculty: 'Faculty of Basic Sciences',
      program: 'BSc Computer Science',
      level: 'Year 2',
      paymentDate: '2026-03-15',
      academicYear: '2025/2026',
      semester: 'Semester 1',
      feeType: 'Tuition Fee',
      amount: 3000000,
      paymentMethod: 'Bank Transfer',
      bankName: 'Rokel Commercial Bank',
      transactionRef: 'TXN202603150001',
      status: 'verified',
      collectedBy: 'Finance Officer 1',
    },
    {
      id: 2,
      receiptNumber: 'RCP-2026-0002',
      studentId: 'STU-2024-002',
      studentName: 'Fatmata Sesay',
      faculty: 'Faculty of Engineering',
      program: 'BEng Civil Engineering',
      level: 'Year 3',
      paymentDate: '2026-03-16',
      academicYear: '2025/2026',
      semester: 'Semester 1',
      feeType: 'Tuition Fee',
      amount: 3500000,
      paymentMethod: 'Mobile Money',
      bankName: 'Orange Money',
      transactionRef: 'OM202603160045',
      status: 'verified',
      collectedBy: 'Finance Officer 2',
    },
    {
      id: 3,
      receiptNumber: 'RCP-2026-0003',
      studentId: 'STU-2024-003',
      studentName: 'Ibrahim Bangura',
      faculty: 'Faculty of Business Administration',
      program: 'BSc Business Management',
      level: 'Year 1',
      paymentDate: '2026-03-17',
      academicYear: '2025/2026',
      semester: 'Semester 1',
      feeType: 'Registration Fee',
      amount: 500000,
      paymentMethod: 'Cash',
      bankName: 'N/A',
      transactionRef: 'CASH-0003',
      status: 'verified',
      collectedBy: 'Finance Officer 1',
    },
    {
      id: 4,
      receiptNumber: 'RCP-2026-0004',
      studentId: 'STU-2024-004',
      studentName: 'Aminata Conteh',
      faculty: 'Faculty of Basic Sciences',
      program: 'BSc Mathematics',
      level: 'Year 4',
      paymentDate: '2026-03-18',
      academicYear: '2025/2026',
      semester: 'Semester 2',
      feeType: 'Examination Fee',
      amount: 300000,
      paymentMethod: 'Bank Transfer',
      bankName: 'Sierra Leone Commercial Bank',
      transactionRef: 'SLCB20260318789',
      status: 'pending',
      collectedBy: 'Finance Officer 3',
    },
  ];

  const stats = {
    totalPayments: 1847,
    totalAmount: 8450000000,
    verifiedPayments: 1789,
    todayPayments: 45,
  };

  const faculties = ['All', 'Faculty of Basic Sciences', 'Faculty of Engineering', 'Faculty of Business Administration'];
  const paymentMethods = ['All', 'Bank Transfer', 'Mobile Money', 'Cash', 'Cheque'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SL', {
      style: 'currency',
      currency: 'SLL',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const filteredPayments = feePayments.filter((payment) => {
    const matchesSearch =
      payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFaculty = facultyFilter === 'All' || payment.faculty === facultyFilter;
    const matchesMethod = paymentMethodFilter === 'All' || payment.paymentMethod === paymentMethodFilter;
    const matchesStatus = statusFilter === 'All' || payment.status === statusFilter.toLowerCase();

    return matchesSearch && matchesFaculty && matchesMethod && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
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
              <h1 className="text-3xl font-bold text-gray-900">Fees Payment Reports</h1>
              <p className="mt-2 text-base text-gray-600">
                Track and monitor all fee payments received from students
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
              <ExportMenu data={filteredPayments} filename="fees-payment-report" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Payments</p>
                <p className="text-4xl font-bold mt-2">{stats.totalPayments.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <CreditCard className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Total Amount</p>
                <p className="text-4xl font-bold mt-2">{formatCurrency(stats.totalAmount).slice(0, -3)}B</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <DollarSign className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Verified</p>
                <p className="text-4xl font-bold mt-2">{stats.verifiedPayments.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <CheckCircle className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide">Today</p>
                <p className="text-4xl font-bold mt-2">{stats.todayPayments}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <TrendingUp className="h-10 w-10" />
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
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Receipt No.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Faculty/Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fee Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">{payment.receiptNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                      <div className="text-sm text-gray-500">{payment.studentId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Building2 className="w-4 h-4 mr-1 text-gray-400" />
                        {payment.faculty}
                      </div>
                      <div className="text-sm text-gray-500">{payment.program}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{payment.feeType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.paymentMethod}</div>
                      <div className="text-sm text-gray-500">{payment.bankName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
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
              <span className="font-medium">{Math.min(currentPage * itemsPerPageedPayments.length)}</span> of{' '}
              <span className="font-medium">{filteredPayments.length}</span> results
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
