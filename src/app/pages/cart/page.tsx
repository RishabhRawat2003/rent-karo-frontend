"use client"
import React from 'react'
import { ShoppingBag, LogIn, Plus, Minus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image: string
}

const CartPage = () => {
    const [isLoggedIn] = React.useState(true)
    const [cartItems, setCartItems] = React.useState<CartItem[]>([
        {
            id: '1',
            name: 'Premium Wireless Headphones',
            price: 249.99,
            quantity: 1,
            image: '/placeholder-product.jpg'
        },
        {
            id: '2',
            name: 'Smart Fitness Tracker',
            price: 129.99,
            quantity: 2,
            image: '/placeholder-product.jpg'
        }
    ])

    const handleIncrement = (id: string) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        )
    }

    const handleDecrement = (id: string) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
            )
        )
    }

    const handleRemove = (id: string) => {
        setCartItems(items => items.filter(item => item.id !== id))
    }

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 mt-14 text-gray-800">Your Shopping Cart</h1>

            {!isLoggedIn ? (
                <div className="text-center py-12 animate-fade-in">
                    <div className="relative inline-block">
                        <ShoppingBag className="mx-auto h-24 w-24 text-blue-500 mb-4 animate-bounce" />
                        <div className="absolute -top-2 -right-2 bg-blue-100 rounded-full p-2">
                            <LogIn className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Sign in to access your cart</h2>
                    <Link href={'/pages/login'} className="bg-blue-600 hover:bg-blue-700 transition-transform transform hover:scale-105 text-white px-8 py-3 rounded-xl flex items-center gap-2 mx-auto w-fit shadow-lg">
                        <LogIn className="h-5 w-5" />
                        Sign In
                    </Link>
                </div>
            ) : cartItems.length === 0 ? (
                <div className="text-center py-12 animate-fade-in">
                    <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-4 animate-float" />
                    <h2 className="text-xl font-semibold mb-4 text-gray-600">Your cart feels lonely</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg">
                        Explore Products
                    </button>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="group flex items-center gap-4 p-6 border rounded-xl bg-white hover:shadow-lg transition-shadow duration-300">
                                <Image
                                    width={100}
                                    height={100}
                                    src={item.image}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-lg border"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1">
                                        <button
                                            onClick={() => handleDecrement(item.id)}
                                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                        >
                                            <Minus className="h-4 w-4 text-gray-700" />
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => handleIncrement(item.id)}
                                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                        >
                                            <Plus className="h-4 w-4 text-gray-700" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="hidden group-hover:inline">Remove</span>
                                    </button>
                                </div>
                                <p className="w-24 text-right font-semibold text-lg text-gray-800">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="border rounded-xl p-6 bg-white h-fit shadow-sm sticky top-8">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800">Order Summary</h2>
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">
                                    ${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium">$5.00</span>
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-800">Total</span>
                                    <span className="font-bold text-blue-600 text-xl">
                                        ${(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 5).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg">
                            Proceed to Checkout
                        </button>
                        <div className="mt-4 text-center">
                            <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm flex items-center justify-center gap-1">
                                <Plus className="h-4 w-4" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CartPage