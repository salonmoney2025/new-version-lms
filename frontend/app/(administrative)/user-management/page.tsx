'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Edit,
  Home,
  LayoutDashboard,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  User,
  X
} from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  campus: string;
  status: 'active' | 'inactive';
  createdDate: string;
}

export default function ManageUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    role: 'STAFF',
    campus: '',
    status: 'active'
  });

  // Mock data - replace with API call
  useEffect(() => {
    setUsers([
      {
        id: '1',
        username: 'admin1',
        fullName: 'John Doe',
        email: 'john.doe@ebkust.edu.sl',
        role: 'ADMIN',
        campus: 'Main Campus',
        status: 'active',
        createdDate: '2025-01-15'
      },
      {
        id: '2',
        username: 'finance1',
        fullName: 'Jane Smith',
        email: 'jane.smith@ebkust.edu.sl',
        role: 'FINANCE',
        campus: 'Main Campus',
        status: 'active',
        createdDate: '2025-02-10'
      },
      {
        id: '3',
        username: 'staff1',
        fullName: 'Michael Johnson',
        email: 'michael.j@ebkust.edu.sl',
        role: 'STAFF',
        campus: 'Bo Campus',
        status: 'inactive',
        createdDate: '2024-12-01'
      },
    ]);
  }, []);

  const filteredUsers = selectedCampus === 'all'
    ? users
    : users.filter(u => u.campus === selectedCampus);

  const handleRefresh = () => {
    // Refresh data from API
    window.location.reload();
  };

  const handleAddUser = () => {
    // Add user logic
    const newUser: User = {
      id: Date.now().toString(),
      username: formData.username,
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
      campus: formData.campus,
      status: formData.status as 'active' | 'inactive',
      createdDate: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      password: '',
      role: user.role,
      campus: user.campus,
      status: user.status
    });
    setShowAddModal(true);
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? {
        ...u,
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        campus: formData.campus,
        status: formData.status as 'active' | 'inactive'
      } : u));
      setShowAddModal(false);
      setEditingUser(null);
      resetForm();
    }
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      fullName: '',
      email: '',
      password: '',
      role: 'STAFF',
      campus: '',
      status: 'active'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Action Buttons Bar */}
        <div className="bg-white border-b border-gray-300 px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium transition-colors"
            >
              <Home className="h-4 w-4" />
              HOME
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              DASHBOARD
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              ADD
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-medium transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              REFRESH
            </button>
          </div>
        </div>

        {/* Page Title */}
        <div className="bg-white p-6 border-l-4 border-portal-teal-500 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">MANAGE COLLEGE ADMINS</h1>
        
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center space-x-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>

        {/* Campus Selection */}
        <div className="bg-white p-6 shadow-sm rounded">
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-gray-700">SELECT CAMPUS:</label>
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500 min-w-[250px]"
            >
              <option value="all">All Campuses</option>
              <option value="Main Campus">Main Campus</option>
              <option value="Bo Campus">Bo Campus</option>
              <option value="Makeni Campus">Makeni Campus</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow-sm rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 border-b-2 border-gray-400">
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    S/N
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Campus
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm border-r border-gray-200">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                      {user.campus}
                    </td>
                    <td className="px-6 py-4 text-sm border-r border-gray-200">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 font-medium">No users found for the selected campus</p>
            </div>
          )}
        </div>

        {/* Add/Edit User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-portal-teal-600 text-white px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingUser ? 'EDIT USER' : 'ADD NEW USER'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                  className="text-white hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password {!editingUser && '*'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                    placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="FINANCE">Finance</option>
                    <option value="STAFF">Staff</option>
                    <option value="REGISTRAR">Registrar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Campus *
                  </label>
                  <select
                    value={formData.campus}
                    onChange={(e) => setFormData({...formData, campus: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                  >
                    <option value="">Select Campus</option>
                    <option value="Main Campus">Main Campus</option>
                    <option value="Bo Campus">Bo Campus</option>
                    <option value="Makeni Campus">Makeni Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingUser(null);
                      resetForm();
                    }}
                    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingUser ? handleUpdateUser : handleAddUser}
                    className="flex items-center gap-2 px-6 py-2 bg-portal-teal-600 hover:bg-portal-teal-700 text-white rounded font-medium transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    {editingUser ? 'Update User' : 'Add User'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
