import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Public paths that don't require authentication
const PUBLIC_PATHS = ['/', '/sign-in', '/offline-login', '/api/offline/sync'];

// Specific routes that receptionist can access
const RECEPTIONIST_PATHS = [
  '/receptionist',
  '/receptionist/all-patients',
  '/receptionist/all-memos'
];

// Export the clerkMiddleware handler
export default clerkMiddleware(async (auth, req) => {
  // Add a header indicating this is handled by middleware
  const response = NextResponse.next();
  response.headers.set('x-middleware-cache', 'no-cache');
  
  // Check if the request has the offline flag in cookies
  const isOfflineMode = req.cookies.get('offline_mode')?.value === 'true';
  
  // If in offline mode, skip Clerk auth and handle local auth
  if (isOfflineMode) {
    // Allow access to the offline-login page
    if (req.nextUrl.pathname === '/offline-login') {
      return response;
    }
    
    // Check if the user has been authenticated offline
    const isOfflineAuthenticated = req.cookies.get('isOfflineAuthenticated')?.value === 'true';
    
    if (!isOfflineAuthenticated) {
      // If not authenticated offline, redirect to offline login
      return NextResponse.redirect(new URL('/offline-login', req.url));
    }
    
    // For offline authenticated users, handle role-based access
    const offlineUserRole = req.cookies.get('offlineUserRole')?.value;
    
    // Admin can access all routes
    if (offlineUserRole === 'admin') {
      return response;
    }
    
    // Role-based route protection for receptionist
    if (offlineUserRole === 'receptionist') {
      // Check if the current path is allowed for receptionist
      const isAllowedPath = RECEPTIONIST_PATHS.some(path => 
        req.nextUrl.pathname === path || 
        req.nextUrl.pathname.startsWith(path + '/')
      );
      
      if (isAllowedPath) {
        return response;
      } else {
        // Redirect to receptionist home if trying to access unauthorized path
        return NextResponse.redirect(new URL('/receptionist', req.url));
      }
    }
    
    // For any other role, redirect to offline login
    return NextResponse.redirect(new URL('/offline-login', req.url));
  }
  
  // If the path is public, allow access
  if (PUBLIC_PATHS.some(path => req.nextUrl.pathname === path || 
                      req.nextUrl.pathname.startsWith('/api/offline/sync'))) {
    return response;
  }
  
  // For protected routes, check authentication with Clerk
  const authObj = await auth();
  
  // If not authenticated, redirect to sign-in
  if (!authObj?.userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  
  return response;
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/'
  ],
};

