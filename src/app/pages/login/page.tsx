// app/login/page.tsx
"use client";
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login } from '@/store/userSlice';
import { toast } from 'react-toastify';
import { LoadingSpinnerWithOverlay } from '@/components/Loading';
import { GoogleSignIn } from '@/components/Authentication';

interface SigninFormData {
    email: string;
    password: string;
}

export default function Page() {
    const [formData, setFormData] = useState<SigninFormData>({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const disptach = useDispatch()
    const router = useRouter()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { loading } = useSelector((state: any) => state.user)

    const validateForm = (data: SigninFormData): string | null => {
        toast.dismiss();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await disptach(login(formData as any) as any)
        if (response?.error) {
            toast.error(response.error.message)
        } else {
            toast.success("User Logged in Successfully")
            router.push('/')
            setFormData({
                email: '',
                password: ''
            })
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4 py-24">
            {
                loading && <LoadingSpinnerWithOverlay />
            }
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div className="text-center mb-10">
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500">
                        Sign in to continue to your account
                    </p>
                </div>

                <GoogleSignIn />

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/pages/signup" className="font-semibold text-blue-600 hover:text-blue-700">
                        Sign up here
                    </Link>
                </div>
            </div>
        </div>
    );
}