'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { RefreshCw, Home, Search, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ManageReversalsPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-8 h-8 text-teal-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">MANAGE REVERSALS</h1>
                <p className="text-sm text-gray-300">Manage payment and transaction reversals</p>
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
              <h3 className="text-gray-600 text-sm font-medium">Pending Reversals</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">8</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Processed Today</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">5</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Total This Month</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">42</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Amount Reversed</h3>
              <p className="text-3xl font-bold text-black mt-2">Le 8.5M</p>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-black mb-4">Search Transaction</h2>
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Enter Transaction ID or Receipt Number"
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black"
              />
              <button className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded flex items-center space-x-2 transition-colors">
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Pending Reversals */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-black">Pending Reversal Requests</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No pending reversal requests</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
