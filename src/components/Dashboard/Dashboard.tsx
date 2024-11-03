"use client";
import dynamic from "next/dynamic";
import React from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";

import CardDataStats from "../CardDataStats";
import { FaMoneyCheck, FaUserTie } from "react-icons/fa";
import { GiExpense } from "react-icons/gi";
import { PiMathOperationsFill } from "react-icons/pi";


const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});

const Dashboard: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total Patient" total="1,872" rate="">
          <FaUserTie />
        </CardDataStats>
        <CardDataStats title="Total Income" total="45,102" rate="">
          <PiMathOperationsFill />
        </CardDataStats>
        <CardDataStats title="Total Expense" total="2.450" rate="" >
          <GiExpense />
        </CardDataStats>
        <CardDataStats title="Total Profit" total="3.456" rate="" >
          <FaMoneyCheck />
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
      </div>
    </>
  );
};

export default Dashboard;
