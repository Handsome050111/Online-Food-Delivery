import React from 'react';
import logo from '../assets/logo.png';

const Loader = ({ fullScreen = false }) => {
    const loaderContent = (
        <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative flex items-center justify-center">
                <div className="absolute w-20 h-20 border-4 border-primary-100 dark:border-primary-900/30 border-t-primary-500 rounded-full animate-spin"></div>
                <img src={logo} alt="Loading..." className="h-10 w-auto object-contain z-10 animate-pulse" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse tracking-wide">Preparing deliciousness...</p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-50 flex items-center justify-center transition-colors duration-300">
                {loaderContent}
            </div>
        );
    }

    return <div className="py-16 flex justify-center w-full">{loaderContent}</div>;
};

export default Loader;
