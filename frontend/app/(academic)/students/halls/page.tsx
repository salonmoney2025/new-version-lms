'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Home, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ManageHallsPage() {
  const halls = [
    { id: 1, name: 'King George Hall', capacity: 200, occupied: 180, gender: 'Male' },
    { id: 2, name: 'Queen Elizabeth Hall', capacity: 150, occupied: 145, gender: 'Female' },
    { id: 3, name: 'Peace Hall', capacity: 180, occupied: 160, gender: 'Male' },
    { id: 4, name: 'Unity Hall', capacity: 120, occupied: 100, gender: 'Female' },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Home className="w-8 h-8 text-teal-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">MANAGE HALLS</h1>
                <p className="text-sm text-gray-300">Student Accommodation Management</p>
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
              <h3 className="text-gray-600 text-sm font-medium">Total Halls</h3>
              <p className="text-3xl font-bold text-black mt-2">4</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Total Capacity</h3>
              <p className="text-3xl font-bold text-black mt-2">650</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Occupied</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">585</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Available</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">65</p>
            </div>
          </div>

          {/* Halls Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-black">Accommodation Halls</h2>
              <div className="flex space-x-3">
                <input
                  type="search"
                  placeholder="Search halls..."
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-teal-500"
                />
                <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Hall</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hall Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Occupied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Available
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Occupancy Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {halls.map((hall) => (
                    <tr key={hall.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                        {hall.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {hall.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {hall.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {hall.occupied}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {hall.capacity - hall.occupied}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {Math.round((hall.occupied / hall.capacity) * 100)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
