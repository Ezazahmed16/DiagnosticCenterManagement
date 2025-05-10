import Dexie from 'dexie';

// Define interface for your data types
export interface OfflinePatient {
  id?: number;
  patientId?: string; // For server sync
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  age?: number;
  gender?: string;
  synced: boolean;
  pendingSync: boolean;
  lastUpdated: Date;
}

export interface OfflineMemo {
  id?: number;
  memoId?: string; // For server sync
  patientId: string;
  patientName?: string; // Denormalized for offline use
  totalAmount: number;
  status?: string;
  isPaid?: boolean;
  paymentType?: string;
  tests?: string[]; // Store test IDs
  note?: string;
  synced: boolean;
  pendingSync: boolean;
  createdAt: Date;
  lastUpdated: Date;
}

export interface OfflineExpense {
  id?: number;
  expenseId?: string; // For server sync
  amount: number;
  expenseTypeId: string;
  expenseTypeName?: string; // Denormalized for offline use
  description?: string;
  date: Date;
  synced: boolean;
  pendingSync: boolean;
  lastUpdated: Date;
}

export interface OfflineAsset {
  id?: number;
  assetId?: string; // For server sync
  name: string;
  amount: number;
  description?: string;
  date?: Date;
  synced: boolean;
  pendingSync: boolean;
  lastUpdated: Date;
}

export interface OfflineExpenseType {
  id?: number;
  expenseTypeId?: string; // For server sync
  name: string;
  description?: string;
  synced: boolean;
  pendingSync: boolean;
  lastUpdated: Date;
}

export interface OfflineTest {
  id?: number;
  testId?: string; // For server sync
  name: string;
  price: number;
  description?: string;
  synced: boolean;
  pendingSync: boolean;
  lastUpdated: Date;
}

export interface SyncStatus {
  id?: number;
  lastSync: Date;
  status: 'online' | 'offline' | 'syncing';
  pendingChanges: number;
}

export interface OfflineUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  role: string;
  lastUpdated: string;
}

// Create Dexie database class
class OfflineDatabase extends Dexie {
  patients: Dexie.Table<OfflinePatient, number>;
  memos: Dexie.Table<OfflineMemo, number>;
  expenses: Dexie.Table<OfflineExpense, number>;
  assets: Dexie.Table<OfflineAsset, number>;
  expenseTypes: Dexie.Table<OfflineExpenseType, number>;
  tests: Dexie.Table<OfflineTest, number>;
  syncStatus: Dexie.Table<SyncStatus, number>;
  offlineUsers: Dexie.Table<OfflineUser, string>;

  constructor() {
    super('DiagnosticCenterOfflineDB');
    
    // Define tables and schema for v1
    this.version(1).stores({
      patients: '++id, patientId, name, phone, email, synced, pendingSync, lastUpdated',
      memos: '++id, memoId, patientId, patientName, totalAmount, status, isPaid, synced, pendingSync, createdAt, lastUpdated',
      expenses: '++id, expenseId, amount, expenseTypeId, expenseTypeName, date, synced, pendingSync, lastUpdated',
      assets: '++id, assetId, name, amount, date, synced, pendingSync, lastUpdated',
      expenseTypes: '++id, expenseTypeId, name, synced, pendingSync, lastUpdated',
      tests: '++id, testId, name, price, synced, pendingSync, lastUpdated',
      syncStatus: '++id, lastSync, status, pendingChanges'
    });
    
    // Add users table in v2
    this.version(2).stores({
      offlineUsers: 'id, email, firstName, lastName, role, lastUpdated'
    });
    
    // Define table mappings
    this.patients = this.table('patients');
    this.memos = this.table('memos');
    this.expenses = this.table('expenses');
    this.assets = this.table('assets');
    this.expenseTypes = this.table('expenseTypes');
    this.tests = this.table('tests');
    this.syncStatus = this.table('syncStatus');
    this.offlineUsers = this.table('offlineUsers');
  }
}

// Create and export a singleton instance
export const offlineDb = new OfflineDatabase();

// Initial sync status
export async function initSyncStatus() {
  try {
    const status = await offlineDb.syncStatus.toArray();
    if (status.length === 0) {
      await offlineDb.syncStatus.add({
        lastSync: new Date(),
        status: typeof navigator !== 'undefined' && navigator.onLine ? 'online' : 'offline',
        pendingChanges: 0
      });
    }
  } catch (error) {
    console.error("Error initializing sync status:", error);
  }
}

// Populate initial expense types and tests
export async function populateInitialData() {
  try {
    // Check if we have expense types
    const expenseTypeCount = await offlineDb.expenseTypes.count();
    if (expenseTypeCount === 0) {
      // Add some default expense types
      await offlineDb.expenseTypes.bulkAdd([
        { name: 'Rent', synced: true, pendingSync: false, lastUpdated: new Date() },
        { name: 'Utilities', synced: true, pendingSync: false, lastUpdated: new Date() },
        { name: 'Salaries', synced: true, pendingSync: false, lastUpdated: new Date() },
        { name: 'Supplies', synced: true, pendingSync: false, lastUpdated: new Date() },
        { name: 'Other', synced: true, pendingSync: false, lastUpdated: new Date() }
      ]);
    }
    
    // Check if we have tests
    const testCount = await offlineDb.tests.count();
    if (testCount === 0) {
      // Add some default tests
      await offlineDb.tests.bulkAdd([
        { name: 'Blood Test', price: 500, synced: true, pendingSync: false, lastUpdated: new Date() },
        { name: 'X-Ray', price: 1000, synced: true, pendingSync: false, lastUpdated: new Date() },
        { name: 'COVID Test', price: 1500, synced: true, pendingSync: false, lastUpdated: new Date() },
        { name: 'Ultrasound', price: 2000, synced: true, pendingSync: false, lastUpdated: new Date() }
      ]);
    }
  } catch (error) {
    console.error("Error populating initial data:", error);
  }
}

// Initialize everything
export async function initializeOfflineDb() {
  if (typeof window !== 'undefined') {
    await initSyncStatus();
    await populateInitialData();
  }
}

// Call this when the app starts
if (typeof window !== 'undefined') {
  initializeOfflineDb();
} 