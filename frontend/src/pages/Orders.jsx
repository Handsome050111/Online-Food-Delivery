import React, { useState } from 'react';
import OrderCard from '../components/OrderCard';
import { PackageOpen } from 'lucide-react';

const ORDERS_DATA = [
    {
        id: 'OD123456780',
        restaurantName: 'Burger Joint',
        restaurantImage: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&q=80',
        date: 'Today, 2:30 PM',
        status: 'Preparing',
        total: 32.12,
        items: [
            { name: 'Classic Cheeseburger', qty: 1 },
            { name: 'Truffle Fries', qty: 2 }
        ]
    },
    {
        id: 'OD123456779',
        restaurantName: 'Sushi Master',
        restaurantImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&q=80',
        date: 'Yesterday, 7:15 PM',
        status: 'Delivered',
        total: 45.50,
        items: [
            { name: 'Spicy Tuna Roll', qty: 2 },
            { name: 'Dragon Roll', qty: 1 },
            { name: 'Miso Soup', qty: 2 }
        ]
    },
    {
        id: 'OD123456333',
        restaurantName: 'Pizza Paradise',
        restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80',
        date: 'Mar 05, 12:45 PM',
        status: 'Delivered',
        total: 28.99,
        items: [
            { name: 'Large Margherita Pizza', qty: 1 },
            { name: 'Garlic Bread', qty: 1 }
        ]
    }
];

const Orders = () => {
    const [activeTab, setActiveTab] = useState('active');

    const activeOrders = ORDERS_DATA.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
    const pastOrders = ORDERS_DATA.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');

    const displayOrders = activeTab === 'active' ? activeOrders : pastOrders;

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Your Orders</h1>

                <div className="flex gap-4 mb-8 border-b border-gray-200 pb-px">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`pb-3 px-2 text-sm sm:text-base font-bold transition-all ${activeTab === 'active' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Active Orders ({activeOrders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`pb-3 px-2 text-sm sm:text-base font-bold transition-all ${activeTab === 'past' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Past Orders ({pastOrders.length})
                    </button>
                </div>

                {displayOrders.length > 0 ? (
                    <div className="space-y-6">
                        {displayOrders.map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center mt-8">
                        <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                            <PackageOpen size={48} />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">No orders found</h2>
                        <p className="text-gray-500 max-w-sm mx-auto font-medium">You don't have any {activeTab} orders at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
