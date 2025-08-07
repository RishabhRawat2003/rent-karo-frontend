"use client";
import { Star, Shield, Users, TrendingUp, Award, CheckCircle, Quote } from 'lucide-react';

export const Testimonials = () => {
    const testimonials = [
        {
            name: "Rajesh Mehta",
            role: "Property Owner",
            text: "RentKaro helped me earn ₹50k+ monthly by renting out my unused furniture. Their verification process gives me peace of mind with every transaction.",
            rating: 5,
            badge: "Verified Owner",
            rentals: 42,
            avatar: "RM",
            color: "from-blue-500 to-blue-600"
        },
        {
            name: "Priya Singh",
            role: "Frequent Renter",
            text: "Found perfect wedding decor within my budget! The quality assurance and easy pickup process made everything stress-free.",
            rating: 4,
            badge: "Top Renter",
            rentals: 28,
            avatar: "PS",
            color: "from-purple-500 to-purple-600"
        },
        {
            name: "Amit Patel",
            role: "Small Business Owner",
            text: "Renting equipment through RentKaro cut my startup costs by 60%. The damage protection plan is a game-changer!",
            rating: 5,
            badge: "Power User",
            rentals: 35,
            avatar: "AP",
            color: "from-orange-500 to-orange-600"
        },
        {
            name: "Neha Gupta",
            role: "College Student",
            text: "Earned my tuition fees by renting out textbooks. The app's rating system helps me choose trustworthy renters effortlessly.",
            rating: 5,
            badge: "Rookie Pro",
            rentals: 19,
            avatar: "NG",
            color: "from-green-500 to-green-600"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6 font-medium">
                        <Users className="w-4 h-4" />
                        Trusted by 50,000+ Users
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        What Our Community Says
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Real experiences from property owners and renters who&apos;ve transformed their rental journey with RentKaro
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="relative bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Quote Icon */}
                            <div className="absolute -top-4 left-8">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                                    <Quote className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center mb-6 pt-2">
                                <div className="flex items-center">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            className="w-5 h-5 text-yellow-500 fill-current" 
                                        />
                                    ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-500 font-medium">
                                    {testimonial.rating}.0
                                </span>
                            </div>

                            {/* Testimonial Text */}
                            <blockquote className="text-gray-700 mb-8 text-lg leading-relaxed font-medium">
                                &quot;{testimonial.text}&quot;
                            </blockquote>

                            {/* User Info */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 bg-gradient-to-r ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold shadow-md`}>
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-lg">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-gray-500">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full mb-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span className="text-sm text-green-700 font-medium">
                                            {testimonial.badge}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {testimonial.rentals} successful rentals
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced Stats Section */}
                <div className="relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl opacity-50"></div>
                    
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-10">
                        <div className="text-center mb-10">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                Platform Statistics
                            </h3>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Numbers that speak for our commitment to excellence and user satisfaction
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { 
                                    value: "1,000+", 
                                    label: "Active Users", 
                                    icon: <Users className="w-8 h-8" />,
                                    color: "text-blue-600",
                                    bgColor: "bg-blue-50"
                                },
                                { 
                                    value: "10+", 
                                    label: "Cities Covered", 
                                    icon: <TrendingUp className="w-8 h-8" />,
                                    color: "text-green-600",
                                    bgColor: "bg-green-50"
                                },
                                { 
                                    value: "4.0/5", 
                                    label: "Average Rating", 
                                    icon: <Star className="w-8 h-8" />,
                                    color: "text-yellow-600",
                                    bgColor: "bg-yellow-50"
                                },
                                { 
                                    value: "98%", 
                                    label: "Success Rate", 
                                    icon: <Award className="w-8 h-8" />,
                                    color: "text-purple-600",
                                    bgColor: "bg-purple-50"
                                }
                            ].map((stat) => (
                                <div key={stat.label} className="text-center group">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.bgColor} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-200`}>
                                        <div className={stat.color}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-600 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-16 grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Shield className="w-8 h-8" />,
                            title: "100% Verified",
                            description: "All users go through our comprehensive verification process"
                        },
                        {
                            icon: <CheckCircle className="w-8 h-8" />,
                            title: "Secure Transactions",
                            description: "Protected payments with our advanced security protocols"
                        },
                        {
                            icon: <Users className="w-8 h-8" />,
                            title: "24/7 Support",
                            description: "Round-the-clock customer service for all your queries"
                        }
                    ].map((feature, index) => (
                        <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl text-blue-600 mb-4">
                                {feature.icon}
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                {feature.title}
                            </h4>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
