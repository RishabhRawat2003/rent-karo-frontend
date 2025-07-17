"use client";
import { Product } from "@/app/pages/account/my-listing/page";

export const renderPricing = (product: Product) => {
    const hasRental = product.rentalPricing?.some(rp => rp.day > 0 && rp.discountPrice > 0);

    return (
        <div className="mt-2">
            {product.wanted_to_sell && (
                <div className="flex flex-wrap items-center gap-1">
                    <span className="font-semibold">Sale:</span>
                    <span className="text-green-600 font-medium">
                        ₹{product.sellingPrice.toLocaleString()}
                    </span>
                    {product.discountOnSellingPrice > 0 && (
                        <span className="text-xs text-gray-500 line-through ml-1">
                            ₹{product.realSellingPrice.toLocaleString()}
                        </span>
                    )}
                </div>
            )}

            {hasRental && product.rentalPricing.filter(rp => rp.day > 0).map((rp, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-1 mt-1">
                    <span className="font-semibold">Rent ({rp.day} day{rp.day > 1 ? 's' : ''}):</span>
                    <span className="text-blue-600 font-medium">
                        ₹{rp.discountPrice.toLocaleString()}
                    </span>
                    {rp.discount > 0 && (
                        <span className="text-xs text-gray-500 line-through ml-1">
                            ₹{rp.realPrice.toLocaleString()}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};