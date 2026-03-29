'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { DollarSign, Receipt, Download, User, LifeBuoy,
  Bell, Calendar, FileText, CreditCard, Home } from 'lucide-react';
import { generateReceiptPDF } from '@/lib/pdf-generator';
import Link from 'next/link';

interface Payment {
  id: string;
  receiptNo: string;
  paymentType: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  status: string;
  transactionRef?: string;
  bank?: {
    bankName: string;
  };
}

interface StudentStats {
  totalPaid: number;
  paymentsCount: number;
  lastPaymentDate?: string;
  recentPayments: Payment[];
}

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudentStats = useCallback(async () => {
    try {
      const response = await fetch('/api/payments');
      if (!response.ok) {
        throw new Error('Failed to fetch payment data');
      }
      const payments: Payment[] = await response.json();

      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
      const lastPayment = payments[0];

      setStats({
        totalPaid,
        paymentsCount: payments.length,
        lastPaymentDate: lastPayment?.paymentDate,
        recentPayments: payments.slice(0, 5),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load dashboard';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role !== 'STUDENT') {
      router.push('/dashboard');
      return;
    }
    fetchStudentStats();
  }, [user, router, fetchStudentStats]);

  const handleDownloadReceipt = async (payment: Payment) => {
    try {
      generateReceiptPDF({
        receiptNo: payment.receiptNo,
        studentName: user?.name || '',
        studentId: user?.studentId || '',
        amount: payment.amount,
        paymentType: payment.paymentType,
        paymentMethod: payment.paymentMethod,
        paymentDate: new Date(payment.paymentDate),
        transactionRef: payment.transactionRef,
        bankName: payment.bank?.bankName,
      });
      toast.success('Receipt downloaded successfully!');
    } catch {
      toast.error('Failed to download receipt');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SL', {
      style: 'currency',
      currency: 'SLE',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
              <p className="mt-2 text-indigo-100">
                Student ID: {user?.studentId}
              </p>
              {user?.department && (
                <p className="text-indigo-100">
                  Department: {user.department}
                </p>
              )}
            
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center space-x-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Calendar className="inline h-4 w-4 mr-2" />
                {new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Paid */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatCurrency(stats?.totalPaid || 0)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Payments */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.paymentsCount || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Receipt className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Last Payment */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Payment</p>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  {stats?.lastPaymentDate
                    ? new Date(stats.lastPaymentDate).toLocaleDateString()
                    : 'No payments yet'}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => router.push('/student/payments')}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="bg-indigo-100 p-2 rounded-lg">
              <CreditCard className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="font-medium text-gray-900">View All Payments</span>
          </button>

          <button
            onClick={() => router.push('/student/profile')}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">My Profile</span>
          </button>

          <button
            onClick={() => router.push('/helpdesk/submit')}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="bg-green-100 p-2 rounded-lg">
              <LifeBuoy className="h-5 w-5 text-green-600" />
            </div>
            <span className="font-medium text-gray-900">Get Support</span>
          </button>

          <button
            onClick={() => router.push('/student/notifications')}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="bg-orange-100 p-2 rounded-lg">
              <Bell className="h-5 w-5 text-orange-600" />
            </div>
            <span className="font-medium text-gray-900">Notifications</span>
          </button>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
            <button
              onClick={() => router.push('/student/payments')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All
            </button>
          </div>

          {stats?.recentPayments && stats.recentPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                        {payment.receiptNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.paymentType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDownloadReceipt(payment)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Receipt className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payments yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your payment history will appear here once you make a payment.
              </p>
            </div>
          )}
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              Account Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Name:</span>
                <span className="text-sm font-medium text-gray-900">{user?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium text-gray-900">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Student ID:</span>
                <span className="text-sm font-medium text-gray-900">{user?.studentId}</span>
              </div>
              {user?.department && (
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Department:</span>
                  <span className="text-sm font-medium text-gray-900">{user.department}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => router.push('/student/profile')}
              className="mt-4 w-full bg-indigo-50 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm"
            >
              Edit Profile
            </button>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              Quick Links
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/student/payments')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <span className="text-sm font-medium text-gray-700">Payment History</span>
                <span className="text-xs text-gray-500">{stats?.paymentsCount || 0} payments</span>
              </button>
              <button
                onClick={() => router.push('/helpdesk/my-tickets')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <span className="text-sm font-medium text-gray-700">My Support Tickets</span>
                <span className="text-xs text-gray-500">View all</span>
              </button>
              <button
                onClick={() => router.push('/student/profile')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <span className="text-sm font-medium text-gray-700">Account Settings</span>
                <span className="text-xs text-gray-500">Update</span>
              </button>
              <button
                onClick={() => router.push('/helpdesk/submit')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <span className="text-sm font-medium text-gray-700">Submit New Ticket</span>
                <span className="text-xs text-indigo-600">Create</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
