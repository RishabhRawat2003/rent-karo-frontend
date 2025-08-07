"use client";
import React, { useState } from 'react';
import { Mail, Lock, UserRound, Phone, Eye, EyeOff, Shield } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '@/store/userSlice';
import { useRouter } from 'next/navigation';
import { LoadingSpinnerWithOverlay } from '@/components/Loading';
import { toast } from 'react-toastify';
import { GoogleSignUp } from '@/components/Authentication';
import { sendOtp, verifyOtp } from '@/store/otpSlice';

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
    const [otp, setOtp] = useState('');
    const [currentStep, setCurrentStep] = useState<'signup' | 'otp' | 'verified'>('signup');
    const [otpVerified, setOtpVerified] = useState(false);
    
    const dispatch = useDispatch();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { loading } = useSelector((state: any) => state.user);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { loading: otpLoading } = useSelector((state: any) => state.otp);
    const router = useRouter();

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

        return null;
    };

    const sendOtpToUser = async () => {
        const data = {
            email: formData.email
        };
        
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await dispatch(sendOtp(data as any) as any);
            if (response?.error) {
                toast.error(response.error.message);
                return false;
            } else {
                toast.success('OTP sent successfully to your email!');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setCurrentStep('otp');
                return true;
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to send OTP. Please try again.');
            return false;
        }
    };

    const verifyOtpCode = async () => {
        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return false;
        }

        const data = {
            email: formData.email,
            otp: otp
        };

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await dispatch(verifyOtp(data as any) as any);
            if (response?.error) {
                toast.error(response.error.message);
                return false;
            } else {
                toast.success('OTP verified successfully!');
                setOtpVerified(true);
                setCurrentStep('verified');
                return true;
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to verify OTP. Please try again.');
            return false;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleInitialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errorMessage = validateForm(formData);
        if (errorMessage) {
            toast.error(errorMessage);
            return;
        }
        
        // Send OTP for verification
        await sendOtpToUser();
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await verifyOtpCode();
    };

    const handleFinalSubmit = async () => {
        if (!otpVerified) {
            toast.error('Please verify your email first');
            return;
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await dispatch(signup(formData as any) as any);
            if (response?.error) {
                toast.error(response.error.message);
            } else {
                toast.success('Account created successfully!');
                router.push('/');
                // Reset form
                setFormData({
                    role: 'buyer',
                    fullName: '',
                    mobileNo: '',
                    email: '',
                    password: '',
                });
                setOtp('');
                setCurrentStep('signup');
                setOtpVerified(false);
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to create account. Please try again.');
        }
    };

    const resetToSignup = () => {
        setCurrentStep('signup');
        setOtpVerified(false);
        setOtp('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4 py-24">
            {(loading || otpLoading) && <LoadingSpinnerWithOverlay />}
            
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
                {/* Progress Indicator */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                            currentStep === 'signup' ? 'bg-blue-600 text-white' : 
                            currentStep === 'otp' || currentStep === 'verified' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                            1
                        </div>
                        <div className={`w-12 h-1 ${currentStep === 'otp' || currentStep === 'verified' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                            currentStep === 'otp' ? 'bg-blue-600 text-white' : 
                            currentStep === 'verified' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                            2
                        </div>
                        <div className={`w-12 h-1 ${currentStep === 'verified' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                            currentStep === 'verified' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                            3
                        </div>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                        {currentStep === 'signup' && `Join as ${formData.role === 'buyer' ? 'a Buyer' : 'a Renter'}`}
                        {currentStep === 'otp' && 'Verify Your Email'}
                        {currentStep === 'verified' && 'Complete Registration'}
                    </h1>
                    <p className="text-gray-500">
                        {currentStep === 'signup' && (formData.role === 'buyer'
                            ? 'Discover and rent anything you need — buy if available'
                            : 'List your items for rent and connect with interested renters')}
                        {currentStep === 'otp' && 'We\'ve sent a verification code to your email address'}
                        {currentStep === 'verified' && 'Your email is verified! Click below to create your account.'}
                    </p>
                </div>

                {/* Step 1: Signup Form */}
                {currentStep === 'signup' && (
                    <>
                        {/* Role Selector */}
                        <div className="flex flex-col md:flex-row gap-4 mb-10">
                            <button
                                onClick={() => handleRoleChange('buyer')}
                                className={`flex-1 p-4 rounded-xl transition-all duration-300 ${
                                    formData.role === 'buyer'
                                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                <span className="block text-sm font-semibold">Buyer</span>
                                <span className="block text-xs mt-1">I want to purchase</span>
                            </button>
                            <button
                                onClick={() => handleRoleChange('renter')}
                                className={`flex-1 p-4 rounded-xl transition-all duration-300 ${
                                    formData.role === 'renter'
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

                        <form onSubmit={handleInitialSubmit} className="space-y-6">
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
                                disabled={loading || otpLoading}
                                className="w-full bg-gradient-to-br from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl disabled:opacity-50"
                            >
                                Send Verification Code
                            </button>
                        </form>
                    </>
                )}

                {/* Step 2: OTP Verification */}
                {currentStep === 'otp' && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-gray-600 mb-2">
                                We&apos;ve sent a 6-digit verification code to:
                            </p>
                            <p className="font-semibold text-gray-900">{formData.email}</p>
                        </div>

                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Enter Verification Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-center text-2xl font-mono tracking-widest"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d{0,6}$/.test(value)) {
                                            setOtp(value);
                                        }
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={otpLoading || otp.length !== 6}
                                className="w-full bg-gradient-to-br from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl disabled:opacity-50"
                            >
                                Verify Code
                            </button>
                        </form>

                        <div className="text-center space-y-2">
                            <button
                                onClick={sendOtpToUser}
                                disabled={otpLoading}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50"
                            >
                                Resend verification code
                            </button>
                            <br />
                            <button
                                onClick={resetToSignup}
                                className="text-gray-500 hover:text-gray-700 text-sm"
                            >
                                ← Back to signup form
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Final Confirmation */}
                {currentStep === 'verified' && (
                    <div className="space-y-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                            <p className="text-sm text-gray-600">Creating account for:</p>
                            <p className="font-semibold text-gray-900">{formData.fullName}</p>
                            <p className="text-sm text-gray-600">{formData.email}</p>
                            <p className="text-sm text-gray-600">Role: {formData.role === 'buyer' ? 'Buyer' : 'Renter'}</p>
                        </div>

                        <button
                            onClick={handleFinalSubmit}
                            disabled={loading}
                            className="w-full bg-gradient-to-br from-green-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl disabled:opacity-50"
                        >
                            Create My Account
                        </button>

                        <button
                            onClick={resetToSignup}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                            ← Start over
                        </button>
                    </div>
                )}

                {currentStep === 'signup' && (
                    <div className="mt-8 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href="/pages/login" className="font-semibold text-blue-600 hover:text-blue-700">
                            Sign in here
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
