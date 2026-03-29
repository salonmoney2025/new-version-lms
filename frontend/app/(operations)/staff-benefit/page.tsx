'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Gift, Home, Plus, Users } from 'lucide-react';
import Link from 'next/link';

export default function StaffBenefitPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gift className="w-8 h-8 text-teal-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">STAFF BENEFIT</h1>
                <p className="text-sm text-gray-300">Manage staff benefits and allowances</p>
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
              <h3 className="text-gray-600 text-sm font-medium">Total Staff</h3>
              <p className="text-3xl font-bold text-black mt-2">156</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Monthly Benefits</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">Le 45M</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Active Benefits</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">8</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Pending Claims</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">12</p>
            </div>
          </div>

          {/* Benefits Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-black">Staff Benefits Overview</h2>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Benefit</span>
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Gift className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-black">Medical Allowance</h3>
                      <p className="text-sm text-gray-600">156 staff enrolled</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-black">Le 15,000,000</p>
                    <p className="text-sm text-gray-600">Monthly</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-black">Transport Allowance</h3>
                      <p className="text-sm text-gray-600">142 staff enrolled</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-black">Le 12,000,000</p>
                    <p className="text-sm text-gray-600">Monthly</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Gift className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-black">Housing Allowance</h3>
                      <p className="text-sm text-gray-600">89 staff enrolled</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-black">Le 18,000,000</p>
                    <p className="text-sm text-gray-600">Monthly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
