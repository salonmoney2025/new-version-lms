'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { DollarSign, Receipt, TrendingUp, Calendar,
  Building2, CheckCircle, Clock, ArrowUpRight, Download, Home } from 'lucide-react';
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface Payment {
  id: string;
  receiptNo: string;
  studentName: string;
  amount: number;
  paymentType: string;
  status: string;
  paymentDate: string;
}

interface PaymentByType {
  type: string;
  amount: number;
  count: number;
}

interface DailyRevenue {
  date: string;
  revenue: number;
  payments: number;
}

interface RecentPayment {
  id: string;
  receiptNo: string;
  studentName: string;
  amount: number;
  paymentType: string;
  paymentDate: string;
}

interface FinanceStats {
  today: {
    revenue: number;
    payments: number;
    pendingPayments: number;
  };
  thisMonth: {
    revenue: number;
    payments: number;
    growth: number;
  };
  recentPayments: RecentPayment[];
  paymentsByType: PaymentByType[];
  dailyRevenue: DailyRevenue[];
}

export default function FinanceDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<FinanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFinanceStats = useCallback(async () => {
    try {
      // Fetch payments data
      const paymentsResponse = await fetch('/api/payments');
      if (!paymentsResponse.ok) throw new Error('Failed to fetch payments');

      const payments = await paymentsResponse.json();

      // Calculate statistics
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayPayments = payments.filter((p: Payment) =>
        new Date(p.paymentDate) >= today
      );

      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthPayments = payments.filter((p: Payment) =>
        new Date(p.paymentDate) >= thisMonth
      );

      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      const lastMonthPayments = payments.filter((p: Payment) => {
        const date = new Date(p.paymentDate);
        return date >= lastMonth && date <= lastMonthEnd;
      });

      const todayRevenue = todayPayments.reduce((sum: number, p: Payment) => sum + p.amount, 0);
      const monthRevenue = monthPayments.reduce((sum: number, p: Payment) => sum + p.amount, 0);
      const lastMonthRevenue = lastMonthPayments.reduce((sum: number, p: Payment) => sum + p.amount, 0);

      const growth = lastMonthRevenue > 0
        ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

      // Payment types distribution
      const typeGroups = payments.reduce((acc: Record<string, number>, p: Payment) => {
        acc[p.paymentType] = (acc[p.paymentType] || 0) + p.amount;
        return acc;
      }, {});

      const paymentsByType = Object.entries(typeGroups).map(([type, amount]) => ({
        type,
        amount: amount as number,
        count: payments.filter((p: Payment) => p.paymentType === type).length
      }));

      // Daily revenue (last 7 days)
      const dailyRevenue = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const dayPayments = payments.filter((p: Payment) => {
          const pDate = new Date(p.paymentDate);
          return pDate >= date && pDate < nextDate;
        });

        dailyRevenue.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: dayPayments.reduce((sum: number, p: Payment) => sum + p.amount, 0),
          payments: dayPayments.length
        });
      }

      setStats({
        today: {
          revenue: todayRevenue,
          payments: todayPayments.length,
          pendingPayments: todayPayments.filter((p: Payment) => p.status === 'pending').length,
        },
        thisMonth: {
          revenue: monthRevenue,
          payments: monthPayments.length,
          growth,
        },
        recentPayments: payments.slice(0, 10),
        paymentsByType,
        dailyRevenue,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load finance statistics';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role !== 'FINANCE' && user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    fetchFinanceStats();
  }, [user, router, fetchFinanceStats]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SL', {
      style: 'currency',
      currency: 'SLE',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading finance dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Finance Dashboard</h1>
              <p className="mt-2 text-green-100">
                Financial operations and revenue tracking
              </p>
            
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center space-x-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Calendar className="inline h-4 w-4 mr-2" />
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Today's Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today&apos;s Revenue</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {formatCurrency(stats?.today.revenue || 0)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today&apos;s Payments</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats?.today.payments || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Receipt className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  {formatCurrency(stats?.thisMonth.revenue || 0)}
                </p>
                <p className={`text-xs mt-1 flex items-center ${
                  (stats?.thisMonth.growth || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {Math.abs(stats?.thisMonth.growth || 0).toFixed(1)}% vs last month
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {stats?.today.pendingPayments || 0}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Revenue Trend */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Revenue (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Types Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Payment Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.paymentsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {stats?.paymentsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => router.push('/receipt/generate')}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="bg-green-100 p-2 rounded-lg">
              <Receipt className="h-5 w-5 text-green-600" />
            </div>
            <span className="font-medium text-gray-900">Generate Receipt</span>
          </button>

          <button
            onClick={() => router.push('/receipt/verify')}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="bg-blue-100 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">Verify Payment</span>
          </button>

          <button
            onClick={() => router.push('/banks/manage-banks')}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="font-medium text-gray-900">Manage Banks</span>
          </button>

          <button
            onClick={() => router.push('/receipt/payment-records')}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="bg-purple-100 p-2 rounded-lg">
              <Download className="h-5 w-5 text-purple-600" />
            </div>
            <span className="font-medium text-gray-900">Payment Records</span>
          </button>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receipt No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats?.recentPayments.map((payment: RecentPayment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {payment.receiptNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                      <div className="text-sm text-gray-500">{payment.studentId}</div>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
