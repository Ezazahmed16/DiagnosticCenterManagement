'use client';

import React, { useState, useEffect } from 'react';
import { syncService } from '@/lib/syncService';
import { MdWifiOff, MdCloudDownload, MdCheck, MdError } from 'react-icons/md';

interface OfflinePreparationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OfflinePreparationModal: React.FC<OfflinePreparationModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setMessage('');
      setProgress(0);
    }
  }, [isOpen]);

  const prepareForOffline = async () => {
    try {
      setStatus('loading');
      setMessage('Downloading data for offline use...');
      setProgress(10);

      // First step: Load data from server
      setProgress(30);
      const success = await syncService.loadOfflineData();
      
      if (!success) {
        throw new Error('Failed to download offline data');
      }
      
      setProgress(90);
      setMessage('Data successfully downloaded for offline use');
      
      // Final step
      setProgress(100);
      setStatus('success');
      
      // Set a flag in localStorage to indicate offline mode is ready
      localStorage.setItem('offline_ready', 'true');
      
    } catch (error) {
      console.error('Error preparing for offline:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-boxdark p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <MdWifiOff className="mr-2" /> Prepare for Offline Mode
        </h2>
        
        {status === 'idle' && (
          <div className="mb-4">
            <p className="text-sm mb-4">
              This will download essential data for the receptionist to work offline. Make sure you&apos;re connected to the internet before proceeding.
            </p>
            <ul className="text-sm mb-4 list-disc pl-5">
              <li>Recent patient records</li>
              <li>Recent memos and tests</li>
              <li>Expense types</li>
              <li>Test catalog</li>
            </ul>
            <p className="text-sm mb-4 font-medium">
              Any changes made offline will be synchronized when you reconnect.
            </p>
          </div>
        )}
        
        {status === 'loading' && (
          <div className="mb-4">
            <p className="text-sm mb-2">{message}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {status === 'success' && (
          <div className="mb-4 text-success flex items-center">
            <MdCheck className="mr-2 text-xl" />
            <p>{message}</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="mb-4 text-danger flex items-center">
            <MdError className="mr-2 text-xl" />
            <p>{message}</p>
          </div>
        )}
        
        <div className="flex justify-end gap-3 mt-6">
          {status === 'idle' && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={prepareForOffline}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm flex items-center"
              >
                <MdCloudDownload className="mr-1" /> Download Data
              </button>
            </>
          )}
          
          {(status === 'success' || status === 'error') && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm"
            >
              Close
            </button>
          )}
          
          {status === 'loading' && (
            <button
              disabled
              className="px-4 py-2 bg-gray-400 text-white rounded-md text-sm cursor-not-allowed"
            >
              Downloading...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflinePreparationModal; 