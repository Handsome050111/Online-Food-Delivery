import React from 'react';

const CookiePolicy = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">Cookie Policy</h1>

            <div className="prose prose-lg text-gray-600 dark:text-gray-400 space-y-6">
                <p>Last updated: October 15, 2026</p>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. What Are Cookies?</h2>
                    <p>Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide information to the owners of the site.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. How We Use Cookies</h2>
                    <p>We use cookies for the following purposes:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li><strong>Essential Cookies:</strong> Required to enable core site functionality, such as logging in securely.</li>
                        <li><strong>Performance Cookies:</strong> Allow us to analyze site usage and improve performance.</li>
                        <li><strong>Functional Cookies:</strong> Enable personalization features, like remembering your language preferences.</li>
                        <li><strong>Targeting Cookies:</strong> Used to deliver relevant advertisements and track their effectiveness.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Managing Cookies</h2>
                    <p>You can control and manage cookies through your browser settings. Please note that removing or blocking cookies can impact your user experience and parts of our website may no longer be fully accessible.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Third-Party Cookies</h2>
                    <p>In addition to our own cookies, we may also use various third-party cookies to report usage statistics, deliver advertisements on and through the service, and so on.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Updates to This Policy</h2>
                    <p>We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons.</p>
                </section>
            </div>
        </div>
    );
};

export default CookiePolicy;
