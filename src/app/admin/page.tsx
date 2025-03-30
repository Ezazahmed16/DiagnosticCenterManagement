'use client';
export const dynamic = "force-dynamic";

import React, { useState } from "react";
import Dashboard from "@/components/Dashboard/Dashboard";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { role } from "@/lib/data";
// import YearSelector from "@/components/Dashboard/YearSelector";

const Page = () => {
  // const currentYear = new Date().getFullYear();
  // const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // const handleYearChange = (year: number) => {
  //   setSelectedYear(year);
  // };

  return (
    <DefaultLayout userRole={role}>
      {/* <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <YearSelector selectedYear={selectedYear} onYearChange={handleYearChange} />
      </div> */}
      <Dashboard />
    </DefaultLayout>
  );
};

export default Page;
