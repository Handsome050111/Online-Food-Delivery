import React, { useState, useEffect } from 'react';
import { Search, Loader2, Filter, ChevronDown, CheckCircle, Clock, Package, Bike, Truck, ShieldAlert } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    preparing: 'bg-blue-100 text-blue-800 border-blue-200',
    ready: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    out_for_delivery: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
};

const OwnerOrders = () => {
    const [userContext, setUserContext] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

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

                    // Fetch the orders for this restaurant
                    fetchOrders(myRestaurant._id);
                    
                    // Set up interval for live updates
                    const interval = setInterval(() => fetchOrders(myRestaurant._id), 30000);
                    return () => clearInterval(interval);
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

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            toast.success(`Order marked as ${newStatus.replace('_', ' ')}`);
            if (restaurant) fetchOrders(restaurant._id);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (userContext?.status === 'pending') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center mb-6 shadow-sm border border-orange-200 dark:border-orange-800">
                    <ShieldAlert size={48} className="text-orange-500" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Feature Locked</h1>
                <p className="text-gray-600 dark:text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
                    Live Orders are hidden because your partner application is still pending Admin verification.
                </p>
            </div>
        );
    }

    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.orderId.toLowerCase().includes(search.toLowerCase()) ||
            order.customerName.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Live Orders</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium pt-1">Manage new tickets and update kitchen status.</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3.5 py-1.5 rounded-lg border border-green-200 dark:border-green-800 shadow-sm">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500"></div>
                    <span className="text-sm font-bold tracking-wide">RECEIVING TICKETS</span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center bg-white dark:bg-gray-900 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-800 focus-within:ring-2 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/30 focus-within:border-primary-400 transition-all w-full max-w-md shadow-sm">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by Order ID or Customer..."
                            className="bg-transparent border-none focus:outline-none px-3 py-1 w-full text-sm font-bold text-gray-700 dark:text-gray-300"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter size={18} className="text-gray-400 hidden sm:block" />
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full sm:w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-400 outline-none px-3 py-2.5 shadow-sm appearance-none cursor-pointer"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready for Pickup</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                                <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs">Order Details</th>
                                <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs">Items</th>
                                <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs">Customer</th>
                                <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs">Time</th>
                                <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs">Status</th>
                                <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs text-right">Kitchen Override</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-12 text-gray-500 font-bold"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading orders...</td></tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-12 text-gray-500 font-bold">No orders found matching criteria.</td></tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order._id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <p className="font-extrabold text-primary-600 dark:text-primary-400 font-mono tracking-tight">{order.orderId}</p>
                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">Rs. {order.totalAmount.toFixed(2)} • {order.paymentMethod}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1 max-w-[200px]">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-start text-xs font-bold text-gray-700 dark:text-gray-300 leading-tight">
                                                        <span className="text-gray-400 dark:text-gray-500 mr-1.5">{item.quantity}x</span>
                                                        <span className="line-clamp-1">{item.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="font-bold text-gray-900 dark:text-white">{order.customerName}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 font-medium">
                                                <Clock size={14} />
                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 mt-1">
                                            <span className={`px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded border ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-end gap-2">
                                                <select 
                                                    value={order.status}
                                                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                                    className="bg-white dark:bg-gray-800 border flex items-center border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 outline-none px-2 py-1.5 shadow-sm cursor-pointer"
                                                >
                                                    <option value="pending" disabled>Pending</option>
                                                    <option value="preparing">Set: Preparing</option>
                                                    <option value="ready">Set: Ready for Pickup</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OwnerOrders;
