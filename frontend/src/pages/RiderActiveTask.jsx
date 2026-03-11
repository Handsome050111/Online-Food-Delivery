import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, CheckCircle2, Phone } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const RiderActiveTask = () => {
    const [activeOrders, setActiveOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchActiveTasks = async () => {
        try {
            setLoading(true);
            const res = await api.get('/orders/rider');
            // Filter strictly for orders assigned to this rider that aren't finished or cancelled
            const active = res.data.filter(o => o.status === 'out_for_delivery' || o.status === 'preparing');
            setActiveOrders(active);
        } catch (error) {
            console.error("Error fetching active tasks:", error);
            toast.error("Failed to load active tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveTasks();
    }, []);

    const completeOrder = async (orderId) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: 'delivered' });
            toast.success("Delivery marked as completed!");
            fetchActiveTasks(); // Refresh the list
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update delivery status");
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500 font-bold">Loading active tasks...</div>;
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Active Tasks</h1>
                <p className="text-gray-500 font-medium pt-1">Manage your current deliveries</p>
            </div>

            {activeOrders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <Navigation size={48} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Deliveries</h2>
                    <p className="text-gray-500 font-medium">Head back to the dashboard to find available runs.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {activeOrders.map(order => (
                        <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-blue-600 p-4 sm:p-6 text-white flex justify-between items-start">
                                <div>
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-2 inline-block">Order Run</span>
                                    <h3 className="text-xl font-extrabold">{order.restaurantName}</h3>
                                    <p className="text-blue-100 font-medium mt-1">Order #{order.orderId}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-extrabold">${order.totalAmount.toFixed(2)}</span>
                                    <p className="text-blue-100 text-sm font-medium">{order.items.length} Items</p>
                                </div>
                            </div>
                            
                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-500 mb-1">Pickup Location</p>
                                                <p className="font-bold text-gray-900">{order.restaurantName}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="ml-5 border-l-2 border-dashed border-gray-200 h-8"></div>
                                        
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                                                <Navigation size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-500 mb-1">Delivery Drop-off</p>
                                                <p className="font-bold text-gray-900">{order.customerName}</p>
                                                <p className="text-gray-600 text-sm font-medium">{order.deliveryAddress}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="sm:w-64 bg-gray-50 rounded-xl p-4 flex flex-col justify-between">
                                        <div className="space-y-3 mb-6">
                                            <h4 className="font-bold text-gray-900">Customer Details</h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                <Phone size={16} />
                                                Contact feature required
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={() => completeOrder(order._id)}
                                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-green-500/20"
                                        >
                                            <CheckCircle2 size={20} />
                                            Mark as Delivered
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RiderActiveTask;
