import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';

// Context Providers
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import { ThemeProvider } from './context/ThemeContext';

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
import PartnerRegistration from './pages/PartnerRegistration';

// Dashboard Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminRestaurants from './pages/AdminRestaurants';
import AdminOrders from './pages/AdminOrders';
import AdminCoupons from './pages/AdminCoupons';
import Notifications from './pages/Notifications';
import AdminRiders from './pages/AdminRiders';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerMenu from './pages/OwnerMenu';
import OwnerOrders from './pages/OwnerOrders';
import OwnerAnalytics from './pages/OwnerAnalytics';
import RiderDashboard from './pages/RiderDashboard';
import RiderActiveTask from './pages/RiderActiveTask';
import RiderHistory from './pages/RiderHistory';
import LiveTracking from './pages/LiveTracking';

function App() {
    return (
        <ThemeProvider>
            <LocationProvider>
                <CartProvider>
                    <Router>
                        <ScrollToTop />
                        <div className="min-h-screen relative font-sans text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 selection:bg-primary-100 selection:text-primary-900 transition-colors duration-300">
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
                                    <Route path="/order-tracking/:orderId" element={<LiveTracking />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/signup" element={<Signup />} />
                                    <Route path="/terms" element={<TermsOfService />} />
                                    <Route path="/privacy" element={<PrivacyPolicy />} />
                                    <Route path="/cookie" element={<CookiePolicy />} />
                                    
                                    {/* Partner Registration */}
                                    <Route path="/partner" element={<PartnerRegistration />} />
                                </Route>

                                {/* Admin Dashboard */}
                                <Route path="/admin" element={<DashboardLayout />}>
                                    <Route index element={<AdminDashboard />} />
                                    <Route path="users" element={<AdminUsers />} />
                                    <Route path="riders" element={<AdminRiders />} />
                                    <Route path="restaurants" element={<AdminRestaurants />} />
                                    <Route path="orders" element={<AdminOrders />} />
                                    <Route path="coupons" element={<AdminCoupons />} />
                                    <Route path="notifications" element={<Notifications />} />
                                </Route>

                                {/* Restaurant Owner Dashboard */}
                                <Route path="/owner" element={<DashboardLayout />}>
                                    <Route index element={<OwnerDashboard />} />
                                    <Route path="menu" element={<OwnerMenu />} />
                                    <Route path="orders" element={<OwnerOrders />} />
                                    <Route path="analytics" element={<OwnerAnalytics />} />
                                    <Route path="notifications" element={<Notifications />} />
                                </Route>

                                {/* Rider Dashboard */}
                                <Route path="/rider" element={<DashboardLayout />}>
                                    <Route index element={<RiderDashboard />} />
                                    <Route path="available" element={<RiderDashboard />} />
                                    <Route path="active" element={<RiderActiveTask />} />
                                    <Route path="history" element={<RiderHistory />} />
                                    <Route path="notifications" element={<Notifications />} />
                                </Route>
                            </Routes>
                        </div>
                    </Router>
                </CartProvider>
            </LocationProvider>
        </ThemeProvider>
    );
}

export default App;
