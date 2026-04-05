'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { clearAuthData } from '@/lib/auth-utils'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear all authentication data using centralized utility
    clearAuthData()

    console.log('✅ Logout successful - all auth data cleared')

    // Redirect to login after a short delay
    setTimeout(() => {
      router.push('/login?message=logged_out')
    }, 500)
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-portal-teal-500 mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-gray-800">Logging out...</p>
        <p className="text-sm text-gray-600 mt-2">Clearing your session</p>
      </div>
    </div>
  )
}
