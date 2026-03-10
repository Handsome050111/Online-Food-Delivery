import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BLOG_POSTS = [
    {
        id: 1,
        title: "The Ultimate Guide to Local Street Food Discoveries",
        excerpt: "We scoured the city to find the hidden gems serving up the most authentic, mouth-watering street food you need to try this weekend.",
        author: "Sarah Jenkins",
        date: "Oct 12, 2026",
        category: "Food Guides",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80"
    },
    {
        id: 2,
        title: "How We Guaranteed 30-Minute Delivery Times",
        excerpt: "A deep dive into the routing algorithms and logistics improvements that let us shave 15 minutes off our average delivery time.",
        author: "Tech Team",
        date: "Oct 05, 2026",
        category: "Company News",
        image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&q=80"
    },
    {
        id: 3,
        title: "5 Plant-Based Restaurants Changing the Game",
        excerpt: "Vegan food has never looked or tasted this good. Check out the top five plant-based spots that are converting even the biggest meat-eaters.",
        author: "David Chen",
        date: "Sep 28, 2026",
        category: "Top Picks",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80"
    },
    {
        id: 4,
        title: "Behind the Scenes: A Day in the Life of a Rider",
        excerpt: "Follow Marcus around the city as he navigates traffic, picks up orders, and brings smiles to hungry customers all day long.",
        author: "Community Team",
        date: "Sep 15, 2026",
        category: "Stories",
        image: "https://images.unsplash.com/photo-1617195737496-bc30194e3a19?w=800&q=80"
    }
];

const Blog = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">The FoodExpress Blog</h1>
                    <p className="text-lg font-medium text-gray-500 max-w-2xl mx-auto">
                        Stories, recipes, company news, and local restaurant highlights from our community.
                    </p>
                </div>

                {/* Featured Post */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-16 flex flex-col lg:flex-row cursor-pointer group">
                    <div className="lg:w-1/2 overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80"
                            alt="Featured food"
                            className="w-full h-[300px] lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wider rounded-full">Featured</span>
                            <span className="text-sm font-bold text-gray-400 flex items-center gap-1"><Calendar size={14} /> Oct 15, 2026</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">The Best Comfort Food For Cold Autumn Nights</h2>
                        <p className="text-lg text-gray-600 font-medium mb-8 leading-relaxed">
                            As the weather gets chilly, nothing beats a warm, hearty meal delivered straight to your couch. We've rounded up the coziest, most satisfying comfort foods available on FoodExpress right now.
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                <User size={16} className="text-gray-400" /> Editorial Team
                            </div>
                            <button className="text-primary-600 font-bold hover:text-primary-700 flex items-center gap-2 transition-colors">
                                Read Article <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Post Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 line-clamp-2">
                    {BLOG_POSTS.map(post => (
                        <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                            <div className="h-64 overflow-hidden relative">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    {post.category}
                                </div>
                            </div>
                            <div className="p-8 pb-6">
                                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mb-4">
                                    <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                                    <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
                                </div>
                                <h3 className="text-xl font-extrabold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">{post.title}</h3>
                                <p className="text-gray-600 font-medium leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <button className="text-primary-600 font-bold hover:text-primary-700 flex items-center gap-2 transition-colors mt-auto w-full group/btn">
                                    Read Article <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                <div className="mt-16 text-center">
                    <button className="bg-white border-2 border-gray-200 text-gray-900 hover:border-primary-600 hover:text-primary-600 font-bold py-3 px-8 rounded-xl transition-colors active:scale-95 shadow-sm">
                        Load More Articles
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Blog;
