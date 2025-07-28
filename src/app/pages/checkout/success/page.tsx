// pages/order-success.tsx or app/order-success/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, Package, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderSuccessPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br pt-20 from-[#f0f7ff] to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1447e6] to-[#3b82f6]"></div>
          
          {/* Success Icon */}
          <div className="relative mb-8">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-[#1447e6] to-[#3b82f6] rounded-full flex items-center justify-center mb-6 shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#1447e6] rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-2 -right-6 w-6 h-6 bg-[#1447e6] rounded-full opacity-30 animate-pulse delay-300"></div>
          </div>

          {/* Success Message */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Order Placed Successfully! 🎉
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Thank you for your purchase!
            </p>
            <p className="text-gray-500">
              Your order has been confirmed and is being processed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row md:justify-center">
            {/* My Orders Button */}
            <Link href="/pages/account">
              <button className="w-full md:w-auto group bg-[#1447e6] hover:bg-[#0f3cc9] text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center">
                <Package className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                View My Orders
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>

            {/* Continue Shopping Button */}
            <Link href="/pages/products">
              <button className="w-full md:w-auto group bg-white hover:bg-[#f0f7ff] text-[#1447e6] px-8 py-4 rounded-2xl font-semibold border-2 border-[#1447e6] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Continue Shopping
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              📧 A confirmation email has been sent to your registered email address
            </p>
            <p className="text-sm text-gray-500">
              📱 Track your order status in the &quot;My Orders&quot; section
            </p>
          </div>
        </div>

        {/* Bottom Decorative Elements */}
        <div className="flex justify-center mt-8 space-x-4">
          <div className="w-3 h-3 bg-[#1447e6] rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-[#1447e6] rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-[#1447e6] rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
