import React from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        alert("Thanks for your message! We'll get back to you soon.");
    };

    return (
        <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">Get in Touch</h1>
                    <p className="text-lg font-medium text-gray-500 max-w-2xl mx-auto">
                        Have a question about an order? Want to list your restaurant? We're here to help you 24/7.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="bg-primary-50 p-3 rounded-xl text-primary-600">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-gray-900 mb-1">Our Headquarters</h3>
                                <p className="text-gray-600 font-medium text-sm leading-relaxed">123 Foodie Blvd, Suite 400<br />San Francisco, CA 94107</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="bg-primary-50 p-3 rounded-xl text-primary-600">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-gray-900 mb-1">Call Us</h3>
                                <p className="text-gray-600 font-medium text-sm leading-relaxed">Support: 1-800-FOOD-EXP<br />Restaurants: 1-888-FOOD-BIZ</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="bg-primary-50 p-3 rounded-xl text-primary-600">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-gray-900 mb-1">Email Us</h3>
                                <p className="text-gray-600 font-medium text-sm leading-relaxed">support@foodexpress.com<br />partners@foodexpress.com</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="bg-primary-50 p-3 rounded-xl text-primary-600">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-gray-900 mb-1">Support Hours</h3>
                                <p className="text-gray-600 font-medium text-sm leading-relaxed">Monday - Sunday<br />24 Hours a Day, 7 Days a Week</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 space-y-6">
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Send us a Message</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                    <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder-gray-400 font-medium" placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                    <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder-gray-400 font-medium" placeholder="Doe" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <input type="email" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder-gray-400 font-medium" placeholder="john@example.com" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-medium text-gray-700 bg-white">
                                    <option>General Inquiry</option>
                                    <option>Where is my order?</option>
                                    <option>Feedback & Suggestions</option>
                                    <option>Restaurant Partnership</option>
                                    <option>Rider Application Issues</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                                <textarea required rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder-gray-400 font-medium resize-none" placeholder="How can we help you today?"></textarea>
                            </div>

                            <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md shadow-primary-500/20 active:scale-[0.98] flex items-center justify-center gap-2">
                                <Send size={20} /> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
