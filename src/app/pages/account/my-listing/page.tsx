"use client";
import { useState } from 'react';
import { PlusCircle, Image as ImageIcon } from 'lucide-react';
import CreateProductForm from '@/components/Product/CreateProductForm';

interface Product {
    _id: string;
    title: string;
    subTitle: string;
    description: string;
    images: string[];
    stocks: number;
    realSellingPrice: number;
    discountOnSellingPrice: number;
    sellingPrice: number;
    rentalPricing: Array<{
        day: number;
        realPrice: number;
        discount: number;
        discountPrice: number;
    }>;
    specificationSchema: Array<{
        title: string;
        data: Array<{
            key: string;
            value: string;
        }>;
    }>;
}

export default function ProductsPage() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [products, setProducts] = useState<Product[]>([
        {
            _id: '1',
            title: 'Professional DSLR Camera',
            subTitle: '4K Video & 24MP Photos',
            description: 'High-end professional camera with full-frame sensor',
            images: [
                'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            stocks: 5,
            realSellingPrice: 120000,
            discountOnSellingPrice: 15,
            sellingPrice: 102000,
            rentalPricing: [
                { day: 1, realPrice: 5000, discount: 10, discountPrice: 4500 },
                { day: 3, realPrice: 12000, discount: 15, discountPrice: 10200 }
            ],
            specificationSchema: [
                {
                    title: 'Camera Specs',
                    data: [
                        { key: 'Sensor', value: 'Full Frame CMOS' },
                        { key: 'Resolution', value: '24.2 MP' },
                        { key: 'ISO Range', value: '100-25600' }
                    ]
                }
            ]
        },
        {
            _id: '2',
            title: 'Studio Lighting Kit',
            subTitle: '3-Point Lighting System',
            description: 'Professional studio lighting setup with softboxes',
            images: [
                'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ],
            stocks: 8,
            realSellingPrice: 45000,
            discountOnSellingPrice: 0,
            sellingPrice: 45000,
            rentalPricing: [
                { day: 1, realPrice: 2000, discount: 0, discountPrice: 2000 },
                { day: 7, realPrice: 12000, discount: 20, discountPrice: 9600 }
            ],
            specificationSchema: [
                {
                    title: 'Kit Contents',
                    data: [
                        { key: 'Lights', value: '3 x 1000W LED' },
                        { key: 'Softboxes', value: '60cm Octa' },
                        { key: 'Stands', value: '3 Adjustable' }
                    ]
                }
            ]
        },
        {
            _id: '3',
            title: 'Camera Lens 50mm f/1.8',
            subTitle: 'Prime Portrait Lens',
            description: 'Versatile prime lens with wide aperture',
            images: [],
            stocks: 3,
            realSellingPrice: 25000,
            discountOnSellingPrice: 20,
            sellingPrice: 20000,
            rentalPricing: [],
            specificationSchema: [
                {
                    title: 'Optical Specs',
                    data: [
                        { key: 'Focal Length', value: '50mm' },
                        { key: 'Aperture', value: 'f/1.8 - f/22' },
                        { key: 'Filter Size', value: '58mm' }
                    ]
                }
            ]
        }
    ]);

    return (
        <div className="container min-h-screen pt-20 mx-auto p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Product List</h1>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <PlusCircle className="w-5 h-5" />
                    Create Product
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-out overflow-hidden">
                        {/* Image Section */}
                        <div className="relative aspect-[3/2] bg-gray-50">
                            {product.images[0] ? (
                                <>
                                    <img
                                        src={product.images[0]}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-16 h-16 text-gray-300" />
                                </div>
                            )}

                            {/* Image Count Badge */}
                            {product.images.length > 1 && (
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                                    +{product.images.length - 1}
                                </div>
                            )}

                            {/* Stock Badge */}
                            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                                {product.stocks > 0 ? (
                                    <span className="text-green-600">{product.stocks} in stock</span>
                                ) : (
                                    <span className="text-red-600">Out of stock</span>
                                )}
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-5 space-y-4">
                            {/* Title & Price */}
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-gray-900 truncate">{product.title}</h2>
                                <p className="text-gray-500 text-sm">{product.subTitle}</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-blue-600">
                                        ₹{product.sellingPrice.toLocaleString()}
                                    </span>
                                    {product.discountOnSellingPrice > 0 && (
                                        <span className="text-sm text-gray-400 line-through">
                                            ₹{product.realSellingPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Specifications */}
                            {product.specificationSchema.map((spec) => (
                                <div key={spec.title} className="space-y-2">
                                    <h3 className="text-sm font-semibold text-gray-700">{spec.title}</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {spec.data.map((item) => (
                                            <div key={item.key} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg">
                                                <span className="text-gray-500">{item.key}</span>
                                                <span className="font-medium text-gray-700">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Rental Plans */}
                            {product.rentalPricing.length > 0 && (
                                <div className="pt-4 border-t border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Rental Plans</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {product.rentalPricing.map((plan) => (
                                            <div key={plan.day} className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-medium text-gray-900">{plan.day} Days</span>
                                                    {plan.discount > 0 && (
                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                            {plan.discount}% OFF
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-lg font-bold text-blue-600">
                                                        ₹{plan.discountPrice.toLocaleString()}
                                                    </span>
                                                    {plan.discount > 0 && (
                                                        <span className="text-sm text-gray-400 line-through">
                                                            ₹{plan.realPrice.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showCreateForm && (
                <CreateProductForm
                    onClose={() => setShowCreateForm(false)}
                    onProductCreated={(newProduct) => setProducts([...products, newProduct])}
                />
            )}
        </div>
    );
}
