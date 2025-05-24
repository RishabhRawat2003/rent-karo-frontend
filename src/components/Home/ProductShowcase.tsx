"use client";
import { ArrowRight, Camera, Laptop, Car, Sofa, Wrench, Shirt, Star, Verified } from 'lucide-react';

export const ProductShowcase = () => {
    const rentals = [
        {
            id: 1,
            title: "Professional DSLR Camera",
            price: "₹999/day",
            category: "Electronics",
            location: "Mumbai",
            icon: <Camera className="w-5 h-5" />
        },
        {
            id: 2,
            title: "Premium Lounge Sofa",
            price: "₹499/day",
            category: "Furniture",
            location: "Delhi",
            icon: <Sofa className="w-5 h-5" />
        },
        {
            id: 3,
            title: "Latest Gaming Laptop",
            price: "₹799/day",
            category: "Electronics",
            location: "Bangalore",
            icon: <Laptop className="w-5 h-5" />
        },
        {
            id: 4,
            title: "Compact SUV Car",
            price: "₹1999/day",
            category: "Vehicles",
            location: "Chennai",
            icon: <Car className="w-5 h-5" />
        },
        {
            id: 5,
            title: "Power Tool Kit",
            price: "₹299/day",
            category: "Tools",
            location: "Hyderabad",
            icon: <Wrench className="w-5 h-5" />
        },
        {
            id: 6,
            title: "Designer Party Wear",
            price: "₹699/day",
            category: "Clothing",
            location: "Kolkata",
            icon: <Shirt className="w-5 h-5" />
        }
    ];

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold mb-16 text-center">
                    <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                        Featured Rentals
                    </span>
                </h2>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {rentals.map((item) => (
                        <div
                            key={item.id}
                            className="relative group break-inside-avoid"
                        >
                            <div className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all bg-white">
                                {/* Image Container */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={`https://source.unsplash.com/random/800x800/?${item.category.toLowerCase()},${item.id}`}
                                        alt={item.title}
                                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                                    {/* Top Badges */}
                                    <div className="absolute top-4 left-4 right-4 flex justify-between">
                                        <div className="flex items-center gap-2 text-sm text-white bg-blue-600/90 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                            {item.icon}
                                            <span>{item.category}</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-green-600/90 text-white px-3 py-1.5 rounded-full backdrop-blur-sm text-sm">
                                            <Verified className="w-4 h-4" />
                                            Verified
                                        </div>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>

                                    {/* Rating and Location */}
                                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star className="w-4 h-4 fill-yellow-400" />
                                            <span>4.8</span>
                                        </div>
                                        <span className="text-gray-400">•</span>
                                        <span>{item.location}</span>
                                    </div>

                                    {/* Price and Action */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-blue-600">{item.price}</span>
                                        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                            Rent Now
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All CTA */}
                <div className="mt-16 text-center">
                    <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                        View All Listings
                    </button>
                </div>
            </div>
        </section>
    );
};