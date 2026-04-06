import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { MessageSquare, Send, User, Search, Clock, Check, CheckCheck } from 'lucide-react';

const Chat = () => {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const socketRef = useRef();
    const messagesEndRef = useRef(null);

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        socketRef.current = io(API_URL);
        socketRef.current.emit('user_joined', currentUser.id);

        socketRef.current.on('receive_message', (message) => {
            if (activeChat && (message.sender_id === activeChat.id || message.receiver_id === activeChat.id)) {
                setMessages(prev => [...prev, message]);
            }
            fetchChats(); // Refresh chat list
        });

        fetchChats();

        return () => {
            socketRef.current.disconnect();
        };
    }, [activeChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchChats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                // Group messages by contact
                const contacts = {};
                response.data.messages.forEach(msg => {
                    const contact = msg.sender_id === currentUser.id ? msg.receiver : msg.sender;
                    if (!contacts[contact.id]) {
                        contacts[contact.id] = {
                            ...contact,
                            lastMessage: msg.content,
                            time: msg.created_at,
                            unreadCount: !msg.is_read && msg.receiver_id === currentUser.id ? 1 : 0
                        };
                    } else {
                        contacts[contact.id].lastMessage = msg.content;
                        contacts[contact.id].time = msg.created_at;
                        if (!msg.is_read && msg.receiver_id === currentUser.id) {
                            contacts[contact.id].unreadCount++;
                        }
                    }
                });
                setChats(Object.values(contacts));
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (contactId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                const filtered = response.data.messages.filter(msg => 
                    (msg.sender_id === currentUser.id && msg.receiver_id === contactId) ||
                    (msg.sender_id === contactId && msg.receiver_id === currentUser.id)
                );
                setMessages(filtered);
                // Mark as read
                await axios.patch(`${API_URL}/api/messages/read/${contactId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchChats(); // Update unread count
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/api/messages`, {
                receiver_id: activeChat.id,
                content: newMessage
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const msg = response.data.message;
                socketRef.current.emit('send_message', msg);
                setMessages(prev => [...prev, msg]);
                setNewMessage('');
                fetchChats();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const filteredChats = chats.filter(chat => 
        chat.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (`${chat.first_name} ${chat.last_name}`).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-120px)] flex bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Sidebar List */}
            <div className="w-full md:w-80 border-r border-gray-100 flex flex-col bg-gray-50/30">
                <div className="p-6 border-b border-gray-100 italic font-medium text-gray-500">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 items-center flex gap-2">
                        <MessageSquare className="text-blue-600" size={24} />
                        Messages
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto mt-2">
                    {loading && chats.length === 0 ? (
                        <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
                    ) : filteredChats.length === 0 ? (
                        <div className="p-10 text-center text-gray-500 flex flex-col items-center">
                            <User size={48} className="text-gray-200 mb-2" />
                            <p>No active conversations.</p>
                        </div>
                    ) : (
                        filteredChats.map((chat) => (
                            <div 
                                key={chat.id} 
                                className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-blue-50/50 transition-all border-l-4 ${activeChat?.id === chat.id ? 'bg-blue-50 border-blue-600' : 'border-transparent'}`}
                                onClick={() => {
                                    setActiveChat(chat);
                                    fetchMessages(chat.id);
                                }}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                                        {chat.username[0].toUpperCase()}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-gray-800 text-sm truncate">{chat.first_name} {chat.last_name}</h3>
                                        <span className="text-[10px] text-gray-400 font-medium">{new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-500 truncate w-3/4">{chat.lastMessage}</p>
                                        {chat.unreadCount > 0 && (
                                            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md shadow-blue-200 flex-shrink-0">
                                                {chat.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Board Area */}
            <div className="flex-1 flex flex-col bg-white">
                {activeChat ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                    {activeChat.username[0].toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-800">{activeChat.first_name} {activeChat.last_name}</h2>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        <span className="text-xs text-green-600 font-bold uppercase tracking-wider">Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Board */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                            {messages.map((msg, index) => {
                                const isSent = msg.sender_id === currentUser.id;
                                return (
                                    <div key={index} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm text-sm ${isSent ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>
                                            <p className="leading-relaxed">{msg.content}</p>
                                            <div className={`text-[10px] mt-1.5 flex items-center gap-1 font-medium ${isSent ? 'text-blue-100 justify-end' : 'text-gray-400'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {isSent && (msg.is_read ? <CheckCheck size={12} /> : <Check size={12} />)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <form onSubmit={handleSendMessage} className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-gray-50/30">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <MessageSquare className="text-blue-300" size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">PowerLink Connect</h2>
                        <p className="text-gray-500 max-w-xs mx-auto">Select a colleague or customer from the sidebar to start messaging in real-time.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
