"use client";
import { Home, ShieldCheck, Handshake, Zap, Star } from 'lucide-react';

export const ProductFeatures = () => {
    const features = [
        {
            icon: Home,
            title: "Easy Rentals",
            text: "Find perfect items nearby with our location-based search",
            stats: "5K+ Daily Listings",
            color: "bg-blue-600",
            badge: "Popular"
        },
        {
            icon: ShieldCheck,
            title: "Secure Transactions",
            text: "Protected payments and verified user profiles",
            stats: "100% Safety Guarantee",
            color: "bg-green-600",
            badge: "Verified"
        },
        {
            icon: Handshake,
            title: "Trusted Community",
            text: "Connect with reliable local renters and owners",
            stats: "4.9/5 User Rating",
            color: "bg-blue-400",
            badge: "Certified"
        },
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-blue-50 to-gray-50 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-center" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <div className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full mb-4 text-sm font-medium">
                        Why Choose RentKaro
                    </div>
                    <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                        Seamless Rental Experience
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover why thousands trust RentKaro for their rental needs and item sharing
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative z-10">
                    {features.map(({ icon: Icon, title, text, stats, color, badge }) => (
                        <div
                            key={title}
                            className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                        >
                            {/* Badge */}
                            {badge && (
                                <div className="absolute -top-3 right-4 bg-white px-3 py-1 rounded-full shadow-sm text-sm font-medium flex items-center gap-1 border border-blue-100">
                                    <Zap className="w-4 h-4 text-blue-600" />
                                    {badge}
                                </div>
                            )}

                            {/* Icon Container */}
                            <div className={`${color} w-16 h-16 rounded-xl mb-6 flex items-center justify-center transition-transform duration-300`}>
                                <Icon className="w-8 h-8 text-white" />
                            </div>

                            {/* Content */}
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
                            <p className="text-gray-600 mb-6">{text}</p>

                            {/* Stats */}
                            <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
                                <span>{stats}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Stats */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-5xl mx-auto">
                    {[
                        { value: "50K+", label: "Active Users" },
                        { value: "200+", label: "Cities Available" },
                        { value: "4.9★", label: "Average Rating" },
                        { value: "24/7", label: "Support" }
                    ].map((stat) => (
                        <div key={stat.label} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
                            <div className="text-gray-600 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};