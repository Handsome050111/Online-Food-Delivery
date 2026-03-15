import React from 'react';
import { Plus } from 'lucide-react';

const FoodCard = ({ food, onAddToCart }) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800 flex flex-col h-full group">
            <div className="relative h-40 overflow-hidden flex-shrink-0">
                <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {food.popular && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold shadow-sm">
                        Popular
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow pt-5">
                <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{food.name}</h3>
                    <span className="font-bold text-primary-600 dark:text-primary-400 flex-shrink-0">Rs. {typeof food.price === 'number' ? food.price.toFixed(0) : '0'}</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 text-ellipsis flex-grow">{food.description}</p>
                <button
                    onClick={onAddToCart}
                    className="w-full bg-gray-50 dark:bg-gray-800 hover:bg-primary-500 dark:hover:bg-primary-500 text-gray-800 dark:text-gray-200 hover:text-white border border-gray-200 dark:border-gray-700 hover:border-primary-500 rounded-xl py-2 flex items-center justify-center gap-2 font-medium transition-colors active:scale-95 duration-200 mt-auto"
                >
                    <Plus size={18} />
                    Add to cart
                </button>
            </div>
        </div>
    );
};

export default FoodCard;
