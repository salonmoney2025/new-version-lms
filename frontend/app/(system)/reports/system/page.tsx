'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Home, Settings, Download } from 'lucide-react';
import Link from 'next/link';

export default function SystemReportsPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-8 h-8 text-teal-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">SYSTEM REPORTS</h1>
                <p className="text-sm text-gray-300">System usage and performance analytics</p>
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
              <h3 className="text-gray-600 text-sm font-medium">Total Users</h3>
              <p className="text-3xl font-bold text-black mt-2">1,401</p>
              <p className="text-sm text-gray-600 mt-2">Active accounts</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Active Sessions</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">342</p>
              <p className="text-sm text-gray-600 mt-2">Currently online</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">System Uptime</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">99.8%</p>
              <p className="text-sm text-gray-600 mt-2">Last 30 days</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Avg Response Time</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">142ms</p>
              <p className="text-sm text-green-600 mt-2">↓ 12ms improvement</p>
            </div>
          </div>

          {/* Report Period */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-black mb-4">Report Period</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black"
                />
              </div>
              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded">
                  Apply Period
                </button>
              </div>
            </div>
          </div>

          {/* Report Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">User Activity Report</h3>
              <p className="text-sm text-gray-600 mb-4">
                User logins, sessions, and activity patterns
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Audit Log</h3>
              <p className="text-sm text-gray-600 mb-4">
                Complete system audit trail and changes
              </p>
              <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Performance Metrics</h3>
              <p className="text-sm text-gray-600 mb-4">
                System performance, load, and response times
              </p>
              <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Error Log</h3>
              <p className="text-sm text-gray-600 mb-4">
                System errors, warnings, and exceptions
              </p>
              <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Access Control</h3>
              <p className="text-sm text-gray-600 mb-4">
                User roles, permissions, and access levels
              </p>
              <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Database Statistics</h3>
              <p className="text-sm text-gray-600 mb-4">
                Database size, queries, and optimization
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
