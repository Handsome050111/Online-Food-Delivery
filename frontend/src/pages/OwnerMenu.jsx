import React, { useState, useEffect } from 'react';
import { Plus, X, Search, Edit, Trash2, ShieldAlert } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const OwnerMenu = () => {
    const [userContext, setUserContext] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingItemId, setEditingItemId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        popular: false
    });
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUserContext(userInfo);
        }
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. Get the restaurant details
                const restRes = await api.get('/restaurants/my-restaurant');
                if (restRes.data.success) {
                    const myRestaurant = restRes.data.data;
                    setRestaurant(myRestaurant);

                    // 2. Fetch the menu items for this restaurant
                    fetchMenuItems(myRestaurant._id);
                }
            } catch (error) {
                console.error("Error fetching restaurant initial data:", error);
                setLoading(false);
            }
        };

        if (userContext && (userContext.role === 'owner' || userContext.role === 'admin')) {
            fetchInitialData();
        } else {
            setLoading(false);
        }
    }, [userContext]);

    const fetchMenuItems = async (restaurantId) => {
        try {
            const { data } = await api.get(`/menu?restaurant=${restaurantId}`);
            setMenuItems(data.data || []);
        } catch (error) {
            console.error("Error fetching menu:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!restaurant?._id) {
            toast.error("Restaurant details not found. Please refresh the page.");
            return;
        }

        setFormLoading(true);
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                restaurantId: restaurant._id
            };

            if (editingItemId) {
                await api.put(`/menu/${editingItemId}`, payload);
                toast.success("Menu item updated successfully!");
            } else {
                await api.post('/menu', payload);
                toast.success("Menu item added successfully!");
            }
            
            setShowModal(false);
            setEditingItemId(null);
            setFormData({ name: '', description: '', price: '', category: '', image: '', popular: false });
            fetchMenuItems(restaurant._id);
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${editingItemId ? 'update' : 'add'} menu item`);
        } finally {
            setFormLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingItemId(null);
        setFormData({ name: '', description: '', price: '', category: '', image: '', popular: false });
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setEditingItemId(item._id);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            category: item.category,
            image: item.image || '',
            popular: item.popular || false
        });
        setShowModal(true);
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this menu item?")) return;
        
        try {
            await api.delete(`/menu/${itemId}`);
            toast.success("Menu item deleted.");
            fetchMenuItems(restaurant._id);
        } catch (error) {
            toast.error("Failed to delete item.");
        }
    };

    const filteredItems = menuItems.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) || 
        item.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Manage Menu</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium pt-1">Create, update, and organize your dishes.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-sm active:scale-95"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    <span>Add New Item</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="flex items-center bg-white dark:bg-gray-900 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-800 focus-within:ring-2 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/30 focus-within:border-primary-400 transition-all max-w-md shadow-sm">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search your menu..."
                            className="bg-transparent border-none focus:outline-none px-3 py-1 w-full text-sm font-bold text-gray-700 dark:text-gray-300"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                                <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs">Item Details</th>
                                <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs">Category</th>
                                <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs">Price</th>
                                <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs">Status</th>
                                <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-12 text-gray-500 font-bold">Loading menu...</td></tr>
                            ) : filteredItems.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-12 text-gray-500 font-bold">No menu items found.</td></tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item._id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0 shadow-sm border border-gray-200 dark:border-gray-700 group-hover:border-primary-200 dark:group-hover:border-primary-800 transition-colors">
                                                    <img src={item.image || 'https://images.unsplash.com/photo-1571091718767-18b5c1457add?w=500&q=80'} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white text-base">{item.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium pt-0.5 line-clamp-1 max-w-xs">{item.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold capitalize border border-gray-200 dark:border-gray-700">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-extrabold text-gray-900 dark:text-white border-none">Rs. {item.price.toFixed(2)}</td>
                                        <td className="py-4 px-6">
                                            {item.popular ? (
                                                <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg text-xs border border-amber-200 dark:border-amber-800">Popular</span>
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400 font-bold bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg text-xs border border-gray-200 dark:border-gray-700">Standard</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openEditModal(item)} className="p-2 text-primary-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Edit Item">
                                                    <Edit size={18} strokeWidth={2.5} />
                                                </button>
                                                <button onClick={() => handleDeleteItem(item._id)} className="p-2 text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete Item">
                                                    <Trash2 size={18} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-lg animate-in zoom-in-95 duration-200 my-8">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-t-2xl">
                            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">{editingItemId ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors">
                                <X size={20} className="stroke-2" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Item Name</label>
                                    <input 
                                        type="text" required 
                                        value={formData.name} 
                                        onChange={e => setFormData({...formData, name: e.target.value})} 
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-400 transition-colors font-medium outline-none" 
                                        placeholder="e.g. Spicy Chicken Burger" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                                    <textarea 
                                        required 
                                        value={formData.description} 
                                        onChange={e => setFormData({...formData, description: e.target.value})} 
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-400 transition-colors font-medium outline-none resize-none h-24" 
                                        placeholder="List ingredients or flavor profile..." 
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Price (Rs.)</label>
                                        <input 
                                            type="number" step="0.01" required 
                                            value={formData.price} 
                                            onChange={e => setFormData({...formData, price: e.target.value})} 
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-400 transition-colors font-medium outline-none" 
                                            placeholder="8.99" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                                        <input 
                                            type="text" required 
                                            value={formData.category} 
                                            onChange={e => setFormData({...formData, category: e.target.value})} 
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-400 transition-colors font-medium outline-none" 
                                            placeholder="Burgers, Drinks..." 
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Image URL</label>
                                    <input 
                                        type="url" 
                                        value={formData.image} 
                                        onChange={e => setFormData({...formData, image: e.target.value})} 
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-400 transition-colors font-medium outline-none" 
                                        placeholder="https://images.unsplash.com/..." 
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-1.5 ml-1">Leave blank to use a default image placeholder.</p>
                                </div>
                                
                                <div className="pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.popular} 
                                            onChange={e => setFormData({...formData, popular: e.target.checked})} 
                                            className="w-5 h-5 text-primary-600 border-gray-300 dark:border-gray-700 rounded focus:ring-primary-500 cursor-pointer" 
                                        />
                                        <div>
                                            <span className="block text-sm font-bold text-gray-900 dark:text-white">Mark as Popular</span>
                                            <span className="block text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">Highlights this dish on your menu</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            
                             <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all active:scale-95 shadow-sm">
                                    Cancel
                                </button>
                                <button type="submit" disabled={formLoading} className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm">
                                    {formLoading ? (editingItemId ? 'Updating...' : 'Adding...') : (editingItemId ? 'Update Item' : 'Add to Menu')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerMenu;
