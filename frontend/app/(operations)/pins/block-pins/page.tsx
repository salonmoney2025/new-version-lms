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
  Hash,
  Home,
  LayoutDashboard,
  Lock,
  RefreshCw,
  Search,
  Shield,
  Unlock,
  User
} from 'lucide-react';

interface Pin {
  id: string;
  pinNumber: string;
  serialNumber: string;
  batchNumber: string;
  type: 'Application' | 'Acceptance' | 'Registration' | 'Other';
  value: number;
  issuedDate: string;
  status: 'active' | 'used' | 'blocked' | 'expired';
  usedBy?: string;
  usedDate?: string;
  blockedBy?: string;
  blockedDate?: string;
  blockReason?: string;
}

export default function BlockPinsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [pins, setPins] = useState<Pin[]>([
    {
      id: '1',
      pinNumber: '1234-5678-9012-3456',
      serialNumber: 'SN-2025-0001',
      batchNumber: 'BATCH-001',
      type: 'Application',
      value: 50000,
      issuedDate: '2025-01-01',
      status: 'active'
    },
    {
      id: '2',
      pinNumber: '2345-6789-0123-4567',
      serialNumber: 'SN-2025-0002',
      batchNumber: 'BATCH-001',
      type: 'Application',
      value: 50000,
      issuedDate: '2025-01-01',
      status: 'used',
      usedBy: 'John Kamara',
      usedDate: '2025-01-15'
    },
    {
      id: '3',
      pinNumber: '3456-7890-1234-5678',
      serialNumber: 'SN-2025-0003',
      batchNumber: 'BATCH-001',
      type: 'Acceptance',
      value: 100000,
      issuedDate: '2025-01-05',
      status: 'blocked',
      blockedBy: 'Admin User',
      blockedDate: '2025-01-20',
      blockReason: 'Suspected fraud - duplicate usage attempt'
    },
    {
      id: '4',
      pinNumber: '4567-8901-2345-6789',
      serialNumber: 'SN-2025-0004',
      batchNumber: 'BATCH-002',
      type: 'Registration',
      value: 150000,
      issuedDate: '2025-01-10',
      status: 'active'
    },
    {
      id: '5',
      pinNumber: '5678-9012-3456-7890',
      serialNumber: 'SN-2025-0005',
      batchNumber: 'BATCH-002',
      type: 'Application',
      value: 50000,
      issuedDate: '2025-01-15',
      status: 'expired'
    }
  ]);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [blockReason, setBlockReason] = useState('');

  const handleRefresh = () => {
    console.log('Refreshing data...');
  };

  const handleBlockPin = (pin: Pin) => {
    setSelectedPin(pin);
    setShowBlockModal(true);
  };

  const handleConfirmBlock = () => {
    if (selectedPin && blockReason.trim()) {
      setPins(pins.map(pin =>
        pin.id === selectedPin.id
          ? {
              ...pin,
              status: 'blocked' as const,
              blockedBy: 'Admin User',
              blockedDate: new Date().toISOString().split('T')[0],
              blockReason
            }
          : pin
      ));

      alert(`PIN ${selectedPin.pinNumber} has been blocked successfully.\nReason: ${blockReason}`);
      setShowBlockModal(false);
      setSelectedPin(null);
      setBlockReason('');
    } else {
      alert('Please provide a reason for blocking this PIN.');
    }
  };

  const handleUnblockPin = (pin: Pin) => {
    if (confirm(`Are you sure you want to unblock PIN ${pin.pinNumber}?`)) {
      setPins(pins.map(p =>
        p.id === pin.id
          ? {
              ...p,
              status: 'active' as const,
              blockedBy: undefined,
              blockedDate: undefined,
              blockReason: undefined
            }
          : p
      ));
      alert(`PIN ${pin.pinNumber} has been unblocked successfully.`);
    }
  };

  const filteredPins = pins.filter(pin => {
    const matchesSearch = pin.pinNumber.includes(searchQuery) ||
                         pin.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pin.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || pin.type === filterType;
    const matchesStatus = filterStatus === 'all' || pin.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: pins.length,
    active: pins.filter(p => p.status === 'active').length,
    used: pins.filter(p => p.status === 'used').length,
    blocked: pins.filter(p => p.status === 'blocked').length,
    expired: pins.filter(p => p.status === 'expired').length
  };

  const getStatusBadge = (status: Pin['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3" />
            Active
          </span>
        );
      case 'used':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <CheckCircle className="h-3 w-3" />
            Used
          </span>
        );
      case 'blocked':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <Lock className="h-3 w-3" />
            Blocked
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <AlertTriangle className="h-3 w-3" />
            Expired
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
              <h1 className="text-3xl font-bold text-gray-800">Block PINs</h1>
              <p className="mt-2 text-base text-gray-600">
                Manage and block compromised or misused PINs
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
              <ExportMenu data={pins} filename="blocked-pins" />
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-100 uppercase tracking-wide">Total PINs</p>
                <p className="text-4xl font-bold mt-2">{stats.total}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Hash className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Active</p>
                <p className="text-4xl font-bold mt-2">{stats.active}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <CheckCircle className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Used</p>
                <p className="text-4xl font-bold mt-2">{stats.used}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <User className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-red-100 uppercase tracking-wide">Blocked</p>
                <p className="text-4xl font-bold mt-2">{stats.blocked}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Lock className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide">Expired</p>
                <p className="text-4xl font-bold mt-2">{stats.expired}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <AlertTriangle className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search PIN
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by PIN, serial, or batch..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
              >
                <option value="all">All Types</option>
                <option value="Application">Application</option>
                <option value="Acceptance">Acceptance</option>
                <option value="Registration">Registration</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="used">Used</option>
                <option value="blocked">Blocked</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* PINs Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 border-b-2 border-gray-400">
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    S/N
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    PIN Number
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Serial Number
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Value (Le)
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Used By
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPins.map((pin, index) => (
                  <tr key={pin.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-900">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm font-mono font-medium text-gray-900">{pin.pinNumber}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-600">{pin.serialNumber}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-900">{pin.type}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-900">{pin.value.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      {getStatusBadge(pin.status)}
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-600">{pin.usedBy || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {pin.status !== 'blocked' && (
                          <button
                            onClick={() => handleBlockPin(pin)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                          >
                            <Lock className="h-4 w-4" />
                            Block
                          </button>
                        )}
                        {pin.status === 'blocked' && (
                          <button
                            onClick={() => handleUnblockPin(pin)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                          >
                            <Unlock className="h-4 w-4" />
                            Unblock
                          </button>
                        )}
                        {pin.blockReason && (
                          <button
                            onClick={() => alert(`Block Reason: ${pin.blockReason}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Block Reason"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPins.length === 0 && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No PINs found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Block Confirmation Modal */}
        {showBlockModal && selectedPin && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowBlockModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6" />
                    <h2 className="text-2xl font-bold">Block PIN</h2>
                  </div>
                  <button
                    onClick={() => setShowBlockModal(false)}
                    className="p-2 hover:bg-white hover:bg-opacity-10 rounded transition-colors"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-red-800">
                      You are about to block PIN <strong className="font-mono">{selectedPin.pinNumber}</strong>.
                      This action will prevent the PIN from being used for any transactions.
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Serial Number</p>
                        <p className="text-sm text-gray-900">{selectedPin.serialNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Type</p>
                        <p className="text-sm text-gray-900">{selectedPin.type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Value</p>
                        <p className="text-sm text-gray-900">Le {selectedPin.value.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Current Status</p>
                        <div className="mt-1">{getStatusBadge(selectedPin.status)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Blocking <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      placeholder="Please provide a detailed reason for blocking this PIN (e.g., suspected fraud, duplicate usage, lost/stolen, etc.)..."
                      rows={4}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
                  <button
                    onClick={() => setShowBlockModal(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBlock}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Lock className="h-4 w-4" />
                    Confirm Block
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
