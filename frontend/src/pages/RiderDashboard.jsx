import React from 'react';
import { Bike, Navigation, CheckCircle2, DollarSign, MapPin } from 'lucide-react';
import StatsCard from '../components/StatsCard';

const RiderDashboard = () => {
    return (
        <div>
            <div className="mb-8 flex flex-wrap justify-between items-end gap-5">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Rider Overview</h1>
                    <p className="text-gray-500 font-medium pt-1">Looking for deliveries today?</p>
                </div>
                <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-sm"></div>
                    Go Online
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard title="Today's Earnings" value="$0.00" icon={DollarSign} colorClass="text-green-600 bg-green-100" />
                <StatsCard title="Deliveries Done" value="0" icon={CheckCircle2} colorClass="text-blue-600 bg-blue-100" />
                <StatsCard title="Active Time" value="0h 0m" icon={Bike} colorClass="text-purple-600 bg-purple-100" />
                <StatsCard title="Total Distance" value="0 km" icon={Navigation} colorClass="text-orange-600 bg-orange-100" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:row-span-2 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-extrabold text-gray-900">Live Navigation</h2>
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded border border-gray-200 uppercase tracking-wider">Offline</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-extrabold text-gray-900">Available Orders</h2>
                        <button className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Refresh</button>
                    </div>
                    <div className="space-y-4">
                        <p className="text-gray-500 font-bold text-center py-8">No deliveries available right now.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiderDashboard;
