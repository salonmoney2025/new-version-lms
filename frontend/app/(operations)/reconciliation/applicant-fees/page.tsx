'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  Download,
  Eye,
  Home,
  Search,
  UserCheck,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

interface ApplicantFeesRecord {
  id: number;
  applicationId: string;
  applicantName: string;
  program: string;
  applicationYear: string;
  applicationDate: string;
  feeType: string;
  amountDue: number;
  amountPaid: number;
  balance: number;
  bankPayment: number;
  cashPayment: number;
  mobileMoneyPayment: number;
  reconciliationStatus: 'matched' | 'unmatched' | 'partial' | 'disputed';
  paymentDate: string;
  receiptNumber: string;
  applicationStatus: string;
}

export default function ApplicantFeesReconciliation() {
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock data - replace with API call
  const applicantFeesRecords: ApplicantFeesRecord[] = [
    {
      id: 1,
      applicationId: 'APP-2026-001',
      applicantName: 'Mariama Conteh',
      program: 'BSc Computer Science',
      applicationYear: '2025/2026',
      applicationDate: '2026-02-15',
      feeType: 'Application Fee',
      amountDue: 150000,
      amountPaid: 150000,
      balance: 0,
      bankPayment: 150000,
      cashPayment: 0,
      mobileMoneyPayment: 0,
      reconciliationStatus: 'matched',
      paymentDate: '2026-02-15',
      receiptNumber: 'APP-RCP-2026-001',
      applicationStatus: 'Approved',
    },
    {
      id: 2,
      applicationId: 'APP-2026-002',
      applicantName: 'Abdul Rahman',
      program: 'BEng Civil Engineering',
      applicationYear: '2025/2026',
      applicationDate: '2026-02-18',
      feeType: 'Application Fee',
      amountDue: 150000,
      amountPaid: 100000,
      balance: 50000,
      bankPayment: 100000,
      cashPayment: 0,
      mobileMoneyPayment: 0,
      reconciliationStatus: 'partial',
      paymentDate: '2026-02-18',
      receiptNumber: 'APP-RCP-2026-002',
      applicationStatus: 'Pending',
    },
    {
      id: 3,
      applicationId: 'APP-2026-003',
      applicantName: 'Hawa Kamara',
      program: 'BSc Nursing',
      applicationYear: '2025/2026',
      applicationDate: '2026-02-20',
      feeType: 'Application Fee',
      amountDue: 150000,
      amountPaid: 0,
      balance: 150000,
      bankPayment: 0,
      cashPayment: 0,
      mobileMoneyPayment: 0,
      reconciliationStatus: 'unmatched',
      paymentDate: '-',
      receiptNumber: '-',
      applicationStatus: 'Incomplete',
    },
    {
      id: 4,
      applicationId: 'APP-2026-004',
      applicantName: 'Mohamed Sesay',
      program: 'BBA Management',
      applicationYear: '2025/2026',
      applicationDate: '2026-02-22',
      feeType: 'Application Fee',
      amountDue: 150000,
      amountPaid: 150000,
      balance: 0,
      bankPayment: 0,
      cashPayment: 150000,
      mobileMoneyPayment: 0,
      reconciliationStatus: 'matched',
      paymentDate: '2026-02-22',
      receiptNumber: 'APP-RCP-2026-004',
      applicationStatus: 'Under Review',
    },
    {
      id: 5,
      applicationId: 'APP-2026-005',
      applicantName: 'Kadiatu Bangura',
      program: 'BSc Mathematics',
      applicationYear: '2025/2026',
      applicationDate: '2026-02-25',
      feeType: 'Application Fee',
      amountDue: 150000,
      amountPaid: 200000,
      balance: -50000,
      bankPayment: 0,
      cashPayment: 0,
      mobileMoneyPayment: 200000,
      reconciliationStatus: 'disputed',
      paymentDate: '2026-02-25',
      receiptNumber: 'APP-RCP-2026-005',
      applicationStatus: 'Approved',
    },
    {
      id: 6,
      applicationId: 'APP-2026-006',
      applicantName: 'Ibrahim Jalloh',
      program: 'BSc Microbiology',
      applicationYear: '2025/2026',
      applicationDate: '2026-03-01',
      feeType: 'Application Fee',
      amountDue: 150000,
      amountPaid: 150000,
      balance: 0,
      bankPayment: 150000,
      cashPayment: 0,
      mobileMoneyPayment: 0,
      reconciliationStatus: 'matched',
      paymentDate: '2026-03-01',
      receiptNumber: 'APP-RCP-2026-006',
      applicationStatus: 'Approved',
    },
  ];

  // Filter and search logic
  const filteredRecords = applicantFeesRecords.filter((record) => {
    const matchesSearch =
      record.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.applicationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = programFilter === 'All' || record.program === programFilter;
    const matchesStatus = statusFilter === 'All' || record.reconciliationStatus === statusFilter;
    const matchesYear = yearFilter === 'All' || record.applicationYear === yearFilter;

    return matchesSearch && matchesProgram && matchesStatus && matchesYear;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate totals
  const totalDue = filteredRecords.reduce((sum, record) => sum + record.amountDue, 0);
  const totalPaid = filteredRecords.reduce((sum, record) => sum + record.amountPaid, 0);
  const totalBalance = filteredRecords.reduce((sum, record) => sum + record.balance, 0);
  const matchedCount = filteredRecords.filter((r) => r.reconciliationStatus === 'matched').length;
  const unmatchedCount = filteredRecords.filter((r) => r.reconciliationStatus === 'unmatched').length;
  const partialCount = filteredRecords.filter((r) => r.reconciliationStatus === 'partial').length;
  const disputedCount = filteredRecords.filter((r) => r.reconciliationStatus === 'disputed').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'matched':
        return (
          <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center space-x-1 w-fit">
            <CheckCircle className="w-3 h-3" />
            <span>Matched</span>
          </span>
        );
      case 'unmatched':
        return (
          <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full flex items-center space-x-1 w-fit">
            <XCircle className="w-3 h-3" />
            <span>Unmatched</span>
          </span>
        );
      case 'partial':
        return (
          <span className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full flex items-center space-x-1 w-fit">
            <AlertCircle className="w-3 h-3" />
            <span>Partial</span>
          </span>
        );
      case 'disputed':
        return (
          <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full flex items-center space-x-1 w-fit">
            <AlertCircle className="w-3 h-3" />
            <span>Disputed</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
            Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
            Pending
          </span>
        );
      case 'Under Review':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
            Under Review
          </span>
        );
      case 'Incomplete':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
            Incomplete
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SL', {
      style: 'currency',
      currency: 'SLE',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <UserCheck className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Applicant Fees Reconciliation</h1>
                <p className="text-sm text-blue-100">
                  Reconcile applicant fee payments and applications
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/reconciliation"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
              >
                Back
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded flex items-center space-x-2 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Due</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(totalDue)}
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-blue-500 opacity-50" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Paid</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(totalPaid)}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500 opacity-50" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Balance</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(totalBalance)}
                  </p>
                </div>
                <AlertCircle className="w-10 h-10 text-orange-500 opacity-50" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {filteredRecords.length}
                  </p>
                </div>
                <UserCheck className="w-10 h-10 text-purple-500 opacity-50" />
              </div>
            </div>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600">Matched</p>
              <p className="text-2xl font-bold text-green-600">{matchedCount}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-sm text-gray-600">Partial</p>
              <p className="text-2xl font-bold text-orange-600">{partialCount}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-gray-600">Unmatched</p>
              <p className="text-2xl font-bold text-red-600">{unmatchedCount}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600">Disputed</p>
              <p className="text-2xl font-bold text-purple-600">{disputedCount}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Applicant
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Name or App ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                <select
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option>All</option>
                  <option>BSc Computer Science</option>
                  <option>BEng Civil Engineering</option>
                  <option>BSc Nursing</option>
                  <option>BBA Management</option>
                  <option>BSc Mathematics</option>
                  <option>BSc Microbiology</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option>All</option>
                  <option>2025/2026</option>
                  <option>2024/2025</option>
                  <option>2023/2024</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option>All</option>
                  <option value="matched">Matched</option>
                  <option value="partial">Partial</option>
                  <option value="unmatched">Unmatched</option>
                  <option value="disputed">Disputed</option>
                </select>
              </div>

              <div className="flex items-end">
                <ExportMenu
                  data={filteredRecords}
                  filename="applicant-fees-reconciliation"
                  sheetName="Applicant Fees"
                />
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Due
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Paid
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      App Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recon Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedRecords.length > 0 ? (
                    paginatedRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {record.applicantName}
                            </div>
                            <div className="text-sm text-gray-500">{record.applicationId}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.program}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.applicationDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatCurrency(record.amountDue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                          {formatCurrency(record.amountPaid)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                          <span
                            className={
                              record.balance > 0
                                ? 'text-red-600'
                                : record.balance < 0
                                ? 'text-purple-600'
                                : 'text-green-600'
                            }
                          >
                            {formatCurrency(Math.abs(record.balance))}
                            {record.balance < 0 && ' (Overpaid)'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getApplicationStatusBadge(record.applicationStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(record.reconciliationStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-teal-600 hover:text-teal-900">
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                        No applicant fees records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of{' '}
                  {filteredRecords.length} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded text-sm ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
