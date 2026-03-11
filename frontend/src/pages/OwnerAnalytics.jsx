import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Clock, Plus, ShieldAlert, CheckCircle, Package } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import api from '../services/api';

const OwnerAnalytics = () => {
    const [userContext, setUserContext] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUserContext(userInfo);
        }
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Get the restaurant details
                const restRes = await api.get('/restaurants/my-restaurant');
                if (restRes.data.success) {
                    const myRestaurant = restRes.data.data;
                    setRestaurant(myRestaurant);

                    // Fetch the orders for this restaurant to calculate metrics
                    fetchOrders(myRestaurant._id);
                }
            } catch (error) {
                console.error("Error fetching restaurant initial data:", error);
                setLoading(false);
            }
        };

        if (userContext && userContext.status !== 'pending') {
            fetchInitialData();
        } else {
            setLoading(false);
        }
    }, [userContext]);

    const fetchOrders = async (restaurantId) => {
        try {
            const { data } = await api.get(`/orders?restaurant=${restaurantId}`);
            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    if (userContext?.status === 'pending') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-orange-200">
                    <ShieldAlert size={48} className="text-orange-500" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Feature Locked</h1>
                <p className="text-gray-600 font-medium max-w-md mx-auto leading-relaxed">
                    Financial Analytics are disabled because your partner application is still pending Admin verification.
                </p>
            </div>
        );
    }

    // --- Analytics Computations ---
    
    // Total Revenue (only delivered orders typically count, but we'll sum all non-cancelled for general view)
    const validOrders = orders.filter(o => o.status !== 'cancelled');
    const totalRevenue = validOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrdersCount = validOrders.length;
    const averageOrderValue = totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount) : 0;

    // Status distributions
    const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {});

    // Recent 5 sales
    const recentSales = [...validOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Financial Analytics</h1>
                    <p className="text-gray-500 font-medium pt-1">Track your restaurant's revenue and order volume.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <p className="text-gray-500 font-bold">Computing metrics...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <StatsCard 
                            title="Total Sales Revenue" 
                            value={`$${totalRevenue.toFixed(2)}`} 
                            icon={DollarSign} 
                            colorClass="text-green-600 bg-green-100" 
                        />
                        <StatsCard 
                            title="Total Orders Processed" 
                            value={totalOrdersCount} 
                            icon={ShoppingBag} 
                            colorClass="text-blue-600 bg-blue-100" 
                        />
                        <StatsCard 
                            title="Average Ticket Size" 
                            value={`$${averageOrderValue.toFixed(2)}`} 
                            icon={TrendingUp} 
                            colorClass="text-purple-600 bg-purple-100" 
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Status Distribution */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                                <Package className="text-gray-400" size={20} />
                                Order Pipeline
                            </h2>
                            <div className="space-y-4">
                                {['pending', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'].map(status => (
                                    <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <span className="font-bold text-gray-700 capitalize flex items-center gap-2">
                                            {status === 'delivered' ? <CheckCircle size={16} className="text-green-500" /> : <Clock size={16} className="text-gray-400" />}
                                            {status.replace('_', ' ')}
                                        </span>
                                        <span className="font-extrabold text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-200">
                                            {statusCounts[status] || 0}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                                <DollarSign className="text-gray-400" size={20} />
                                Recent Transactions
                            </h2>
                            <div className="space-y-4">
                                {recentSales.length === 0 ? (
                                    <p className="text-center text-gray-500 font-bold py-8">No recent sales.</p>
                                ) : (
                                    recentSales.map(order => (
                                        <div key={order._id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                            <div>
                                                <p className="font-extrabold text-gray-900">{order.customerName}</p>
                                                <p className="text-xs font-bold text-gray-500 mt-0.5">{order.orderId}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-extrabold text-green-600">+${order.totalAmount.toFixed(2)}</span>
                                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default OwnerAnalytics;
