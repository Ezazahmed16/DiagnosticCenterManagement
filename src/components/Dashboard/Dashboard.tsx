'use server';

import React from "react";
import { FaMoneyCheck, FaUserTie } from "react-icons/fa";
import { GiExpense } from "react-icons/gi";
import { PiMathOperationsFill } from "react-icons/pi";
import { MdVideogameAsset } from "react-icons/md";
import CardDataStats from "../CardDataStats";
import prisma from "@/lib/prisma";
import IncomeChart from "./IncomeChart";
import ExpenseChart from "./ExpenseChart";
import MostExpenseChart from "./MostExpenseChart";

const Dashboard: React.FC = async () => {
  const userCount = (await prisma.patient.count()) ?? 0; // Removed cacheStrategy
  const totalIncomeAmount = (await prisma.memo.aggregate({ _sum: { totalAmount: true } }))._sum?.totalAmount ?? 0;
  const totalExpenseAmount = (await prisma.expense.aggregate({ _sum: { amount: true } }))._sum?.amount ?? 0;
  const totalAssetAmount = (await prisma.asset.aggregate({ _sum: { amount: true } }))._sum?.amount ?? 0;
  const profit = totalIncomeAmount - totalExpenseAmount;

  // 📈 Monthly Income Data
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

  // 📉 Monthly Expense Data
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

  // 📊 Current Month Expenses by Type
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

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-5 2xl:gap-7.5">
        <CardDataStats title="Total Patients" total={userCount.toString()} rate=""><FaUserTie /></CardDataStats>
        <CardDataStats title="Total Income" total={`${totalIncomeAmount.toLocaleString()}`} rate=""><PiMathOperationsFill /></CardDataStats>
        <CardDataStats title="Total Expense" total={`${totalExpenseAmount.toLocaleString()}`} rate=""><GiExpense /></CardDataStats>
        <CardDataStats title="Total Assets" total={`${totalAssetAmount.toLocaleString()}`} rate=""><MdVideogameAsset /></CardDataStats>
        <CardDataStats title="Total Profit" total={`${profit.toLocaleString()}`} rate=""><FaMoneyCheck /></CardDataStats>
      </div>

      <div className="py-5">
        <IncomeChart data={formattedIncomeData} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-10">
        <div className="col-span-8">
          <ExpenseChart data={formattedExpenseData} />
        </div>
        <div className="col-span-4">
          <MostExpenseChart data={formattedExpenseTypeData} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
