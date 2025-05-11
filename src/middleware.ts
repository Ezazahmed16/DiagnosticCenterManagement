import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public paths that don't require authentication
const PUBLIC_PATHS = ['/sign-in', '/offline-login', '/api/offline/sync'];

// Define paths accessible to receptionist
const RECEPTIONIST_PATHS = [
  '/receptionist',
  '/receptionist/all-patients',
  '/receptionist/add-patient',
  '/receptionist/patients',
  '/receptionist/appointments',
  '/receptionist/reports',
  '/receptionist/settings'
];

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId } = await auth();
  const response = NextResponse.next();

  // Check if we're in offline mode
  const isOfflineMode = req.cookies.get('offline_mode')?.value === 'true';
  
  // If we're in offline mode
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
  if (PUBLIC_PATHS.some(path => 
    req.nextUrl.pathname === path || 
    req.nextUrl.pathname.startsWith('/api/offline/sync')
  )) {
    return response;
  }
  
  // For protected routes, check authentication with Clerk
  if (!userId) {
    // If not authenticated and trying to access a protected route, redirect to sign-in
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }
  
  return response;
});

// Configure the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};

