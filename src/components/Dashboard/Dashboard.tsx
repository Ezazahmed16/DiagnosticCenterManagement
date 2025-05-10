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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh data when online status changes
    const handleOnline = () => fetchData();
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <SyncStatus />
      </div>
    
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-5 2xl:gap-7.5">
        <CardDataStats title="Total Patients" total={data.userCount.toString()} rate=""><FaUserTie /></CardDataStats>
        <CardDataStats title="Total Income" total={`${data.totalIncomeAmount.toLocaleString()}`} rate=""><PiMathOperationsFill /></CardDataStats>
        <CardDataStats title="Total Expense" total={`${data.totalExpenseAmount.toLocaleString()}`} rate=""><GiExpense /></CardDataStats>
        <CardDataStats title="Total Assets" total={`${data.totalAssetAmount.toLocaleString()}`} rate=""><MdVideogameAsset /></CardDataStats>
        <CardDataStats title="Total Profit" total={`${data.profit.toLocaleString()}`} rate=""><FaMoneyCheck /></CardDataStats>
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
