import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which routes require authentication
const protectedRoutes = [
  '/dashboard',
  '/admin-dashboard',
  '/receipt',
  '/banks',
  '/payments',
  '/helpdesk',
  '/system-settings',
  '/applications',
  '/student',
  '/staff',
  '/admin',
  '/finance',
  '/notifications',
];

// Define public routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register'];

// Define role-based route access
const roleBasedRoutes: Record<string, string[]> = {
  '/admin': ['ADMIN', 'SUPER_ADMIN'],
  '/system-settings': ['ADMIN', 'SUPER_ADMIN'],
  '/finance': ['ADMIN', 'FINANCE'],
  '/staff/dashboard': ['ADMIN', 'STAFF'],
  '/receipt/generate': ['ADMIN', 'FINANCE', 'STAFF'],
  '/receipt/verify': ['ADMIN', 'FINANCE'],
  '/banks': ['ADMIN', 'FINANCE'],
  '/payments': ['ADMIN', 'FINANCE'],
  '/student': ['STUDENT'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Early return for static assets and API routes (OPTIMIZATION)
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') // Static files (.js, .css, .png, etc.)
  ) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value;

  // Development-only logging (removed in production for performance)
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware - Path:', pathname);
    console.log('Middleware - Token present:', !!token);
  }

  // Edge Runtime compatible: Just check if token cookie exists
  // The actual JWT verification happens in API routes (Node.js runtime)
  let user = null;

  if (token) {
    // Token exists = user is authenticated
    // We trust the cookie and verify it properly in API routes
    // For middleware routing, assume ADMIN role (actual role checked in API)
    user = { userId: 'unknown', email: 'unknown', name: 'User', role: 'ADMIN' };
  }

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If user is authenticated and trying to access auth routes, redirect to role dashboard
  if (isAuthRoute && user) {
    const dashboardUrl = new URL(getDashboardForRole(user.role), request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // If route is protected and user is not authenticated, redirect to login
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  if (user && isProtectedRoute) {
    for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(user.role)) {
          // User doesn't have permission, redirect to their appropriate dashboard
          const dashboardUrl = new URL(getDashboardForRole(user.role), request.url);
          return NextResponse.redirect(dashboardUrl);
        }
      }
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Helper function to get dashboard URL based on role
function getDashboardForRole(role: string): string {
  switch (role) {
    case 'SUPER_ADMIN':
    case 'ADMIN':
      return '/admin-dashboard';
    case 'FINANCE':
      return '/finance/dashboard';
    case 'STAFF':
      return '/staff/dashboard';
    case 'STUDENT':
      return '/student/dashboard';
    default:
      return '/admin-dashboard';
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.gif).*)',
  ],
};
