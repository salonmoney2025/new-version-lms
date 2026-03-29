'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  FileText,
  Home,
  LayoutDashboard,
  RefreshCw,
  RotateCcw,
  Search,
  XCircle
} from 'lucide-react';

interface Application {
  id: string;
  applicationId: string;
  studentName: string;
  program: string;
  faculty: string;
  campus: string;
  email: string;
  phone: string;
  applicationDate: string;
  status: 'submitted' | 'in-review' | 'approved' | 'rejected';
  canReset: boolean;
}

export default function ResetApplicationPage() {
  const router = useRouter();
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState<Application[]>([
    {
      id: '1',
      applicationId: 'APP-2025-001',
      studentName: 'John Kamara',
      program: 'Computer Science',
      faculty: 'Engineering',
      campus: 'Main Campus',
      email: 'john.kamara@example.com',
      phone: '+232 76 123 456',
      applicationDate: '2025-01-15',
      status: 'submitted',
      canReset: true
    },
    {
      id: '2',
      applicationId: 'APP-2025-002',
      studentName: 'Fatmata Sesay',
      program: 'Business Administration',
      faculty: 'Business',
      campus: 'Bo Campus',
      email: 'fatmata.sesay@example.com',
      phone: '+232 77 234 567',
      applicationDate: '2025-01-18',
      status: 'approved',
      canReset: false
    },
    {
      id: '3',
      applicationId: 'APP-2025-003',
      studentName: 'Mohamed Bangura',
      program: 'Civil Engineering',
      faculty: 'Engineering',
      campus: 'Main Campus',
      email: 'mohamed.bangura@example.com',
      phone: '+232 78 345 678',
      applicationDate: '2025-01-20',
      status: 'rejected',
      canReset: true
    },
    {
      id: '4',
      applicationId: 'APP-2025-004',
      studentName: 'Aminata Koroma',
      program: 'Medicine',
      faculty: 'Medical Sciences',
      campus: 'Makeni Campus',
      email: 'aminata.koroma@example.com',
      phone: '+232 79 456 789',
      applicationDate: '2025-01-22',
      status: 'in-review',
      canReset: true
    }
  ]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [resetReason, setResetReason] = useState('');

  const handleRefresh = () => {
    console.log('Refreshing data...');
  };

  const handleResetRequest = (application: Application) => {
    setSelectedApplication(application);
    setShowConfirmModal(true);
  };

  const handleConfirmReset = () => {
    if (selectedApplication && resetReason.trim()) {
      // Update the application status
      setApplications(applications.map(app =>
        app.id === selectedApplication.id
          ? { ...app, status: 'submitted' as const }
          : app
      ));

      alert(`Application ${selectedApplication.applicationId} has been reset successfully.\nReason: ${resetReason}`);
      setShowConfirmModal(false);
      setSelectedApplication(null);
      setResetReason('');
    } else {
      alert('Please provide a reason for resetting this application.');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.applicationId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCampus = selectedCampus === 'all' || app.campus === selectedCampus;
    return matchesSearch && matchesCampus;
  });

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <FileText className="h-3 w-3" />
            Submitted
          </span>
        );
      case 'in-review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Eye className="h-3 w-3" />
            In Review
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Action Buttons Bar */}
        <div className="bg-white border-b border-gray-300 px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium transition-colors"
            >
              <Home className="h-4 w-4" />
              HOME
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              DASHBOARD
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-medium transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              REFRESH
            </button>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-portal-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Reset Application</h1>
              <p className="mt-2 text-base text-gray-600">
                Reset submitted applications to allow students to make corrections
              </p>
            
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center space-x-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
            <div className="flex gap-3">
              <ExportMenu data={applications} filename="reset-applications" />
            </div>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-bold text-yellow-900">Important Notice</h3>
              <p className="text-sm text-yellow-800 mt-1">
                Resetting an application will allow the student to modify their submitted information.
                Approved applications cannot be reset. Please ensure you have authorization before proceeding.
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campus Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Campus
              </label>
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
              >
                <option value="all">All Campuses</option>
                <option value="Main Campus">Main Campus</option>
                <option value="Bo Campus">Bo Campus</option>
                <option value="Makeni Campus">Makeni Campus</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Application
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or application ID..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 border-b-2 border-gray-400">
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    S/N
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Application ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Campus
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Application Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((app, index) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-900">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-900">{app.applicationId}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-900">{app.studentName}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-600">{app.program}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-600">{app.campus}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-600">
                        {new Date(app.applicationDate).toLocaleDateString('en-GB')}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResetRequest(app)}
                          disabled={!app.canReset}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            app.canReset
                              ? 'bg-orange-600 hover:bg-orange-700 text-white'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                          title={app.canReset ? 'Reset Application' : 'Cannot reset approved applications'}
                        >
                          <RotateCcw className="h-4 w-4" />
                          Reset
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No applications found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && selectedApplication && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowConfirmModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6" />
                    <h2 className="text-2xl font-bold">Confirm Application Reset</h2>
                  </div>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="p-2 hover:bg-white hover:bg-opacity-10 rounded transition-colors"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                      You are about to reset the application for <strong>{selectedApplication.studentName}</strong>.
                      This will allow the student to modify their submitted information.
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Application ID</p>
                        <p className="text-sm text-gray-900">{selectedApplication.applicationId}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Current Status</p>
                        <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Program</p>
                        <p className="text-sm text-gray-900">{selectedApplication.program}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Campus</p>
                        <p className="text-sm text-gray-900">{selectedApplication.campus}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Reset <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={resetReason}
                      onChange={(e) => setResetReason(e.target.value)}
                      placeholder="Please provide a detailed reason for resetting this application..."
                      rows={4}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReset}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Confirm Reset
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
