'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Folders, Home, Upload, Download, FileText, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function FilesManagementPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Folders className="w-8 h-8 text-teal-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">FILES MANAGEMENT</h1>
                <p className="text-sm text-gray-300">Document and file management system</p>
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
              <h3 className="text-gray-600 text-sm font-medium">Total Files</h3>
              <p className="text-3xl font-bold text-black mt-2">1,245</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Storage Used</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">24.5 GB</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Folders</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">48</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Shared Files</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">127</p>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-black mb-4">Upload Files</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">Drag and drop files here or click to browse</p>
              <button className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors">
                Select Files
              </button>
            </div>
          </div>

          {/* Files Grid */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-black">Recent Files</h2>
              <input
                type="search"
                placeholder="Search files..."
                className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 text-black"
              />
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((file) => (
                  <div key={file} className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <button className="text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-medium text-black mb-1">Document_{file}.pdf</h3>
                    <p className="text-sm text-gray-600 mb-3">2.4 MB • 2 days ago</p>
                    <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center justify-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
