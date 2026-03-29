'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Calculator, Home, Download, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReconciliationPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calculator className="w-8 h-8 text-teal-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">RECONCILIATION</h1>
                <p className="text-sm text-gray-300">Financial reconciliation and audit</p>
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
              <h3 className="text-gray-600 text-sm font-medium">Total Transactions</h3>
              <p className="text-3xl font-bold text-black mt-2">2,456</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Reconciled</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">2,398</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Pending</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">58</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Discrepancies</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">5</p>
            </div>
          </div>

          {/* Reconciliation Period */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-black mb-4">Select Reconciliation Period</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black"
                />
              </div>
              <div className="flex items-end">
                <button className="w-full px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors">
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Auto-Reconcile</h3>
              <p className="text-sm text-gray-600 mb-4">
                Automatically match and reconcile transactions
              </p>
              <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors">
                Start Auto-Reconcile
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Export Report</h3>
              <p className="text-sm text-gray-600 mb-4">
                Download reconciliation report
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                Download Report
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">View Discrepancies</h3>
              <p className="text-sm text-gray-600 mb-4">
                Review unmatched transactions
              </p>
              <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors">
                View Issues
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-black mb-4">Reconciliation Summary</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Range
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transactions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No reconciliation reports available. Generate a report to get started.
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
