// app/admin/login/page.tsx
"use client";
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { LoadingSpinnerWithOverlay } from '@/components/Loading';
import { login } from '@/store/adminSlice';


interface AdminLoginFormData {
    email: string;
    password: string;
}

export default function AdminLoginPage() {
    const [formData, setFormData] = useState<AdminLoginFormData>({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { loading } = useSelector((state: any) => state.admin);

    const validateForm = (data: AdminLoginFormData): string | null => {
        toast.dismiss();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(data.email)) {
            return "Please enter a valid admin email address.";
        }

        if (data.password.length < 8) {
            return "Admin password must be at least 8 characters long.";
        }

        return null;
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
        const response = await dispatch(login(formData as any) as any);
        if (response?.error) {
            toast.error(response.error.message);
        } else {
            toast.success("Admin login successful");
            router.push('/admin-dashboard/statistics');
            setFormData({ email: '', password: '' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center p-4 py-24">
            {loading && <LoadingSpinnerWithOverlay />}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div className="text-center mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        Admin Portal
                    </h1>
                    <p className="text-gray-500">
                        Sign in to access the administration panel
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Admin Email</label>
                        <div className="relative">
                            <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="admin@example.com"
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
                                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
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
                        className="w-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
                    >
                        Sign in as Admin
                    </button>
                </form>
            </div>
        </div>
    );
}