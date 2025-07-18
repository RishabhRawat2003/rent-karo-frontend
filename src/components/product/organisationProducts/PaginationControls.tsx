"use client";
import { ChevronLeft, ChevronRight } from 'lucide-react';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PaginationControls = ({ handlePageChange, pagination, products }: any) => (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
        <div className="text-sm text-gray-600">
            Showing {Math.min(pagination.limit, products.length)} of {pagination.totalProducts} products
        </div>

        <div className="flex items-center space-x-2">
            <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`p-2 rounded-md ${pagination.page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300'
                    }`}
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-1">
                {(() => {
                    const { page, totalPages } = pagination;
                    const pages = [];

                    if (totalPages <= 5) {
                        // Show all pages if total pages are 5 or less
                        for (let i = 1; i <= totalPages; i++) {
                            pages.push(i);
                        }
                    } else {
                        // Always show first page
                        pages.push(1);

                        if (page > 3) pages.push('...');

                        const start = Math.max(2, page - 1);
                        const end = Math.min(totalPages - 1, page + 1);

                        for (let i = start; i <= end; i++) {
                            pages.push(i);
                        }

                        if (page < totalPages - 2) pages.push('...');

                        // Always show last page
                        pages.push(totalPages);
                    }

                    return pages.map((p, index) =>
                        p === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                                ...
                            </span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => handlePageChange(p as number)}
                                className={`w-8 h-8 rounded-md text-sm ${pagination.page === p
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            >
                                {p}
                            </button>
                        )
                    );
                })()}
            </div>


            <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className={`p-2 rounded-md ${pagination.page >= pagination.totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300'
                    }`}
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    </div>
);