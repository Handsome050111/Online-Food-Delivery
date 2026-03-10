import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { CartProvider } from './context/CartContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Main Pages
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';

// Dashboard Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminRestaurants from './pages/AdminRestaurants';
import AdminOrders from './pages/AdminOrders';
import AdminCoupons from './pages/AdminCoupons';
import AdminNotifications from './pages/AdminNotifications';
import OwnerDashboard from './pages/OwnerDashboard';
import RiderDashboard from './pages/RiderDashboard';

function App() {
    return (
        <CartProvider>
            <Router>
                <div className="min-h-screen relative font-sans text-gray-900 selection:bg-primary-100 selection:text-primary-900">
                    <Toaster position="top-right" />
                    <Routes>
                        {/* Main User Routes */}
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/restaurants" element={<Restaurants />} />
                            <Route path="/restaurants/:id" element={<RestaurantDetails />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/terms" element={<TermsOfService />} />
                            <Route path="/privacy" element={<PrivacyPolicy />} />
                            <Route path="/cookie" element={<CookiePolicy />} />
                        </Route>

                        {/* Admin Dashboard */}
                        <Route path="/admin" element={<DashboardLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="restaurants" element={<AdminRestaurants />} />
                            <Route path="orders" element={<AdminOrders />} />
                            <Route path="coupons" element={<AdminCoupons />} />
                            <Route path="notifications" element={<AdminNotifications />} />
                        </Route>

                        {/* Restaurant Owner Dashboard */}
                        <Route path="/owner" element={<DashboardLayout />}>
                            <Route index element={<OwnerDashboard />} />
                        </Route>

                        {/* Rider Dashboard */}
                        <Route path="/rider" element={<DashboardLayout />}>
                            <Route index element={<RiderDashboard />} />
                        </Route>
                    </Routes>
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;
