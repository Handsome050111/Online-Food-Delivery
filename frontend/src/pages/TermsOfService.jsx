import React from 'react';

const TermsOfService = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">Terms of Service</h1>

            <div className="prose prose-lg text-gray-600 dark:text-gray-400 space-y-6">
                <p>Last updated: October 15, 2026</p>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p>By accessing and using our Online Food Delivery System, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our service.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. User Accounts</h2>
                    <p>When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Ordering and Payment</h2>
                    <p>All orders are subject to acceptance by the respective restaurants. Prices are subject to change without notice. We reserve the right to refuse or cancel any order for any reason.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Delivery</h2>
                    <p>Delivery times are estimates and cannot be guaranteed. We are not responsible for delays caused by traffic, weather, or restaurant preparation times.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Limitation of Liability</h2>
                    <p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;
