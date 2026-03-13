import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', subject: 'General Inquiry', message: ''
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                subject: formData.subject,
                message: formData.message
            };
            
            const { data } = await api.post('/contact', payload);
            
            if (data.success) {
                toast.success(data.message || "Thanks for your message!");
                setFormData({ firstName: '', lastName: '', email: '', subject: 'General Inquiry', message: '' });
            }
        } catch (error) {
            console.error("Contact form error:", error);
            toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">Get in Touch</h1>
                    <p className="text-lg font-medium text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Have a question about an order? Want to list your restaurant? We're here to help you 24/7.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-start gap-4">
                            <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-xl text-primary-600 dark:text-primary-400">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-1">Our Headquarters</h3>
                                <p className="text-gray-600 dark:text-gray-400 font-medium text-sm leading-relaxed">123 Foodie Blvd, Suite 400<br />San Francisco, CA 94107</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-start gap-4">
                            <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-xl text-primary-600 dark:text-primary-400">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-1">Call Us</h3>
                                <p className="text-gray-600 dark:text-gray-400 font-medium text-sm leading-relaxed">Support: 1-800-FOOD-EXP<br />Restaurants: 1-888-FOOD-BIZ</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-start gap-4">
                            <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-xl text-primary-600 dark:text-primary-400">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-1">Email Us</h3>
                                <p className="text-gray-600 dark:text-gray-400 font-medium text-sm leading-relaxed">support@foodexpress.com<br />partners@foodexpress.com</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-start gap-4">
                            <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-xl text-primary-600 dark:text-primary-400">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-1">Support Hours</h3>
                                <p className="text-gray-600 dark:text-gray-400 font-medium text-sm leading-relaxed">Monday - Sunday<br />24 Hours a Day, 7 Days a Week</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 space-y-6">
                            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">Send us a Message</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                                    <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800" placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                                    <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800" placeholder="Doe" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800" placeholder="john@example.com" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                                <select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800">
                                    <option>General Inquiry</option>
                                    <option>Where is my order?</option>
                                    <option>Feedback & Suggestions</option>
                                    <option>Restaurant Partnership</option>
                                    <option>Rider Application Issues</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows="4" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800 resize-none" placeholder="How can we help you today?"></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md shadow-primary-500/20 active:scale-[0.98] flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Sending...' : <><Send size={20} /> Send Message</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
