'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  BookOpen,
  Building2,
  Edit,
  Eye,
  Filter,
  GraduationCap,
  Home,
  RefreshCw,
  Search,
  Users
} from 'lucide-react';
import Link from 'next/link';
interface Faculty {
  id: number;
  facultyCode: string;
  facultyName: string;
  dean: string;
  deanEmail: string;
  deanPhone: string;
  campus: string;
  building: string;
  totalDepartments: number;
  totalPrograms: number;
  totalStudents: number;
  totalStaff: number;
  establishedYear: string;
  status: 'active' | 'inactive';
}

export default function FacultiesReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [campusFilter, setCampusFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - replace with API call
  const faculties: Faculty[] = [
    {
      id: 1,
      facultyCode: 'FBS',
      facultyName: 'Faculty of Basic Sciences',
      dean: 'Prof. Mohamed Kamara',
      deanEmail: 'dean.fbs@ebkust.edu.sl',
      deanPhone: '+232 76 111 222',
      campus: 'Main Campus',
      building: 'Basic Sciences Building',
      totalDepartments: 5,
      totalPrograms: 12,
      totalStudents: 1245,
      totalStaff: 45,
      establishedYear: '2015',
      status: 'active',
    },
    {
      id: 2,
      facultyCode: 'FENG',
      facultyName: 'Faculty of Engineering',
      dean: 'Prof. Sarah Williams',
      deanEmail: 'dean.eng@ebkust.edu.sl',
      deanPhone: '+232 77 222 333',
      campus: 'Main Campus',
      building: 'Engineering Complex',
      totalDepartments: 6,
      totalPrograms: 15,
      totalStudents: 1567,
      totalStaff: 62,
      establishedYear: '2015',
      status: 'active',
    },
    {
      id: 3,
      facultyCode: 'FBA',
      facultyName: 'Faculty of Business Administration',
      dean: 'Dr. Ibrahim Conteh',
      deanEmail: 'dean.business@ebkust.edu.sl',
      deanPhone: '+232 78 333 444',
      campus: 'Main Campus',
      building: 'Business School',
      totalDepartments: 4,
      totalPrograms: 10,
      totalStudents: 1023,
      totalStaff: 38,
      establishedYear: '2016',
      status: 'active',
    },
    {
      id: 4,
      facultyCode: 'FENV',
      facultyName: 'Faculty of Environmental Sciences',
      dean: 'Prof. Fatmata Bangura',
      deanEmail: 'dean.env@ebkust.edu.sl',
      deanPhone: '+232 79 444 555',
      campus: 'Makeni Campus',
      building: 'Environmental Studies Building',
      totalDepartments: 3,
      totalPrograms: 8,
      totalStudents: 678,
      totalStaff: 28,
      establishedYear: '2017',
      status: 'active',
    },
    {
      id: 5,
      facultyCode: 'FMED',
      facultyName: 'Faculty of Medicine and Health Sciences',
      dean: 'Prof. Joseph Koroma',
      deanEmail: 'dean.med@ebkust.edu.sl',
      deanPhone: '+232 76 555 666',
      campus: 'Bo Campus',
      building: 'Medical Sciences Complex',
      totalDepartments: 7,
      totalPrograms: 14,
      totalStudents: 892,
      totalStaff: 54,
      establishedYear: '2018',
      status: 'active',
    },
  ];

  const stats = {
    totalFaculties: 5,
    totalDepartments: 25,
    totalPrograms: 59,
    totalStudents: 5405,
  };

  const campuses = ['All', 'Main Campus', 'Makeni Campus', 'Bo Campus'];
  const statuses = ['All', 'Active', 'Inactive'];

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const filteredFaculties = faculties.filter((faculty) => {
    const matchesSearch =
      faculty.facultyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.dean.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCampus = campusFilter === 'All' || faculty.campus === campusFilter;
    const matchesStatus = statusFilter === 'All' || faculty.status === statusFilter.toLowerCase();

    return matchesSearch && matchesCampus && matchesStatus;
  });

  const totalPages = Math.ceil(filteredFaculties.length / itemsPerPage);
  const paginatedFaculties = filteredFaculties.slice(
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
              <h1 className="text-3xl font-bold text-gray-900">View Faculties</h1>
              <p className="mt-2 text-base text-gray-600">
                Overview of all university faculties and their information
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
              <ExportMenu data={filteredFaculties} filename="faculties-report" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Faculties</p>
                <p className="text-4xl font-bold mt-2">{stats.totalFaculties}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Building2 className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Total Departments</p>
                <p className="text-4xl font-bold mt-2">{stats.totalDepartments}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <BookOpen className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Total Programs</p>
                <p className="text-4xl font-bold mt-2">{stats.totalPrograms}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <GraduationCap className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide">Total Students</p>
                <p className="text-4xl font-bold mt-2">{stats.totalStudents.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Users className="h-10 w-10" />
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
                  placeholder="Search faculties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campus</label>
              <select
                value={campusFilter}
                onChange={(e) => setCampusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {campuses.map((campus) => (
                  <option key={campus} value={campus}>{campus}</option>
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

        {/* Faculties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paginatedFaculties.map((faculty) => (
            <div key={faculty.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{faculty.facultyName}</h3>
                    <p className="text-sm text-gray-500">Code: {faculty.facultyCode}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(faculty.status)}`}>
                  {faculty.status.charAt(0).toUpperCase() + faculty.status.slice(1)}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">Dean:</span>
                  <span className="ml-2">{faculty.dean}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">Campus:</span>
                  <span className="ml-2">{faculty.campus}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">Building:</span>
                  <span className="ml-2">{faculty.building}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{faculty.totalDepartments}</p>
                  <p className="text-xs text-gray-500 mt-1">Departments</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{faculty.totalPrograms}</p>
                  <p className="text-xs text-gray-500 mt-1">Programs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{faculty.totalStudents}</p>
                  <p className="text-xs text-gray-500 mt-1">Students</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{faculty.totalStaff}</p>
                  <p className="text-xs text-gray-500 mt-1">Staff</p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                <button className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * itemsPerPageedFaculties.length)}</span> of{' '}
                <span className="font-medium">{filteredFaculties.length}</span> results
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
        )}
      </div>
    </DashboardLayout>
  );
}
