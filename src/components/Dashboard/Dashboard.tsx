'use server';
import dynamic from "next/dynamic";
import React from "react";
import CardDataStats from "../CardDataStats";
import { FaMoneyCheck, FaUserTie } from "react-icons/fa";
import { GiExpense } from "react-icons/gi";
import { PiMathOperationsFill } from "react-icons/pi";
import prisma from "@/lib/prisma";

const Dashboard: React.FC = async () => {
  const userCount = await prisma.patient?.count();

  // Fetch total income
  const totalIncome = await prisma.memo.aggregate({
    _sum: {
      totalAmount: true,
    },
  });


  // Fetch total expense
  const totalExpense = await prisma.expense.aggregate({
    _sum: {
      amount: true,
    },
  });

  // Ensure null values are handled
  const totalIncomeAmount = totalIncome._sum?.totalAmount ?? 0; // Default to 0 if null
  const totalExpenseAmount = totalExpense._sum?.amount ?? 0; // Default to 0 if null

  // Calculate profit
  const profit = totalIncomeAmount - totalExpenseAmount;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total Patient" total={String(userCount)} rate="">
          <FaUserTie />
        </CardDataStats>
        <CardDataStats title="Total Income" total={String(totalIncomeAmount)} rate="">
          <PiMathOperationsFill />
        </CardDataStats>
        <CardDataStats
          title="Total Expense"
          total={String(totalExpenseAmount)}
          rate=""
        >
          <GiExpense />
        </CardDataStats>
        <CardDataStats title="Total Profit" total={String(profit)} rate="">
          <FaMoneyCheck />
        </CardDataStats>
      </div>
    </>
  );
};

export default Dashboard;


