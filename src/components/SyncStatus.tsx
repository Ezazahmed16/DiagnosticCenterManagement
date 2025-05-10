'use client';

import React, { useEffect, useState } from 'react';
import { FaSync, FaCloudUploadAlt, FaCloudDownloadAlt, FaWifi } from 'react-icons/fa';
import { MdWifiOff, MdDownload } from 'react-icons/md';
import { useLiveQuery } from 'dexie-react-hooks';
import { offlineDb } from '@/lib/offlineDb';
import { syncOfflineData } from '@/lib/prismaUtils';
import OfflinePreparationModal from './OfflinePreparationModal';
import { useUser } from '@clerk/nextjs';
import { saveUserForOffline } from '@/lib/offlineAuth';

export default function SyncStatus() {
  const { user } = useUser();
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  // Use Dexie's live query to monitor sync status
  const syncStatus = useLiveQuery(async () => {
    const status = await offlineDb.syncStatus.toArray();
    return status.length > 0 ? status[0] : null;
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if offline mode is ready
    if (typeof window !== 'undefined') {
      setOfflineReady(localStorage.getItem('offline_ready') === 'true');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (syncStatus?.lastSync) {
      setLastSyncTime(new Date(syncStatus.lastSync));
    }
  }, [syncStatus]);

  const handleSync = async () => {
    if (!isOnline) {
      setSyncMessage('Cannot sync while offline');
      setTimeout(() => setSyncMessage(null), 3000);
      return;
    }

    try {
      setSyncing(true);
      const result = await syncOfflineData();
      setSyncMessage(result.message);
      setTimeout(() => setSyncMessage(null), 3000);
    } catch (error) {
      setSyncMessage('Sync failed');
      setTimeout(() => setSyncMessage(null), 3000);
    } finally {
      setSyncing(false);
    }
  };

  const handleOfflinePrep = async () => {
    if (showOfflineModal) return; // Avoid multiple clicks
    setShowOfflineModal(true);
    
    try {
      // First, save the current user for offline use
      if (user) {
        console.log('Saving user for offline login:', user.emailAddresses[0].emailAddress);
        const result = await saveUserForOffline({
          id: user.id,
          emailAddresses: user.emailAddresses,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          publicMetadata: user.publicMetadata
        });
        
        if (!result) {
          console.error('Failed to save user data for offline use');
        } else {
          console.log('User data saved successfully for offline use');
        }
      } else {
        console.error('No user data available to save for offline use');
      }
    } catch (error) {
      console.error('Error preparing user for offline mode:', error);
    }
  };

  // Only show offline preparation for receptionists and admins
  const showOfflinePrep = user?.publicMetadata.role === 'receptionist' || 
                           user?.publicMetadata.role === 'admin';

  return (
    <>
      <div className="flex flex-col items-end p-2 bg-white dark:bg-boxdark rounded-sm shadow-default">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <FaWifi className="text-success" title="Online" />
          ) : (
            <MdWifiOff className="text-danger" title="Offline" />
          )}
          
          <span className="text-sm">
            {isOnline ? 'Online' : 'Offline'} Mode
          </span>
          
          {syncStatus?.status === 'syncing' || syncing ? (
            <FaSync className="animate-spin text-meta-5" />
          ) : syncStatus?.pendingChanges ? (
            <div className="flex items-center gap-1">
              <FaCloudUploadAlt className="text-meta-5" />
              <span className="text-xs">{syncStatus.pendingChanges} pending</span>
            </div>
          ) : isOnline ? (
            <FaCloudDownloadAlt className="text-success" />
          ) : null}
          
          <button
            onClick={handleSync}
            disabled={syncing || !isOnline}
            className={`ml-2 px-2 py-1 text-xs rounded ${
              syncing || !isOnline 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-opacity-90'
            }`}
          >
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>

          {showOfflinePrep && isOnline && (
            <button
              onClick={handleOfflinePrep}
              className="ml-2 px-2 py-1 text-xs rounded bg-secondary text-white hover:bg-opacity-90 flex items-center"
              title="Prepare for offline use"
            >
              <MdDownload className="mr-1" /> {offlineReady ? 'Update' : 'Offline Prep'}
            </button>
          )}
        </div>
        
        {lastSyncTime && (
          <div className="text-xs text-gray-500 mt-1">
            Last synced: {lastSyncTime.toLocaleString()}
          </div>
        )}
        
        {syncMessage && (
          <div className="text-xs mt-1 p-1 bg-gray-100 rounded-sm">
            {syncMessage}
          </div>
        )}
      </div>

      <OfflinePreparationModal 
        isOpen={showOfflineModal}
        onClose={() => setShowOfflineModal(false)}
      />
    </>
  );
} 