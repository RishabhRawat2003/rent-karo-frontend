"use client";
import Link from 'next/link';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from "next/navigation";
import { TOKEN } from '@/utils/enum';
import { decodeToken } from '@/utils/decodeToken';
import { useSelector } from 'react-redux';
const Header = () => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartItems, setCartItems] = useState(3);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN) : null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { cart } = useSelector((state: any) => state.cart)

    const navigationLinks = [
        { name: 'Home', path: '/' },
        { name: 'Rent', path: '/pages/rent' },
        { name: 'Buy', path: '/pages/buy' },
        { name: 'Products', path: '/pages/products' },
        { name: 'About', path: '/pages/about' },
        { name: 'Contact', path: '/pages/contact' },
    ];

    useEffect(() => {
        setCartItems(cart.length || 0)
        if (storedToken) {
            const decodedToken = decodeToken(storedToken);
            if (decodedToken?.email) {
                setIsLoggedIn(true);
            }
        } else {
            setIsLoggedIn(false);
        }
        setLoading(false);
    }, [storedToken, cart]);

    if (loading) {
        return (
            <header className="bg-white shadow-sm border-b fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16 animate-pulse">
                        <div className="h-6 w-32 bg-gray-200 rounded"></div>

                        <nav className="hidden md:flex space-x-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-5 w-16 bg-gray-200 rounded"></div>
                            ))}
                        </nav>

                        <div className="flex items-center space-x-6">
                            <div className="h-6 w-6 bg-gray-200 rounded-full" />
                            <div className="h-6 w-6 bg-gray-200 rounded-full" />
                            <div className="md:hidden h-6 w-6 bg-gray-200 rounded" />
                        </div>
                    </div>

                    {/* Mobile menu skeleton (if needed) */}
                    <div className="md:hidden bg-gray-50 space-y-2 mt-2 animate-pulse p-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-4 w-full bg-gray-200 rounded"></div>
                        ))}
                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className="bg-white shadow-sm border-b fixed w-full z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-2xl font-bold">
                        <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                            RentKaro
                        </span>
                    </Link>

                    <nav className="hidden md:flex space-x-8">
                        {navigationLinks.map((link) => {
                            const isActive = pathname === link.path;
                            return (
                                <div key={link.name}>
                                    <Link
                                        href={link.path}
                                        className={`relative text-gray-700 hover:text-blue-600 transition-colors ${isActive ? "text-blue-600" : ""
                                            }`}
                                    >
                                        {link.name}
                                        {isActive && (
                                            <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600" />
                                        )}
                                    </Link>
                                </div>
                            );
                        })}
                    </nav>

                    <div className="flex items-center space-x-6">
                        {isLoggedIn && (
                            <div>
                                <Link href="/pages/cart" className="relative">
                                    <ShoppingCart className="text-2xl text-gray-700 hover:text-blue-600" />
                                    {cartItems > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                            {cartItems}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        )}

                        {isLoggedIn ? (
                            <div>
                                <Link href="/pages/account">
                                    <User className="text-2xl text-gray-700 hover:text-blue-600" />
                                </Link>
                            </div>
                        ) : (
                            <div className="hidden md:flex gap-4">
                                <Link
                                    href="/pages/login"
                                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/pages/signup"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        <button
                            className="md:hidden p-2 text-gray-700"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="text-2xl" /> : <Menu className="text-2xl" />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden bg-gray-50">
                        {navigationLinks.map((link) => {
                            const isActive = pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    className={`block py-3 px-4 ${isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                        {!isLoggedIn && (
                            <>
                                <Link
                                    href="/pages/login"
                                    className="block py-3 px-4 text-gray-700 hover:bg-gray-100 border-t"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/pages/signup"
                                    className="block py-3 px-4 text-gray-700 hover:bg-gray-100"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;