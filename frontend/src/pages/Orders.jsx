import React, { useState, useEffect } from 'react';
import OrderCard from '../components/OrderCard';
import { PackageOpen, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Orders = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userInfo) {
                setIsLoading(false);
                return;
            }

            try {
                const { data } = await api.get('/orders/myorders', {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                
                // Format the backend data to match the UI component expectations
                const formattedOrders = data.map(o => ({
                    id: o.orderId,
                    restaurantName: o.restaurant?.name || o.restaurantName || 'Unknown Restaurant',
                    restaurantImage: o.restaurant?.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80',
                    date: new Date(o.createdAt).toLocaleDateString() + ', ' + new Date(o.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                    status: o.status === 'pending' ? 'Preparing' : o.status === 'out_for_delivery' ? 'On the way' : o.status.charAt(0).toUpperCase() + o.status.slice(1),
                    total: o.totalAmount,
                    items: o.items.map(i => ({ name: i.name, qty: i.quantity || i.qty }))
                }));

                setOrders(formattedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to load your orders");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const activeOrders = orders.filter(o => o.status.toLowerCase() !== 'delivered' && o.status.toLowerCase() !== 'cancelled');
    const pastOrders = orders.filter(o => o.status.toLowerCase() === 'delivered' || o.status.toLowerCase() === 'cancelled');

    const displayOrders = activeTab === 'active' ? activeOrders : pastOrders;

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">Your Orders</h1>

                {!userInfo ? (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Please login</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">You need to be logged in to view your orders.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-800 pb-px">
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`pb-3 px-2 text-sm sm:text-base font-bold transition-all ${activeTab === 'active' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            >
                                Active Orders ({activeOrders.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('past')}
                                className={`pb-3 px-2 text-sm sm:text-base font-bold transition-all ${activeTab === 'past' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            >
                                Past Orders ({pastOrders.length})
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
                                <p className="text-gray-500 dark:text-gray-400 font-medium">Loading your orders...</p>
                            </div>
                        ) : displayOrders.length > 0 ? (
                            <div className="space-y-6">
                                {displayOrders.map(order => (
                                    <OrderCard key={order.id} order={order} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center mt-8">
                                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <PackageOpen size={48} />
                                </div>
                                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">No orders found</h2>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto font-medium">You don't have any {activeTab} orders at the moment.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Orders;
