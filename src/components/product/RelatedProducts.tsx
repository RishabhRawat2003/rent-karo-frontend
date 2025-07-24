"use client";
import { getCategoryProduct } from "@/store/productSlice";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { LoadingSpinnerWithoutOverlay } from "../Loading";
import { Product } from "@/app/pages/products/page";

function ProductCard({ product }: { product: Product }) {
    const isForSale = product.wanted_to_sell;

    // For rental products, find the best deal
    const bestRentalDeal = product.rentalPricing?.length
        ? product.rentalPricing.reduce((prev, current) =>
            (current.discountPrice < prev.discountPrice) ? current : prev
        )
        : null;

    // For sale products, calculate savings
    const savings = product.realSellingPrice - product.sellingPrice;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="relative h-52">
                {product.images.length > 0 ? (
                    <Image
                        width={400}
                        height={400}
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
                    {isForSale ? (
                        product.discountOnSellingPrice > 0 && (
                            <span
                                className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                                style={{ backgroundColor: '#1447e6' }}
                            >
                                {product.discountOnSellingPrice}% OFF
                            </span>
                        )
                    ) : bestRentalDeal && bestRentalDeal.discount > 0 && (
                        <span
                            className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: '#1447e6' }}
                        >
                            {bestRentalDeal.discount}% OFF
                        </span>
                    )}
                </div>

                <div className="absolute bottom-3 left-3">
                    <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold text-white ${isForSale ? 'bg-green-600' : 'bg-blue-600'
                            }`}
                    >
                        {isForSale ? 'FOR SALE' : 'FOR RENT'}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-gray-800 line-clamp-1">{product.title}</h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-1">{product.subTitle}</p>
                    </div>
                    <span
                        className="text-xs font-medium px-2 py-1 text-center rounded-full"
                        style={{ backgroundColor: '#eff6ff', color: '#1447e6' }}
                    >
                        {product.sub_category}
                    </span>
                </div>

                <div className="mt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">
                            {isForSale ? 'Price:' : 'Daily Rate:'}
                        </span>
                        <div className="flex items-center space-x-2">
                            {isForSale ? (
                                <>
                                    {product.discountOnSellingPrice > 0 && (
                                        <span className="text-gray-400 text-sm line-through">
                                            ₹{product.realSellingPrice}
                                        </span>
                                    )}
                                    <span className="font-bold text-lg" style={{ color: '#1447e6' }}>
                                        ₹{product.sellingPrice}
                                    </span>
                                </>
                            ) : bestRentalDeal ? (
                                <>
                                    {bestRentalDeal.discount > 0 && (
                                        <span className="text-gray-400 text-sm line-through">
                                            ₹{bestRentalDeal.realPrice}
                                        </span>
                                    )}
                                    <span className="font-bold text-lg" style={{ color: '#1447e6' }}>
                                        ₹{bestRentalDeal.discountPrice}
                                    </span>
                                </>
                            ) : (
                                <span className="text-gray-500">Not available</span>
                            )}
                        </div>
                    </div>

                    {isForSale ? (
                        product.discountOnSellingPrice > 0 && (
                            <div className="mt-1 flex justify-between">
                                <span className="text-gray-500 text-sm">You save:</span>
                                <span className="text-green-600 font-medium text-sm">
                                    ₹{savings}
                                </span>
                            </div>
                        )
                    ) : bestRentalDeal && bestRentalDeal.discount > 0 && (
                        <div className="mt-1 flex justify-between">
                            <span className="text-gray-500 text-sm">You save:</span>
                            <span className="text-green-600 font-medium text-sm">
                                ₹{bestRentalDeal.realPrice - bestRentalDeal.discountPrice}
                            </span>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex justify-between items-center text-sm">
                    <span className={`inline-flex items-center ${product.stocks > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <span className={`w-2 h-2 rounded-full mr-1 ${product.stocks > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {product.stocks > 0 ? `${product.stocks} available` : 'Out of stock'}
                    </span>
                    <Link href={isForSale ? '' : `/pages/rent/${product._id}`} className="font-medium px-3 py-1.5 rounded-md hover:underline" style={{ color: '#1447e6' }}>
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RelatedProducts({ category }: any) {
    console.log(category);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const dispatch = useDispatch();

    async function getProduct() {
        setLoading(true);
        const data = {
            category
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await dispatch(getCategoryProduct(data as any) as any);
            if (response?.error) {
                toast.error(response.error.message);
            } else {
                setProducts(response.payload.products);
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to load product');
        }
        setLoading(false);
    }

    useEffect(() => {
        if (category) getProduct();
    }, [category]);

    return (
        < div className="mt-12" >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Similar Products</h2>
                <Link href={'/pages/rent'} className="text-sm text-blue-600 font-medium hover:text-blue-800">
                    View all
                </Link>
            </div>

            {loading ? (
                <LoadingSpinnerWithoutOverlay />
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </>
            )}
        </div >
    )
}

export default RelatedProducts