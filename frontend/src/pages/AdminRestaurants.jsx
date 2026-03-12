import React, { useState, useEffect } from 'react';
import { Store, Search, Filter, Plus, X, AlertCircle, MapPin, User, Tag, Info, CheckCircle, ShieldAlert } from 'lucide-react';
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
            setRestaurants(data);
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

    const openDetails = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setShowDetailModal(true);
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Manage Restaurants</h1>
                    <p className="text-gray-500 font-medium">Approve, monitor, and manage restaurant partners.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-100 focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-400 transition-all mb-6 max-w-md">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search restaurants, owners, or category..."
                        className="bg-transparent border-none focus:outline-none px-3 py-1 w-full text-sm font-bold text-gray-700"
                    />
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="text-gray-500 text-sm border-b border-gray-100 bg-gray-50/50">
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
                                    <tr key={restaurant._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden">
                                                    <img src={restaurant.imageUrl} alt="Restaurant" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{restaurant.name}</p>
                                                    <p className="text-xs text-gray-500 font-medium pt-0.5">Rating: {restaurant.rating} / 5.0</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600 font-medium">{restaurant.ownerName}</td>
                                        <td className="py-4 px-4 text-gray-600 font-medium">{restaurant.category}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${restaurant.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                    restaurant.status === 'suspended' ? 'bg-red-50 text-red-700 border-red-100' :
                                                        'bg-green-50 text-green-700 border-green-100'
                                                }`}>
                                                {restaurant.status === 'pending' ? 'Pending Approval' : restaurant.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right space-x-2">
                                            <button 
                                                onClick={() => openDetails(restaurant)}
                                                className="text-primary-600 font-bold hover:text-primary-800 text-xs px-2 py-1 bg-primary-50 rounded-lg transition-colors border border-primary-100"
                                            >
                                                Details
                                            </button>
                                            {restaurant.status === 'pending' && (
                                                <button onClick={() => handleUpdateStatus(restaurant._id, 'active')} className="text-white bg-green-600 px-3 py-1 rounded-lg font-bold hover:bg-green-700 text-xs transition-colors">Approve</button>
                                            )}
                                            {restaurant.status === 'active' && (
                                                <button onClick={() => handleUpdateStatus(restaurant._id, 'suspended')} className="text-red-500 font-bold hover:text-red-700 text-xs px-2 py-1">Suspend</button>
                                            )}
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
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                                    <Info size={24} />
                                </div>
                                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Partner Application Review</h2>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 bg-gray-50 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="w-full md:w-1/3">
                                    <img 
                                        src={selectedRestaurant.imageUrl} 
                                        alt="Restaurant" 
                                        className="w-full aspect-square object-cover rounded-2xl shadow-sm border border-gray-200" 
                                    />
                                    <div className="mt-4 flex flex-col gap-2">
                                        <div className={`text-center py-2 rounded-xl font-extrabold text-sm border uppercase tracking-wider ${
                                            selectedRestaurant.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                            selectedRestaurant.status === 'suspended' ? 'bg-red-50 text-red-700 border-red-200' :
                                            'bg-green-50 text-green-700 border-green-200'
                                        }`}>
                                            {selectedRestaurant.status}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-1">{selectedRestaurant.name}</h3>
                                        <p className="text-gray-500 font-medium flex items-center gap-1.5 capitalize">
                                            <Tag size={16} className="text-primary-500" />
                                            {selectedRestaurant.category} Cuisine
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-5 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Business Owner</p>
                                                <p className="font-bold text-gray-800">{selectedRestaurant.ownerName}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500">
                                                <MapPin size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Operating Address</p>
                                                <p className="font-bold text-gray-800 leading-relaxed">{selectedRestaurant.address || 'Address provided at registration'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-6 pt-2">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Initial Rating</p>
                                            <p className="text-lg font-black text-amber-500">{selectedRestaurant.rating} / 5.0</p>
                                        </div>
                                        <div className="w-px h-8 bg-gray-200"></div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Commission</p>
                                            <p className="text-lg font-black text-gray-800 text-primary-500">Standard 20%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-10 flex gap-4 pt-6 border-t border-gray-100">
                                {selectedRestaurant.status === 'pending' ? (
                                    <>
                                        <button 
                                            onClick={() => handleUpdateStatus(selectedRestaurant._id, 'suspended')}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-red-50 text-red-700 font-black rounded-2xl hover:bg-red-100 transition-all border border-red-200"
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
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md animate-in zoom-in-95 duration-200 my-8">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                            <h2 className="text-xl font-extrabold text-gray-900">Add New Restaurant</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddRestaurant} className="p-6">
                            {error && (
                                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm font-bold border border-red-100">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Restaurant Name</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. Pizza Paradise" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Owner Name</label>
                                    <input type="text" required value={formData.ownerName} onChange={e => setFormData({ ...formData, ownerName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. Jane Smith" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Cuisine Category</label>
                                    <input type="text" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. Italian, Fast Food" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Location / Address</label>
                                    <input type="text" required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="123 Food Street" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Initial Status</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none">
                                        <option value="active">Active (Live)</option>
                                        <option value="pending">Pending Approval</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-8 flex gap-3">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
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
