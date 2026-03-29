'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  Building2,
  CheckCircle,
  CreditCard,
  DollarSign,
  Eye,
  Filter,
  Home,
  RefreshCw,
  Search,
  TrendingUp,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
interface FeesAccount {
  id: number;
  accountCode: string;
  accountName: string;
  accountType: string;
  category: string;
  amount: number;
  currency: string;
  faculty: string;
  program: string;
  level: string;
  semester: string;
  status: 'active' | 'inactive';
  mandatory: boolean;
  description: string;
}

export default function FeesAccountsReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('All');
  const [accountTypeFilter, setAccountTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock data - replace with API call
  const feesAccounts: FeesAccount[] = [
    {
      id: 1,
      accountCode: 'TUITION-FBS-UG',
      accountName: 'Tuition Fee - Basic Sciences Undergraduate',
      accountType: 'Tuition',
      category: 'Academic Fee',
      amount: 5000000,
      currency: 'SLL',
      faculty: 'Faculty of Basic Sciences',
      program: 'BSc Computer Science',
      level: 'Year 1',
      semester: 'Semester 1',
      status: 'active',
      mandatory: true,
      description: 'Annual tuition fee for undergraduate students in Faculty of Basic Sciences',
    },
    {
      id: 2,
      accountCode: 'REG-ALL-UG',
      accountName: 'Registration Fee - All Undergraduate',
      accountType: 'Registration',
      category: 'Administrative Fee',
      amount: 500000,
      currency: 'SLL',
      faculty: 'All Faculties',
      program: 'All Programs',
      level: 'All Levels',
      semester: 'Semester 1',
      status: 'active',
      mandatory: true,
      description: 'Registration fee applicable to all undergraduate students',
    },
    {
      id: 3,
      accountCode: 'EXAM-FBS-UG',
      accountName: 'Examination Fee - Basic Sciences',
      accountType: 'Examination',
      category: 'Academic Fee',
      amount: 300000,
      currency: 'SLL',
      faculty: 'Faculty of Basic Sciences',
      program: 'All Programs',
      level: 'All Levels',
      semester: 'Semester 2',
      status: 'active',
      mandatory: true,
      description: 'Examination fee for Faculty of Basic Sciences students',
    },
    {
      id: 4,
      accountCode: 'LIBRARY-ALL-UG',
      accountName: 'Library Fee',
      accountType: 'Library',
      category: 'Facility Fee',
      amount: 150000,
      currency: 'SLL',
      faculty: 'All Faculties',
      program: 'All Programs',
      level: 'All Levels',
      semester: 'Semester 1',
      status: 'active',
      mandatory: true,
      description: 'Library access and resource fee',
    },
    {
      id: 5,
      accountCode: 'LAB-FENG-UG',
      accountName: 'Laboratory Fee - Engineering',
      accountType: 'Laboratory',
      category: 'Facility Fee',
      amount: 800000,
      currency: 'SLL',
      faculty: 'Faculty of Engineering',
      program: 'All Engineering Programs',
      level: 'All Levels',
      semester: 'Semester 1',
      status: 'active',
      mandatory: true,
      description: 'Laboratory and workshop fee for engineering students',
    },
  ];

  const stats = {
    totalAccounts: 45,
    activeAccounts: 42,
    totalRevenue: 2850000000,
    mandatoryFees: 38,
  };

  const faculties = ['All', 'All Faculties', 'Faculty of Basic Sciences', 'Faculty of Engineering', 'Faculty of Business'];
  const accountTypes = ['All', 'Tuition', 'Registration', 'Examination', 'Library', 'Laboratory', 'Accommodation'];
  const statuses = ['All', 'Active', 'Inactive'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SL', {
      style: 'currency',
      currency: 'SLL',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const filteredAccounts = feesAccounts.filter((account) => {
    const matchesSearch =
      account.accountCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFaculty = facultyFilter === 'All' || account.faculty === facultyFilter;
    const matchesType = accountTypeFilter === 'All' || account.accountType === accountTypeFilter;
    const matchesStatus = statusFilter === 'All' || account.status === statusFilter.toLowerCase();

    return matchesSearch && matchesFaculty && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
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
              <h1 className="text-3xl font-bold text-gray-900">List of Fees Accounts</h1>
              <p className="mt-2 text-base text-gray-600">
                Manage and view all fee accounts across the university
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
              <ExportMenu data={filteredAccounts} filename="fees-accounts-report" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Accounts</p>
                <p className="text-4xl font-bold mt-2">{stats.totalAccounts}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <CreditCard className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Active Accounts</p>
                <p className="text-4xl font-bold mt-2">{stats.activeAccounts}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <CheckCircle className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Total Revenue</p>
                <p className="text-4xl font-bold mt-2">{formatCurrency(stats.totalRevenue).slice(0, -3)}B</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <DollarSign className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide">Mandatory Fees</p>
                <p className="text-4xl font-bold mt-2">{stats.mandatoryFees}</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search accounts..."
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <select
                value={accountTypeFilter}
                onChange={(e) => setAccountTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {accountTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
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

        {/* Fees Accounts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Account Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Account Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Faculty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mandatory</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">{account.accountCode}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{account.accountName}</div>
                      <div className="text-sm text-gray-500">{account.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{account.accountType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{account.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(account.amount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Building2 className="w-4 h-4 mr-1 text-gray-400" />
                        {account.faculty}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {account.mandatory ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(account.status)}`}>
                        {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
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
              <span className="font-medium">{Math.min(currentPage * itemsPerPageedAccounts.length)}</span> of{' '}
              <span className="font-medium">{filteredAccounts.length}</span> results
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
