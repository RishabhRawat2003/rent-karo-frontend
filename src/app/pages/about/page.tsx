"use client"
import { Building2, Globe, HeartHandshake, Leaf, ScrollText, Upload } from 'lucide-react'
import Link from 'next/link'

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-10">
            {/* Hero Section */}
            <section className="text-center py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        About <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">RentKaro</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-8">
                        Revolutionizing Ownership Since 2025
                    </p>

                    <div className="flex justify-center gap-8 mb-12">
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-2xl font-bold text-blue-600">50K+</h3>
                            <p className="text-gray-600">Active Users</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-2xl font-bold text-green-600">1M+</h3>
                            <p className="text-gray-600">Transactions</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Our Vision for the Sharing Economy
                        </h2>
                        <p className="text-gray-600 text-lg">
                            At RentKaro, we believe in sustainable ownership and community empowerment.
                            Our platform bridges the gap between item owners and seekers, creating a
                            circular economy where everyone benefits.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/pages/signup" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                                Join Now
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                        <Globe className="w-12 h-12 text-blue-600 mb-4" />
                        <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                        <ul className="space-y-4 text-gray-600">
                            {[
                                { icon: Upload, text: "Easy item listing and management", color: "text-green-500" },
                                { icon: HeartHandshake, text: "Secure peer-to-peer transactions", color: "text-blue-500" },
                                { icon: Leaf, text: "Sustainable consumption model", color: "text-green-600" },
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <item.icon className={`w-5 h-5 ${item.color}`} />
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 bg-white px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        How RentKaro Works
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: ScrollText, title: "1. List Your Item", color: "bg-blue-100" },
                            { icon: Building2, title: "2. Find & Rent", color: "bg-green-100" },
                            { icon: HeartHandshake, title: "3. Earn Money", color: "bg-purple-100" },
                        ].map((item, index) => (
                            <div key={index} className="p-6 border rounded-xl hover:shadow-lg transition">
                                <div className={`${item.color} w-fit p-4 rounded-lg mb-4`}>
                                    <item.icon className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                                <p className="text-gray-600">
                                    {index === 0 && "Easily list items you want to rent out. Set your prices, availability, and rental terms in just a few clicks."}
                                    {index === 1 && "Browse thousands of items available for rent. Filter by category, location, and price to find exactly what you need."}
                                    {index === 2 && "Generate income from your unused items. We handle payments and insurance for worry-free transactions."}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Our Core Values
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Leaf, title: "Sustainability", color: "bg-blue-100" },
                            { icon: HeartHandshake, title: "Community", color: "bg-green-100" },
                            { icon: Building2, title: "Convenience", color: "bg-purple-100" },
                        ].map((item, index) => (
                            <div key={index} className="text-center p-6">
                                <div className={`${item.color} w-fit p-4 rounded-lg mx-auto mb-4`}>
                                    <item.icon className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                                <p className="text-gray-600">
                                    {index === 0 && "Promoting eco-friendly consumption through shared resource utilization"}
                                    {index === 1 && "Building trust through verified users and secure transactions"}
                                    {index === 2 && "Seamless experience from listing to delivery"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 text-center px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">
                        Join the Sharing Revolution
                    </h2>

                    <p className="text-gray-600 mb-8 text-lg">
                        Whether you&apos;re looking to earn from unused items or find affordable rentals,
                        RentKaro is your gateway to smarter ownership.
                    </p>

                    <Link
                        href="/pages/signup"
                        className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2"
                    >
                        Get Started
                        <Upload className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default AboutPage