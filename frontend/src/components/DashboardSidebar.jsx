import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, LogOut } from 'lucide-react';

const DashboardSidebar = ({ links, basePath }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-white dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50 border-r border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800">
                <Link to="/" className="flex items-center gap-2 group transition-transform active:scale-95">
                    <div className="bg-primary-500 text-white p-1.5 rounded-lg group-hover:bg-primary-600 transition-colors">
                        <UtensilsCrossed size={20} />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">Food<span className="text-primary-500">Express</span></span>
                </Link>
            </div>

            <div className="flex-grow py-6 px-4 overflow-y-auto custom-scrollbar">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Menu</p>
                <nav className="space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        // Exact match for basepath, startsWith for sub-paths
                        const isActive = location.pathname === link.path || (link.path !== basePath && location.pathname.startsWith(link.path));
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive
                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20 translate-x-1'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-white hover:translate-x-1'
                                    }`}
                            >
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-sm">
                <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-500/10 transition-colors">
                    <LogOut size={20} strokeWidth={2.5} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
