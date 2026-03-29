'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  Activity,
  Clock,
  Filter,
  Home,
  MapPin,
  RefreshCw,
  Search,
  TrendingUp,
  User
} from 'lucide-react';
import Link from 'next/link';

interface AccessLogEntry {
  id: number;
  username: string;
  fullName: string;
  role: string;
  action: string;
  module: string;
  ipAddress: string;
  device: string;
  browser: string;
  location: string;
  timestamp: string;
  duration: string;
  status: 'success' | 'failed' | 'warning';
}

export default function AccessLogReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [statusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock data - replace with API call
  const accessLogs: AccessLogEntry[] = [
    {
      id: 1,
      username: 'admin001',
      fullName: 'John Doe',
      role: 'Administrator',
      action: 'Login',
      module: 'Authentication',
      ipAddress: '192.168.1.100',
      device: 'Windows 11',
      browser: 'Chrome 120',
      location: 'Freetown, SL',
      timestamp: '2026-03-22 09:15:23',
      duration: '2h 15m',
      status: 'success',
    },
    {
      id: 2,
      username: 'finance01',
      fullName: 'Sarah Williams',
      role: 'Finance Officer',
      action: 'Generate Receipt',
      module: 'Finance',
      ipAddress: '192.168.1.105',
      device: 'MacOS',
      browser: 'Safari 17',
      location: 'Freetown, SL',
      timestamp: '2026-03-22 09:20:45',
      duration: '45m',
      status: 'success',
    },
    {
      id: 3,
      username: 'registrar01',
      fullName: 'Michael Johnson',
      role: 'Registrar',
      action: 'Add Student',
      module: 'Student Management',
      ipAddress: '192.168.1.110',
      device: 'Windows 10',
      browser: 'Edge 119',
      location: 'Makeni, SL',
      timestamp: '2026-03-22 09:30:12',
      duration: '1h 30m',
      status: 'success',
    },
    {
      id: 4,
      username: 'hr_staff',
      fullName: 'Emily Brown',
      role: 'HR Manager',
      action: 'Failed Login',
      module: 'Authentication',
      ipAddress: '192.168.1.115',
      device: 'Android',
      browser: 'Chrome Mobile',
      location: 'Bo, SL',
      timestamp: '2026-03-22 09:35:00',
      duration: '0m',
      status: 'failed',
    },
  ];

  const stats = {
    totalAccess: 1247,
    uniqueUsers: 89,
    successRate: 97.5,
    avgSessionTime: '1h 25m',
  };

  const roles = ['All', 'Administrator', 'Finance Officer', 'Registrar', 'HR Manager', 'Student', 'Staff'];
  const actions = ['All', 'Login', 'Logout', 'Add Student', 'Generate Receipt', 'View Report', 'Edit Data', 'Delete Record'];

  const getStatusBadge = (status: string) => {
    const badges = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
    };
    return badges[status as keyof typeof badges] || badges.success;
  };

  const filteredLogs = accessLogs.filter((log) => {
    const matchesSearch =
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'All' || log.role === roleFilter;
    const matchesAction = actionFilter === 'All' || log.action === actionFilter;
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter.toLowerCase();

    return matchesSearch && matchesRole && matchesAction && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
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
              <h1 className="text-3xl font-bold text-gray-900">Access Log Report</h1>
              <p className="mt-2 text-base text-gray-600">
                Monitor and track all user activities and system access
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
              <ExportMenu data={filteredLogs} filename="access-log-report" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Access</p>
                <p className="text-4xl font-bold mt-2">{stats.totalAccess.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Activity className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Unique Users</p>
                <p className="text-4xl font-bold mt-2">{stats.uniqueUsers}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <User className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Success Rate</p>
                <p className="text-4xl font-bold mt-2">{stats.successRate}%</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <TrendingUp className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide">Avg Session Time</p>
                <p className="text-4xl font-bold mt-2">{stats.avgSessionTime}</p>
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
                  placeholder="Search users, actions..."
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {actions.map((action) => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Access Log Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Module</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Device/Browser</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{log.fullName}</div>
                        <div className="text-sm text-gray-500">{log.username}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{log.role}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">{log.action}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{log.module}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {log.ipAddress}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{log.device}</div>
                      <div className="text-sm text-gray-500">{log.browser}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {log.timestamp}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{log.duration}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(log.status)}`}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
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
              <span className="font-medium">{Math.min(currentPage * itemsPerPageedLogs.length)}</span> of{' '}
              <span className="font-medium">{filteredLogs.length}</span> results
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
