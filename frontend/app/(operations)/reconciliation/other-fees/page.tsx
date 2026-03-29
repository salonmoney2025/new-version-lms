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
  FileText,
  Home,
  Search,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

interface OtherFeesRecord {
  id: number;
  transactionId: string;
  payerName: string;
  payerType: 'Student' | 'Applicant' | 'Staff' | 'External';
  payerId: string;
  paymentDate: string;
  feeCategory: string;
  feeDescription: string;
  amountDue: number;
  amountPaid: number;
  balance: number;
  paymentMethod: 'Bank' | 'Cash' | 'Mobile Money' | 'Cheque';
  bankName: string;
  transactionRef: string;
  receiptNumber: string;
  reconciliationStatus: 'matched' | 'unmatched' | 'partial' | 'disputed';
  collectedBy: string;
  approvedBy: string;
}

export default function OtherFeesReconciliation() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [payerTypeFilter, setPayerTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock data - replace with API call
  const otherFeesRecords: OtherFeesRecord[] = [
    {
      id: 1,
      transactionId: 'TXN-2026-0001',
      payerName: 'Mohamed Kamara',
      payerType: 'Student',
      payerId: 'STU-2024-001',
      paymentDate: '2026-03-15',
      feeCategory: 'Library Fine',
      feeDescription: 'Late return of borrowed books',
      amountDue: 50000,
      amountPaid: 50000,
      balance: 0,
      paymentMethod: 'Cash',
      bankName: '-',
      transactionRef: '-',
      receiptNumber: 'LIB-RCP-2026-001',
      reconciliationStatus: 'matched',
      collectedBy: 'Library Staff',
      approvedBy: 'Librarian',
    },
    {
      id: 2,
      transactionId: 'TXN-2026-0002',
      payerName: 'Fatmata Sesay',
      payerType: 'Student',
      payerId: 'STU-2024-002',
      paymentDate: '2026-03-16',
      feeCategory: 'ID Card Replacement',
      feeDescription: 'Lost student ID card replacement fee',
      amountDue: 75000,
      amountPaid: 50000,
      balance: 25000,
      paymentMethod: 'Mobile Money',
      bankName: 'Orange Money',
      transactionRef: 'OMO202603160001',
      receiptNumber: 'ID-RCP-2026-002',
      reconciliationStatus: 'partial',
      collectedBy: 'Registry Staff',
      approvedBy: 'Registrar',
    },
    {
      id: 3,
      transactionId: 'TXN-2026-0003',
      payerName: 'Ibrahim Koroma',
      payerType: 'Applicant',
      payerId: 'APP-2026-010',
      paymentDate: '2026-03-18',
      feeCategory: 'Transcript Fee',
      feeDescription: 'Official transcript processing fee',
      amountDue: 200000,
      amountPaid: 200000,
      balance: 0,
      paymentMethod: 'Bank',
      bankName: 'Rokel Commercial Bank',
      transactionRef: 'TXN202603180001',
      receiptNumber: 'TRN-RCP-2026-003',
      reconciliationStatus: 'matched',
      collectedBy: 'Finance Officer',
      approvedBy: 'Finance Manager',
    },
    {
      id: 4,
      transactionId: 'TXN-2026-0004',
      payerName: 'Aisha Bangura',
      payerType: 'Student',
      payerId: 'STU-2023-045',
      paymentDate: '2026-03-20',
      feeCategory: 'Hostel Fee',
      feeDescription: 'Accommodation fee for Semester 1',
      amountDue: 500000,
      amountPaid: 0,
      balance: 500000,
      paymentMethod: 'Bank',
      bankName: '-',
      transactionRef: '-',
      receiptNumber: '-',
      reconciliationStatus: 'unmatched',
      collectedBy: '-',
      approvedBy: '-',
    },
    {
      id: 5,
      transactionId: 'TXN-2026-0005',
      payerName: 'John Doe',
      payerType: 'External',
      payerId: 'EXT-2026-001',
      paymentDate: '2026-03-22',
      feeCategory: 'Conference Fee',
      feeDescription: 'Annual academic conference registration',
      amountDue: 300000,
      amountPaid: 350000,
      balance: -50000,
      paymentMethod: 'Bank',
      bankName: 'Sierra Leone Commercial Bank',
      transactionRef: 'TXN202603220001',
      receiptNumber: 'CNF-RCP-2026-005',
      reconciliationStatus: 'disputed',
      collectedBy: 'Conference Coordinator',
      approvedBy: 'Dean',
    },
    {
      id: 6,
      transactionId: 'TXN-2026-0006',
      payerName: 'Mariama Jalloh',
      payerType: 'Staff',
      payerId: 'STF-2022-015',
      paymentDate: '2026-03-23',
      feeCategory: 'Parking Fee',
      feeDescription: 'Monthly parking permit fee',
      amountDue: 100000,
      amountPaid: 100000,
      balance: 0,
      paymentMethod: 'Cheque',
      bankName: 'First International Bank',
      transactionRef: 'CHQ-00012345',
      receiptNumber: 'PRK-RCP-2026-006',
      reconciliationStatus: 'matched',
      collectedBy: 'Security Office',
      approvedBy: 'Head of Security',
    },
    {
      id: 7,
      transactionId: 'TXN-2026-0007',
      payerName: 'Abdul Rahman',
      payerType: 'Student',
      payerId: 'STU-2025-078',
      paymentDate: '2026-03-25',
      feeCategory: 'Lab Breakage',
      feeDescription: 'Laboratory equipment damage compensation',
      amountDue: 150000,
      amountPaid: 150000,
      balance: 0,
      paymentMethod: 'Cash',
      bankName: '-',
      transactionRef: '-',
      receiptNumber: 'LAB-RCP-2026-007',
      reconciliationStatus: 'matched',
      collectedBy: 'Lab Technician',
      approvedBy: 'Head of Department',
    },
  ];

  // Filter and search logic
  const filteredRecords = otherFeesRecords.filter((record) => {
    const matchesSearch =
      record.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || record.feeCategory === categoryFilter;
    const matchesPayerType = payerTypeFilter === 'All' || record.payerType === payerTypeFilter;
    const matchesStatus = statusFilter === 'All' || record.reconciliationStatus === statusFilter;

    return matchesSearch && matchesCategory && matchesPayerType && matchesStatus;
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

  const getPayerTypeBadge = (type: string) => {
    const colors = {
      Student: 'bg-blue-100 text-blue-800',
      Applicant: 'bg-green-100 text-green-800',
      Staff: 'bg-purple-100 text-purple-800',
      External: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${colors[type as keyof typeof colors]}`}>
        {type}
      </span>
    );
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
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Other Fees Reconciliation</h1>
                <p className="text-sm text-indigo-100">
                  Reconcile miscellaneous fees and payments
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
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Due</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(totalDue)}
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-indigo-500 opacity-50" />
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

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-teal-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {filteredRecords.length}
                  </p>
                </div>
                <FileText className="w-10 h-10 text-teal-500 opacity-50" />
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
                  Search Transaction
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Name or TXN ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fee Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                >
                  <option>All</option>
                  <option>Library Fine</option>
                  <option>ID Card Replacement</option>
                  <option>Transcript Fee</option>
                  <option>Hostel Fee</option>
                  <option>Conference Fee</option>
                  <option>Parking Fee</option>
                  <option>Lab Breakage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payer Type
                </label>
                <select
                  value={payerTypeFilter}
                  onChange={(e) => setPayerTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                >
                  <option>All</option>
                  <option>Student</option>
                  <option>Applicant</option>
                  <option>Staff</option>
                  <option>External</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
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
                  filename="other-fees-reconciliation"
                  sheetName="Other Fees"
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
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee Category
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
                      Status
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
                              {record.transactionId}
                            </div>
                            <div className="text-sm text-gray-500">{record.paymentDate}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {record.payerName}
                            </div>
                            <div className="flex items-center space-x-2">
                              {getPayerTypeBadge(record.payerType)}
                              <span className="text-xs text-gray-500">{record.payerId}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{record.feeCategory}</div>
                          <div className="text-xs text-gray-500">{record.feeDescription}</div>
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
                          {getStatusBadge(record.reconciliationStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        No other fees records found
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
                          ? 'bg-indigo-600 text-white border-indigo-600'
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
