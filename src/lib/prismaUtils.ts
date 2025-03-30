'use server';

import prisma from "@/lib/prisma";

export const getDashboardData = async () => {
  const userCount = (await prisma.patient.count()) ?? 0;
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
};
