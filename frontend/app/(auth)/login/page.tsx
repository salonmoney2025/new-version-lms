'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { GraduationCap, Loader2 } from 'lucide-react';
import { storeTokens } from '@/lib/auth-utils';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword] = useState(false);

  // Show session expired message if redirected due to 401
  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      toast.error('Your session has expired. Please login again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store Django tokens using centralized utility
      if (data.djangoTokens) {
        storeTokens(data.djangoTokens.access, data.djangoTokens.refresh);
      } else {
        console.warn('[Login] No Django tokens received - API calls may fail');
      }

      // Store user role for redirect
      const userRole = data.user.role;

      // Show success message
      toast.success(`Welcome back, ${data.user.name}!`);

      // Use redirect param if present, otherwise redirect based on role
      const redirectTo = searchParams.get('redirect');
      let targetUrl = '/dashboard';

      if (redirectTo) {
        targetUrl = redirectTo;
      } else if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
        targetUrl = '/dashboard';
      } else if (userRole === 'FINANCE' || userRole === 'STAFF') {
        targetUrl = '/receipt/generate';
      } else if (userRole === 'STUDENT') {
        targetUrl = '/student-portal/dashboard';
      }

      // Force immediate redirect using router.push instead of window.location
      console.log('Redirecting to:', targetUrl);
      router.push(targetUrl);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to login';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="max-w-md w-full">
        <div className="bg-white border-2 border-solid black-200 rounded-lg shadow-lg p-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-portal-teal-500 flex items-center justify-center shadow-lg">
                <GraduationCap className="h-14 w-14 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-black">EBKUST</h1>
            <p className="mt-2 text-sm text-black">
              Ernest Bai Koroma University of Science and Technology
            </p>
            <div className="mt-4 h-1 w-16 bg-portal-teal-500 mx-auto"></div>
            <p className="mt-4 text-lg font-semibold text-black">
              University Portal Login
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
                Username
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="username"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-4 py-3 border-2 border-solid black-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500 focus:border-portal-teal-500 transition-colors text-black"
                placeholder="Enter Username"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-black mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-4 py-3 border-2 border-solid black-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500 focus:border-portal-teal-500 transition-colors text-black"
                placeholder="******"
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm font-medium text-portal-teal-600 hover:text-portal-teal-700 transition-colors">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded text-base font-semibold text-white bg-portal-teal-600 hover:bg-portal-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-portal-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="text-center pt-4 border-t border-solid black-200">
            <p className="text-sm text-black">
              Need help?{' '}
              <Link href="/support" className="font-medium text-portal-teal-600 hover:text-portal-teal-700 transition-colors">
                Contact Support
              </Link>
            </p>
          </div>

          {/* System Info */}
          <div className="mt-6">
            <div className="text-center text-xs text-black space-y-1">
              <p>© 2026 EBKUST. All rights reserved.</p>
              <p className="text-portal-teal-600">Portal Version 2.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
