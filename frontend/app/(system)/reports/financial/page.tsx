'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { DollarSign, Download, Home } from 'lucide-react';
import Link from 'next/link';

export default function FinancialReportsPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-8 h-8 text-teal-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">FINANCIAL REPORTS</h1>
                <p className="text-sm text-gray-300">Financial analytics and reporting</p>
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
              <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">Le 245M</p>
              <p className="text-sm text-green-600 mt-2">↑ 15% from last month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Outstanding Fees</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">Le 42M</p>
              <p className="text-sm text-gray-600 mt-2">17% of total</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Transactions</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">2,456</p>
              <p className="text-sm text-gray-600 mt-2">This month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Collection Rate</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">83%</p>
              <p className="text-sm text-green-600 mt-2">↑ 3% improvement</p>
            </div>
          </div>

          {/* Report Filters */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-black mb-4">Report Period</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Report Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black">
                  <option>Summary</option>
                  <option>Detailed</option>
                  <option>Comparative</option>
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
              <h3 className="text-lg font-semibold text-black mb-2">Revenue Report</h3>
              <p className="text-sm text-gray-600 mb-4">
                Total revenue by payment type and period
              </p>
              <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Payment Analysis</h3>
              <p className="text-sm text-gray-600 mb-4">
                Payment methods, channels, and trends
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Outstanding Fees</h3>
              <p className="text-sm text-gray-600 mb-4">
                Unpaid fees by student, department, and level
              </p>
              <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Refund Report</h3>
              <p className="text-sm text-gray-600 mb-4">
                Refunds processed and pending approval
              </p>
              <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Bank Reconciliation</h3>
              <p className="text-sm text-gray-600 mb-4">
                Bank statements vs system records
              </p>
              <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Audit Trail</h3>
              <p className="text-sm text-gray-600 mb-4">
                Complete financial transaction history
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
