'use client';

import { offlineDb } from './offlineDb';

// Type definitions for offline user
interface OfflineUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  role: string;
  lastUpdated: string;
}

// Initialize offline user table in the database
export async function initOfflineAuth() {
  try {
    // Add the users table to the schema
    if (!offlineDb.table('users')) {
      offlineDb.version(2).stores({
        users: 'id, email, name, role, lastLogin'
      });
    }
  } catch (error) {
    console.error("Error initializing offline auth:", error);
  }
}

// Save the current user data for offline use
export async function saveUserForOffline(userData: any) {
  if (!userData) return false;
  
  try {
    // Check if the user exists in the offlineUsers table
    const existingUser = await offlineDb.offlineUsers.get(userData.id);
    
    // Structure the user data
    const userToSave = {
      id: userData.id,
      email: userData.emailAddresses?.[0]?.emailAddress || 'unknown',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      imageUrl: userData.imageUrl,
      role: userData.publicMetadata?.role,
      lastUpdated: new Date().toISOString()
    };
    
    // Add or update the user in the offlineUsers table
    if (existingUser) {
      await offlineDb.offlineUsers.update(userData.id, userToSave);
    } else {
      await offlineDb.offlineUsers.add(userToSave);
    }
    
    // Save the last active user ID to localStorage
    localStorage.setItem('offlineActiveUserId', userData.id);
    
    return true;
  } catch (error) {
    console.error('Failed to save user for offline use:', error);
    return false;
  }
}

// Get the offline user data (from IndexedDB)
export async function getOfflineUser() {
  try {
    // Get the last active user ID from localStorage
    const activeUserId = localStorage.getItem('offlineActiveUserId');
    if (!activeUserId) return null;
    
    // Get the user from the offlineUsers table
    const offlineUser = await offlineDb.offlineUsers.get(activeUserId);
    if (!offlineUser) return null;
    
    return {
      id: offlineUser.id,
      firstName: offlineUser.firstName,
      lastName: offlineUser.lastName,
      emailAddress: offlineUser.email,
      imageUrl: offlineUser.imageUrl,
      publicMetadata: { 
        role: offlineUser.role 
      }
    };
  } catch (error) {
    console.error('Failed to get offline user:', error);
    return null;
  }
}

// Verify offline login credentials
export async function verifyOfflineCredentials(email: string, password: string) {
  try {
    // Find user by email
    const user = await offlineDb.offlineUsers.where('email').equals(email).first();
    if (!user) return null;
    
    // For demonstration, we're using a simplified password verification approach
    // In a real app, you would use a more secure approach
    // Here we're checking if the password matches the last 4 chars of the email username (before the @)
    const emailUsername = email.split('@')[0];
    const simplifiedPassword = emailUsername.slice(-4);
    
    // Check if password matches the simplified password or the default password (1234)
    if (password === simplifiedPassword || password === '1234') {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        imageUrl: user.imageUrl,
        publicMetadata: { 
          role: user.role 
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to verify offline credentials:', error);
    return null;
  }
}

// Set active offline user
export function setActiveOfflineUser(userId: string) {
  localStorage.setItem('offlineActiveUserId', userId);
  localStorage.setItem('isOfflineAuthenticated', 'true');
}

// Clear offline authentication
export function clearOfflineAuth() {
  localStorage.removeItem('offlineActiveUserId');
  localStorage.removeItem('isOfflineAuthenticated');
}

// Check if user is authenticated offline
export function isOfflineAuthenticated() {
  return localStorage.getItem('isOfflineAuthenticated') === 'true';
}

// Check if user has receptionist access when offline
export async function hasReceptionistAccess() {
  try {
    const user = await getOfflineUser();
    return user?.publicMetadata?.role === 'receptionist';
  } catch (error) {
    console.error("Error checking receptionist access:", error);
    return false;
  }
} 