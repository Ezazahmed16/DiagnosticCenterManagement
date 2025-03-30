'use client';
import React from "react";

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ selectedYear, onYearChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="year" className="text-sm font-medium">Select Year:</label>
      <select
        id="year"
        value={selectedYear}
        onChange={(e) => onYearChange(Number(e.target.value))}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
      >
        {years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};

export default YearSelector;