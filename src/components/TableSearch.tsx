// 'use client'
// import { useRouter } from "next/navigation";
// import { CiSearch } from "react-icons/ci";

// const TableSearch = () => {
//     const router = useRouter()

//     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         const value = (e.currentTarget[0] as HTMLInputElement).value;
//         console.log(value)
//         const params = new URLSearchParams(window.location.search);
//         params.set("search", value);
//         router.push(`${window.location.pathname}?${params}`);
//     };

//     return (
//         <form onSubmit={handleSubmit} className="relative">
//             <button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2">
//                 <CiSearch className="h-6 w-6" />
//             </button>
//             <input
//                 type="text"
//                 placeholder="Type to search..."
//                 className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none lg:w-60 border-2 py-2 rounded-3xl"
//             />
//         </form>
//     );
// };

// export default TableSearch;


"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";

const TableSearch = () => {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const value = (e.currentTarget[0] as HTMLInputElement).value;

        const params = new URLSearchParams(window.location.search);
        params.set("search", value);
        router.push(`${window.location.pathname}?${params}`);
    };

    return (
        // <form
        //   onSubmit={handleSubmit}
        //   className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
        // >
        //   <Image src="/search.png" alt="" width={14} height={14} />
        //   <input
        //     type="text"
        //     placeholder="Search..."
        //     className="w-[200px] p-2 bg-transparent outline-none"
        //   />
        // </form>
        <form onSubmit={handleSubmit} className="relative">
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <CiSearch className="h-6 w-6" />
            </div>
            <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none lg:w-60 border-2 py-2 rounded-3xl"
            />
        </form>
    );
};

export default TableSearch;