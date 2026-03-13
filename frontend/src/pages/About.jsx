import React from 'react';
import { Users, Target, Award, Heart } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-16 transition-colors duration-300">
            {/* Hero Section */}
            <div className="bg-primary-600 dark:bg-primary-900/50 text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">Our Mission is to Deliver Happiness</h1>
                    <p className="text-lg sm:text-xl font-medium text-primary-100 dark:text-primary-200 leading-relaxed">
                        We believe that great food brings people together. That's why we're building the fastest, most reliable food delivery platform in the world.
                    </p>
                </div>
            </div>

            {/* Stats/Features */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 text-center transform hover:-translate-y-1 transition-transform">
                        <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-6">
                            <Users size={32} />
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-3">Community First</h3>
                        <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">We partner with local restaurants to help them grow and reach more customers in their neighborhoods.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 text-center transform hover:-translate-y-1 transition-transform">
                        <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-6">
                            <Target size={32} />
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-3">Lightning Fast</h3>
                        <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">Our advanced routing algorithms ensure your food arrives hot and fresh, exactly when you expect it.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 text-center transform hover:-translate-y-1 transition-transform">
                        <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-6">
                            <Award size={32} />
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-3">Quality Assured</h3>
                        <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">We thoroughly vet every restaurant on our platform to guarantee you get the highest quality meals.</p>
                    </div>
                </div>
            </div>

            {/* Story Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-8">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
                            alt="Restaurant Kitchen"
                            className="rounded-3xl shadow-2xl w-full object-cover h-[400px]"
                        />
                    </div>
                    <div className="md:w-1/2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold text-sm">
                            <Heart size={16} /> Our Story
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">How We Started</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                            FoodExpress began in 2026 with a simple idea: what if you could get your favorite local restaurant dish delivered as easily as sending a text message?
                        </p>
                        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                            Since then, we've grown from a small team of three in a cramped apartment to a platform serving millions of hungry customers across the country. But our core mission remains the same: connecting people with the food they love.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
