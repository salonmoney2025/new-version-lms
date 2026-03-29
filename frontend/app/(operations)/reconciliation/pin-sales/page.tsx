'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  AlertCircle,
  CheckCircle,
  Download,
  Eye,
  Home,
  Key,
  Search,
  TrendingUp,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

interface PINSalesRecord {
  id: number;
  pinBatchId: string;
  pinNumber: string;
  purchaserName: string;
  purchaseDate: string;
  pinType: string;
  pinValue: number;
  amountPaid: number;
  balance: number;
  paymentMethod: 'Bank' | 'Cash' | 'Mobile Money';
  bankName: string;
  transactionRef: string;
  receiptNumber: string;
  pinStatus: 'Active' | 'Used' | 'Expired' | 'Blocked';
  reconciliationStatus: 'matched' | 'unmatched' | 'partial' | 'disputed';
  usedBy: string;
  usedDate: string;
}

export default function PINSalesReconciliation() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pinTypeFilter, setPinTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock data - replace with API call
  const pinSalesRecords: PINSalesRecord[] = [
    {
      id: 1,
      pinBatchId: 'BATCH-2026-001',
      pinNumber: 'PIN-2026-001234',
      purchaserName: 'Aminata Koroma',
      purchaseDate: '2026-03-01',
      pinType: 'Application PIN',
      pinValue: 50000,
      amountPaid: 50000,
      balance: 0,
      paymentMethod: 'Bank',
      bankName: 'Rokel Commercial Bank',
      transactionRef: 'TXN202603010001',
      receiptNumber: 'PIN-RCP-2026-001',
      pinStatus: 'Used',
      reconciliationStatus: 'matched',
      usedBy: 'APP-2026-045',
      usedDate: '2026-03-02',
    },
    {
      id: 2,
      pinBatchId: 'BATCH-2026-001',
      pinNumber: 'PIN-2026-001235',
      purchaserName: 'Mohamed Bangura',
      purchaseDate: '2026-03-02',
      pinType: 'Application PIN',
      pinValue: 50000,
      amountPaid: 40000,
      balance: 10000,
      paymentMethod: 'Cash',
      bankName: '-',
      transactionRef: '-',
      receiptNumber: 'PIN-RCP-2026-002',
      pinStatus: 'Active',
      reconciliationStatus: 'partial',
      usedBy: '-',
      usedDate: '-',
    },
    {
      id: 3,
      pinBatchId: 'BATCH-2026-002',
      pinNumber: 'PIN-2026-002100',
      purchaserName: 'Fatmata Sesay',
      purchaseDate: '2026-03-05',
      pinType: 'Transcript PIN',
      pinValue: 100000,
      amountPaid: 100000,
      balance: 0,
      paymentMethod: 'Mobile Money',
      bankName: 'Orange Money',
      transactionRef: 'OMO202603050001',
      receiptNumber: 'PIN-RCP-2026-003',
      pinStatus: 'Used',
      reconciliationStatus: 'matched',
      usedBy: 'STU-2024-123',
      usedDate: '2026-03-06',
    },
    {
      id: 4,
      pinBatchId: 'BATCH-2026-003',
      pinNumber: 'PIN-2026-003050',
      purchaserName: 'Ibrahim Kamara',
      purchaseDate: '2026-03-08',
      pinType: 'Verification PIN',
      pinValue: 75000,
      amountPaid: 0,
      balance: 75000,
      paymentMethod: 'Bank',
      bankName: '-',
      transactionRef: '-',
      receiptNumber: '-',
      pinStatus: 'Blocked',
      reconciliationStatus: 'unmatched',
      usedBy: '-',
      usedDate: '-',
    },
    {
      id: 5,
      pinBatchId: 'BATCH-2026-002',
      pinNumber: 'PIN-2026-002101',
      purchaserName: 'Mariama Jalloh',
      purchaseDate: '2026-03-10',
      pinType: 'Transcript PIN',
      pinValue: 100000,
      amountPaid: 150000,
      balance: -50000,
      paymentMethod: 'Bank',
      bankName: 'Sierra Leone Commercial Bank',
      transactionRef: 'TXN202603100001',
      receiptNumber: 'PIN-RCP-2026-005',
      pinStatus: 'Active',
      reconciliationStatus: 'disputed',
      usedBy: '-',
      usedDate: '-',
    },
    {
      id: 6,
      pinBatchId: 'BATCH-2026-001',
      pinNumber: 'PIN-2026-001236',
      purchaserName: 'Abdul Conteh',
      purchaseDate: '2026-03-12',
      pinType: 'Application PIN',
      pinValue: 50000,
      amountPaid: 50000,
      balance: 0,
      paymentMethod: 'Mobile Money',
      bankName: 'Africell Money',
      transactionRef: 'AFM202603120001',
      receiptNumber: 'PIN-RCP-2026-006',
      pinStatus: 'Active',
      reconciliationStatus: 'matched',
      usedBy: '-',
      usedDate: '-',
    },
    {
      id: 7,
      pinBatchId: 'BATCH-2026-004',
      pinNumber: 'PIN-2026-004001',
      purchaserName: 'Kadiatu Mansaray',
      purchaseDate: '2026-03-15',
      pinType: 'Result Checking PIN',
      pinValue: 25000,
      amountPaid: 25000,
      balance: 0,
      paymentMethod: 'Cash',
      bankName: '-',
      transactionRef: '-',
      receiptNumber: 'PIN-RCP-2026-007',
      pinStatus: 'Used',
      reconciliationStatus: 'matched',
      usedBy: 'STU-2023-456',
      usedDate: '2026-03-16',
    },
  ];

  // Filter and search logic
  const filteredRecords = pinSalesRecords.filter((record) => {
    const matchesSearch =
      record.purchaserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.pinNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPinType = pinTypeFilter === 'All' || record.pinType === pinTypeFilter;
    const matchesStatus = statusFilter === 'All' || record.reconciliationStatus === statusFilter;
    const matchesPaymentMethod =
      paymentMethodFilter === 'All' || record.paymentMethod === paymentMethodFilter;

    return matchesSearch && matchesPinType && matchesStatus && matchesPaymentMethod;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate totals
  const totalValue = filteredRecords.reduce((sum, record) => sum + record.pinValue, 0);
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

  const getPinStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
            Active
          </span>
        );
      case 'Used':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
            Used
          </span>
        );
      case 'Expired':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
            Expired
          </span>
        );
      case 'Blocked':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
            Blocked
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
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Key className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">PIN Sales Reconciliation</h1>
                <p className="text-sm text-purple-100">
                  Reconcile PIN sales and payment transactions
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
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total PIN Value</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(totalValue)}
                  </p>
                </div>
                <Key className="w-10 h-10 text-purple-500 opacity-50" />
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

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total PINs Sold</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {filteredRecords.length}
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-blue-500 opacity-50" />
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
                  Search PIN
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="PIN or Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PIN Type</label>
                <select
                  value={pinTypeFilter}
                  onChange={(e) => setPinTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                >
                  <option>All</option>
                  <option>Application PIN</option>
                  <option>Transcript PIN</option>
                  <option>Verification PIN</option>
                  <option>Result Checking PIN</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethodFilter}
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                >
                  <option>All</option>
                  <option>Bank</option>
                  <option>Cash</option>
                  <option>Mobile Money</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
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
                  filename="pin-sales-reconciliation"
                  sheetName="PIN Sales"
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
                      PIN Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchaser
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PIN Value
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Paid
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PIN Status
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
                              {record.pinNumber}
                            </div>
                            <div className="text-sm text-gray-500">{record.receiptNumber}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {record.purchaserName}
                          </div>
                          <div className="text-sm text-gray-500">{record.purchaseDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.pinType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatCurrency(record.pinValue)}
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
                          {getPinStatusBadge(record.pinStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(record.reconciliationStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-purple-600 hover:text-purple-900 mr-3">
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
                      <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                        No PIN sales records found
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
                          ? 'bg-purple-600 text-white border-purple-600'
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
