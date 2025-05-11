"use client";

import React, { useEffect, useState } from "react";
import { FaMoneyCheck, FaUserTie } from "react-icons/fa";
import { GiExpense } from "react-icons/gi";
import { PiMathOperationsFill } from "react-icons/pi";
import { MdVideogameAsset } from "react-icons/md";
import CardDataStats from "../CardDataStats";
import IncomeChart from "./IncomeChart";
import ExpenseChart from "./ExpenseChart";
import MostExpenseChart from "./MostExpenseChart";
import { getDashboardData } from "@/lib/prismaUtils";
import SyncStatus from "../SyncStatus";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      fetchData();
    };
    const handleOffline = () => {
      setIsOffline(true);
      fetchData(); // This will now use offline data
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboardData = await getDashboardData();
      setData(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={fetchData}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <>
      {isOffline && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p className="font-medium">You are currently offline</p>
          <p className="text-sm">Showing data from local storage</p>
        </div>
      )}

      <div className="flex justify-end mb-4">
        <SyncStatus />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-5 2xl:gap-7.5">
        <CardDataStats 
          title="Total Patients" 
          total={data.userCount} 
          icon={<FaUserTie />} 
        />
        <CardDataStats 
          title="Total Income" 
          total={data.totalIncomeAmount} 
          icon={<PiMathOperationsFill />} 
        />
        <CardDataStats 
          title="Total Expense" 
          total={data.totalExpenseAmount} 
          icon={<GiExpense />} 
        />
        <CardDataStats 
          title="Total Assets" 
          total={data.totalAssetAmount} 
          icon={<MdVideogameAsset />} 
        />
        <CardDataStats 
          title="Total Profit" 
          total={data.profit} 
          icon={<FaMoneyCheck />} 
        />
      </div>

      <div className="py-5">
        <IncomeChart data={data.formattedIncomeData} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-10">
        <div className="col-span-8">
          <ExpenseChart data={data.formattedExpenseData} />
        </div>
        <div className="col-span-4">
          <MostExpenseChart data={data.formattedExpenseTypeData} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
