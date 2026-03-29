'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { BadgeCheck, Home } from 'lucide-react';
import Link from 'next/link';

export default function StaffIDCardsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <BadgeCheck className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-black">Staff ID Cards</h1>
            <p className="text-sm text-gray-600">Manage staff identification cards</p>
          
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center space-x-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-600">Total Cards</h3>
            <p className="text-3xl font-bold text-black mt-2">156</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-600">Active</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">148</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-600">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">5</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-600">Expired</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">3</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Staff ID Card Management</h2>
          <p className="text-gray-600">Generate and manage staff identification cards</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
