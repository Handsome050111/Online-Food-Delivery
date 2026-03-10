import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Navigation } from 'lucide-react';
import RatingStars from './RatingStars';

const RestaurantCard = ({ restaurant }) => {
    return (
        <Link to={`/restaurants/${restaurant.id}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex-grow">
            <div className="relative h-48 overflow-hidden flex-shrink-0">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                    {restaurant.category}
                </div>
                {restaurant.featured && (
                    <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        Featured
                    </div>
                )}
            </div>
            <div className="p-5 flex flex-col flex-grow text-left">
                <div className="flex justify-between items-start mb-2 gap-2 text-left">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{restaurant.name}</h3>
                    <div className="bg-gray-50 px-2 py-1 rounded border border-gray-100 flex items-center flex-shrink-0">
                        <RatingStars rating={restaurant.rating} showCount={false} />
                    </div>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-1 flex-grow">{restaurant.tags.join(' • ')}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-sm font-medium text-gray-600 w-full mt-auto">
                    <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-primary-500" />
                        <span>{restaurant.deliveryTime} min</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Navigation size={16} className="text-primary-500" />
                        <span>{restaurant.deliveryFee === 0 ? 'Free' : `Rs. ${restaurant.deliveryFee.toFixed(0)}`}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;
