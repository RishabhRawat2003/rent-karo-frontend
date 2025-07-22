"use client";

import { getAllProducts } from "@/store/productSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Image from "next/image";
import { LoadingSpinnerWithOverlay } from "@/components/Loading";

interface RentalPricing {
    day: number;
    discount: number;
    discountPrice: number;
    realPrice: number;
    _id: string;
}

interface Product {
    _id: string;
    title: string;
    subTitle: string;
    category: string;
    images: string[];
    rentalPricing: RentalPricing[];
    stocks: number;
    createdAt: string;
    updatedAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    totalPages: number;
    totalProducts: number;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 20,
        totalPages: 1,
        totalProducts: 0,
    });
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    async function getProducts() {
        setLoading(true);
        try {
            const data = {
                ...pagination,
                wanted_to_sell: false,
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await dispatch(getAllProducts(data as any) as any)
            if (response?.error) {
                toast.error(response.error.message);
            } else {
                setProducts(response.payload.products);
                setPagination(prev => ({
                    ...prev,
                    totalPages: response.payload.totalPages,
                    totalProducts: response.payload.totalProducts,
                }));
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to load products');
        }
        setLoading(false);
    }

    useEffect(() => {
        getProducts();
    }, [pagination.page]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    return (
        <div className="min-h-screen pt-16" style={{ backgroundColor: '#eff6ff' }}>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:justify-between md:flex-row gap-6 md:gap-0 md:items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">All Rental Products</h2>
                        <p className="text-gray-600 mt-1">Professional equipment available for rent</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Sort by:</span>
                        <select className="bg-white border border-gray-300 rounded-md px-3 py-1.5">
                            <option>Most Popular</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Newest First</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinnerWithOverlay />
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        <PaginationControls
                            pagination={pagination}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
    const bestDeal = product.rentalPricing.reduce((prev, current) =>
        (current.discountPrice < prev.discountPrice) ? current : prev
    );

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="relative h-52">
                {product.images.length > 0 ? (
                    <Image
                        width={100}
                        height={100}
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    {bestDeal.discount > 0 && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#1447e6' }}>
                            {bestDeal.discount}% OFF
                        </span>
                    )}
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-gray-800 line-clamp-1">{product.title}</h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-1">{product.subTitle}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: '#eff6ff', color: '#1447e6' }}>
                        {product.category}
                    </span>
                </div>

                <div className="mt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Daily Rate:</span>
                        <div className="flex items-center space-x-2">
                            {bestDeal.discount > 0 && (
                                <span className="text-gray-400 text-sm line-through">
                                    ₹{bestDeal.realPrice}
                                </span>
                            )}
                            <span className="font-bold text-lg" style={{ color: '#1447e6' }}>
                                ₹{bestDeal.discountPrice}
                            </span>
                        </div>
                    </div>

                    {bestDeal.discount > 0 && (
                        <div className="mt-1 flex justify-between">
                            <span className="text-gray-500 text-sm">You save:</span>
                            <span className="text-green-600 font-medium text-sm">
                                ₹{bestDeal.realPrice - bestDeal.discountPrice}
                            </span>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex justify-between items-center text-sm">
                    <span className={`inline-flex items-center ${product.stocks > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <span className={`w-2 h-2 rounded-full mr-1 ${product.stocks > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {product.stocks > 0 ? `${product.stocks} available` : 'Out of stock'}
                    </span>
                    <button className="font-medium px-3 py-1.5 rounded-md hover:underline" style={{ color: '#1447e6' }}>
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}

// Pagination Controls Component
function PaginationControls({
    pagination,
    onPageChange
}: {
    pagination: Pagination;
    onPageChange: (page: number) => void;
}) {
    return (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.totalProducts)}
                </span>{' '}
                of <span className="font-medium">{pagination.totalProducts}</span> products
            </div>

            <div className="flex space-x-2">
                <button
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`px-4 py-2 rounded-md ${pagination.page === 1
                            ? 'bg-gray-200 cursor-not-allowed text-gray-400'
                            : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'
                        }`}
                >
                    Previous
                </button>

                <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                            pageNum = i + 1;
                        } else if (pagination.page > pagination.totalPages - 3) {
                            pageNum = pagination.totalPages - 4 + i;
                        } else {
                            pageNum = pagination.page - 2 + i;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`w-10 h-10 rounded-md ${pagination.page === pageNum
                                        ? 'text-white font-bold'
                                        : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'
                                    }`}
                                style={{
                                    backgroundColor: pagination.page === pageNum ? '#1447e6' : 'white',
                                    borderColor: pagination.page === pageNum ? '#1447e6' : '#d1d5db'
                                }}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className={`px-4 py-2 rounded-md ${pagination.page >= pagination.totalPages
                            ? 'bg-gray-200 cursor-not-allowed text-gray-400'
                            : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}