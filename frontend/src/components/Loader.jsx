import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

const Loader = ({ fullScreen = false }) => {
    const loaderContent = (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-500">
                    <UtensilsCrossed size={20} />
                </div>
            </div>
            <p className="text-gray-500 font-medium animate-pulse">Preparing deliciousness...</p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                {loaderContent}
            </div>
        );
    }

    return <div className="py-16 flex justify-center w-full">{loaderContent}</div>;
};

export default Loader;
