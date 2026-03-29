'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { GraduationCap, Home, CheckCircle, Download, Users } from 'lucide-react';
import Link from 'next/link';

export default function GraduationPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-teal-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">GRADUATION</h1>
                <p className="text-sm text-gray-300">Manage graduation and commencement ceremonies</p>
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
              <h3 className="text-gray-600 text-sm font-medium">Eligible Graduates</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">342</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Pending Verification</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">28</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Certificates Ready</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">298</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Graduation Date</h3>
              <p className="text-lg font-bold text-black mt-2">May 15, 2026</p>
            </div>
          </div>

          {/* Graduation Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Verify Graduates</h3>
              <p className="text-sm text-gray-600 mb-4">
                Review and verify students eligible for graduation
              </p>
              <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors">
                View Eligible Students
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Download className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Generate Certificates</h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate and download graduation certificates
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                Generate Certificates
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Seating Arrangement</h3>
              <p className="text-sm text-gray-600 mb-4">
                Manage ceremony seating and attendance
              </p>
              <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors">
                Arrange Seating
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Graduation List</h3>
              <p className="text-sm text-gray-600 mb-4">
                Download complete graduation list
              </p>
              <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download List</span>
              </button>
            </div>
          </div>

          {/* Graduation Calendar */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-black mb-4">Graduation Schedule</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
                <div>
                  <h3 className="font-medium text-black">Certificate Verification Deadline</h3>
                  <p className="text-sm text-gray-600">Final deadline for verifying graduate records</p>
                </div>
                <p className="font-semibold text-black">May 1, 2026</p>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
                <div>
                  <h3 className="font-medium text-black">Rehearsal Date</h3>
                  <p className="text-sm text-gray-600">Graduation ceremony rehearsal</p>
                </div>
                <p className="font-semibold text-black">May 13, 2026</p>
              </div>
              <div className="flex items-center justify-between p-4 border-2 border-teal-500 bg-teal-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-black">Graduation Ceremony</h3>
                  <p className="text-sm text-gray-600">Main commencement ceremony</p>
                </div>
                <p className="font-semibold text-teal-700">May 15, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
