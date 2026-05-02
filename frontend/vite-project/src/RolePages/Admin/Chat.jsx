import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Send, User, Search, MoreVertical, Phone, Video } from 'lucide-react';

const Chat = () => {
    const { darkMode } = useOutletContext();
    const [message, setMessage] = useState('');

    const contacts = [
        { id: 1, name: 'Admin Office', status: 'Online', lastMsg: 'Please review the latest report', time: '10:25 AM' },
        { id: 2, name: 'Michael T. (Tech)', status: 'Online', lastMsg: 'Site repair complete', time: 'Yesterday' },
        { id: 3, name: 'David M. (Tech)', status: 'Offline', lastMsg: 'Waiting for parts', time: '2 days ago' },
    ];

    const messages = [
        { id: 1, sender: 'Admin Office', text: 'Hello, did you see the emergency alert?', time: '10:00 AM', isMe: false },
        { id: 2, sender: 'Me', text: 'Yes, looking into it now. Assigning Tech-023.', time: '10:05 AM', isMe: true },
        { id: 3, sender: 'Admin Office', text: 'Great, keep us posted.', time: '10:06 AM', isMe: false },
    ];

    return (
        <div className={`flex h-[calc(100vh-120px)] ${darkMode ? 'bg-[#1f2a40] border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-xl overflow-hidden border`}>
            {/* Contacts Sidebar */}
            <div className={`w-80 ${darkMode ? 'border-r border-gray-700 bg-[#141b2d]' : 'border-r border-gray-200 bg-gray-50'} flex flex-col`}>
                <div className={`p-4 ${darkMode ? 'border-b border-gray-700 bg-[#1f2a40]' : 'border-b border-gray-200 bg-white'}`}>
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Messages</h2>
                    <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className={`w-full pl-10 pr-4 py-2 ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white focus:ring-cyan-400' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'} border rounded-xl text-sm focus:ring-2 transition-all`}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {contacts.map(contact => (
                        <div key={contact.id} className={`p-4 flex items-center space-x-3 ${darkMode ? 'hover:bg-[#1f2a40] border-b border-gray-700' : 'hover:bg-gray-100 border-b border-gray-200'} cursor-pointer transition-colors`}>
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-gradient-to-br from-purple-500 to-cyan-500' : 'bg-gradient-to-br from-blue-500 to-blue-600'} flex items-center justify-center text-white font-bold`}>
                                    {contact.name.charAt(0)}
                                </div>
                                {contact.status === 'Online' && (
                                    <div className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 ${darkMode ? 'border-2 border-[#141b2d]' : 'border-2 border-gray-50'} rounded-full`}></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>{contact.name}</h3>
                                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{contact.time}</span>
                                </div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>{contact.lastMsg}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${darkMode ? 'bg-[#1f2a40]' : 'bg-white'}`}>
                {/* Chat Header */}
                <div className={`p-4 ${darkMode ? 'border-b border-gray-700 bg-[#1f2a40]' : 'border-b border-gray-200 bg-white'} flex justify-between items-center shadow-sm`}>
                    <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gradient-to-br from-purple-600 to-cyan-600' : 'bg-gradient-to-br from-blue-600 to-blue-500'} text-white flex items-center justify-center font-bold`}>
                            A
                        </div>
                        <div>
                            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin Office</h3>
                            <span className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} font-medium flex items-center`}>
                                <span className={`w-1.5 h-1.5 ${darkMode ? 'bg-green-400' : 'bg-green-600'} rounded-full mr-1.5 shadow-[0_0_8px_rgba(34,197,94,0.5)]`}></span>
                                Online
                            </span>
                        </div>
                    </div>
                    <div className={`flex items-center space-x-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <button className={`${darkMode ? 'hover:text-cyan-400' : 'hover:text-blue-600'} transition-colors`}><Phone size={20} /></button>
                        <button className={`${darkMode ? 'hover:text-cyan-400' : 'hover:text-blue-600'} transition-colors`}><Video size={20} /></button>
                        <button className={`${darkMode ? 'hover:text-cyan-400' : 'hover:text-blue-600'} transition-colors`}><MoreVertical size={20} /></button>
                    </div>
                </div>

                {/* Messages Container */}
                <div className={`flex-1 p-6 overflow-y-auto ${darkMode ? 'bg-[#141b2d]' : 'bg-gray-50'} custom-scrollbar space-y-4`}>
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${msg.isMe
                                    ? darkMode 
                                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-tr-none'
                                        : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none'
                                    : darkMode
                                        ? 'bg-[#1f2a40] text-gray-200 rounded-tl-none border border-gray-700'
                                        : 'bg-white text-gray-900 rounded-tl-none border border-gray-200'
                                }`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <span className={`text-[10px] mt-2 block ${msg.isMe ? darkMode ? 'text-cyan-100' : 'text-blue-100' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className={`p-4 ${darkMode ? 'border-t border-gray-700 bg-[#1f2a40]' : 'border-t border-gray-200 bg-white'}`}>
                    <form
                        className="flex items-center space-x-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setMessage('');
                        }}
                    >
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className={`flex-1 py-3 px-6 ${darkMode ? 'bg-[#141b2d] border-gray-700 text-white focus:ring-cyan-400' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'} border rounded-full text-sm focus:ring-2 transition-all`}
                        />
                        <button
                            type="submit"
                            className={`p-3 ${darkMode ? 'bg-gradient-to-r from-purple-600 to-cyan-600' : 'bg-gradient-to-r from-blue-600 to-blue-500'} text-white rounded-full hover:opacity-90 transition-all active:scale-90 shadow-lg`}
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: ${darkMode ? '#1f2a40' : '#f9fafb'};
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${darkMode ? 'linear-gradient(to bottom, #06b6d4, #8b5cf6)' : 'linear-gradient(to bottom, #2563eb, #3b82f6)'};
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default Chat;
