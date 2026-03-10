import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-8">Privacy Policy</h1>

            <div className="prose prose-lg text-gray-600 space-y-6">
                <p>Last updated: October 15, 2026</p>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
                    <p>We collect information you provide directly to us when you create an account, place an order, or communicate with us. This may include your name, email address, phone number, delivery address, and payment information.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>Process and fulfill your orders</li>
                        <li>Communicate with you about your orders</li>
                        <li>Improve our services and enhance user experience</li>
                        <li>Send promotional communications (with your consent)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data Sharing and Disclosure</h2>
                    <p>We share your information with restaurants and delivery partners solely for the purpose of fulfilling your orders. We do not sell your personal data to third parties.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Security</h2>
                    <p>We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Your Rights</h2>
                    <p>You have the right to access, correct, or delete your personal data. You can manage your account information through your profile settings or by contacting our support team.</p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
