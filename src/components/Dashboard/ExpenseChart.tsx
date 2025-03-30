'use client';

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ExpenseChartProps {
  data: { month: string; total: number }[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ data }) => {
  return (
    <div className="w-full h-80 bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Yearly Expenses
      </h2>
      <ResponsiveContainer width="90%" height="90%" className="justify-center items-center flex mx-auto">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-700" />
          <XAxis dataKey="month" stroke="#6B7280" className="dark:stroke-black" />
          <YAxis stroke="#6B7280" className="dark:stroke-black" />
          <Tooltip
            contentStyle={{ backgroundColor: '#F9FAFB', borderColor: '#D1D5DB' }}
            labelStyle={{ color: '#1F2937' }}
            itemStyle={{ color: '#1F2937' }}
            wrapperClassName="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />
          <Legend wrapperStyle={{ color: '#4B5563' }} className="dark:text-gray-100" />
          <Bar dataKey="total" fill="#F87171" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
