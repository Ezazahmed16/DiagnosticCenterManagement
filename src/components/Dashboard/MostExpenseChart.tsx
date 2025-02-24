"use client";
import React from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

interface MostExpenseChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ["#60A5FA", "#F87171", "#34D399", "#FBBF24", "#A78BFA"];

const MostExpenseChart: React.FC<MostExpenseChartProps> = ({ data }) => {
  const hasData = data && data.length > 0;

  return (
    <div className="w-full h-100 rounded-2xl shadow-lg p-4 text-gray-800 dark:text-white bg-white dark:bg-gray-900">
      <h2 className="text-lg font-semibold mb-4 text-center">Most Expense</h2>
      {hasData ? (
        <ResponsiveContainer width="80%" height="80%" className="flex justify-center items-center mx-auto">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}  
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} 
              labelStyle={{ color: "#374151" }} 
              itemStyle={{ color: "#374151" }}
              wrapperClassName="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
            />
            <Legend 
              wrapperStyle={{ color: "#374151" }} 
              className="dark:text-gray-100 text-sm"
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No expense data available.</p>
      )}
    </div>
  );
};

export default MostExpenseChart;
