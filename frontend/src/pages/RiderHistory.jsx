import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle2, XCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const RiderHistory = () => {
    const [historyOrders, setHistoryOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await api.get('/orders/rider');
            // Filter strictly for orders assigned to this rider that are finished or cancelled
            const data = Array.isArray(res.data) ? res.data : (res.data?.success ? res.data.data : []);
            const history = Array.isArray(data) ? data.filter(o => o.status === 'delivered' || o.status === 'cancelled') : [];
            setHistoryOrders(history);
        } catch (error) {
            console.error("Error fetching history:", error);
            toast.error("Failed to load delivery history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400 font-bold font-sans">Loading history...</div>;
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Delivery History</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium pt-1">Your past completed runs</p>
            </div>

            {historyOrders.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
                    <ClipboardList size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No History Yet</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Completed deliveries will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {historyOrders.map(order => (
                        <div key={order._id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
                             <div className="flex-1 w-full sm:w-auto">
                                  <div className="flex items-center gap-2 mb-2">
                                       <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded-md border border-transparent dark:border-gray-700">#{order.orderId}</span>
                                       {order.status === 'delivered' ? (
                                           <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md border border-transparent dark:border-green-800">
                                               <CheckCircle2 size={12} /> Delivered
                                           </span>
                                       ) : (
                                           <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md border border-transparent dark:border-red-800">
                                               <XCircle size={12} /> Cancelled
                                           </span>
                                       )}
                                  </div>
                                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">{order.restaurantName}</h3>
                                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{order.deliveryAddress}</p>
                             </div>
                             <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-6 py-4 border border-gray-100 dark:border-gray-700 text-right w-full sm:w-auto">
                                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Earned</p>
                                  <p className="text-2xl font-extrabold text-green-600 dark:text-green-400">Rs. {order.totalAmount.toFixed(2)}</p>
                                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                             </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RiderHistory;
