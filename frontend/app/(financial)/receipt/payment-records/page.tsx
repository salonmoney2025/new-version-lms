'use client';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Loader2, Home } from 'lucide-react';
import Link from 'next/link';

export default function PaymentRecordsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const params = searchTerm ? new URLSearchParams({ search: searchTerm }) : '';
      const response = await fetch(`/api/payments?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setPayments(data);
    } catch {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Payment Records</h1>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-6"
        />
        {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : (
          <div>
            {payments.map((p) => (
              <div key={p.id} className="p-4 mb-4 bg-white rounded-lg shadow">
                <p>{p.receiptNo} - {p.studentName} - SLE {p.amount}</p>
              
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center space-x-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
