'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  BarChart3,
  BookOpen,
  Building,
  Calendar,
  Eye,
  Home,
  LayoutDashboard,
  PieChart,
  RefreshCw,
  TrendingUp,
  Users
} from 'lucide-react';

interface ApplicantCount {
  id: string;
  category: string;
  subcategory: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export default function ApplicantCountsPage() {
  const router = useRouter();
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2025/2026');
  const [viewMode, setViewMode] = useState<'overview' | 'faculty' | 'program' | 'status'>('overview');

  // Mock data
  const totalApplicants = 1250;
  const byFaculty: ApplicantCount[] = [
    { id: '1', category: 'Faculty', subcategory: 'Engineering', count: 420, percentage: 33.6, trend: 'up' },
    { id: '2', category: 'Faculty', subcategory: 'Business', count: 315, percentage: 25.2, trend: 'up' },
    { id: '3', category: 'Faculty', subcategory: 'Medical Sciences', count: 280, percentage: 22.4, trend: 'stable' },
    { id: '4', category: 'Faculty', subcategory: 'Arts & Humanities', count: 235, percentage: 18.8, trend: 'down' }
  ];

  const byProgram: ApplicantCount[] = [
    { id: '1', category: 'Program', subcategory: 'Computer Science', count: 185, percentage: 14.8, trend: 'up' },
    { id: '2', category: 'Program', subcategory: 'Business Administration', count: 165, percentage: 13.2, trend: 'up' },
    { id: '3', category: 'Program', subcategory: 'Civil Engineering', count: 145, percentage: 11.6, trend: 'stable' },
    { id: '4', category: 'Program', subcategory: 'Medicine', count: 140, percentage: 11.2, trend: 'up' },
    { id: '5', category: 'Program', subcategory: 'Electrical Engineering', count: 90, percentage: 7.2, trend: 'stable' }
  ];

  const byStatus: ApplicantCount[] = [
    { id: '1', category: 'Status', subcategory: 'Submitted', count: 520, percentage: 41.6, trend: 'up' },
    { id: '2', category: 'Status', subcategory: 'In Review', count: 385, percentage: 30.8, trend: 'stable' },
    { id: '3', category: 'Status', subcategory: 'Approved', count: 245, percentage: 19.6, trend: 'up' },
    { id: '4', category: 'Status', subcategory: 'Rejected', count: 100, percentage: 8.0, trend: 'down' }
  ];

  const byCampus: ApplicantCount[] = [
    { id: '1', category: 'Campus', subcategory: 'Main Campus', count: 680, percentage: 54.4, trend: 'up' },
    { id: '2', category: 'Campus', subcategory: 'Bo Campus', count: 320, percentage: 25.6, trend: 'stable' },
    { id: '3', category: 'Campus', subcategory: 'Makeni Campus', count: 250, percentage: 20.0, trend: 'up' }
  ];

  const handleRefresh = () => {
    console.log('Refreshing data...');
  };

  const handleViewDetails = (count: ApplicantCount) => {
    router.push(`/admissions/applicant-counts/detailed?category=${count.category}&subcategory=${count.subcategory}`);
  };

  const getCurrentData = () => {
    switch (viewMode) {
      case 'faculty':
        return byFaculty;
      case 'program':
        return byProgram;
      case 'status':
        return byStatus;
      default:
        return byCampus;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (trend === 'down') {
      return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
    }
    return <span className="text-gray-600">─</span>;
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
              <h1 className="text-3xl font-bold text-gray-800">Applicant Counts</h1>
              <p className="mt-2 text-base text-gray-600">
                View applicant statistics by faculty, program, status, and campus
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
              <ExportMenu data={getCurrentData()} filename={`applicant-counts-${viewMode}`} />
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Applicants</p>
                <p className="text-4xl font-bold mt-2">{totalApplicants.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Users className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Approved</p>
                <p className="text-4xl font-bold mt-2">{byStatus.find(s => s.subcategory === 'Approved')?.count || 0}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide">In Review</p>
                <p className="text-4xl font-bold mt-2">{byStatus.find(s => s.subcategory === 'In Review')?.count || 0}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Eye className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Academic Year</p>
                <p className="text-2xl font-bold mt-2">{selectedYear}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Calendar className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and View Mode */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Filters */}
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                >
                  <option>2025/2026</option>
                  <option>2024/2025</option>
                  <option>2023/2024</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campus
                </label>
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                >
                  <option value="all">All Campuses</option>
                  <option value="Main Campus">Main Campus</option>
                  <option value="Bo Campus">Bo Campus</option>
                  <option value="Makeni Campus">Makeni Campus</option>
                </select>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('overview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'overview'
                    ? 'bg-portal-teal-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Building className="h-4 w-4" />
                Campus
              </button>
              <button
                onClick={() => setViewMode('faculty')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'faculty'
                    ? 'bg-portal-teal-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Faculty
              </button>
              <button
                onClick={() => setViewMode('program')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'program'
                    ? 'bg-portal-teal-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Program
              </button>
              <button
                onClick={() => setViewMode('status')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'status'
                    ? 'bg-portal-teal-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <PieChart className="h-4 w-4" />
                Status
              </button>
            </div>
          </div>
        </div>

        {/* Counts Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 border-b-2 border-gray-400">
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    S/N
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    {viewMode === 'overview' ? 'Campus' : viewMode === 'faculty' ? 'Faculty' : viewMode === 'program' ? 'Program' : 'Status'}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Trend
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getCurrentData().map((count, index) => (
                  <tr key={count.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-900">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-900">{count.subcategory}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm font-bold text-portal-teal-600">{count.count}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-portal-teal-500 h-2 rounded-full"
                            style={{ width: `${count.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{count.percentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(count.trend)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(count)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100 border-t-2 border-gray-400">
                <tr>
                  <td colSpan={2} className="px-6 py-4 border-r border-gray-300">
                    <span className="text-sm font-bold text-gray-800 uppercase">Total</span>
                  </td>
                  <td className="px-6 py-4 border-r border-gray-300">
                    <span className="text-sm font-bold text-portal-teal-600">{totalApplicants}</span>
                  </td>
                  <td className="px-6 py-4 border-r border-gray-300">
                    <span className="text-sm font-bold text-gray-800">100%</span>
                  </td>
                  <td colSpan={2} className="px-6 py-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
