"use client";
import { getAllProducts } from '@/store/productSlice';
import { ArrowRight, Star, Verified, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { LoadingSpinnerWithoutOverlay } from '../Loading';
import { useRouter } from 'next/navigation';

interface RentalPricing {
    day: number;
    discount: number;
    discountPrice: number;
    realPrice: number;
    _id: string;
}

interface Organisation {
    _id: string;
    name: string;
    is_verified: boolean;
}

interface Product {
    _id: string;
    title: string;
    subTitle: string;
    category: string;
    sub_category: string;
    images: string[];
    rentalPricing: RentalPricing[];
    stocks: number;
    description: string;
    organisationId: Organisation;
    createdAt: string;
    updatedAt: string;
}

export const ProductShowcase = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const router = useRouter();

    const getProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = {
                wanted_to_sell: false
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await dispatch(getAllProducts(data as any) as any);
            if (response?.error) {
                toast.error(response.error.message);
            } else {
                console.log(response.payload.products);
                setProducts(response.payload.products.slice(0, 6));
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to load products');
        }
        setLoading(false);
    }, [dispatch]);

    useEffect(() => {
        getProducts();
    }, [getProducts]);

    const handleProductClick = (productId: string) => {
        router.push(`/pages/rent/${productId}`);
    };

    const formatPrice = (pricing: RentalPricing[]) => {
        if (!pricing || pricing.length === 0) return '₹0/day';
        const firstPricing = pricing[0];
        return `₹${firstPricing.discountPrice}/day`;
    };

    const getCategoryIcon = (category: string) => {
        // You can add more category-specific icons here
        switch (category.toLowerCase()) {
            case 'electronics':
                return '📱';
            case 'furniture':
                return '🪑';
            case 'vehicles':
                return '🚗';
            case 'tools':
                return '🔧';
            case 'clothing':
                return '👕';
            default:
                return '📦';
        }
    };

    if (loading) {
        return (
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold mb-16 text-center">
                        <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                            Featured Rentals
                        </span>
                    </h2>
                    <LoadingSpinnerWithoutOverlay />
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold mb-16 text-center">
                    <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                        Featured Rentals
                    </span>
                </h2>

                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products available at the moment.</p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="relative group break-inside-avoid cursor-pointer"
                                onClick={() => handleProductClick(product._id)}
                            >
                                <div className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all bg-white">
                                    {/* Image Container */}
                                    <div className="relative overflow-hidden">
                                        <Image
                                            width={400}
                                            height={300}
                                            src={product.images?.[0] || '/placeholder-image.jpg'}
                                            alt={product.title}
                                            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/placeholder-image.jpg';
                                            }}
                                        />

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                                        {/* Top Badges */}
                                        <div className="absolute top-4 left-4 right-4 flex justify-between">
                                            <div className="flex items-center gap-2 text-sm text-white bg-blue-600/90 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                                <span>{getCategoryIcon(product.category)}</span>
                                                <span className="capitalize">{product.category}</span>
                                            </div>
                                            {product.organisationId?.is_verified && (
                                                <div className="flex items-center gap-1 bg-green-600/90 text-white px-3 py-1.5 rounded-full backdrop-blur-sm text-sm">
                                                    <Verified className="w-4 h-4" />
                                                    Verified
                                                </div>
                                            )}
                                        </div>

                                        {/* Stock Badge */}
                                        {product.stocks > 0 && (
                                            <div className="absolute bottom-4 left-4">
                                                <div className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                                    {product.stocks} in stock
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6">
                                        <div className="mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-1 line-clamp-2">
                                                {product.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-1">
                                                {product.subTitle}
                                            </p>
                                        </div>

                                        {/* Rating and Owner */}
                                        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star className="w-4 h-4 fill-yellow-400" />
                                                <span>4.8</span>
                                            </div>
                                            <span className="text-gray-400">•</span>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                <span className="line-clamp-1">
                                                    {product.organisationId?.name || 'Owner'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {product.description}
                                        </p>

                                        {/* Price and Action */}
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-bold text-blue-600">
                                                    {formatPrice(product.rentalPricing)}
                                                </span>
                                                {product.rentalPricing?.[0]?.realPrice > product.rentalPricing?.[0]?.discountPrice && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        ₹{product.rentalPricing[0].realPrice}/day
                                                    </span>
                                                )}
                                            </div>
                                            <button 
                                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleProductClick(product._id);
                                                }}
                                            >
                                                Rent Now
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Discount Badge */}
                                        {product.rentalPricing?.[0]?.discount > 0 && (
                                            <div className="mt-3">
                                                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                                    {product.rentalPricing[0].discount}% OFF
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* View All CTA */}
                <div className="mt-16 text-center">
                    <button 
                        className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                        onClick={() => router.push('/pages/rent')}
                    >
                        View All Listings
                    </button>
                </div>
            </div>
        </section>
    );
};
