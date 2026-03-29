'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  Briefcase,
  Building2,
  Calendar,
  Eye,
  Filter,
  Home,
  Mail,
  Phone,
  RefreshCw,
  Search,
  User,
  Users
} from 'lucide-react';
import Link from 'next/link';
interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  department: string;
  faculty: string;
  position: string;
  employmentType: string;
  dateOfHire: string;
  status: 'active' | 'inactive' | 'on-leave';
  salary: number;
  officeLocation: string;
}

export default function EmployeeListReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [positionFilter, setPositionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock data - replace with API call
  const employees: Employee[] = [
    {
      id: 1,
      employeeId: 'EMP-2024-001',
      firstName: 'Dr. Samuel',
      lastName: 'Kargbo',
      email: 'skargbo@ebkust.edu.sl',
      phone: '+232 76 111 222',
      gender: 'Male',
      department: 'Computer Science',
      faculty: 'Faculty of Basic Sciences',
      position: 'Lecturer',
      employmentType: 'Full-time',
      dateOfHire: '2020-01-15',
      status: 'active',
      salary: 12000000,
      officeLocation: 'FBS Building, Room 205',
    },
    {
      id: 2,
      employeeId: 'EMP-2024-002',
      firstName: 'Prof. Mary',
      lastName: 'Williams',
      email: 'mwilliams@ebkust.edu.sl',
      phone: '+232 77 222 333',
      gender: 'Female',
      department: 'Civil Engineering',
      faculty: 'Faculty of Engineering',
      position: 'Professor',
      employmentType: 'Full-time',
      dateOfHire: '2018-03-20',
      status: 'active',
      salary: 18000000,
      officeLocation: 'Engineering Block A, Room 301',
    },
    {
      id: 3,
      employeeId: 'EMP-2024-003',
      firstName: 'Mr. Ahmed',
      lastName: 'Conteh',
      email: 'aconteh@ebkust.edu.sl',
      phone: '+232 78 333 444',
      gender: 'Male',
      department: 'Finance',
      faculty: 'Administration',
      position: 'Finance Officer',
      employmentType: 'Full-time',
      dateOfHire: '2021-06-10',
      status: 'active',
      salary: 8000000,
      officeLocation: 'Admin Building, Room 102',
    },
    {
      id: 4,
      employeeId: 'EMP-2024-004',
      firstName: 'Mrs. Aminata',
      lastName: 'Bangura',
      email: 'abangura@ebkust.edu.sl',
      phone: '+232 79 444 555',
      gender: 'Female',
      department: 'Library',
      faculty: 'Academic Support',
      position: 'Librarian',
      employmentType: 'Full-time',
      dateOfHire: '2019-09-01',
      status: 'active',
      salary: 7500000,
      officeLocation: 'Main Library',
    },
    {
      id: 5,
      employeeId: 'EMP-2023-045',
      firstName: 'Dr. Joseph',
      lastName: 'Koroma',
      email: 'jkoroma@ebkust.edu.sl',
      phone: '+232 76 555 666',
      gender: 'Male',
      department: 'Business Administration',
      faculty: 'Faculty of Business Administration',
      position: 'Senior Lecturer',
      employmentType: 'Full-time',
      dateOfHire: '2017-02-15',
      status: 'on-leave',
      salary: 15000000,
      officeLocation: 'Business School, Room 201',
    },
  ];

  const stats = {
    totalEmployees: 287,
    activeEmployees: 265,
    onLeave: 12,
    teachingStaff: 189,
  };

  const departments = ['All', 'Computer Science', 'Civil Engineering', 'Finance', 'Library', 'Business Administration', 'Human Resources'];
  const positions = ['All', 'Professor', 'Senior Lecturer', 'Lecturer', 'Assistant Lecturer', 'Finance Officer', 'Librarian', 'Admin Staff'];
  const statuses = ['All', 'Active', 'Inactive', 'On-Leave'];

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      'on-leave': 'bg-yellow-100 text-yellow-800',
    };
    return badges[status as keyof typeof badges] || badges.active;
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = departmentFilter === 'All' || employee.department === departmentFilter;
    const matchesPosition = positionFilter === 'All' || employee.position === positionFilter;
    const matchesStatus = statusFilter === 'All' || employee.status === statusFilter.toLowerCase().replace('-', '-');

    return matchesSearch && matchesDepartment && matchesPosition && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
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
              <h1 className="text-3xl font-bold text-gray-900">View Employee List</h1>
              <p className="mt-2 text-base text-gray-600">
                Complete directory of all university employees
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
              <ExportMenu data={filteredEmployees} filename="employee-list-report" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Employees</p>
                <p className="text-4xl font-bold mt-2">{stats.totalEmployees}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Users className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Active Employees</p>
                <p className="text-4xl font-bold mt-2">{stats.activeEmployees}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <User className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide">On Leave</p>
                <p className="text-4xl font-bold mt-2">{stats.onLeave}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Calendar className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Teaching Staff</p>
                <p className="text-4xl font-bold mt-2">{stats.teachingStaff}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Briefcase className="h-10 w-10" />
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
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {positions.map((position) => (
                  <option key={position} value={position}>{position}</option>
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

        {/* Employee Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Employment Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date of Hire</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">{employee.employeeId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {employee.firstName[0]}{employee.lastName[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{employee.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900 mb-1">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        {employee.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                        {employee.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Building2 className="w-4 h-4 mr-1 text-gray-400" />
                        {employee.department}
                      </div>
                      <div className="text-sm text-gray-500">{employee.faculty}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{employee.position}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{employee.employmentType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {new Date(employee.dateOfHire).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(employee.status)}`}>
                        {employee.status === 'on-leave' ? 'On Leave' : employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
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
              <span className="font-medium">{Math.min(currentPage * itemsPerPageedEmployees.length)}</span> of{' '}
              <span className="font-medium">{filteredEmployees.length}</span> results
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
