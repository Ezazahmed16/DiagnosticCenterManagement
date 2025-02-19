'use server';
import React from "react";
import { FaMoneyCheck, FaUserTie } from "react-icons/fa";
import { GiExpense } from "react-icons/gi";
import { PiMathOperationsFill } from "react-icons/pi";
import CardDataStats from "../CardDataStats";
import prisma from "@/lib/prisma";
import { MdVideogameAsset } from "react-icons/md";

const Dashboard: React.FC = async () => {
  // Fetch total patient count
  const userCount = await prisma.patient?.count() ?? 0;

  // Fetch aggregates with null-safe defaults
  const totalIncomeAmount = (await prisma.memo.aggregate({ _sum: { totalAmount: true } }))._sum?.totalAmount ?? 0;
  const totalExpenseAmount = (await prisma.expense.aggregate({ _sum: { amount: true } }))._sum?.amount ?? 0;
  const totalAssetAmount = (await prisma.asset.aggregate({ _sum: { amount: true } }))._sum?.amount ?? 0;

  // Calculate profit
  const profit = totalIncomeAmount - totalExpenseAmount;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-5 2xl:gap-7.5">
      <CardDataStats title="Total Patients" total={userCount.toString()} rate="">
        <FaUserTie />
      </CardDataStats>

      <CardDataStats title="Total Income" total={`${totalIncomeAmount.toLocaleString()}`} rate="">
        <PiMathOperationsFill />
      </CardDataStats>

      <CardDataStats title="Total Expense" total={`${totalExpenseAmount.toLocaleString()}`} rate="">
        <GiExpense />
      </CardDataStats>

      <CardDataStats title="Total Assets" total={`${totalAssetAmount.toLocaleString()}`} rate="">
        <MdVideogameAsset />
      </CardDataStats>

      <CardDataStats title="Total Profit" total={`${profit.toLocaleString()}`} rate="">
        <FaMoneyCheck />
      </CardDataStats>
    </div>
  );
};

export default Dashboard;
