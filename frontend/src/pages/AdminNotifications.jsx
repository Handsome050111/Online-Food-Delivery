import React, { useState } from 'react';
import { Bell, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Notifications</h1>
                    <p className="text-gray-500 font-medium">System alerts, new registrations, and important updates.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
                    >
                        <CheckCircle2 size={18} />
                        <span>Mark All as Read</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <p className="text-gray-500 font-bold text-center py-6">No notifications found.</p>
                    ) : (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`flex items-start gap-4 p-4 rounded-xl relative overflow-hidden group transition-colors border ${notif.isRead
                                        ? 'hover:bg-gray-50 border-transparent'
                                        : notif.type === 'error'
                                            ? 'bg-red-50 border-red-100'
                                            : 'bg-blue-50 border-blue-100'
                                    }`}
                            >
                                {!notif.isRead && (
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${notif.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                )}

                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${notif.isRead ? 'bg-gray-100 text-gray-500' :
                                        notif.type === 'error' ? 'bg-red-100 text-red-600' :
                                            'bg-blue-100 text-blue-600'
                                    }`}>
                                    {notif.type === 'error' ? <AlertCircle size={20} /> :
                                        notif.type === 'success' ? <CheckCircle2 size={20} /> :
                                            <Info size={20} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`font-bold ${notif.isRead ? 'text-gray-700' : 'text-gray-900 font-extrabold'}`}>
                                            {notif.title}
                                        </h4>
                                        {!notif.isRead && (
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${notif.type === 'error' ? 'text-red-600 bg-red-100' : 'text-blue-600 bg-blue-100'
                                                }`}>New</span>
                                        )}
                                    </div>
                                    <p className={`text-sm mb-2 ${notif.isRead ? 'text-gray-500' : 'text-gray-600 font-medium'}`}>
                                        {notif.message}
                                    </p>
                                    <p className="text-xs text-gray-400 font-bold">{notif.time}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
