import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotif, setSelectedNotif] = useState(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleNotifClick = async (notif) => {
        setSelectedNotif(notif);
        if (!notif.isRead) {
            try {
                await api.put(`/notifications/${notif._id}/read`);
                setNotifications(notifications.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
            } catch (error) {
                console.error("Failed to mark notification as read", error);
            }
        }
    };

    const markAllAsRead = async () => {
        try {
            // Find all unread notifications
            const unread = notifications.filter(n => !n.isRead);
            if (unread.length === 0) return toast.success("All caught up!");

            // Mark them all as read concurrently
            await Promise.all(unread.map(n => api.put(`/notifications/${n._id}/read`)));
            
            // Update local state instead of refetching everything
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            toast.success("All notifications marked as read");
        } catch (error) {
            console.error("Error marking read:", error);
            toast.error("Failed to update read status");
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Notifications</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">System alerts, new assignments, and important updates.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={markAllAsRead}
                        disabled={loading || notifications.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        <CheckCircle2 size={18} />
                        <span>Mark All as Read</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <div className="space-y-4">
                    {loading ? (
                         <p className="text-gray-500 dark:text-gray-400 font-bold text-center py-6">Loading notifications...</p>
                    ) : notifications.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 font-bold text-center py-6">No notifications found.</p>
                    ) : (
                        notifications.map((notif) => (
                            <div
                                key={notif._id}
                                onClick={() => handleNotifClick(notif)}
                                className={`flex items-start gap-4 p-4 rounded-xl relative overflow-hidden group transition-colors border cursor-pointer ${notif.isRead
                                        ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border-transparent'
                                        : notif.type === 'error'
                                            ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'
                                            : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30'
                                    }`}
                            >
                                {!notif.isRead && (
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${notif.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                )}

                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${notif.isRead ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400' :
                                        notif.type === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                            'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    }`}>
                                    {notif.type === 'error' ? <AlertCircle size={20} /> :
                                        notif.type === 'success' ? <CheckCircle2 size={20} /> :
                                            <Info size={20} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`font-bold ${notif.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white font-extrabold'}`}>
                                            {notif.title}
                                        </h4>
                                        {!notif.isRead && (
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${notif.type === 'error' ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40' : 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40'
                                                }`}>New</span>
                                        )}
                                    </div>
                                    <p className={`text-sm mb-2 ${notif.isRead ? 'text-gray-500 dark:text-gray-400' : 'text-gray-600 dark:text-gray-300 font-medium'}`}>
                                        {notif.message}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold">
                                         {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedNotif && (
                <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                    selectedNotif.type === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                    selectedNotif.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                    'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                    {selectedNotif.type === 'error' ? <AlertCircle size={20} /> :
                                     selectedNotif.type === 'success' ? <CheckCircle2 size={20} /> :
                                     <Info size={20} />}
                                </div>
                                <h2 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">System Message</h2>
                            </div>
                            <button onClick={() => setSelectedNotif(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1.5 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-700">
                                <X size={18} />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">{selectedNotif.title}</h3>
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 mb-6">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                    {selectedNotif.message}
                                </p>
                            </div>
                            
                            <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <span>{new Date(selectedNotif.createdAt).toLocaleDateString()}</span>
                                <span>{new Date(selectedNotif.createdAt).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
