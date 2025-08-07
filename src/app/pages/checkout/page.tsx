"use client"
import { useDispatch, useSelector } from "react-redux";
import { CartItem } from "../cart/page";
import { useEffect, useState } from "react";
import { decodeToken } from "@/utils/decodeToken";
import { toast } from "react-toastify";
import { TOKEN } from "@/utils/enum";
import { useRouter } from "next/navigation";
import { userDetails } from "@/store/userSlice";
import { LoadingSpinnerWithOverlay } from "@/components/Loading";
import { createPayment, verifyPayment } from "@/store/orderSlice";
import { clearCart } from "@/store/cartSlice";
import Image from "next/image";
import { getKycByUser } from "@/store/kycSlice";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Razorpay: any;
    }
}
interface RentalPricing {
    day: number;
    realPrice: number;
    discount: number;
    discountPrice?: number;
}

interface OrderItem {
    product_id: string;
    quantity: number;
    wanted_to_sell: boolean;
    realSellingPrice?: number;
    sellingPrice?: number;
    discountOnSellingPrice?: number;
    rentalPricing: RentalPricing[];
}

interface CheckoutFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    pincode: string;
    city: string;
    state: string;
}

function CheckoutPage() {
    const [formData, setFormData] = useState<CheckoutFormData>({
        name: '',
        email: '',
        phone: '',
        address: '',
        pincode: '',
        city: '',
        state: ''
    });
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter()
    const dispatch = useDispatch();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { cart } = useSelector((state: any) => state.cart);

    // Convert cart items to order items format
    const convertCartToOrderItems = (): OrderItem[] => {
        return cart.map((item: CartItem) => ({
            product_id: item._id,
            quantity: item.quantity,
            wanted_to_sell: item.wanted_to_sell,
            realSellingPrice: item?.realSellingPrice || 0,
            sellingPrice: item?.sellingPrice || 0,
            discountOnSellingPrice: item?.discountOnSellingPrice || 0,
            rentalPricing: item?.rentalPricing || []
        }));
    };

    function calculateItemTotal(item: CartItem) {
        if (item.wanted_to_sell) {
            const price = item.sellingPrice || item.realSellingPrice || 0;
            return price * item.quantity;
        } else {
            const price = item.rentalPricing?.[0]?.discountPrice || item.rentalPricing?.[0]?.realPrice || 0;
            return price * item.quantity;
        }
    }

    function calculateCartTotal() {
        return cart.reduce((total: number, item: CartItem) => {
            return total + calculateItemTotal(item);
        }, 0);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function getStatusOfKyc() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await dispatch(getKycByUser() as any)
        if (response?.error) {
            toast.error(response.error.message)
        } else {
            return response.payload.kyc
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (cart.length === 0) {
            toast.error('Cart is empty')
            return
        }

        if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.pincode || !formData.city || !formData.state) {
            toast.error('Please fill all the fields')
            return
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const kyc: any = await getStatusOfKyc();
        if (!kyc) {
            toast.error('Please do the kyc verification first.')
            router.push('/pages/account/kyc')
            return
        }

        if (kyc.kycStatus !== 'approved') {
            toast.error('Your kyc is not approved Yet.')
            router.push('/pages/account/kyc')
            return
        }

        setIsSubmitting(true);

        const orderData = {
            ...formData,
            user_id: userId,
            order_items: convertCartToOrderItems(),
            shipping_amount: 50,
            items_total: calculateCartTotal(),
            total_amount: calculateCartTotal() + 50
        };

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await dispatch(createPayment({ amount: orderData.total_amount } as any) as any)
            if (response?.error) {
                toast.error(response.error.message)
            } else {
                const data = response.payload.data;
                const paymentObject = new window.Razorpay({
                    key: "rzp_test_UhfLjJSfwteOmt",
                    order_id: data.id,
                    ...data,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    handler: async function (response: any) {
                        const option2 = {
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            ...orderData
                        };
                        setLoading(true);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const res = await dispatch(verifyPayment(option2 as any) as any)
                        if (res?.error) {
                            toast.error(res.error.message)
                        } else {
                            dispatch(clearCart())
                            toast.success("Order Placed Successfully");
                            router.push('/pages/checkout/success')
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            toast.info('Payment cancelled');
                        }
                    }
                });
                paymentObject.open();
            }
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    async function getUserDetails() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await dispatch(userDetails() as any)
        if (response?.error) {
            toast.error(response.error.message)
        } else {
            setFormData({
                name: response.payload.user.fullName,
                email: response.payload.user.email,
                phone: response.payload.user.mobileNo || '',
                address: response.payload.user.address || '',
                pincode: response.payload.user.pincode || '',
                city: response.payload.user.city || '',
                state: response.payload.user.state || ''
            })
            setLoading(false)
        }
    }

    useEffect(() => {
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
        setUserId(decodedToken.id);
        getUserDetails();
    }, []);

    const subtotal = calculateCartTotal();
    const shipping = 50;
    const total = subtotal + shipping;

    if (loading) return (
        <div className="w-full h-screen">
            <LoadingSpinnerWithOverlay />
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 py-8 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex flex-col gap-3 sm:flex-row sm:gap-0 items-center space-x-4">
                            <div className="flex items-center">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="ml-2 text-sm text-green-600 font-medium">Cart</span>
                            </div>

                            <div className="hidden sm:block w-8 h-0.5 bg-gray-300"></div>

                            <div className="flex items-center">
                                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                                <span className="ml-2 text-sm text-blue-600 font-medium">Checkout</span>
                            </div>

                            <div className="hidden sm:block w-8 h-0.5 bg-gray-300"></div>

                            <div className="flex items-center">
                                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                                <span className="ml-2 text-sm text-gray-400 font-medium">Complete</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Title */}
                    <div className="mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Checkout
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Complete your order securely
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Review your information and place your order with confidence
                        </p>
                    </div>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                        <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Secure
                        </span>
                        <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Trusted
                        </span>
                        <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                            Fast
                        </span>
                    </div>
                </div>
                <div className="lg:grid lg:grid-cols-2 lg:gap-12">
                    {/* Left Column - Form */}
                    <div>
                        <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8 mb-8 lg:mb-0">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Shipping Information
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                {/* Address Information */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Address *</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                                        placeholder="Enter your complete address"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">Pincode *</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            required
                                            maxLength={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            placeholder="400001"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            placeholder="Mumbai"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">State *</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            placeholder="Maharashtra"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button - Mobile */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full lg:hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            Place Order
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8 lg:sticky lg:top-8 h-fit">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Order Summary
                        </h2>

                        {/* Cart Items */}
                        <div className="space-y-4 mb-6">
                            {cart.map((item: CartItem, index: number) => (
                                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <Image width={100} height={100} src={item.images[0]} alt={item.title} className="max-w-full max-h-full" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                                        <div className="flex gap-2">
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            <p className="text-sm text-gray-500">Type: {item.wanted_to_sell ? "Sell" : "Rental"}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        ₹{calculateItemTotal(item).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Price Breakdown */}
                        <div className="border-t border-gray-200 pt-6 space-y-4">
                            <div className="flex justify-between text-base text-gray-600">
                                <span>Subtotal ({cart.length} items)</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between text-base text-gray-600">
                                <span>Shipping</span>
                                <span>₹{shipping.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between text-base text-gray-600">
                                <span>Tax</span>
                                <span>₹0</span>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button - Desktop */}
                        <button
                            type="submit"
                            form="checkoutForm"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                            className="hidden lg:flex w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center mt-6"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    Place Order • ₹{total.toLocaleString()}
                                </>
                            )}
                        </button>

                        {/* Security Notice */}
                        <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Secure & encrypted checkout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
