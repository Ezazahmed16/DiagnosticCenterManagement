'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OfflineLoginForm from '@/components/OfflineLoginForm';

export default function OfflineLoginPage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    // If user is online, redirect to regular login
    if (isOnline) {
      router.push('/sign-in');
    }

    const handleOnline = () => {
      setIsOnline(true);
      router.push('/sign-in');
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [router, isOnline]);

  return (
    <div className="grid h-screen w-full flex-grow items-center bg-zinc-100 px-4 sm:justify-center">
      <OfflineLoginForm />
    </div>
  );
} 