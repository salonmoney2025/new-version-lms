'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { List, Home, Download, Printer } from 'lucide-react';
import Link from 'next/link';

export default function GenerateClassListPage() {
  const [formData, setFormData] = useState({
    academicYear: '',
    semester: '',
    level: '',
    department: '',
    course: '',
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <List className="w-8 h-8 text-teal-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">GENERATE CLASS LIST</h1>
                <p className="text-sm text-gray-300">Create class lists for courses</p>
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

        {/* Form */}
        <div className="px-6 py-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-black mb-6">Class List Generator</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Academic Year */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Academic Year <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black"
                >
                  <option value="">--Select Academic Year--</option>
                  <option>2024/2025</option>
                  <option>2025/2026</option>
                  <option>2026/2027</option>
                </select>
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Semester <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black"
                >
                  <option value="">--Select Semester--</option>
                  <option>First Semester</option>
                  <option>Second Semester</option>
                </select>
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Level <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black"
                >
                  <option value="">--Select Level--</option>
                  <option>100 Level</option>
                  <option>200 Level</option>
                  <option>300 Level</option>
                  <option>400 Level</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Department <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black"
                >
                  <option value="">--Select Department--</option>
                  <option>Computer Science</option>
                  <option>Electrical Engineering</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Economics</option>
                </select>
              </div>

              {/* Course */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Course (Optional)
                </label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black"
                >
                  <option value="">--All Courses--</option>
                  <option>CS101 - Introduction to Computer Science</option>
                  <option>CS201 - Data Structures</option>
                  <option>MATH101 - Calculus I</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded flex items-center space-x-2 transition-colors">
                <List className="w-5 h-5" />
                <span>Generate List</span>
              </button>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded flex items-center space-x-2 transition-colors">
                <Download className="w-5 h-5" />
                <span>Export to Excel</span>
              </button>
              <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded flex items-center space-x-2 transition-colors">
                <Printer className="w-5 h-5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="mt-6 bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-black mb-4">Class List Preview</h3>
            <div className="text-center py-12 text-gray-500">
              Select filters and click &quot;Generate List&quot; to view class list
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
