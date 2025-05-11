'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyOfflineCredentials, setActiveOfflineUser } from '@/lib/offlineAuth';
import { offlineDb } from '@/lib/offlineDb';
import { MdWifiOff, MdLockOutline, MdOutlineEmail } from 'react-icons/md';
import type { OfflineUser } from '@/lib/offlineDb';
import { toast } from 'react-toastify';

export default function OfflineLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Auto-initialize offline users when component loads
  useEffect(() => {
    const initializeOfflineUsers = async () => {
      try {
        // Admin user data
        const adminUser = {
          id: 'admin-user-123',
          email: 'alokhealthadmin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          lastUpdated: new Date().toISOString()
        };

        // Receptionist user data
        const receptionistUser = {
          id: 'receptionist-user-123',
          email: 'receptionist@example.com',
          firstName: 'Receptionist',
          lastName: 'User',
          role: 'receptionist',
          lastUpdated: new Date().toISOString()
        };

        // Save admin user
        const existingAdminUser = await offlineDb.offlineUsers.get(adminUser.id);
        if (existingAdminUser) {
          await offlineDb.offlineUsers.update(adminUser.id, adminUser);
        } else {
          await offlineDb.offlineUsers.add(adminUser);
        }

        // Save receptionist user
        const existingReceptionistUser = await offlineDb.offlineUsers.get(receptionistUser.id);
        if (existingReceptionistUser) {
          await offlineDb.offlineUsers.update(receptionistUser.id, receptionistUser);
        } else {
          await offlineDb.offlineUsers.add(receptionistUser);
        }
        
        console.log('Offline users initialized successfully');
        setIsInitialized(true);
        toast.success('Offline mode ready');
      } catch (error) {
        console.error('Error initializing offline users:', error);
        toast.error('Failed to initialize offline mode');
        setError('Failed to initialize offline mode. Please try refreshing the page.');
      }
    };

    initializeOfflineUsers();
  }, []);

  const handleOfflineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInitialized) {
      setError('Offline mode is not ready yet. Please wait...');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Get all stored users
      const users = await offlineDb.offlineUsers.toArray();
      console.log('Available offline users:', users);
      
      // First check if input matches any email
      let user = users.find((u: OfflineUser) => 
        u.email.toLowerCase() === username.toLowerCase()
      );

      // If no user found by email, check if it's a username (without @)
      if (!user && !username.includes('@')) {
        // First try exact username match with email prefix
        user = users.find((u: OfflineUser) => 
          u.email.split('@')[0].toLowerCase() === username.toLowerCase()
        );
        
        // Check for specific usernames
        if (!user) {
          if (username.toLowerCase() === 'alokhealthadmin') {
            user = users.find((u: OfflineUser) => u.role === 'admin');
          } else if (username.toLowerCase() === 'receptionist') {
            user = users.find((u: OfflineUser) => u.role === 'receptionist');
          }
        }
      }

      if (!user) {
        setError('User not found in offline storage');
        toast.error('User not found');
        setIsLoading(false);
        return;
      }

      // Handle password check - use specific password
      const isPasswordValid = password === 'alokhealth25';
      
      if (!isPasswordValid) {
        setError('Incorrect password');
        toast.error('Incorrect password');
        setIsLoading(false);
        return;
      }

      // Set offline user as current
      setActiveOfflineUser(user.id);
      
      // Set cookies for offline authentication
      document.cookie = `offline_mode=true; path=/; max-age=86400`;
      document.cookie = `isOfflineAuthenticated=true; path=/; max-age=86400`;
      document.cookie = `offlineUserRole=${user.role}; path=/; max-age=86400`;
      
      toast.success('Offline login successful');
      
      // Determine where to redirect based on role
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'receptionist') {
        router.push('/receptionist');
      } else if (user.role === 'doctor') {
        router.push('/doctor');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error during offline login:', error);
      setError('An error occurred during offline login');
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-1 ring-black/5 sm:w-96 sm:px-8">
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center mb-2 text-red-500">
          <MdWifiOff size={24} className="mr-2" />
          <span className="text-lg font-medium">Offline Mode</span>
        </div>
        <h1 className="mt-4 text-xl font-medium tracking-tight text-zinc-950">
          Sign in to continue
        </h1>
        {!isInitialized && (
          <p className="text-sm text-yellow-600 mt-2">
            Initializing offline mode...
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <form onSubmit={handleOfflineLogin} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-950">Username</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdOutlineEmail className="text-gray-400" />
            </div>
            <input
              type="text"
              required
              disabled={!isInitialized}
              className="w-full rounded-md bg-white pl-10 px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="alokhealthadmin or receptionist"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-950">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdLockOutline className="text-gray-400" />
            </div>
            <input
              type="password"
              required
              disabled={!isInitialized}
              className="w-full rounded-md bg-white pl-10 px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !isInitialized}
          className="w-full rounded-md bg-zinc-950 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging in...' : !isInitialized ? 'Initializing...' : 'Sign In Offline'}
        </button>
      </form>

      <div className="text-xs text-gray-500 mt-4">
        <p className="mb-1">To use offline mode:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Username: <strong>alokhealthadmin</strong> (admin) or <strong>receptionist</strong></li>
          <li>Password: <strong>alokhealth25</strong></li>
        </ul>
      </div>
    </div>
  );
} 