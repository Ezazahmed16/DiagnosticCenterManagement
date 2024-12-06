import React from 'react'
import { CiSearch } from "react-icons/ci";

const TableSearch = () => {
    return (
        <div className="relative">
            <button className="absolute left-2 top-1/2 -translate-y-1/2">
                <CiSearch className="h-6 w-6" />
            </button>
            <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none lg:w-60 border-2 py-2 rounded-3xl"
            />
        </div>
    )
}

export default TableSearch