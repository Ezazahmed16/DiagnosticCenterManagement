'use server';

import prisma from "@/lib/prisma";
import { offlineDb } from "./offlineDb";
import { syncService } from "./syncService";

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Function to check online status
const isOnline = () => {
  if (!isBrowser) return true; // Server-side is always "online"
  return navigator.onLine;
};

export const getDashboardData = async () => {
  try {
    // Try to get data from the server if online
    if (isOnline()) {
      try {
        // Fetch from server
        const userCount = (await prisma.patient.count()) ?? 0;
        const totalIncomeAmount = (await prisma.memo.aggregate({ _sum: { totalAmount: true } }))._sum?.totalAmount ?? 0;
        const totalExpenseAmount = (await prisma.expense.aggregate({ _sum: { amount: true } }))._sum?.amount ?? 0;
        const totalAssetAmount = (await prisma.asset.aggregate({ _sum: { amount: true } }))._sum?.amount ?? 0;
        const profit = totalIncomeAmount - totalExpenseAmount;

        // Monthly Income Data
        const monthlyIncome = await prisma.memo.groupBy({
          by: ["createdAt"],
          _sum: { totalAmount: true },
          orderBy: { createdAt: "asc" },
        });

        const formattedIncomeData = Object.entries(
          monthlyIncome.reduce<{ [month: string]: number }>((acc, item) => {
            const month = new Date(item.createdAt).toLocaleString("default", { month: "short" });
            acc[month] = (acc[month] ?? 0) + (item._sum.totalAmount ?? 0);
            return acc;
          }, {})
        ).map(([month, total]) => ({ month, total }));

        // Monthly Expense Data
        const monthlyExpenses = await prisma.expense.groupBy({
          by: ["date"],
          _sum: { amount: true },
          orderBy: { date: "asc" },
        });

        const formattedExpenseData = Object.entries(
          monthlyExpenses.reduce<{ [month: string]: number }>((acc, item) => {
            const month = new Date(item.date).toLocaleString("default", { month: "short" });
            acc[month] = (acc[month] ?? 0) + (item._sum.amount ?? 0);
            return acc;
          }, {})
        ).map(([month, total]) => ({ month, total }));

        // Current Month Expenses by Type
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const expensesByType = await prisma.expense.groupBy({
          by: ["expenseTypeId"],
          where: { date: { gte: startOfMonth, lte: endOfMonth } },
          _sum: { amount: true },
        });

        const expenseTypeIds = expensesByType.map(e => e.expenseTypeId);
        const expenseTypes = await prisma.expenseType.findMany({
          where: { id: { in: expenseTypeIds } },
          select: { id: true, name: true },
        });

        const formattedExpenseTypeData = expensesByType.map(expense => ({
          name: expenseTypes.find(type => type.id === expense.expenseTypeId)?.name ?? "Unknown",
          value: expense._sum.amount ?? 0,
        }));

        return {
          userCount,
          totalIncomeAmount,
          totalExpenseAmount,
          totalAssetAmount,
          profit,
          formattedIncomeData,
          formattedExpenseData,
          formattedExpenseTypeData,
        };
      } catch (error) {
        console.error("Error fetching from server:", error);
        // If server fetch fails, fall back to offline data
        return getOfflineDashboardData();
      }
    } else {
      // Use offline data if not online
      return getOfflineDashboardData();
    }
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    throw error;
  }
};

// Get dashboard data from offline storage
async function getOfflineDashboardData() {
  try {
    // Get counts from IndexedDB
    const patients = await offlineDb.patients.toArray();
    const userCount = patients.length;
    
    const memos = await offlineDb.memos.toArray();
    const totalIncomeAmount = memos.reduce((sum, memo) => sum + memo.totalAmount, 0);
    
    const expenses = await offlineDb.expenses.toArray();
    const totalExpenseAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const assets = await offlineDb.assets.toArray();
    const totalAssetAmount = assets.reduce((sum, asset) => sum + asset.amount, 0);
    
    const profit = totalIncomeAmount - totalExpenseAmount;

    // Prepare income data by month
    const incomeByMonth: Record<string, number> = {};
    memos.forEach(memo => {
      const month = new Date(memo.createdAt).toLocaleString("default", { month: "short" });
      incomeByMonth[month] = (incomeByMonth[month] ?? 0) + memo.totalAmount;
    });
    
    const formattedIncomeData = Object.entries(incomeByMonth)
      .map(([month, total]) => ({ month, total }));

    // Prepare expense data by month
    const expenseByMonth: Record<string, number> = {};
    expenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleString("default", { month: "short" });
      expenseByMonth[month] = (expenseByMonth[month] ?? 0) + expense.amount;
    });
    
    const formattedExpenseData = Object.entries(expenseByMonth)
      .map(([month, total]) => ({ month, total }));

    // Current month expenses by type
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
    });
    
    // Group by expense type
    const expensesByType: Record<string, number> = {};
    currentMonthExpenses.forEach(expense => {
      expensesByType[expense.expenseTypeId] = (expensesByType[expense.expenseTypeId] ?? 0) + expense.amount;
    });
    
    const formattedExpenseTypeData = Object.entries(expensesByType)
      .map(([typeId, value]) => ({ 
        name: typeId, // In a real app, you'd need to store expense type names locally too
        value 
      }));

    return {
      userCount,
      totalIncomeAmount,
      totalExpenseAmount,
      totalAssetAmount,
      profit,
      formattedIncomeData,
      formattedExpenseData,
      formattedExpenseTypeData,
    };
  } catch (error) {
    console.error("Error fetching offline dashboard data:", error);
    // Return empty data as fallback
    return {
      userCount: 0,
      totalIncomeAmount: 0,
      totalExpenseAmount: 0,
      totalAssetAmount: 0,
      profit: 0,
      formattedIncomeData: [],
      formattedExpenseData: [],
      formattedExpenseTypeData: [],
    };
  }
}

// Add other CRUD functions with offline support
// Example: Adding a patient with offline support
export async function addPatient(patientData: any) {
  try {
    if (isOnline()) {
      // Try to add to server
      try {
        const result = await prisma.patient.create({
          data: patientData
        });
        
        // Also store in offline db
        await offlineDb.patients.add({
          patientId: result.id,
          ...patientData,
          synced: true,
          pendingSync: false,
          lastUpdated: new Date()
        });
        
        return result;
      } catch (error) {
        console.error("Error adding patient to server:", error);
        // Fall back to offline storage
        return addPatientOffline(patientData);
      }
    } else {
      // Add to offline storage only
      return addPatientOffline(patientData);
    }
  } catch (error) {
    console.error("Error in addPatient:", error);
    throw error;
  }
}

async function addPatientOffline(patientData: any) {
  try {
    // Add to offline db with sync status
    const result = await offlineDb.patients.add({
      ...patientData,
      synced: false,
      pendingSync: true,
      lastUpdated: new Date()
    });
    
    // Update pending changes count
    await syncService.countPendingChanges();
    
    return {
      id: `offline-${result}`, // Use a prefix to indicate offline ID
      ...patientData,
      _offlineId: result
    };
  } catch (error) {
    console.error("Error adding patient offline:", error);
    throw error;
  }
}

// Implement similar patterns for other CRUD operations
// For memos, expenses, etc.

// Utility to trigger manual sync
export async function syncOfflineData() {
  if (!isOnline()) {
    return { success: false, message: "Cannot sync while offline" };
  }
  
  return syncService.syncData();
}
