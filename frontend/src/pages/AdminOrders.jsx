import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, Eye, Filter } from 'lucide-react';
import api from '../services/api';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/orders?search=${search}&status=${filterStatus}`);
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [search, filterStatus]);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus });
            fetchOrders();
        } catch (error) {
            alert('Failed to update order status');
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'preparing': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'out_for_delivery': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Platform Orders</h1>
                    <p className="text-gray-500 font-medium">Monitor and manage all customer deliveries in real-time.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-100 focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-400 transition-all flex-1 max-w-md">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search Order ID, Customer, or Restaurant..."
                            className="bg-transparent border-none focus:outline-none px-3 py-1 w-full text-sm font-bold text-gray-700 uppercase"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="text-gray-500 text-sm border-b border-gray-100 bg-gray-50/50">
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs rounded-tl-xl">Order ID</th>
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs">Customer</th>
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs">Restaurant</th>
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs">Total</th>
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs">Status</th>
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs rounded-tr-xl text-right">Update</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500 font-bold">Loading orders...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500 font-bold">No orders found.</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4">
                                            <span className="font-extrabold text-primary-600 tracking-wider">#{order.orderId}</span>
                                            <p className="text-xs text-gray-400 font-bold mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="font-bold text-gray-900">{order.customerName}</p>
                                            <p className="text-xs text-gray-500 truncate max-w-[150px]" title={order.deliveryAddress}>{order.deliveryAddress}</p>
                                        </td>
                                        <td className="py-4 px-4 font-bold text-gray-700">{order.restaurantName}</td>
                                        <td className="py-4 px-4 font-extrabold text-gray-900">Rs. {order.totalAmount}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${getStatusStyles(order.status)}`}>
                                                {order.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                                className="text-sm font-bold bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-primary-500 text-gray-700"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="preparing">Preparing</option>
                                                <option value="out_for_delivery">Delivery</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancel</option>
                                            </select>
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

export default AdminOrders;
