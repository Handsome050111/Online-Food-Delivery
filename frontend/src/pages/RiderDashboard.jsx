import React from 'react';
import { Bike, Navigation, CheckCircle2, DollarSign, MapPin } from 'lucide-react';
import StatsCard from '../components/StatsCard';

const RiderDashboard = () => {
    return (
        <div>
            <div className="mb-8 flex flex-wrap justify-between items-end gap-5">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Rider Overview</h1>
                    <p className="text-gray-500 font-medium pt-1">Hello Mike, looking for deliveries today?</p>
                </div>
                <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-sm"></div>
                    Go Online
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard title="Today's Earnings" value="$84.50" icon={DollarSign} trend="up" trendValue="+12%" colorClass="text-green-600 bg-green-100" />
                <StatsCard title="Deliveries Done" value="12" icon={CheckCircle2} colorClass="text-blue-600 bg-blue-100" />
                <StatsCard title="Active Time" value="4h 30m" icon={Bike} colorClass="text-purple-600 bg-purple-100" />
                <StatsCard title="Total Distance" value="28.4 km" icon={Navigation} colorClass="text-orange-600 bg-orange-100" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:row-span-2 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-extrabold text-gray-900">Live Navigation</h2>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded border border-green-200 uppercase tracking-wider">Online</span>
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden relative min-h-[400px] sm:min-h-[500px]">
                        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000&q=80" alt="Map Route" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-x-4 bottom-4 bg-white p-5 rounded-xl shadow-xl border border-gray-100">
                            <h3 className="font-extrabold text-gray-900 mb-1">Active Delivery</h3>
                            <p className="text-sm font-bold text-primary-600 mb-4">Est. 12 mins • 2.4 km</p>
                            <div className="space-y-4 relative before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gray-200">
                                <div className="flex gap-4 relative z-10">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5 border-2 border-white shadow-sm">
                                        <MapPin size={12} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Pickup</p>
                                        <p className="text-sm font-extrabold text-gray-900">Burger Joint, 123 Main St</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 relative z-10">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5 border-2 border-white shadow-sm">
                                        <Navigation size={12} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Dropoff</p>
                                        <p className="text-sm font-extrabold text-gray-900">456 Elm St, Apt 4B</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-extrabold text-gray-900">Available Orders</h2>
                        <button className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Refresh</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow hover:border-primary-200 transition-all bg-gray-50 hover:bg-white cursor-pointer group">
                                <div className="flex justify-between items-start mb-3 border-b border-gray-200 pb-3">
                                    <h3 className="font-extrabold text-gray-900">Pizza Paradise</h3>
                                    <span className="font-extrabold text-green-700 bg-green-100 px-2.5 py-1 rounded-md text-sm border border-green-200">
                                        +${(i * 3.5 + 4).toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 font-bold mb-4">Distance: {i * 1.2} km • Est: {15 + i * 5} mins</p>
                                <div className="flex gap-2">
                                    <button className="flex-1 bg-gray-900 group-hover:bg-primary-500 text-white py-2.5 rounded-xl font-bold transition-colors shadow-sm active:scale-95 text-sm">
                                        Accept Delivery
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiderDashboard;
