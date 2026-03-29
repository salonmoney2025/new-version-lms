'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Eye,
  FileText,
  Home,
  LayoutDashboard,
  Mail,
  Phone,
  RefreshCw,
  User,
  XCircle
} from 'lucide-react';

interface Applicant {
  id: string;
  applicationId: string;
  fullName: string;
  email: string;
  phone: string;
  program: string;
  faculty: string;
  campus: string;
  applicationDate: string;
  status: 'submitted' | 'in-review' | 'approved' | 'rejected';
  dateOfBirth: string;
  gender: string;
  nationality: string;
}

export default function DetailedApplicantCountsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'Campus';
  const subcategory = searchParams.get('subcategory') || 'Main Campus';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock detailed data
  const applicants: Applicant[] = [
    {
      id: '1',
      applicationId: 'APP-2025-001',
      fullName: 'John Kamara',
      email: 'john.kamara@example.com',
      phone: '+232 76 123 456',
      program: 'Computer Science',
      faculty: 'Engineering',
      campus: 'Main Campus',
      applicationDate: '2025-01-15',
      status: 'submitted',
      dateOfBirth: '2005-03-12',
      gender: 'Male',
      nationality: 'Sierra Leonean'
    },
    {
      id: '2',
      applicationId: 'APP-2025-002',
      fullName: 'Fatmata Sesay',
      email: 'fatmata.sesay@example.com',
      phone: '+232 77 234 567',
      program: 'Business Administration',
      faculty: 'Business',
      campus: 'Main Campus',
      applicationDate: '2025-01-18',
      status: 'approved',
      dateOfBirth: '2004-07-22',
      gender: 'Female',
      nationality: 'Sierra Leonean'
    },
    {
      id: '3',
      applicationId: 'APP-2025-003',
      fullName: 'Mohamed Bangura',
      email: 'mohamed.bangura@example.com',
      phone: '+232 78 345 678',
      program: 'Civil Engineering',
      faculty: 'Engineering',
      campus: 'Main Campus',
      applicationDate: '2025-01-20',
      status: 'in-review',
      dateOfBirth: '2005-11-08',
      gender: 'Male',
      nationality: 'Sierra Leonean'
    },
    {
      id: '4',
      applicationId: 'APP-2025-004',
      fullName: 'Aminata Koroma',
      email: 'aminata.koroma@example.com',
      phone: '+232 79 456 789',
      program: 'Medicine',
      faculty: 'Medical Sciences',
      campus: 'Main Campus',
      applicationDate: '2025-01-22',
      status: 'approved',
      dateOfBirth: '2004-05-15',
      gender: 'Female',
      nationality: 'Sierra Leonean'
    },
    {
      id: '5',
      applicationId: 'APP-2025-005',
      fullName: 'Ibrahim Kamara',
      email: 'ibrahim.kamara@example.com',
      phone: '+232 76 567 890',
      program: 'Electrical Engineering',
      faculty: 'Engineering',
      campus: 'Main Campus',
      applicationDate: '2025-01-25',
      status: 'rejected',
      dateOfBirth: '2005-09-30',
      gender: 'Male',
      nationality: 'Sierra Leonean'
    }
  ];

  const handleRefresh = () => {
    console.log('Refreshing data...');
  };

  const handleViewApplicant = (applicant: Applicant) => {
    alert(`Viewing details for ${applicant.fullName}`);
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         applicant.applicationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         applicant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || applicant.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    total: applicants.length,
    submitted: applicants.filter(a => a.status === 'submitted').length,
    'in-review': applicants.filter(a => a.status === 'in-review').length,
    approved: applicants.filter(a => a.status === 'approved').length,
    rejected: applicants.filter(a => a.status === 'rejected').length
  };

  const getStatusBadge = (status: Applicant['status']) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <FileText className="h-3 w-3" />
            Submitted
          </span>
        );
      case 'in-review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Eye className="h-3 w-3" />
            In Review
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
    }
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
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              BACK
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

        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-portal-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Detailed Applicant Counts - {subcategory}
              </h1>
              <p className="mt-2 text-base text-gray-600">
                View all applicants for {category}: {subcategory}
              </p>
            
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center space-x-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
            <div className="flex gap-3">
              <ExportMenu data={applicants} filename={`applicants-${subcategory.replace(/\s+/g, '-').toLowerCase()}`} />
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-100 uppercase tracking-wide">Total</p>
                <p className="text-4xl font-bold mt-2">{statusCounts.total}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <User className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Submitted</p>
                <p className="text-4xl font-bold mt-2">{statusCounts.submitted}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <FileText className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-yellow-100 uppercase tracking-wide">In Review</p>
                <p className="text-4xl font-bold mt-2">{statusCounts['in-review']}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Eye className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Approved</p>
                <p className="text-4xl font-bold mt-2">{statusCounts.approved}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <CheckCircle className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-red-100 uppercase tracking-wide">Rejected</p>
                <p className="text-4xl font-bold mt-2">{statusCounts.rejected}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <XCircle className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, ID, or email..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({statusCounts.total})
              </button>
              <button
                onClick={() => setFilterStatus('submitted')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'submitted'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Submitted ({statusCounts.submitted})
              </button>
              <button
                onClick={() => setFilterStatus('in-review')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'in-review'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                In Review ({statusCounts['in-review']})
              </button>
              <button
                onClick={() => setFilterStatus('approved')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'approved'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Approved ({statusCounts.approved})
              </button>
              <button
                onClick={() => setFilterStatus('rejected')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'rejected'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected ({statusCounts.rejected})
              </button>
            </div>
          </div>
        </div>

        {/* Applicants Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 border-b-2 border-gray-400">
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    S/N
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Application ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Application Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplicants.map((applicant, index) => (
                  <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-900">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-900">{applicant.applicationId}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-900">{applicant.fullName}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{applicant.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{applicant.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-600">{applicant.program}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(applicant.applicationDate).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      {getStatusBadge(applicant.status)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewApplicant(applicant)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplicants.length === 0 && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No applicants found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
