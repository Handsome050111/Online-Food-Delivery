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
            const history = res.data.filter(o => o.status === 'delivered' || o.status === 'cancelled');
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
        return <div className="p-8 text-center text-gray-500 font-bold">Loading history...</div>;
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Delivery History</h1>
                <p className="text-gray-500 font-medium pt-1">Review your past completed runs</p>
            </div>

            {historyOrders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <ClipboardList size={48} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No Past Deliveries</h2>
                    <p className="text-gray-500 font-medium">Your completed jobs will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {historyOrders.map(order => (
                        <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
                             <div className="flex-1 w-full sm:w-auto">
                                  <div className="flex items-center gap-2 mb-2">
                                       <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-700 rounded-md">#{order.orderId}</span>
                                       {order.status === 'delivered' ? (
                                           <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-md">
                                               <CheckCircle2 size={12} /> Delivered
                                           </span>
                                       ) : (
                                           <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-red-100 text-red-700 rounded-md">
                                               <XCircle size={12} /> Cancelled
                                           </span>
                                       )}
                                  </div>
                                  <h3 className="text-lg font-extrabold text-gray-900">{order.restaurantName}</h3>
                                  <p className="text-sm font-medium text-gray-500 mt-1">{order.deliveryAddress}</p>
                             </div>
                             <div className="bg-gray-50 rounded-xl px-6 py-4 border border-gray-100 text-right w-full sm:w-auto">
                                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Earned</p>
                                  <p className="text-2xl font-extrabold text-green-600">${order.totalAmount.toFixed(2)}</p>
                                  <p className="text-xs font-medium text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                             </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RiderHistory;
