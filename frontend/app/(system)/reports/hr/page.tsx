'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Download, Home, Users } from 'lucide-react';
import Link from 'next/link';

export default function HRReportsPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-teal-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">HR REPORTS</h1>
                <p className="text-sm text-gray-300">Human resources analytics and reporting</p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center space-x-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Total Staff</h3>
              <p className="text-3xl font-bold text-black mt-2">156</p>
              <p className="text-sm text-green-600 mt-2">↑ 8 new hires</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Faculty Members</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">89</p>
              <p className="text-sm text-gray-600 mt-2">57% of staff</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Admin Staff</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">67</p>
              <p className="text-sm text-gray-600 mt-2">43% of staff</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Avg Attendance</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">96.5%</p>
              <p className="text-sm text-gray-600 mt-2">This month</p>
            </div>
          </div>

          {/* Report Filters */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-black mb-4">Report Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Department
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black">
                  <option>All Departments</option>
                  <option>Faculty</option>
                  <option>Administration</option>
                  <option>IT Services</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Employment Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black">
                  <option>All Types</option>
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Period
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Quarter</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Report Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Staff Directory</h3>
              <p className="text-sm text-gray-600 mb-4">
                Complete staff listing with contact information
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Attendance Report</h3>
              <p className="text-sm text-gray-600 mb-4">
                Staff attendance and leave records
              </p>
              <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Payroll Report</h3>
              <p className="text-sm text-gray-600 mb-4">
                Salary and compensation breakdown
              </p>
              <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Performance Review</h3>
              <p className="text-sm text-gray-600 mb-4">
                Staff performance evaluations and ratings
              </p>
              <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Leave Management</h3>
              <p className="text-sm text-gray-600 mb-4">
                Leave requests, approvals, and balances
              </p>
              <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Training & Development</h3>
              <p className="text-sm text-gray-600 mb-4">
                Staff training programs and certifications
              </p>
              <button className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
