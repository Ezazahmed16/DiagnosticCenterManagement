import { offlineDb } from './offlineDb';

// Type for sync operation result
type SyncResult = {
  success: boolean;
  message: string;
  syncedItems: number;
};

// Main sync service
export const syncService = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  
  // Initialize listeners for online/offline events
  init: () => {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', syncService.handleOnline);
      window.addEventListener('offline', syncService.handleOffline);
      
      // Initial check
      syncService.isOnline = navigator.onLine;
      if (syncService.isOnline) {
        syncService.updateSyncStatus('online');
      } else {
        syncService.updateSyncStatus('offline');
      }
    }
  },
  
  // Clean up event listeners
  cleanup: () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', syncService.handleOnline);
      window.removeEventListener('offline', syncService.handleOffline);
    }
  },
  
  // Handle coming online
  handleOnline: async () => {
    console.log('Network is now online');
    syncService.isOnline = true;
    await syncService.updateSyncStatus('online');
    await syncService.syncData();
  },
  
  // Handle going offline
  handleOffline: async () => {
    console.log('Network is now offline');
    syncService.isOnline = false;
    await syncService.updateSyncStatus('offline');
  },
  
  // Update sync status in the database
  updateSyncStatus: async (status: 'online' | 'offline' | 'syncing') => {
    const currentStatus = await offlineDb.syncStatus.toArray();
    if (currentStatus.length > 0) {
      await offlineDb.syncStatus.update(currentStatus[0].id!, {
        status,
        lastSync: status === 'online' ? new Date() : currentStatus[0].lastSync
      });
    } else {
      await offlineDb.syncStatus.add({
        status,
        lastSync: new Date(),
        pendingChanges: 0
      });
    }
  },
  
  // Get current sync status
  getSyncStatus: async () => {
    const status = await offlineDb.syncStatus.toArray();
    return status.length > 0 ? status[0] : null;
  },
  
  // Count pending changes
  countPendingChanges: async () => {
    const patients = await offlineDb.patients.where({ pendingSync: true }).count();
    const memos = await offlineDb.memos.where({ pendingSync: true }).count();
    const expenses = await offlineDb.expenses.where({ pendingSync: true }).count();
    const assets = await offlineDb.assets.where({ pendingSync: true }).count();
    
    const total = patients + memos + expenses + assets;
    
    // Update the count in the status
    const currentStatus = await offlineDb.syncStatus.toArray();
    if (currentStatus.length > 0) {
      await offlineDb.syncStatus.update(currentStatus[0].id!, {
        pendingChanges: total
      });
    }
    
    return total;
  },
  
  // Load data for offline use
  loadOfflineData: async (): Promise<boolean> => {
    if (!syncService.isOnline) {
      console.log('Cannot load offline data while offline');
      return false;
    }
    
    try {
      console.log('Loading data for offline use...');
      await syncService.updateSyncStatus('syncing');
      
      // Fetch data from API with error handling
      try {
        // Add timestamp to prevent caching
        const response = await fetch('/api/offline/sync?_t=' + new Date().getTime(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch offline data: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log('API response:', responseData);
        
        if (!responseData.success || !responseData.data) {
          throw new Error('Invalid response from sync API');
        }
        
        const { data } = responseData;
        
        // Begin transaction to clear and repopulate tables
        await offlineDb.transaction('rw', 
          [offlineDb.patients, offlineDb.memos, offlineDb.expenseTypes, offlineDb.tests], 
          async () => {
            // Clear existing synced data (keep only unsynced records)
            await offlineDb.patients.where({ synced: true }).delete();
            await offlineDb.memos.where({ synced: true }).delete();
            await offlineDb.expenseTypes.where({ synced: true }).delete();
            await offlineDb.tests.where({ synced: true }).delete();
            
            // Prepare patients data
            const patientsToAdd = data.patients.map((patient: any) => ({
              patientId: patient.id,
              name: patient.name || 'Unknown',
              phone: patient.phone || '',
              email: patient.email || '',
              address: patient.address || '',
              age: patient.age || null,
              gender: patient.gender || '',
              synced: true,
              pendingSync: false,
              lastUpdated: new Date()
            }));
            
            // Prepare memos data
            const memosToAdd = data.memos.map((memo: any) => ({
              memoId: memo.id,
              patientId: memo.patientId || '',
              patientName: memo.Patient?.name || 'Unknown',
              totalAmount: memo.totalAmount || 0,
              status: memo.status || '',
              isPaid: !!memo.isPaid,
              paymentType: memo.paymentType || '',
              tests: Array.isArray(memo.MemoToTest) ? memo.MemoToTest.map((test: any) => test.testId) : [],
              synced: true,
              pendingSync: false,
              createdAt: new Date(memo.createdAt || Date.now()),
              lastUpdated: new Date()
            }));
            
            // Prepare expense types data
            const expenseTypesToAdd = data.expenseTypes.map((type: any) => ({
              expenseTypeId: type.id,
              name: type.name || 'Unknown',
              description: type.description || '',
              synced: true,
              pendingSync: false,
              lastUpdated: new Date()
            }));
            
            // Prepare tests data
            const testsToAdd = data.tests.map((test: any) => ({
              testId: test.id,
              name: test.name || 'Unknown',
              price: test.price || 0,
              description: test.description || '',
              synced: true,
              pendingSync: false,
              lastUpdated: new Date()
            }));
            
            console.log(`Adding ${patientsToAdd.length} patients, ${memosToAdd.length} memos, ${expenseTypesToAdd.length} expense types, ${testsToAdd.length} tests`);
            
            // Bulk add data
            if (patientsToAdd.length) await offlineDb.patients.bulkAdd(patientsToAdd);
            if (memosToAdd.length) await offlineDb.memos.bulkAdd(memosToAdd);
            if (expenseTypesToAdd.length) await offlineDb.expenseTypes.bulkAdd(expenseTypesToAdd);
            if (testsToAdd.length) await offlineDb.tests.bulkAdd(testsToAdd);
        });
        
        await syncService.updateSyncStatus('online');
        console.log('Offline data loaded successfully');
        
        // Update last sync time
        const currentStatus = await offlineDb.syncStatus.toArray();
        if (currentStatus.length > 0) {
          await offlineDb.syncStatus.update(currentStatus[0].id!, {
            lastSync: new Date(),
            pendingChanges: await syncService.countPendingChanges()
          });
        }
        
        // Set offline ready status
        localStorage.setItem('offline_ready', 'true');
        
        return true;
      } catch (apiError) {
        console.error('API fetch error:', apiError);
        throw apiError;
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
      await syncService.updateSyncStatus('online');
      return false;
    }
  },
  
  // Sync all pending data with the server
  syncData: async (): Promise<SyncResult> => {
    if (!syncService.isOnline) {
      return { 
        success: false, 
        message: 'Cannot sync while offline', 
        syncedItems: 0 
      };
    }
    
    await syncService.updateSyncStatus('syncing');
    
    try {
      // Sync patients
      const pendingPatients = await offlineDb.patients.where({ pendingSync: true }).toArray();
      // Sync memos
      const pendingMemos = await offlineDb.memos.where({ pendingSync: true }).toArray();
      // Sync expenses
      const pendingExpenses = await offlineDb.expenses.where({ pendingSync: true }).toArray();
      // Sync assets
      const pendingAssets = await offlineDb.assets.where({ pendingSync: true }).toArray();
      
      const totalPending = pendingPatients.length + pendingMemos.length + 
                           pendingExpenses.length + pendingAssets.length;
      
      if (totalPending === 0) {
        await syncService.updateSyncStatus('online');
        return { 
          success: true, 
          message: 'No changes to sync', 
          syncedItems: 0 
        };
      }
      
      // Here you would make API calls to sync the data
      // For each type of data, send to server and mark as synced if successful
      
      // For now, we'll just simulate a successful sync
      const syncPromises = [];
      
      if (pendingPatients.length > 0) {
        syncPromises.push(syncService.syncPatients(pendingPatients));
      }
      
      if (pendingMemos.length > 0) {
        syncPromises.push(syncService.syncMemos(pendingMemos));
      }
      
      if (pendingExpenses.length > 0) {
        syncPromises.push(syncService.syncExpenses(pendingExpenses));
      }
      
      if (pendingAssets.length > 0) {
        syncPromises.push(syncService.syncAssets(pendingAssets));
      }
      
      await Promise.all(syncPromises);
      
      await syncService.updateSyncStatus('online');
      await syncService.countPendingChanges();
      
      return { 
        success: true, 
        message: `Successfully synced ${totalPending} items`, 
        syncedItems: totalPending 
      };
    } catch (error) {
      console.error('Sync error:', error);
      await syncService.updateSyncStatus('online');
      return { 
        success: false, 
        message: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        syncedItems: 0 
      };
    }
  },
  
  // Sync patients to server
  syncPatients: async (patients: any[]) => {
    // Here you would make an API call to sync patients
    // For now, we'll just simulate a successful sync
    for (const patient of patients) {
      // In a real implementation, you'd make an API call here
      // If successful, update the local record to mark as synced
      await offlineDb.patients.update(patient.id!, {
        synced: true,
        pendingSync: false,
        lastUpdated: new Date()
      });
    }
  },
  
  // Sync memos to server
  syncMemos: async (memos: any[]) => {
    for (const memo of memos) {
      await offlineDb.memos.update(memo.id!, {
        synced: true,
        pendingSync: false,
        lastUpdated: new Date()
      });
    }
  },
  
  // Sync expenses to server
  syncExpenses: async (expenses: any[]) => {
    for (const expense of expenses) {
      await offlineDb.expenses.update(expense.id!, {
        synced: true,
        pendingSync: false,
        lastUpdated: new Date()
      });
    }
  },
  
  // Sync assets to server
  syncAssets: async (assets: any[]) => {
    for (const asset of assets) {
      await offlineDb.assets.update(asset.id!, {
        synced: true,
        pendingSync: false,
        lastUpdated: new Date()
      });
    }
  }
};

// Initialize the sync service when the module is imported
if (typeof window !== 'undefined') {
  syncService.init();
} 