"use client";
import { Star, Home, Key, Shield, Calendar, Handshake } from 'lucide-react';

export const Testimonials = () => {
    const testimonials = [
        {
            name: "Rajesh Mehta",
            role: "Property Owner",
            text: "RentKaro helped me earn ₹50k+ monthly by renting out my unused furniture. Their verification process gives me peace of mind with every transaction.",
            rating: 5,
            badge: "Verified Owner",
            avatar: "bg-gradient-to-br from-blue-400 to-green-500",
            rentals: 42
        },
        {
            name: "Priya Singh",
            role: "Frequent Renter",
            text: "Found perfect wedding decor within my budget! The quality assurance and easy pickup process made everything stress-free.",
            rating: 5,
            badge: "Top Renter",
            avatar: "bg-gradient-to-br from-purple-400 to-pink-500",
            rentals: 28
        },
        {
            name: "Amit Patel",
            role: "Small Business Owner",
            text: "Renting equipment through RentKaro cut my startup costs by 60%. The damage protection plan is a game-changer!",
            rating: 5,
            badge: "Power User",
            avatar: "bg-gradient-to-br from-orange-400 to-yellow-500",
            rentals: 35
        },
        {
            name: "Neha Gupta",
            role: "College Student",
            text: "Earned my tuition fees by renting out textbooks. The app's rating system helps me choose trustworthy renters effortlessly.",
            rating: 5,
            badge: "Rookie Pro",
            avatar: "bg-gradient-to-br from-green-400 to-blue-500",
            rentals: 19
        }
    ];

    return (
        <section className="relative py-24 bg-gradient-to-b from-blue-50 to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-6 py-2 rounded-full mb-6">
                        <Handshake className="w-5 h-5" />
                        <span className="font-medium">Trusted Community</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                        Why Renters & Owners Love Us
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Join thousands who've transformed their rental experience
                    </p>
                </div>

                {/* Testimonial Grid */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.name}
                            className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200"
                        >
                            {/* User Header */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`${testimonial.avatar} w-12 h-12 rounded-lg`} />
                                <div>
                                    <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>{testimonial.role}</span>
                                        <span>•</span>
                                        <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full">
                                            <Home className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm">{testimonial.rentals} Rentals</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, j) => (
                                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-gray-600 mb-4">"{testimonial.text}"</p>

                            {/* Badge & Features */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                                    <Shield className="w-4 h-4 text-green-600" />
                                    <span className="text-sm text-green-600">{testimonial.badge}</span>
                                </div>
                                <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                                    <Calendar className="w-5 h-5" />
                                    <span className="text-sm">View History</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Footer */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {[
                        { value: "50K+", label: "Successful Rentals", icon: <Key className="w-6 h-6" /> },
                        { value: "200+", label: "Cities Active", icon: <Home className="w-6 h-6" /> },
                        { value: "4.9★", label: "Average Rating", icon: <Star className="w-6 h-6" /> },
                        { value: "98%", label: "Verified Users", icon: <Shield className="w-6 h-6" /> }
                    ].map((stat) => (
                        <div key={stat.label} className="p-4 bg-white rounded-lg border border-gray-200">
                            <div className="flex justify-center mb-2 text-blue-600">
                                {stat.icon}
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-gray-600 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};