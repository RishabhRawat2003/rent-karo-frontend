"use client";
import { ArrowUp, MapPin, Phone, Mail } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export const Footer = () => {
    const socialLinks = [
        { icon: <FaFacebook />, name: "Facebook" },
        { icon: <FaTwitter />, name: "Twitter" },
        { icon: <FaInstagram />, name: "Instagram" }
    ];

    const footerLinks = [
        {
            title: "Rentals",
            links: ["How It Works", "Browse Items", "List Item", "Safety Guide"]
        },
        {
            title: "Support",
            links: ["Help Center", "Contact Us", "FAQ", "Blog"]
        },
        {
            title: "Legal",
            links: ["Privacy Policy", "Terms of Use", "Cookie Policy", "Service Agreement"]
        }
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative bg-gray-900 text-white pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="md:col-span-2">
                        <h2 className="text-3xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                                RentKaro
                            </span>
                        </h2>
                        <p className="text-gray-400 mb-6 max-w-sm">
                            Your trusted partner for seamless rentals and community sharing
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 text-gray-400">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-blue-400" />
                                <span>123 Rental Street, Mumbai, India</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-400" />
                                <span>+91 12345 67890</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-400" />
                                <span>hello@rentkaro.in</span>
                            </div>
                        </div>
                    </div>

                    {/* Links Columns */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-lg font-semibold mb-4 text-blue-400">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-blue-400 transition-colors"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Social Links */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <h3 className="text-lg font-semibold mb-4 text-blue-400">
                            Connect With Us
                        </h3>
                        <div className="flex gap-4">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href="#"
                                    className="p-3 bg-white/10 rounded-lg hover:bg-blue-600 transition-all"
                                >
                                    {link.icon}
                                    <span className="sr-only">{link.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="border-t border-white/10 pt-8 text-center">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
                        <div>
                            © {new Date().getFullYear()} RentKaro. All rights reserved.
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
                            <a href="#" className="hover:text-blue-400 transition-colors">Security</a>
                        </div>
                    </div>
                </div>

                {/* Back to Top Button */}
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 p-3 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                >
                    <ArrowUp className="w-6 h-6" />
                    <span className="sr-only">Back to top</span>
                </button>
            </div>
        </footer>
    );
};