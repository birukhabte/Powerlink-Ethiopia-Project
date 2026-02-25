import React, { useState } from 'react';
import { Send, User, Search, MoreVertical, Phone, Video } from 'lucide-react';

const Chat = () => {
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
        <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up">
            {/* Contacts Sidebar */}
            <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/30">
                <div className="p-4 border-b border-gray-100 bg-white">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {contacts.map(contact => (
                        <div key={contact.id} className="p-4 flex items-center space-x-3 hover:bg-white cursor-pointer transition-colors border-b border-gray-50">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {contact.name.charAt(0)}
                                </div>
                                {contact.status === 'Online' && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-gray-800 truncate">{contact.name}</h3>
                                    <span className="text-xs text-gray-400">{contact.time}</span>
                                </div>
                                <p className="text-sm text-gray-500 truncate">{contact.lastMsg}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                            A
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Admin Office</h3>
                            <span className="text-xs text-green-500 font-medium flex items-center">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                                Online
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-400">
                        <button className="hover:text-blue-600 transition-colors"><Phone size={20} /></button>
                        <button className="hover:text-blue-600 transition-colors"><Video size={20} /></button>
                        <button className="hover:text-blue-600 transition-colors"><MoreVertical size={20} /></button>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50 custom-scrollbar space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${msg.isMe
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                }`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <span className={`text-[10px] mt-2 block ${msg.isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-100 bg-white">
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
                            className="flex-1 py-3 px-6 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                        />
                        <button
                            type="submit"
                            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:shadow-lg transition-all active:scale-90"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;
