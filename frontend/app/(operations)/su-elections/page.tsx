'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { BarChart3, Home, Settings, UserPlus, Vote } from 'lucide-react';
import Link from 'next/link';

export default function SUElectionsPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Vote className="w-8 h-8 text-teal-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">STUDENT UNION ELECTIONS</h1>
                <p className="text-sm text-gray-300">Manage student union elections and voting</p>
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
              <h3 className="text-gray-600 text-sm font-medium">Total Voters</h3>
              <p className="text-3xl font-bold text-black mt-2">1,245</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Votes Cast</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">842</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Candidates</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Turnout</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">67.6%</p>
            </div>
          </div>

          {/* Election Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Register Candidates</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add and manage election candidates
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                Manage Candidates
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Vote className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Start Voting</h3>
              <p className="text-sm text-gray-600 mb-4">
                Open or close voting sessions
              </p>
              <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors">
                Manage Voting
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">View Results</h3>
              <p className="text-sm text-gray-600 mb-4">
                Real-time voting results and analytics
              </p>
              <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors">
                View Results
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Election Settings</h3>
              <p className="text-sm text-gray-600 mb-4">
                Configure election parameters
              </p>
              <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors">
                Configure
              </button>
            </div>
          </div>

          {/* Positions */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-black mb-4">Election Positions</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
                <div>
                  <h3 className="font-medium text-black">President</h3>
                  <p className="text-sm text-gray-600">4 candidates registered</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
                <div>
                  <h3 className="font-medium text-black">Vice President</h3>
                  <p className="text-sm text-gray-600">3 candidates registered</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
                <div>
                  <h3 className="font-medium text-black">Secretary General</h3>
                  <p className="text-sm text-gray-600">5 candidates registered</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
