'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import { hasReceptionistAccess, saveUserForOffline, getOfflineUser } from '@/lib/offlineAuth';
import { routeAccessMap } from '@/lib/settings';

interface OfflineAuthProviderProps {
  children: ReactNode;
}

// Public paths that don't require authentication
const PUBLIC_PATHS = ['/sign-in', '/offline-login'];

export default function OfflineAuthProvider({ children }: OfflineAuthProviderProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [authChecked, setAuthChecked] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Clear offline mode when going back online
      localStorage.removeItem('offlineMode');
      document.cookie = 'offline_mode=false; path=/; max-age=0';
      setIsOfflineMode(false);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      // Check if we have offline user data
      const hasOfflineUser = localStorage.getItem('offlineActiveUserId');
      if (hasOfflineUser) {
        localStorage.setItem('offlineMode', 'true');
        document.cookie = 'offline_mode=true; path=/; max-age=86400';
        setIsOfflineMode(true);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if we're in offline mode (persisted)
    const offlineMode = localStorage.getItem('offlineMode') === 'true';
    setIsOfflineMode(offlineMode);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save user data for offline use when online
  useEffect(() => {
    if (isLoaded && isSignedIn && user && isOnline) {
      // Store the user's data for offline use
      saveUserForOffline({
        id: user.id,
        emailAddresses: user.emailAddresses,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        publicMetadata: user.publicMetadata
      });
    }
  }, [isLoaded, isSignedIn, user, isOnline]);

  // Handle authentication and redirect as needed
  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Skip check if auth isn't loaded yet
        if (!isLoaded && !isOfflineMode) return;

        // Check for public paths
        if (PUBLIC_PATHS.includes(pathname)) {
          setAuthChecked(true);
          setIsInitialized(true);
          return;
        }

        // When online, rely on Clerk auth
        if (isOnline && !isOfflineMode) {
          if (!isSignedIn) {
            // If not signed in and not on sign-in page, redirect to sign-in
            router.push('/sign-in');
          } else {
            // If signed in, check role-based access
            const userRole = user?.publicMetadata.role as string;
            
            // First, handle initial redirect after sign in
            if (pathname === '/') {
              router.push(`/${userRole}`);
              return;
            }
            
            // Check if current path is allowed for user's role
            let hasAccess = false;
            for (const [route, allowedRoles] of Object.entries(routeAccessMap)) {
              if (new RegExp(route).test(pathname) && allowedRoles.includes(userRole)) {
                hasAccess = true;
                break;
              }
            }
            
            if (!hasAccess) {
              router.push(`/${userRole}`);
            }
          }
        } else {
          // When offline or in offline mode
          const offlineUser = await getOfflineUser();
          
          if (!offlineUser) {
            // If no offline user credentials, redirect to offline login
            if (pathname !== '/offline-login') {
              router.push('/offline-login');
            }
          } else {
            // When offline with stored credentials
            if (pathname === '/') {
              // If on homepage, redirect to appropriate section based on role
              const role = offlineUser.publicMetadata.role;
              if (role === 'admin') {
                router.push('/admin');
              } else if (role === 'receptionist') {
                router.push('/receptionist/all-patients');
              } else if (role === 'doctor') {
                router.push('/doctor');
              } else {
                router.push('/dashboard');
              }
              return;
            }

            // Admin can access all routes
            if (offlineUser.publicMetadata.role === 'admin') {
              // No need to redirect, admin has access to all pages
            } 
            // Check path access for non-admin roles
            else if (pathname.startsWith('/receptionist')) {
              if (offlineUser.publicMetadata.role !== 'receptionist') {
                // If receptionist access not allowed, redirect to appropriate page
                router.push(`/${offlineUser.publicMetadata.role}`);
              }
            } else if (pathname.startsWith('/admin')) {
              // Only admin can access admin routes, redirect others
              router.push(`/${offlineUser.publicMetadata.role}`);
            } else if (pathname.startsWith('/doctor')) {
              if (offlineUser.publicMetadata.role !== 'doctor') {
                // If doctor access not allowed, redirect to appropriate page
                router.push(`/${offlineUser.publicMetadata.role}`);
              }
            }
          }
        }
        
        setAuthChecked(true);
        setIsInitialized(true);
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthChecked(true);
        setIsInitialized(true);
      }
    };
    
    checkAccess();
  }, [isLoaded, isSignedIn, user, pathname, router, isOnline, isOfflineMode]);

  // Show nothing until auth is checked to prevent flashes of incorrect content
  if (!authChecked && !PUBLIC_PATHS.includes(pathname)) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }

  // Only render children when fully initialized to prevent toggle errors
  if (!isInitialized) {
    return <div className="h-screen w-full flex items-center justify-center">Initializing...</div>;
  }

  return <>{children}</>;
} 