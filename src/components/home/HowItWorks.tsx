"use client";
import { Search, Calendar, Shield, Truck, Check, ArrowRight, Zap } from 'lucide-react';

export const HowItWorks = () => {
    const steps = [
        {
            title: "Browse Listings",
            icon: Search,
            description: "Explore thousands of verified rental items in your area with detailed descriptions and real photos",
            link: "View Rentals"
        },
        {
            title: "Select & Book",
            icon: Calendar,
            description: "Choose your rental dates and confirm availability with instant booking confirmation",
            link: "Booking Guide"
        },
        {
            title: "Secure Payment",
            icon: Shield,
            description: "Protected transactions with multiple payment options and damage insurance coverage",
            link: "Safety Features"
        },
        {
            title: "Pickup/Delivery",
            icon: Truck,
            description: "Flexible collection options or doorstep delivery within 24 hours of booking confirmation",
            link: "Delivery Info"
        },
    ];

    return (
        <section className="relative py-24 bg-gradient-to-b from-blue-50 to-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-6 py-2 rounded-full mb-6">
                        <Zap className="w-5 h-5" />
                        <span className="font-medium">Rental Process</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                        Simple 4-Step Rental Process
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        From discovery to delivery - experience hassle-free rentals with our trusted platform
                    </p>
                </div>

                {/* Timeline Container */}
                <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute left-1/2 h-full w-1 bg-gradient-to-b from-blue-600 to-green-600">
                        <div className="absolute -left-2.5 top-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                            <Check className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Steps */}
                    {steps.map(({ title, icon: Icon, description, link }, i) => (
                        <div
                            key={title}
                            className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'} mb-16 last:mb-0`}
                        >
                            <div className="w-full lg:w-1/2 p-4 relative group">
                                {/* Step Content */}
                                <div className={`p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all ${i % 2 === 0 ? 'lg:ml-12' : 'lg:mr-12'} border border-gray-200`}>
                                    {/* Step Header */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <span className="text-blue-600 font-bold text-sm">STEP {i + 1}</span>
                                            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                                        </div>
                                    </div>

                                    {/* Step Description */}
                                    <p className="text-gray-600 mb-4">{description}</p>

                                    {/* Learn More Link */}
                                    <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                                        <span className="text-sm font-medium">{link}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats & CTA */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {[
                        { value: "10K+", label: "Active Listings" },
                        { value: "95%", label: "Happy Renters" },
                        { value: "4.9★", label: "Average Rating" },
                        { value: "50+", label: "Cities Served" }
                    ].map((stat) => (
                        <div key={stat.label} className="p-4 bg-white rounded-lg border border-gray-200">
                            <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
                            <div className="text-gray-600 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
                        Start Renting Now
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
};