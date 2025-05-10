"use client";

import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter, useSearchParams } from "next/navigation";

const Pagination = ({ page, count }: { page: number; count: number }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const totalPages = Math.ceil(count / ITEM_PER_PAGE);

    const changePage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${window.location.pathname}?${params.toString()}`);
    };

    // Calculate which pages to show
    const getVisiblePages = () => {
        const pages = [];
        const showPages = 7;
        const halfShow = Math.floor(showPages / 2);

        let start = Math.max(1, page - halfShow);
        let end = Math.min(totalPages, start + showPages - 1);

        // Adjust if we're near the end
        if (end === totalPages) {
            start = Math.max(1, end - showPages + 1);
        }
        // Adjust if we're near the start
        if (start === 1) {
            end = Math.min(totalPages, start + showPages - 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="p-4 flex items-center justify-between text-gray-500">
            <button
                onClick={() => changePage(page - 1)}
                disabled={page === 1}
                className={`py-2 px-4 rounded-md text-xs font-semibold ${page === 1
                        ? "bg-slate-200 opacity-50 cursor-not-allowed"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
            >
                Prev
            </button>
            <div className="flex items-center gap-2 text-sm">
                {getVisiblePages().map((pageIndex) => (
                    <button
                        key={pageIndex}
                        onClick={() => changePage(pageIndex)}
                        className={`px-3 py-1 rounded-sm ${page === pageIndex
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                    >
                        {pageIndex}
                    </button>
                ))}
            </div>
            <button
                onClick={() => changePage(page + 1)}
                disabled={page === totalPages}
                className={`py-2 px-4 rounded-md text-xs font-semibold ${page === totalPages
                        ? "bg-slate-200 opacity-50 cursor-not-allowed"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;