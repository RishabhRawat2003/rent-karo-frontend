"use client";
import React, { useState } from 'react';
import { Mail, Lock, UserRound, Phone, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '@/store/userSlice';
import { useRouter } from 'next/navigation';
import { LoadingSpinnerWithOverlay } from '@/components/Loading';
import { toast } from 'react-toastify';
import { GoogleSignUp } from '@/components/Authentication';

interface SignupFormData {
    role: 'buyer' | 'renter';
    fullName: string;
    mobileNo: string;
    email: string;
    password: string;
}

export default function Page() {
    const [formData, setFormData] = useState<SignupFormData>({
        role: 'buyer',
        fullName: '',
        mobileNo: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const { loading } = useSelector((state: any) => state.user);
    const router = useRouter()

    const handleRoleChange = (role: 'buyer' | 'renter') => {
        setFormData(prev => ({ ...prev, role }));
    };

    const validateForm = (data: SignupFormData): string | null => {
        toast.dismiss();
        const nameRegex = /^[A-Za-z\s]+$/;
        const mobileRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nameRegex.test(data.fullName)) {
            return "Full name can only contain letters and spaces.";
        }

        if (!mobileRegex.test(data.mobileNo)) {
            return "Mobile number must be exactly 10 digits.";
        }

        if (!emailRegex.test(data.email)) {
            return "Please enter a valid email address.";
        }

        if (data.password.length < 6) {
            return "Password must be at least 6 characters long.";
        }

        return null; // No errors
    };



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errorMessage = validateForm(formData);
        if (errorMessage) {
            toast.error(errorMessage);
            return;
        }
        const response = await dispatch(signup(formData as any) as any);
        if (response?.error) {
            toast.error(response.error.message);
        } else {
            toast.success('Account created successfully!');
            router.push('/');
            setFormData({
                role: 'buyer',
                fullName: '',
                mobileNo: '',
                email: '',
                password: '',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4 py-24">
            {
                loading && <LoadingSpinnerWithOverlay />
            }
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div className="text-center mb-10">
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                        Join as {formData.role === 'buyer' ? 'a Buyer' : 'a Renter'}
                    </h1>
                    <p className="text-gray-500">
                        {formData.role === 'buyer'
                            ? 'Discover and rent anything you need — buy if available'
                            : 'List your items for rent and connect with interested renters'}
                    </p>
                </div>

                {/* Role Selector */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <button
                        onClick={() => handleRoleChange('buyer')}
                        className={`flex-1 p-4 rounded-xl transition-all duration-300 ${formData.role === 'buyer'
                            ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                    >
                        <span className="block text-sm font-semibold">Buyer</span>
                        <span className="block text-xs mt-1">I want to purchase</span>
                    </button>
                    <button
                        onClick={() => handleRoleChange('renter')}
                        className={`flex-1 p-4 rounded-xl transition-all duration-300 ${formData.role === 'renter'
                            ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                    >
                        <span className="block text-sm font-semibold">Renter</span>
                        <span className="block text-xs mt-1">I want to list items</span>
                    </button>
                </div>

                <GoogleSignUp role={formData.role} />

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name Input */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <div className="relative">
                            <UserRound className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                name="fullName"
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Mobile Number Input */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                        <div className="relative">
                            <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                name="mobileNo"
                                type="tel"
                                required
                                maxLength={10}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="9876543210"
                                value={formData.mobileNo}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Allow only digits, and max 10 characters
                                    if (/^\d{0,10}$/.test(value)) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            mobileNo: value,
                                        }));
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative">
                            <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-br from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/pages/login" className="font-semibold text-blue-600 hover:text-blue-700">
                        Sign in here
                    </Link>
                </div>
            </div>
        </div>
    );
}