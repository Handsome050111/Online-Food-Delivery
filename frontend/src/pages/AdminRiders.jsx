import React, { useState, useEffect } from 'react';
import { Bike, Search, Plus, X, AlertCircle, Car, Trash2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminRiders = () => {
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'rider',
        riderDetails: {
            vehicleType: 'Motorcycle',
            licensePlate: '',
            isAvailable: true
        }
    });
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchRiders = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/users?search=${search}&role=rider`);
            const riderList = Array.isArray(data) ? data : (data.data || []);
            setRiders(riderList);
        } catch (error) {
            console.error('Error fetching riders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRiders();
    }, [search]);

    const handleAddRider = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');
        try {
            await api.post('/users', formData);
            setShowModal(false);
            setFormData({ 
                name: '', email: '', password: '', role: 'rider',
                riderDetails: { vehicleType: 'Motorcycle', licensePlate: '', isAvailable: true }
            });
            fetchRiders();
            toast.success("Rider registered successfully");
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add rider');
        } finally {
            setFormLoading(false);
        }
    };

    const handleSuspendRider = async (id) => {
        if (window.confirm('Are you sure you want to change this rider\'s status?')) {
            try {
                await api.put(`/users/${id}/suspend`);
                fetchRiders();
                toast.success("Rider status updated");
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to update rider status');
            }
        }
    };

    const handleDeleteRider = async (id) => {
        if (window.confirm('CRITICAL: Are you sure you want to PERMANENTLY DELETE this rider? This cannot be undone.')) {
            try {
                await api.delete(`/users/${id}`);
                fetchRiders();
                toast.success("Rider permanently deleted");
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete rider');
            }
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Manage Riders</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Register and overview your delivery fleet.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Register Rider</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2 border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/30 focus-within:border-primary-400 transition-all mb-6 max-w-md">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search rider by name or email..."
                        className="bg-transparent border-none focus:outline-none px-3 py-1 w-full text-sm font-bold text-gray-700 dark:text-gray-300"
                    />
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs rounded-tl-xl">Rider</th>
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs">Vehicle</th>
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs">Joined Date</th>
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs">Availability</th>
                                <th className="py-4 px-4 font-bold uppercase tracking-wider text-xs rounded-tr-xl text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-500 font-bold">Loading riders...</td></tr>
                            ) : riders.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-500 font-bold">No riders found.</td></tr>
                            ) : (
                                riders.map((rider) => (
                                    <tr key={rider._id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold uppercase">
                                                    {rider.name.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">{rider.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{rider.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-700">{rider.riderDetails?.vehicleType || 'None'}</span>
                                                <span className="text-xs text-gray-500 font-medium">{rider.riderDetails?.licensePlate || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600 font-medium">
                                            {new Date(rider.createdAt || Date.now()).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${rider.status === 'suspended' ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' : 
                                                (rider.riderDetails?.isAvailable ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700')
                                            }`}>
                                                {rider.status === 'suspended' ? 'Suspended' : (rider.riderDetails?.isAvailable ? 'Available' : 'Offline')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleSuspendRider(rider._id)}
                                                className={`font-bold text-xs px-2.5 py-1.5 rounded-lg border transition-all ${rider.status === 'suspended' ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100' : 'bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100'}`}
                                            >
                                                {rider.status === 'suspended' ? 'Activate' : 'Suspend'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRider(rider._id)}
                                                className="p-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                title="Delete Rider"
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

            {/* Add Rider Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-md animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Register New Rider</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddRider} className="p-6">
                            {error && (
                                <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm font-bold border border-red-100 dark:border-red-800">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors" placeholder="Rider Name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors" placeholder="rider@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Password</label>
                                    <input type="password" required minLength="6" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors" placeholder="••••••••" />
                                </div>
                                
                                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-2">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Car size={16} /> Vehicle Details</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Vehicle Type</label>
                                            <select value={formData.riderDetails.vehicleType} onChange={e => setFormData({ ...formData, riderDetails: { ...formData.riderDetails, vehicleType: e.target.value } })} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors">
                                                <option value="Motorcycle">Motorcycle</option>
                                                <option value="Bicycle">Bicycle</option>
                                                <option value="Car">Car</option>
                                                <option value="None">None</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">License Plate (Optional)</label>
                                            <input type="text" value={formData.riderDetails.licensePlate} onChange={e => setFormData({ ...formData, riderDetails: { ...formData.riderDetails, licensePlate: e.target.value } })} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors" placeholder="ABC-1234" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                                <button type="submit" disabled={formLoading} className="flex-1 px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                                    {formLoading ? 'Registering...' : 'Register Rider'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRiders;
