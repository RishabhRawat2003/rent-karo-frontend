"use client"
import { Mail, MapPin, Phone, Send, Clock } from 'lucide-react'

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-10">
            {/* Hero Section */}
            <section className="text-center py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Get in <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">Touch</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        We&apos;re here to help you with all your rental needs
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <div className="max-w-6lx mx-auto px-4 lg:px-10 py-12">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                            <p className="text-gray-600 mb-8">
                                Have questions about renting items or need support? Our team is ready to assist you!
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <Phone className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Phone</h3>
                                        <p className="text-gray-600">+1 (555) 123-4567</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <Mail className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Email</h3>
                                        <p className="text-gray-600">support@rentkaro.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <MapPin className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Office</h3>
                                        <p className="text-gray-600">
                                            123 Rental Street<br />
                                            New Delhi, India 110001
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                                    <div className="p-3 bg-orange-100 rounded-lg">
                                        <Clock className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Working Hours</h3>
                                        <p className="text-gray-600">
                                            Mon-Sat: 9AM - 7PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-xl shadow-lg h-fit">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                        <form className="space-y-6">
                            <div>
                                <label className="block text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="+91 12345 67890"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Message</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                            >
                                <Send className="w-5 h-5" />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-16 rounded-xl overflow-hidden shadow-lg">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.3044352300126!2d77.22837241508234!3d28.62873938242102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1625047702782!5m2!1sen!2sin"
                        width="100%"
                        height="400"
                        className="border-0"
                        allowFullScreen
                        loading="lazy"
                        title="RentKaro Office Location"
                    ></iframe>
                </div>
            </div>

            {/* CTA Banner */}
            <section className="bg-blue-600 mt-16">
                <div className="max-w-6xl mx-auto px-4 py-12 text-center">
                    <div className="text-white">
                        <h2 className="text-3xl font-bold mb-4">Need Immediate Assistance?</h2>
                        <p className="text-lg mb-6">Call our 24/7 support line</p>
                        <div className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold">
                            <Phone className="w-5 h-5" />
                            +1 (555) 123-4567
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ContactPage