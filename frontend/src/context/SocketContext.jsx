import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

    useEffect(() => {
        if (userInfo) {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            // Extract base URL for socket (remove /api)
            const socketUrl = apiUrl.replace('/api', '');
            
            const newSocket = io(socketUrl);
            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
                
                // Join personal room
                newSocket.emit('join', `user_${userInfo._id}`);
                
                // Join role-based room
                if (userInfo.role === 'rider') {
                    newSocket.emit('join', 'rider');
                }
                
                // If owner, join restaurant room (we might need to fetch restaurant ID if not in userInfo)
                if (userInfo.restaurantId) {
                    newSocket.emit('join', `restaurant_${userInfo.restaurantId}`);
                }
            });

            return () => newSocket.close();
        }
    }, [userInfo?._id]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
