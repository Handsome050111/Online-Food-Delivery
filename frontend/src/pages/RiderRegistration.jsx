import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bike, Mail, Lock, User, ArrowRight, UploadCloud, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const RiderRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        vehicleType: 'Motorcycle',
        licensePlate: ''
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Auto-redirect if user hits the back button to /rider-registration but is still logged in
    React.useEffect(() => {
        const userInfoContext = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfoContext) {
             if (userInfoContext.role === 'admin') navigate('/admin');
             else if (userInfoContext.role === 'rider') navigate('/rider');
             else if (userInfoContext.role === 'owner') navigate('/owner');
             else navigate('/');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return '';
        setUploadingImage(true);
        const imgData = new FormData();
        imgData.append('image', imageFile);

        try {
            const { data } = await api.post('/upload', imgData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data.imagePath;
        } catch (error) {
            console.error('Image upload failed:', error);
            throw new Error('Failed to upload image. Please try a different smaller image.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        try {
            setLoading(true);
            
            // 1. Upload Image First
            let avatarPath = '';
            if (imageFile) {
                avatarPath = await uploadImage();
            }

            // 2. Register Rider
            const res = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'rider',
                vehicleType: formData.vehicleType,
                licensePlate: formData.licensePlate,
                avatar: avatarPath
            });

            // Auto log-in with the returned JWT token
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            toast.success("Rider application submitted successfully!");
            
            // Redirect to rider dashboard
            navigate('/rider');
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(error.message || error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-300 animate-in fade-in duration-500">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center -rotate-6 shadow-sm">
                        <Bike size={32} className="text-primary-600 dark:text-primary-400 rotate-6" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Ride With Us
                </h2>
                <p className="mt-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    Earn money delivering food on your own schedule.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow-xl shadow-gray-200/50 dark:shadow-none sm:rounded-3xl sm:px-10 border border-gray-100 dark:border-gray-800">
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        {/* Image Upload Section */}
                        <div className="flex flex-col items-center justify-center">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Profile Photo (Required)</label>
                            <div className="relative group cursor-pointer">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange} 
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full" 
                                    required={!imageFile}
                                />
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-800 group-hover:border-primary-500 transition-colors relative bg-gray-50 dark:bg-gray-800 flex items-center justify-center shadow-inner">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold">
                                        <UploadCloud className="mb-1" size={20} />
                                        Upload
                                    </div>
                                </div>
                            </div>
                            {imageFile && <span className="mt-3 text-xs font-bold text-green-500 flex items-center gap-1"><CheckCircle2 size={14} /> Photo selected</span>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Full Name</label>
                                <div className="mt-2 relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 font-medium transition-colors" placeholder="John Doe" />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Email address</label>
                                <div className="mt-2 relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 font-medium transition-colors" placeholder="rider@express.com" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Vehicle Type</label>
                                <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="mt-2 block w-full pl-3 pr-10 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 font-medium transition-colors">
                                    <option value="Motorcycle">Motorcycle</option>
                                    <option value="Bicycle">Bicycle</option>
                                    <option value="Car">Car</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">License Plate <span className="text-gray-400">(if applicable)</span></label>
                                <input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleChange} className="mt-2 block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 font-medium transition-colors" placeholder="ABC-123" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                                <div className="mt-2 relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input type="password" name="password" required value={formData.password} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 font-medium transition-colors" placeholder="••••••••" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Confirm Password</label>
                                <div className="mt-2 relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 font-medium transition-colors" placeholder="••••••••" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading || uploadingImage}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-primary-500/20 text-sm font-black text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading || uploadingImage ? 'Submitting Application...' : 'Submit Rider Application'}
                                {!loading && !uploadingImage && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="mt-6 text-center">
                            <Link to="/signup" className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
                                Looking to order food instead? Click here.
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiderRegistration;
