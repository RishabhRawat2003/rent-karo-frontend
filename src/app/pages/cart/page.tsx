"use client"
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/store/cartSlice';
import { decodeToken } from '@/utils/decodeToken';
import { TOKEN } from '@/utils/enum';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface CartItem {
    _id: string;
    title: string;
    subTitle: string;
    category: string;
    sub_category: string;
    images: string[];
    stocks: number;
    quantity: number;
    wanted_to_sell: boolean;
    // For selling products
    realSellingPrice?: number;
    sellingPrice?: number;
    discountOnSellingPrice?: number;
    // For rental products
    rentalPricing?: Array<{
        day: number;
        realPrice: number;
        discount: number;
        discountPrice: number;
        _id: string;
    }>;
}

const CartPage = () => {
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { cart } = useSelector((state: any) => state.cart);
    const dispatch = useDispatch();

    function increaseProductQuantity(id: string) {
        dispatch(increaseQuantity(id));
    }

    function decreaseProductQuantity(id: string) {
        dispatch(decreaseQuantity(id));
    }

    function removeProductFromCart(id: string) {
        dispatch(removeFromCart(id));
    }


    function calculateItemTotal(item: CartItem) {
        if (item.wanted_to_sell) {
            // Selling product
            const price = item.sellingPrice || item.realSellingPrice || 0;
            return price * item.quantity;
        } else {
            // Rental product - just use the first (and only) pricing option
            const price = item.rentalPricing?.[0]?.discountPrice || item.rentalPricing?.[0]?.realPrice || 0;
            return price * item.quantity;
        }
    }

    function calculateCartTotal() {
        return cart.reduce((total: number, item: CartItem) => {
            return total + calculateItemTotal(item);
        }, 0);
    }

    function handleSubmit() {
        const token = JSON.parse(localStorage.getItem(TOKEN) as string);
        if (!token) {
            toast.error('You are not logged in');
            router.push('/pages/login');
            return;
        }
        const decodedToken = decodeToken(token);
        if (decodedToken.role === 'renter') {
            toast.error('You are not allowed to create an order. Only users can create an order.');
            return;
        }
        // Proceed with checkout
        router.push('/pages/checkout');
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br flex justify-center items-center from-[#f1f7ff] to-white">
                <div className="max-w-6xl mx-auto p-4 md:p-8">
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                        <div className="bg-white rounded-full p-8 shadow-lg mb-6">
                            <ShoppingBag size={64} className="text-[#1447e6] mx-auto" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8 max-w-md">
                            Looks like you haven&apos;t added any items to your cart yet. Start shopping to fill it up!
                        </p>
                        <button
                            onClick={() => router.push('/pages/products')}
                            className="bg-[#1447e6] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                        >
                            Start Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f7ff] to-white">
            <div className="max-w-8xl mx-auto p-4 md:p-8">
                <div className="pt-14 pb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
                    <p className="text-gray-600">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item: CartItem) => (
                            <div key={item._id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Product Image */}
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={item.images[0]}
                                            width={400}
                                            height={400}
                                            alt={item.title}
                                            className="w-full md:w-48 h-48 object-cover rounded-lg border border-gray-200"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                                            <p className="text-gray-600 text-sm">{item.subTitle}</p>
                                            <div className="flex gap-2 mt-2">
                                                <span className="bg-[#f1f7ff] capitalize text-[#1447e6] px-2 py-1 rounded text-xs font-medium">
                                                    {item.category}
                                                </span>
                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                                    {item.sub_category}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${item.wanted_to_sell ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {item.wanted_to_sell ? 'For Sale' : 'For Rent'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Rental Days Selection (for rental items) */}
                                        {!item.wanted_to_sell && item.rentalPricing && item.rentalPricing.length > 0 && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Rental Duration:</label>
                                                <div className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50">
                                                    <span className="font-medium">
                                                        {item.rentalPricing[0].day} day{item.rentalPricing[0].day > 1 ? 's' : ''} - ₹{item.rentalPricing[0].discountPrice}
                                                    </span>
                                                    {item.rentalPricing[0].discount > 0 && (
                                                        <span className="text-gray-600 ml-2">
                                                            (₹{item.rentalPricing[0].realPrice} - {item.rentalPricing[0].discount}% off)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}


                                        {/* Price Display */}
                                        <div className="space-y-1">
                                            {item.wanted_to_sell ? (
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="text-2xl font-bold text-[#1447e6]">
                                                        ₹{(item.sellingPrice || item.realSellingPrice || 0).toLocaleString()}
                                                    </span>
                                                    {item.discountOnSellingPrice && item.realSellingPrice && item.sellingPrice && (
                                                        <>
                                                            <span className="text-lg text-gray-500 line-through">
                                                                ₹{item.realSellingPrice.toLocaleString()}
                                                            </span>
                                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                                                                {item.discountOnSellingPrice}% OFF
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                item.rentalPricing && item.rentalPricing.length > 0 && (
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span className="text-2xl font-bold text-[#1447e6]">
                                                            ₹{item.rentalPricing[0].discountPrice.toLocaleString()}
                                                        </span>
                                                        {item.rentalPricing[0].discount > 0 && (
                                                            <>
                                                                <span className="text-lg text-gray-500 line-through">
                                                                    ₹{item.rentalPricing[0].realPrice.toLocaleString()}
                                                                </span>
                                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                                                                    {item.rentalPricing[0].discount}% OFF
                                                                </span>
                                                            </>
                                                        )}
                                                        <span className="text-sm text-gray-600">
                                                            per {item.rentalPricing[0].day} day{item.rentalPricing[0].day > 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>


                                        {/* Quantity and Actions */}
                                        <div className="flex sm:items-center sm:justify-between">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                                <div className="flex items-center border border-gray-300 rounded-lg">
                                                    <button
                                                        onClick={() => decreaseProductQuantity(item._id)}
                                                        disabled={item.quantity <= 1}
                                                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="px-4 py-2 border-x border-gray-300 font-medium min-w-[60px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => increaseProductQuantity(item._id)}
                                                        disabled={item.quantity >= item.stocks}
                                                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    ({item.stocks} available)
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => removeProductFromCart(item._id)}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        {/* Item Total */}
                                        <div className="pt-3 border-t border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-600">
                                                    Subtotal ({item.quantity} item{item.quantity > 1 ? 's' : ''}):
                                                </span>
                                                <span className="text-lg font-bold text-[#1447e6]">
                                                    ₹{calculateItemTotal(item).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-20">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Items ({cart.length})</span>
                                    <span>₹{calculateCartTotal().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between text-lg font-bold text-gray-800">
                                        <span>Total</span>
                                        <span className="text-[#1447e6]">₹{calculateCartTotal().toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="w-full bg-[#1447e6] text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                Proceed to Checkout
                                <ArrowRight size={18} />
                            </button>

                            <button
                                onClick={() => router.push('/pages/products')}
                                className="w-full mt-3 border border-[#1447e6] text-[#1447e6] py-3 px-6 rounded-lg font-semibold hover:bg-[#f1f7ff] transition-colors duration-200"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
