import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, Clock, MapPin, Phone, ArrowLeft, RefreshCw } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';

const LiveTracking = () => {
    const { orderId } = useParams();
    const socket = useSocket();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        try {
            const { data } = await api.get(`/orders`);
            const targetOrder = data.find(o => o.orderId === orderId || o._id === orderId);
            setOrder(targetOrder);
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();

        if (socket) {
            socket.on('order_status_update', (updatedOrder) => {
                if (updatedOrder.orderId === orderId || updatedOrder._id === orderId) {
                    setOrder(updatedOrder);
                }
            });

            return () => socket.off('order_status_update');
        }
    }, [orderId, socket]);

    const getStatusIndex = (status) => {
        const statuses = ['pending', 'preparing', 'out_for_delivery', 'delivered'];
        return statuses.indexOf(status);
    };

    const steps = [
        { key: 'pending', label: 'Order Placed', icon: Package, description: 'The restaurant has received your order.' },
        { key: 'preparing', label: 'Preparing', icon: RefreshCw, description: 'Your food is being cooked with love.' },
        { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, description: 'Your rider is on the way to you.' },
        { key: 'delivered', label: 'Delivered', icon: CheckCircle2, description: 'Enjoy your meal!' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
                <RefreshCw className="animate-spin text-primary-500" size={48} />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order not found</h2>
                <Link to="/orders" className="bg-primary-500 text-white px-6 py-2 rounded-xl font-bold">Back to Orders</Link>
            </div>
        );
    }

    const currentStatusIndex = getStatusIndex(order.status);

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <Link to="/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors font-bold mb-8">
                    <ArrowLeft size={18} />
                    Back to My Orders
                </Link>

                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                    {/* Header */}
                    <div className="bg-primary-600 p-8 text-white relative">
                        <div className="relative z-10">
                            <h1 className="text-3xl font-black mb-1">Track Your Order</h1>
                            <p className="text-primary-100 font-bold opacity-90">#{order.orderId}</p>
                        </div>
                        <CheckCircle2 className="absolute top-1/2 right-8 -translate-y-1/2 text-white/10 w-32 h-32" />
                    </div>

                    {/* Progress Tracker */}
                    <div className="p-8 sm:p-12 bg-white dark:bg-gray-900">
                        <div className="relative">
                            {/* Vertical Line for Mobile */}
                            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-100 dark:bg-gray-800 lg:hidden"></div>
                            
                            {/* Horizontal Line for Desktop */}
                            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-gray-100 dark:bg-gray-800 hidden lg:block"></div>

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
                                {steps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isActive = index <= currentStatusIndex;
                                    const isCurrent = index === currentStatusIndex;

                                    return (
                                        <div key={step.key} className="flex lg:flex-col lg:items-center gap-6 lg:gap-4 group">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 relative ${isActive ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'}`}>
                                                <Icon size={24} className={isCurrent ? 'animate-pulse' : ''} />
                                                {isActive && !isCurrent && index < 3 && (
                                                     <div className="absolute left-full lg:left-1/2 lg:top-full w-full lg:w-0.5 h-0.5 lg:h-full bg-primary-500 hidden lg:block"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 lg:text-center">
                                                <h3 className={`font-black text-lg transition-colors duration-300 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>{step.label}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{step.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="border-t border-gray-100 dark:border-gray-800 p-8 bg-gray-50/50 dark:bg-gray-800/30 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-gray-400 dark:text-gray-500 uppercase tracking-widest text-xs font-black mb-4">Delivery Details</h4>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm">
                                        <MapPin className="text-primary-500" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{order.customerName}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{order.deliveryAddress}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm">
                                        <Phone className="text-primary-500" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">Contact No.</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-none mt-1">Via App Support</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-gray-400 dark:text-gray-500 uppercase tracking-widest text-xs font-black mb-4">Restaurant Info</h4>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-md text-primary-500 text-2xl font-black">
                                    {order.restaurantName.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-gray-900 dark:text-white">{order.restaurantName}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Estimated arrival: 30-45 mins</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveTracking;
