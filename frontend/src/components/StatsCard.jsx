import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => {
    const isPositive = trend === 'up';

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-4 rounded-xl ${colorClass}`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full ${isPositive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                        {isPositive ? <ArrowUpRight size={16} strokeWidth={3} /> : <ArrowDownRight size={16} strokeWidth={3} />}
                        {trendValue}
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-gray-500 dark:text-gray-400 font-bold mb-1">{title}</h3>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{value}</p>
            </div>
        </div>
    );
};

export default StatsCard;
