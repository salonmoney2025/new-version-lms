/**
 * Authentication Utilities
 * Centralized token and auth management
 */

const isDev = process.env.NODE_ENV === 'development';

/**
 * Clear all authentication data
 */
export function clearAuthData() {
  if (isDev) {
    console.log('[AUTH] Clearing all authentication data...');
  }

  // Clear localStorage
  localStorage.clear();

  // Clear sessionStorage
  sessionStorage.clear();

  // Clear all cookies
  if (typeof document !== 'undefined') {
    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    });
  }

  if (isDev) {
    console.log('[AUTH] ✅ All auth data cleared');
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('access_token') || getCookie('auth-token');
  return !!token;
}

/**
 * Get cookie value
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }

  return null;
}

/**
 * Store tokens after login
 */
export function storeTokens(accessToken: string, refreshToken?: string) {
  localStorage.setItem('access_token', accessToken);

  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }

  if (isDev) {
    console.log('[AUTH] Tokens stored successfully');
  }
}

/**
 * Get current access token
 */
export function getAccessToken(): string | null {
  return localStorage.getItem('access_token') || getCookie('auth-token');
}

/**
 * Get current refresh token
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token');
}

/**
 * Logout and redirect
 */
export function logout(redirectTo: string = '/login') {
  clearAuthData();

  if (typeof window !== 'undefined') {
    window.location.href = redirectTo;
  }
}

/**
 * Development mode helper - shows auth status
 */
export function logAuthStatus() {
  if (!isDev) return;

  const hasAccessToken = !!getAccessToken();
  const hasRefreshToken = !!getRefreshToken();

  console.group('[AUTH] Status');
  console.log('Access Token:', hasAccessToken ? '✅ Present' : '❌ Missing');
  console.log('Refresh Token:', hasRefreshToken ? '✅ Present' : '❌ Missing');
  console.log('Authenticated:', isAuthenticated() ? '✅ Yes' : '❌ No');
  console.groupEnd();
}
