'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Key, Home, Search, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface StudentInfo {
  id: string;
  name: string;
  email: string;
  level: string;
  department: string;
  program?: string;
}

export default function ResetStudentPasswordPage() {
  const [studentId, setStudentId] = useState('');
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSearch = () => {
    // Mock student search
    if (studentId) {
      setStudentInfo({
        id: studentId,
        name: 'John Doe',
        email: 'john.doe@ebkust.edu.sl',
        level: '200 Level',
        department: 'Computer Science',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Key className="w-8 h-8 text-teal-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">RESET STUDENT PASSWORD</h1>
                <p className="text-sm text-gray-300">Reset student account passwords</p>
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

        {/* Search Student */}
        <div className="px-6 py-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-black mb-4">Find Student</h2>
            <div className="flex space-x-3">
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter Student ID or Email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded flex items-center space-x-2 transition-colors"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Student Info & Password Reset */}
          {studentInfo && (
            <>
              {/* Student Information */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-black mb-4">Student Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Student ID</p>
                    <p className="text-black font-medium">{studentInfo.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="text-black font-medium">{studentInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-black font-medium">{studentInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Level</p>
                    <p className="text-black font-medium">{studentInfo.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="text-black font-medium">{studentInfo.department}</p>
                  </div>
                </div>
              </div>

              {/* Password Reset Form */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-black mb-4">Reset Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      New Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Confirm Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded flex items-center space-x-2 transition-colors">
                    <RefreshCw className="w-5 h-5" />
                    <span>Reset Password</span>
                  </button>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> The student will be notified via email about the password change.
                    Make sure to provide a strong password.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
