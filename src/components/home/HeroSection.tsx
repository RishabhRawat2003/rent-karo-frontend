"use client";
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Tag, Handshake } from 'lucide-react';
import Image from 'next/image';

const HeroSection = () => {
    return (
        <section className="bg-gradient-to-b from-blue-50 to-white pt-16">
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="md:w-1/2 space-y-6 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Rent, Buy, or List Items<br />
                            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                                Effortlessly
                            </span>
                        </h1>

                        <p className="text-lg text-gray-600 md:pr-12">
                            Your trusted marketplace for quality rentals and purchases. Find what you need or earn from items you&apos;re not using.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                            <Link
                                href="/listings"
                                className="group bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-blue-200"
                            >
                                <span>Explore Listings</span>
                                <span>
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            </Link>

                            <div>
                                <Link
                                    href="/list-item"
                                    className="px-8 py-3 rounded-lg font-medium text-blue-600 hover:bg-blue-50 transition-colors border-2 border-blue-600"
                                >
                                    List Item
                                </Link>
                            </div>
                        </div>

                        <div className="pt-8 flex flex-wrap gap-6 justify-center md:justify-start">
                            {[
                                { value: '10K+', label: 'Happy Users', icon: <Handshake className="w-6 h-6" /> },
                                { value: '5K+', label: 'Items Available', icon: <Tag className="w-6 h-6" /> },
                                { value: '100%', label: 'Verified Owners', icon: <ShieldCheck className="w-6 h-6" /> },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                                >
                                    <div className="flex justify-center mb-2 text-blue-600">
                                        {stat.icon}
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="md:w-1/2">
                        <div className="relative w-full h-96 bg-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                            <Image
                                width={1000}
                                height={1000}
                                src="https://images.unsplash.com/photo-1556740714-a8395b3bf30f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                                alt="RentKaro marketplace"
                                className="w-full h-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-green-600/5" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;