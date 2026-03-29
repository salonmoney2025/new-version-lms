'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  Activity,
  Calendar,
  Eye,
  Filter,
  Home,
  Key,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Shield,
  User,
  Users
} from 'lucide-react';
import Link from 'next/link';
interface AdminUser {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdDate: string;
  createdBy: string;
  department: string;
}

export default function AdminUsersReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock data - replace with API call
  const adminUsers: AdminUser[] = [
    {
      id: 1,
      userId: 'ADM-001',
      firstName: 'Emmanuel',
      lastName: 'Koroma',
      username: 'ekoroma',
      email: 'ekoroma@ebkust.edu.sl',
      phone: '+232 76 111 222',
      role: 'Super Admin',
      permissions: ['All Access'],
      status: 'active',
      lastLogin: '2026-03-22 08:30:00',
      createdDate: '2024-01-01',
      createdBy: 'System',
      department: 'IT Department',
    },
    {
      id: 2,
      userId: 'ADM-002',
      firstName: 'Sarah',
      lastName: 'Kamara',
      username: 'skamara',
      email: 'skamara@ebkust.edu.sl',
      phone: '+232 77 222 333',
      role: 'Registrar',
      permissions: ['Student Management', 'Course Management', 'Reports'],
      status: 'active',
      lastLogin: '2026-03-22 07:15:00',
      createdDate: '2024-02-15',
      createdBy: 'ADM-001',
      department: 'Academic Registry',
    },
    {
      id: 3,
      userId: 'ADM-003',
      firstName: 'Mohamed',
      lastName: 'Bangura',
      username: 'mbangura',
      email: 'mbangura@ebkust.edu.sl',
      phone: '+232 78 333 444',
      role: 'Finance Officer',
      permissions: ['Finance', 'Receipts', 'Reports'],
      status: 'active',
      lastLogin: '2026-03-21 16:45:00',
      createdDate: '2024-03-10',
      createdBy: 'ADM-001',
      department: 'Finance Department',
    },
    {
      id: 4,
      userId: 'ADM-004',
      firstName: 'Fatmata',
      lastName: 'Sesay',
      username: 'fsesay',
      email: 'fsesay@ebkust.edu.sl',
      phone: '+232 79 444 555',
      role: 'Admissions Officer',
      permissions: ['Applications', 'Admissions', 'Reports'],
      status: 'active',
      lastLogin: '2026-03-22 09:00:00',
      createdDate: '2024-01-20',
      createdBy: 'ADM-001',
      department: 'Admissions Office',
    },
    {
      id: 5,
      userId: 'ADM-005',
      firstName: 'Ibrahim',
      lastName: 'Conteh',
      username: 'iconteh',
      email: 'iconteh@ebkust.edu.sl',
      phone: '+232 76 555 666',
      role: 'HR Manager',
      permissions: ['HR Management', 'Staff Records', 'Reports'],
      status: 'suspended',
      lastLogin: '2026-02-28 14:20:00',
      createdDate: '2024-04-05',
      createdBy: 'ADM-001',
      department: 'Human Resources',
    },
  ];

  const stats = {
    totalAdmins: 45,
    activeAdmins: 42,
    onlineNow: 12,
    totalRoles: 8,
  };

  const roles = ['All', 'Super Admin', 'Registrar', 'Finance Officer', 'Admissions Officer', 'HR Manager', 'IT Admin'];
  const statuses = ['All', 'Active', 'Inactive', 'Suspended'];

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || badges.active;
  };

  const getRoleBadge = (role: string) => {
    const badges: { [key: string]: string } = {
      'Super Admin': 'bg-purple-100 text-purple-800',
      'Registrar': 'bg-blue-100 text-blue-800',
      'Finance Officer': 'bg-green-100 text-green-800',
      'Admissions Officer': 'bg-orange-100 text-orange-800',
      'HR Manager': 'bg-pink-100 text-pink-800',
      'IT Admin': 'bg-indigo-100 text-indigo-800',
    };
    return badges[role] || 'bg-gray-100 text-gray-800';
  };

  const filteredUsers = adminUsers.filter((user) => {
    const matchesSearch =
      user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter.toLowerCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
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
              <h1 className="text-3xl font-bold text-gray-900">System Admin Users</h1>
              <p className="mt-2 text-base text-gray-600">
                Manage and monitor all system administrators and their access levels
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
              <ExportMenu data={filteredUsers} filename="admin-users-report" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Admins</p>
                <p className="text-4xl font-bold mt-2">{stats.totalAdmins}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Users className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Active Admins</p>
                <p className="text-4xl font-bold mt-2">{stats.activeAdmins}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Shield className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Online Now</p>
                <p className="text-4xl font-bold mt-2">{stats.onlineNow}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Activity className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide">Total Roles</p>
                <p className="text-4xl font-bold mt-2">{stats.totalRoles}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Key className="h-10 w-10" />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search admin users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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

        {/* Admin Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">{user.userId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <User className="w-4 h-4 mr-1 text-gray-400" />
                        {user.username}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900 mb-1">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                        {user.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{user.department}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {user.lastLogin}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
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
              <span className="font-medium">{Math.min(currentPage * itemsPerPageedUsers.length)}</span> of{' '}
              <span className="font-medium">{filteredUsers.length}</span> results
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
