'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FileUpload from '@/components/FileUpload';
import { RefreshCw, Home, Upload, Download, CheckCircle, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface BatchTransfer {
  id: string;
  type: string;
  records: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  fileName?: string;
}

export default function BatchTransferPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transfers, setTransfers] = useState<BatchTransfer[]>([]);
  const [fromDepartment, setFromDepartment] = useState('');
  const [toDepartment, setToDepartment] = useState('');
  const [level, setLevel] = useState('');

  const departments = [
    'Computer Science',
    'Engineering',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Business Administration',
    'Economics',
  ];

  const levels = ['100 Level', '200 Level', '300 Level', '400 Level'];

  const handleFileUpload = (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    const newTransfer: BatchTransfer = {
      id: `BATCH-${Date.now()}`,
      type: 'CSV Upload',
      records: Math.floor(Math.random() * 100) + 1,
      date: new Date().toISOString(),
      status: 'completed',
      fileName: file.name,
    };

    setTransfers((prev) => [newTransfer, ...prev]);
    toast.success(`Successfully uploaded ${file.name}`);
    setShowUploadModal(false);
  };

  const handleTransfer = () => {
    if (!fromDepartment || !toDepartment || !level) {
      toast.error('Please fill all fields');
      return;
    }

    if (fromDepartment === toDepartment) {
      toast.error('Source and destination departments must be different');
      return;
    }

    const newTransfer: BatchTransfer = {
      id: `BATCH-${Date.now()}`,
      type: 'Department Transfer',
      records: Math.floor(Math.random() * 50) + 1,
      date: new Date().toISOString(),
      status: 'completed',
    };

    setTransfers((prev) => [newTransfer, ...prev]);
    toast.success(`Transferred students from ${fromDepartment} to ${toDepartment}`);
    setShowTransferModal(false);
    setFromDepartment('');
    setToDepartment('');
    setLevel('');
  };

  const handleDownloadTemplate = (templateType: 'student-upload' | 'student-transfer') => {
    let csvData: string[][] = [];
    let filename = '';

    if (templateType === 'student-upload') {
      // Template for bulk student upload
      csvData = [
        [
          'Student ID',
          'First Name',
          'Last Name',
          'Email',
          'Phone',
          'Date of Birth',
          'Gender',
          'Department',
          'Faculty',
          'Program',
          'Level',
          'Academic Year',
          'Entry Mode',
          'Status',
        ],
        [
          'STU-2026-001',
          'Mohamed',
          'Kamara',
          'mkamara@example.com',
          '+23276123456',
          '2005-01-15',
          'Male',
          'Computer Science',
          'Faculty of Engineering',
          'BSc Computer Science',
          '100 Level',
          '2025/2026',
          'WASSCE',
          'Active',
        ],
        [
          'STU-2026-002',
          'Fatmata',
          'Sesay',
          'fsesay@example.com',
          '+23277234567',
          '2004-08-22',
          'Female',
          'Mathematics',
          'Faculty of Basic Sciences',
          'BSc Mathematics',
          '200 Level',
          '2024/2025',
          'A-Level',
          'Active',
        ],
        [
          'STU-2026-003',
          'Ibrahim',
          'Bangura',
          'ibangura@example.com',
          '+23278345678',
          '2005-03-10',
          'Male',
          'Business Management',
          'Faculty of Business Administration',
          'BSc Business Management',
          '100 Level',
          '2025/2026',
          'WASSCE',
          'Active',
        ],
      ];
      filename = 'student-upload-template.csv';
    } else if (templateType === 'student-transfer') {
      // Template for department transfer
      csvData = [
        [
          'Student ID',
          'Current Department',
          'Current Faculty',
          'Target Department',
          'Target Faculty',
          'Level',
          'Reason',
        ],
        [
          'STU-2026-001',
          'Computer Science',
          'Faculty of Engineering',
          'Mathematics',
          'Faculty of Basic Sciences',
          '200 Level',
          'Change of interest',
        ],
        [
          'STU-2026-002',
          'Physics',
          'Faculty of Basic Sciences',
          'Computer Science',
          'Faculty of Engineering',
          '100 Level',
          'Academic progression',
        ],
      ];
      filename = 'student-transfer-template.csv';
    }

    const csvContent = csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);

    toast.success(`Template downloaded: ${filename}`);
  };

  const handleExportCSV = () => {
    // Create sample CSV data for export
    const csvData = [
      ['Student ID', 'Name', 'Department', 'Faculty', 'Level', 'Status', 'Email', 'Phone'],
      [
        'STU-001',
        'John Doe',
        'Computer Science',
        'Faculty of Engineering',
        '200 Level',
        'Active',
        'jdoe@example.com',
        '+23276123456',
      ],
      [
        'STU-002',
        'Jane Smith',
        'Mathematics',
        'Faculty of Basic Sciences',
        '300 Level',
        'Active',
        'jsmith@example.com',
        '+23277234567',
      ],
      [
        'STU-003',
        'Bob Johnson',
        'Business Management',
        'Faculty of Business Administration',
        '100 Level',
        'Active',
        'bjohnson@example.com',
        '+23278345678',
      ],
    ];

    const csvContent = csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `students-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast.success('Student data exported successfully');
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-8 h-8 text-teal-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">BATCH TRANSFER</h1>
                <p className="text-sm text-gray-300">Bulk student and data transfer operations</p>
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
              <h3 className="text-gray-600 text-sm font-medium">Total Transfers</h3>
              <p className="text-3xl font-bold text-black mt-2">{transfers.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Pending</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {transfers.filter((t) => t.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Completed</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {transfers.filter((t) => t.status === 'completed').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-600 text-sm font-medium">Failed</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {transfers.filter((t) => t.status === 'failed').length}
              </p>
            </div>
          </div>

          {/* Transfer Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Upload CSV</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload student data via CSV file
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Upload File
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Transfer Students</h3>
              <p className="text-sm text-gray-600 mb-4">
                Transfer students between departments
              </p>
              <button
                onClick={() => setShowTransferModal(true)}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                Start Transfer
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Export Data</h3>
              <p className="text-sm text-gray-600 mb-4">
                Download student data to CSV
              </p>
              <button
                onClick={handleExportCSV}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
              >
                Export CSV
              </button>
            </div>
          </div>

          {/* Recent Transfers */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-black">Recent Batch Transfers</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Records
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transfers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No batch transfers found
                      </td>
                    </tr>
                  ) : (
                    transfers.map((transfer) => (
                      <tr key={transfer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transfer.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transfer.type}
                          {transfer.fileName && (
                            <div className="text-xs text-gray-500">{transfer.fileName}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transfer.records}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transfer.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                              transfer.status
                            )}`}
                          >
                            {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Upload Student Data CSV</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="px-6 py-4">
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-2">CSV Format Requirements:</p>
                      <ul className="list-disc list-inside space-y-1 mb-3">
                        <li>First row must contain column headers</li>
                        <li>
                          Required columns: Student ID, First Name, Last Name, Email, Department,
                          Faculty, Level
                        </li>
                        <li>File size must be less than 10MB</li>
                        <li>Maximum 1000 records per upload</li>
                        <li>Use proper date format: YYYY-MM-DD</li>
                        <li>Phone format: +232XXXXXXXXX</li>
                      </ul>
                      <p className="font-semibold text-blue-900">
                        📥 Download the official template to ensure correct formatting
                      </p>
                    </div>
                  </div>
                </div>

                {/* Template Downloads */}
                <div className="mb-6 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                    <Download className="w-5 h-5 mr-2" />
                    Official CSV Templates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={() => handleDownloadTemplate('student-upload')}
                      className="flex items-center justify-between px-4 py-3 bg-white border border-green-300 rounded-lg hover:bg-green-50 transition-colors group"
                    >
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Student Upload Template</p>
                        <p className="text-xs text-gray-600">For bulk student registration</p>
                      </div>
                      <Download className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                    </button>

                    <button
                      onClick={() => handleDownloadTemplate('student-transfer')}
                      className="flex items-center justify-between px-4 py-3 bg-white border border-teal-300 rounded-lg hover:bg-teal-50 transition-colors group"
                    >
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Transfer Template</p>
                        <p className="text-xs text-gray-600">For department transfers</p>
                      </div>
                      <Download className="w-5 h-5 text-teal-600 group-hover:text-teal-700" />
                    </button>
                  </div>
                </div>

                <FileUpload
                  maxSize={10}
                  acceptedTypes={['.csv', 'text/csv']}
                  multiple={false}
                  onUpload={handleFileUpload}
                />
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  💡 <span className="font-medium">Pro Tip:</span> Download a template first to
                  ensure proper data formatting
                </p>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Modal */}
        {showTransferModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Transfer Students</h2>
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-semibold mb-1">Transfer Options:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Manual transfer (use form below)</li>
                        <li>
                          Bulk transfer via CSV (
                          <button
                            onClick={() => {
                              handleDownloadTemplate('student-transfer');
                              setShowTransferModal(false);
                              setShowUploadModal(true);
                            }}
                            className="text-amber-900 underline font-medium hover:text-amber-700"
                          >
                            download template
                          </button>
                          )
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Department
                  </label>
                  <select
                    value={fromDepartment}
                    onChange={(e) => setFromDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Department
                  </label>
                  <select
                    value={toDepartment}
                    onChange={(e) => setToDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select level</option>
                    {levels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  Transfer Students
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
