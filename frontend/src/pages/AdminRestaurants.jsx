import React, { useState, useEffect } from 'react';
import { Store, Search, Filter, Plus, X, AlertCircle, MapPin, User, Tag, Info, CheckCircle, ShieldAlert, Trash2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    
    const [formData, setFormData] = useState({ name: '', ownerName: '', category: '', status: 'active', address: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchRestaurants = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/restaurants?search=${search}&status=${filterStatus}`);
            // Handle both direct array or wrapped object { data: [...] }
            const restaurantList = Array.isArray(data) ? data : (data.data || []);
            setRestaurants(restaurantList);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, [search, filterStatus]);

    const handleAddRestaurant = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');
        try {
            await api.post('/restaurants', formData);
            setShowAddModal(false);
            setFormData({ name: '', ownerName: '', category: '', status: 'active', address: '' });
            fetchRestaurants();
            toast.success("Restaurant added successfully");
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add restaurant');
        } finally {
            setFormLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await api.put(`/restaurants/${id}/status`, { status: newStatus });
            toast.success(`Restaurant ${newStatus === 'active' ? 'approved' : newStatus}`);
            if (showDetailModal) setShowDetailModal(false);
            fetchRestaurants();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        }
    };

    const handleDeleteRestaurant = async (id) => {
        if (window.confirm('CRITICAL: Are you sure you want to PERMANENTLY DELETE this restaurant? This will also delete all its menu items and cannot be undone.')) {
            try {
                await api.delete(`/restaurants/${id}`);
                fetchRestaurants();
                toast.success("Restaurant and menu items permanently deleted");
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete restaurant');
            }
        }
    };

    const openDetails = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setShowDetailModal(true);
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Manage Restaurants</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Approve, monitor, and manage restaurant partners.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending Approval</option>
                        <option value="suspended">Suspended</option>
                    </select>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Add Restaurant</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs rounded-tl-xl">Restaurant Name</th>
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs">Owner</th>
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs">Category</th>
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs">Status</th>
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs rounded-tr-xl text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-500 font-bold">Loading restaurants...</td></tr>
                            ) : restaurants.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-500 font-bold">No restaurants found.</td></tr>
                            ) : (
                                restaurants.map((restaurant) => (
                                    <tr key={restaurant._id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden text-left flex items-center justify-center">
                                                    <img src={restaurant.image || restaurant.imageUrl} alt="Restaurant" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">{restaurant.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium pt-0.5">Rating: {restaurant.rating} / 5.0</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400 font-medium">{restaurant.ownerName}</td>
                                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400 font-medium">{restaurant.category}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${restaurant.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800' :
                                                    restaurant.status === 'suspended' ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' :
                                                        'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                                                }`}>
                                                {restaurant.status === 'pending' ? 'Pending Approval' : restaurant.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => openDetails(restaurant)}
                                                className="text-primary-600 font-bold hover:text-primary-800 text-xs px-2.5 py-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-lg transition-colors border border-primary-100 dark:border-primary-800"
                                            >
                                                Details
                                            </button>
                                            {restaurant.status === 'pending' && (
                                                <button onClick={() => handleUpdateStatus(restaurant._id, 'active')} className="text-white bg-green-600 px-3 py-1.5 rounded-lg font-bold hover:bg-green-700 text-xs transition-colors shadow-sm">Approve</button>
                                            )}
                                            {restaurant.status === 'active' && (
                                                <button onClick={() => handleUpdateStatus(restaurant._id, 'suspended')} className="text-orange-600 font-bold hover:bg-orange-50 dark:hover:bg-orange-900/20 text-xs px-2.5 py-1.5 rounded-lg border border-orange-100 dark:border-orange-800 transition-colors">Suspend</button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteRestaurant(restaurant._id)}
                                                className="p-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/30 transition-all"
                                                title="Delete Restaurant"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Details Modal */}
            {showDetailModal && selectedRestaurant && (
                <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 rounded-t-2xl z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
                                    <Info size={24} />
                                </div>
                                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Partner Application Review</h2>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 bg-gray-50 dark:bg-gray-800 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="w-full md:w-1/3">
                                    <img 
                                        src={selectedRestaurant.image || selectedRestaurant.imageUrl} 
                                        alt="Restaurant" 
                                        className="w-full aspect-square object-cover rounded-2xl shadow-sm border border-gray-200" 
                                    />
                                    <div className="mt-4 flex flex-col gap-2">
                                        <div className={`text-center py-2 rounded-xl font-extrabold text-sm border uppercase tracking-wider ${
                                            selectedRestaurant.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800' :
                                            selectedRestaurant.status === 'suspended' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' :
                                            'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                                        }`}>
                                            {selectedRestaurant.status}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{selectedRestaurant.name}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5 capitalize">
                                            <Tag size={16} className="text-primary-500" />
                                            {selectedRestaurant.category} Cuisine
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-5 bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Business Owner</p>
                                                <p className="font-bold text-gray-800 dark:text-gray-200">{selectedRestaurant.ownerName}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                                                <MapPin size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Operating Address</p>
                                                <p className="font-bold text-gray-800 dark:text-gray-200 leading-relaxed">{selectedRestaurant.address || 'Not Provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-6 pt-2">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Initial Rating</p>
                                            <p className="text-lg font-black text-amber-500">{selectedRestaurant.rating} / 5.0</p>
                                        </div>
                                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Commission</p>
                                            <p className="text-lg font-black text-primary-500">Standard 20%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-10 flex gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                                {selectedRestaurant.status === 'pending' ? (
                                    <>
                                        <button 
                                            onClick={() => handleUpdateStatus(selectedRestaurant._id, 'suspended')}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-black rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all border border-red-200 dark:border-red-800"
                                        >
                                            <ShieldAlert size={20} />
                                            Reject Application
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateStatus(selectedRestaurant._id, 'active')}
                                            className="flex-2 flex items-center justify-center gap-2 px-10 py-3.5 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 active:scale-95"
                                        >
                                            <CheckCircle size={20} />
                                            Approve & Go Live
                                        </button>
                                    </>
                                ) : selectedRestaurant.status === 'active' ? (
                                    <button 
                                        onClick={() => handleUpdateStatus(selectedRestaurant._id, 'suspended')}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-lg"
                                    >
                                        Suspend Partnership
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleUpdateStatus(selectedRestaurant._id, 'active')}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition-all shadow-lg"
                                    >
                                        Lift Suspension
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Restaurant Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-md animate-in zoom-in-95 duration-200 my-8">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 rounded-t-2xl z-10">
                            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Add New Restaurant</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddRestaurant} className="p-6">
                            {error && (
                                <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm font-bold border border-red-100 dark:border-red-800">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Restaurant Name</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors" placeholder="e.g. Pizza Paradise" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Owner Name</label>
                                    <input type="text" required value={formData.ownerName} onChange={e => setFormData({ ...formData, ownerName: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors" placeholder="e.g. Jane Smith" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Cuisine Category</label>
                                    <input type="text" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors" placeholder="e.g. Italian, Fast Food" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Location / Address</label>
                                    <input type="text" required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors" placeholder="123 Food Street" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Initial Status</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors">
                                        <option value="active">Active (Live)</option>
                                        <option value="pending">Pending Approval</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-8 flex gap-3">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                                <button type="submit" disabled={formLoading} className="flex-1 px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                                    {formLoading ? 'Saving...' : 'Add Restaurant'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRestaurants;
