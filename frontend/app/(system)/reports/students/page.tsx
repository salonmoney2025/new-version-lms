'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Download, FileBarChart, Filter, Home } from 'lucide-react';
import Link from 'next/link';

export default function StudentReportsPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileBarChart className="w-8 h-8 text-teal-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">STUDENT REPORTS</h1>
                <p className="text-sm text-gray-300">Student analytics and reporting</p>
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
              <h3 className="text-gray-600 text-sm font-medium">Total Students</h3>
              <p className="text-3xl font-bold text-black mt-2">1,245</p>
              <p className="text-sm text-green-600 mt-2">↑ 12% from last year</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Active Students</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">1,180</p>
              <p className="text-sm text-gray-600 mt-2">94.8% of total</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Average GPA</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">3.42</p>
              <p className="text-sm text-green-600 mt-2">↑ 0.08 from last sem</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Attendance Rate</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">87.5%</p>
              <p className="text-sm text-gray-600 mt-2">This semester</p>
            </div>
          </div>

          {/* Report Filters */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-black mb-4">Report Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Academic Year
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black">
                  <option>2025/2026</option>
                  <option>2024/2025</option>
                  <option>2023/2024</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Department
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black">
                  <option>All Departments</option>
                  <option>Computer Science</option>
                  <option>Engineering</option>
                  <option>Mathematics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Level
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black">
                  <option>All Levels</option>
                  <option>100 Level</option>
                  <option>200 Level</option>
                  <option>300 Level</option>
                  <option>400 Level</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded flex items-center justify-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Apply Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Report Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Enrollment Report</h3>
              <p className="text-sm text-gray-600 mb-4">
                Student enrollment statistics by department and level
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Academic Performance</h3>
              <p className="text-sm text-gray-600 mb-4">
                GPA distribution and academic standing reports
              </p>
              <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Attendance Report</h3>
              <p className="text-sm text-gray-600 mb-4">
                Class attendance statistics and trends
              </p>
              <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Demographics Report</h3>
              <p className="text-sm text-gray-600 mb-4">
                Student demographics by region, gender, and age
              </p>
              <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Graduation Report</h3>
              <p className="text-sm text-gray-600 mb-4">
                Students eligible for graduation by program
              </p>
              <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">Custom Report</h3>
              <p className="text-sm text-gray-600 mb-4">
                Build custom student reports with selected metrics
              </p>
              <button className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Build Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
