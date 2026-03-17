import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare, User } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Chat = ({ orderId, recipientName, isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const socket = useSocket();
    const messagesEndRef = useRef(null);
    
    // Robustly retrieve user info
    const [userInfo] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('userInfo') || '{}');
        } catch (e) {
            console.error('Error parsing userInfo:', e);
            return {};
        }
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            fetchChatHistory();
            if (socket) {
                socket.emit('join', `order_${orderId}`);
            }
        }
    }, [isOpen, orderId, socket]);

    useEffect(() => {
        if (socket) {
            socket.on('receive_message', (message) => {
                if (message.orderId === orderId) {
                    setMessages(prev => [...prev, message]);
                }
            });

            return () => socket.off('receive_message');
        }
    }, [socket, orderId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchChatHistory = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/messages/${orderId}`);
            setMessages(res.data);
        } catch (error) {
            console.error('Error fetching chat history:', error);
            toast.error('Failed to load chat history');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const messageData = {
                orderId,
                text: newMessage
            };

            const res = await api.post('/messages', messageData);
            const savedMessage = res.data;
            console.log('Message saved successfully:', savedMessage);

            // Update local state
            setMessages(prev => [...prev, savedMessage]);
            setNewMessage('');

            // Emit via socket for real-time delivery
            if (socket) {
                socket.emit('send_message', {
                    orderId,
                    message: savedMessage
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="bg-primary-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <User size={20} />
                    </div>
                    <div>
                        <h3 className="font-black leading-tight">{recipientName}</h3>
                        <p className="text-xs text-primary-100 font-bold opacity-80">Delivery Support</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-800/20">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                ) : !Array.isArray(messages) || messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <MessageSquare size={48} className="text-gray-200 dark:text-gray-700 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">No messages yet. Send a message to start chatting!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        if (!msg || !msg.sender) return null;
                        const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
                        const isOwn = senderId?.toString() === userInfo?._id?.toString();
                        return (
                            <div key={msg._id || index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm font-medium shadow-sm ${isOwn ? 'bg-primary-500 text-white rounded-tr-none' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none border border-gray-100 dark:border-gray-700'}`}>
                                    <p>{msg.text}</p>
                                    <p className={`text-[10px] mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-400'}`}>
                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-2 bg-white dark:bg-gray-900">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary-500 tracking-tight"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="w-10 h-10 bg-primary-500 hover:bg-primary-600 text-white rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-primary-500/20"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default Chat;
