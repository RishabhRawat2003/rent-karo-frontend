"use client";
import { Product } from '@/app/pages/account/my-listing/page';
import Image from 'next/image';
import React from 'react'
import { Image as ImageIcon } from 'lucide-react';
import { renderPricing } from './RenderPricing';


function ProductCard({ product , setCurrentProduct}: { product: Product ; setCurrentProduct: (product: Product) => void}) {
    return (
        <div
            className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer bg-white"
            onClick={() => setCurrentProduct(product)}
        >
            <div className="relative aspect-video bg-gray-50 flex items-center justify-center">
                {product.images?.[0] ? (
                    <Image
                        width={1000}
                        height={1000}
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).className = "hidden";
                        }}
                    />
                ) : (
                    <div className="flex flex-col items-center text-gray-400 p-4">
                        <ImageIcon className="w-10 h-10" />
                        <span className="text-xs mt-2">No image</span>
                    </div>
                )}
                {product.blockedByAdmin && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Blocked
                    </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {product.category}
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-gray-900 truncate flex-1">{product.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${product.wanted_to_sell
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                        }`}
                    >
                        {product.wanted_to_sell ? 'Sale' : 'Rent'}
                    </span>
                </div>

                <p className="text-gray-600 text-sm mt-1 line-clamp-2 h-10">{product.subTitle}</p>

                {renderPricing(product)}

                <div className="flex justify-between items-center mt-3">
                    <span className="text-sm font-medium">
                        Stock: {product.stocks}
                    </span>
                    <span className="text-xs text-gray-500">
                        {new Date(product.updatedAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ProductCard