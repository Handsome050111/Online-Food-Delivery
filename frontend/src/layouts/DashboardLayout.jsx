import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, UserCircle, LayoutDashboard, Users, Store, ShoppingBag, Tag, Bike, DollarSign, ClipboardList, UtensilsCrossed, Package, Navigation, ArrowLeft, LogOut } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import api from '../services/api';

const ADMIN_LINKS = [
    { path: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard },
    { path: '/admin/restaurants', label: 'Restaurants', icon: Store },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/riders', label: 'Riders', icon: Bike },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/admin/coupons', label: 'Coupons', icon: Tag },
];

const OWNER_LINKS = [
    { path: '/owner', label: 'Restaurant Overview', icon: LayoutDashboard },
    { path: '/owner/menu', label: 'Manage Menu', icon: UtensilsCrossed },
    { path: '/owner/orders', label: 'Live Orders', icon: ShoppingBag },
    { path: '/owner/analytics', label: 'Analytics', icon: DollarSign },
];

const RIDER_LINKS = [
    { path: '/rider', label: 'Delivery Dashboard', icon: Bike },
    { path: '/rider/available', label: 'Available Runs', icon: Package },
    { path: '/rider/active', label: 'Active Task', icon: Navigation },
    { path: '/rider/history', label: 'History', icon: ClipboardList },
];

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Read user auth state to populate dynamic dashboard names
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!userInfo || !userInfo.token) return;
        const fetchUnread = async () => {
            try {
                const { data } = await api.get('/notifications');
                setUnreadCount(data.filter(n => !n.isRead).length);
            } catch (error) {
                console.error("Failed to fetch unread notifications count");
            }
        };
        fetchUnread();
    }, [userInfo?.token]);

    const isAdmin = location.pathname.startsWith('/admin');
    const isOwner = location.pathname.startsWith('/owner');
    const isRider = location.pathname.startsWith('/rider');

    let links = ADMIN_LINKS;
    let basePath = '/admin';
    let roleTitle = 'Admin Portal';

    if (isOwner) {
        links = OWNER_LINKS;
        basePath = '/owner';
        roleTitle = 'Restaurant Portal';
    } else if (isRider) {
        links = RIDER_LINKS;
        basePath = '/rider';
        roleTitle = 'Rider Portal';
    }

    if (!isAdmin && !isOwner && !isRider) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex font-sans transition-colors duration-300">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <DashboardSidebar links={links} basePath={basePath} />
            </div>

            <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all duration-300">
                <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full focus:outline-none transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors hidden sm:block"
                            title="Go Back"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white hidden sm:block tracking-tight">{roleTitle}</h1>
                    </div>

                    <div className="flex items-center gap-5">

                        <Link to={`${basePath}/notifications`} className="relative p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors active:scale-95 block">
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse shadow-sm shadow-red-500/50"></span>
                            )}
                        </Link>

                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 rounded-xl transition-colors active:scale-95 text-left"
                            >
                                <UserCircle size={32} className="text-gray-400" />
                                <div className="hidden sm:block pr-2">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1">
                                        {userInfo ? userInfo.name : 'Unknown User'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold leading-none capitalize">
                                        {userInfo ? userInfo.role : 'Guest'}
                                    </p>
                                </div>
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg py-1 z-50">
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('userInfo');
                                            navigate('/login');
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden pt-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
