import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Try to load cart from localStorage on initial render
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('foodexpress_cart');
        return savedCart ? JSON.parse(savedCart) : { items: [], restaurant: null };
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('foodexpress_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item, restaurant) => {
        setCart((prevCart) => {
            // Prevent adding items from a different restaurant without clearing first
            if (prevCart.restaurant && prevCart.restaurant._id !== restaurant._id && prevCart.items.length > 0) {
                // In a real app, you might want to show a prompt here. We'll simply clear the cart for now.
                toast('Cleared previous cart items from another restaurant', { icon: '🧹' });
                return {
                    restaurant,
                    items: [{ ...item, quantity: 1, cartId: `${item.id || item._id}-${Date.now()}` }]
                };
            }

            const existingItemIndex = prevCart.items.findIndex(
                (cartItem) => (cartItem.id || cartItem._id) === (item.id || item._id)
            );

            if (existingItemIndex > -1) {
                // Item exists, just increment quantity
                const newItems = [...prevCart.items];
                newItems[existingItemIndex].quantity += 1;
                return { ...prevCart, items: newItems, restaurant: prevCart.restaurant || restaurant };
            } else {
                // New item
                return {
                    restaurant: prevCart.restaurant || restaurant,
                    items: [...prevCart.items, { ...item, quantity: 1, cartId: `${item.id || item._id}-${Date.now()}` }]
                };
            }
        });
    };

    const removeFromCart = (cartId) => {
        setCart((prevCart) => {
            const newItems = prevCart.items.filter((item) => item.cartId !== cartId);
            return {
                ...prevCart,
                items: newItems,
                restaurant: newItems.length === 0 ? null : prevCart.restaurant
            };
        });
    };

    const updateQuantity = (cartId, delta) => {
        setCart((prevCart) => {
            const newItems = prevCart.items.map((item) => {
                if (item.cartId === cartId) {
                    const newQty = item.quantity + delta;
                    return newQty > 0 ? { ...item, quantity: newQty } : item;
                }
                return item;
            });
            return { ...prevCart, items: newItems };
        });
    };

    const clearCart = () => {
        setCart({ items: [], restaurant: null });
        toast.success("Cart cleared");
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
