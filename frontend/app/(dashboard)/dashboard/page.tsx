'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import api from '@/lib/api';
import {
  Users, DollarSign, BookOpen, GraduationCap,
  TrendingUp, ArrowUpRight, Receipt, UserPlus, FileText,
  Calendar, Bell, BarChart3, Activity,
  Clock, CheckCircle, AlertCircle, Info
} from 'lucide-react';

interface DashboardStats {
  students: {
    total: number;
    active: number;
    recent: number;
  };
  staff: {
    total: number;
    active: number;
  };
  courses: {
    total: number;
    active: number;
  };
  offerings: {
    total: number;
    open: number;
  };
  finance: {
    total_revenue: number;
    pending_fees: number;
  };
  recent_activity: {
    new_students: number;
    new_enrollments: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/analytics/dashboard/');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SL', {
      style: 'currency',
      currency: 'SLE',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-portal-teal-500">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="mt-2 text-base text-gray-600">
            Welcome back! Here&apos;s an overview of your university system.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Students */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Students</p>
                <p className="text-4xl font-bold mt-2">
                  {statsLoading ? '...' : stats?.students.total.toLocaleString() || 0}
                </p>
                {stats && (
                  <p className="text-sm text-blue-100 mt-2 flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    {stats.students.active} active students
                  </p>
                )}
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Users className="h-10 w-10" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Total Revenue</p>
                <p className="text-4xl font-bold mt-2">
                  {statsLoading ? '...' : formatCurrency(stats?.finance.total_revenue || 0)}
                </p>
                <p className="text-sm text-green-100 mt-2">Financial year 2025/26</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <DollarSign className="h-10 w-10" />
              </div>
            </div>
          </div>

          {/* Total Courses */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Total Courses</p>
                <p className="text-4xl font-bold mt-2">
                  {statsLoading ? '...' : stats?.courses.total || 0}
                </p>
                {stats && (
                  <p className="text-sm text-purple-100 mt-2">
                    {stats.offerings.open} open offerings
                  </p>
                )}
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <BookOpen className="h-10 w-10" />
              </div>
            </div>
          </div>

          {/* Total Staff */}
          <div className="bg-gradient-to-br from-portal-teal-500 to-portal-teal-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-100 uppercase tracking-wide">Total Staff</p>
                <p className="text-4xl font-bold mt-2">
                  {statsLoading ? '...' : stats?.staff.total || 0}
                </p>
                {stats && (
                  <p className="text-sm text-teal-100 mt-2">
                    {stats.staff.active} active members
                  </p>
                )}
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <GraduationCap className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-blue-100 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">New Students (7 days)</span>
                <span className="text-lg font-bold text-blue-600">{stats?.recent_activity.new_students || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">New Enrollments</span>
                <span className="text-lg font-bold text-blue-600">{stats?.recent_activity.new_enrollments || 0}</span>
              </div>
            </div>
          </div>

          {/* Course Offerings */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-purple-100 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Course Offerings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">Total Courses</span>
                <span className="text-lg font-bold text-purple-600">{stats?.offerings.total || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">Open for Enrollment</span>
                <span className="text-lg font-bold text-green-600">{stats?.offerings.open || 0}</span>
              </div>
            </div>
          </div>

          {/* Finance Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Finance Summary</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">Total Revenue</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(stats?.finance.total_revenue || 0)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">Pending Fees</span>
                <span className="text-lg font-bold text-orange-600">{formatCurrency(stats?.finance.pending_fees || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Announcements Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border-t-4 border-portal-teal-500">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
              <ExportMenu data={stats ? [stats] : []} filename="dashboard-report" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => router.push('/students/add')}
                className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-all hover:shadow-md group"
              >
                <UserPlus className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">Add Student</span>
              </button>
              <button
                onClick={() => router.push('/receipt/generate')}
                className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-all hover:shadow-md group"
              >
                <Receipt className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">Generate Receipt</span>
              </button>
              <button
                onClick={() => router.push('/applications')}
                className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-all hover:shadow-md group"
              >
                <FileText className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">View Applications</span>
              </button>
              <button
                onClick={() => router.push('/reports')}
                className="flex flex-col items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-all hover:shadow-md group"
              >
                <BarChart3 className="h-8 w-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">View Reports</span>
              </button>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-md p-6 border-l-4 border-amber-500">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-bold text-gray-800">Announcements</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg shadow-sm border border-amber-200">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Semester Registration</p>
                    <p className="text-xs text-gray-600 mt-1">Opens on March 25, 2026</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border border-amber-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Fee Payment Deadline</p>
                    <p className="text-xs text-gray-600 mt-1">Due by March 30, 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities & Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities Feed */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-portal-teal-600" />
                <h3 className="text-lg font-bold text-gray-800">Recent Activities</h3>
              </div>
              <button className="text-sm text-portal-teal-600 hover:text-portal-teal-700 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">New Student Enrolled</p>
                  <p className="text-xs text-gray-600">John Doe - Computer Science</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    5 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Receipt className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Payment Received</p>
                  <p className="text-xs text-gray-600">Le 50,000 - STU-2024-001</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    1 hour ago
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="bg-purple-100 p-2 rounded-full">
                  <FileText className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Application Submitted</p>
                  <p className="text-xs text-gray-600">Engineering Program - APP-2024-156</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="bg-orange-100 p-2 rounded-full">
                  <BookOpen className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Course Updated</p>
                  <p className="text-xs text-gray-600">CS101 - Introduction to Programming</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    3 hours ago
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events Calendar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-portal-teal-600" />
                <h3 className="text-lg font-bold text-gray-800">Upcoming Events</h3>
              </div>
              <button className="text-sm text-portal-teal-600 hover:text-portal-teal-700 font-medium">
                View Calendar
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="text-center">
                  <div className="bg-blue-600 text-white rounded-lg px-3 py-2">
                    <p className="text-xs font-semibold">MAR</p>
                    <p className="text-2xl font-bold">25</p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Registration Opens</p>
                  <p className="text-sm text-gray-600">Semester 2 2025/26</p>
                  <p className="text-xs text-gray-500 mt-1">9:00 AM - Online Portal</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <div className="text-center">
                  <div className="bg-purple-600 text-white rounded-lg px-3 py-2">
                    <p className="text-xs font-semibold">MAR</p>
                    <p className="text-2xl font-bold">28</p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Faculty Meeting</p>
                  <p className="text-sm text-gray-600">All Departments</p>
                  <p className="text-xs text-gray-500 mt-1">2:00 PM - Main Hall</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <div className="text-center">
                  <div className="bg-orange-600 text-white rounded-lg px-3 py-2">
                    <p className="text-xs font-semibold">MAR</p>
                    <p className="text-2xl font-bold">30</p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Payment Deadline</p>
                  <p className="text-sm text-gray-600">Tuition Fees</p>
                  <p className="text-xs text-gray-500 mt-1">5:00 PM - Finance Office</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Chart Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-portal-teal-600" />
              <h3 className="text-lg font-bold text-gray-800">Student Enrollment Trend</h3>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-portal-teal-500">
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="grid grid-cols-6 gap-2 items-end h-48">
            <div className="flex flex-col items-center">
              <div className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-colors" style={{ height: '60%' }}></div>
              <p className="text-xs text-gray-600 mt-2">Oct</p>
              <p className="text-xs font-semibold text-gray-800">120</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-colors" style={{ height: '75%' }}></div>
              <p className="text-xs text-gray-600 mt-2">Nov</p>
              <p className="text-xs font-semibold text-gray-800">150</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-colors" style={{ height: '85%' }}></div>
              <p className="text-xs text-gray-600 mt-2">Dec</p>
              <p className="text-xs font-semibold text-gray-800">170</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-colors" style={{ height: '70%' }}></div>
              <p className="text-xs text-gray-600 mt-2">Jan</p>
              <p className="text-xs font-semibold text-gray-800">140</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-colors" style={{ height: '90%' }}></div>
              <p className="text-xs text-gray-600 mt-2">Feb</p>
              <p className="text-xs font-semibold text-gray-800">180</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full bg-portal-teal-500 rounded-t-lg hover:bg-portal-teal-600 transition-colors" style={{ height: '100%' }}></div>
              <p className="text-xs text-gray-600 mt-2">Mar</p>
              <p className="text-xs font-semibold text-gray-800">200</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-portal-teal-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
              <div>
                <p className="text-xs text-gray-600">Frontend</p>
                <p className="font-semibold text-green-700">Running</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
              <div>
                <p className="text-xs text-gray-600">Backend API</p>
                <p className="font-semibold text-green-700">Running</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
              <div>
                <p className="text-xs text-gray-600">Database</p>
                <p className="font-semibold text-green-700">Connected</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
              <div>
                <p className="text-xs text-gray-600">Active Records</p>
                <p className="font-semibold text-blue-700">{stats ? `${stats.students.total} students` : 'Loading...'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
