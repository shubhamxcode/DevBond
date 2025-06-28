import React, { createContext, useContext, ReactNode, useCallback,useEffect } from "react";
import {io,Socket} from 'socket.io-client'
import { useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import axios from "axios";

// Context Type
interface Types {
    children: ReactNode;
}
interface PrivateMessage {
    senderId: string;
    senderName: string;
    message: string;
    timestamp: Date;
}

interface IsocketContext{
    sendPrivateMessage: (recipientId: string, message: string) => void;
    messages: PrivateMessage[];
    joinUser: (userId: string, username: string) => void;
    isConnected: boolean;
    sendTypingStatus: (recipientId: string, isTyping: boolean) => void;
    typingUsers: Map<string, boolean>;
}
    const apiUrl = import.meta.env.DEV
        ? "http://localhost:4001"  // Local backend for development
        : import.meta.env.VITE_RENDER_URL_;  // Render backend for production

// Create socket context
const SocketContext = createContext<IsocketContext|null>(null);

export const useSocket=()=>{
    const state=useContext(SocketContext)
    if (!state) throw new Error("state is undefined")
    return state
}

export const SocketProvider: React.FC<Types> = ({ children }) => {
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<PrivateMessage[]>([]);
    const [skip, setSkip] = useState(0);
    const limit = 20;
    const [isConnected, setIsConnected] = useState(false);
    const [typingUsers, setTypingUsers] = useState<Map<string, boolean>>(new Map());

    // Get current user info from Redux
    const userId = useSelector((state: RootState) => state.userProfile.userId);
    const username = useSelector((state: RootState) => state.userProfile.username);
    console.log(`is userid there:`,userId,username)

    const joinUser = useCallback((userId: string, username: string) => {
        if (socket) {
            socket.emit('join-user', { userId, username });
        }
    }, [socket]);

    const sendPrivateMessage = useCallback((recipientId: string, message: string) => {
        if (socket) {
            socket.emit('private-message', { recipientId, message });
        }
    }, [socket]);

    const sendTypingStatus = useCallback((recipientId: string, isTyping: boolean) => {
        if (socket) {
            socket.emit('typing-status', { recipientId, isTyping });
        }
    }, [socket]);

    const onPrivateMessageReceive = useCallback((msg: PrivateMessage) => {
        console.log('Private message received:', msg);
        setMessages((prev) => [...prev, {
            ...msg,
            timestamp: new Date(msg.timestamp)
        }]);
    }, []);

    const onMessageSent = useCallback((data: { recipientId: string, message: string, timestamp: Date }) => {
        console.log('Message sent confirmation:', data);
        // Add the sent message to your own chat history
        if (userId && username) {
            setMessages((prev) => [
                ...prev,
                {
                    senderId: userId,
                    senderName: username,
                    message: data.message,
                    timestamp: data.timestamp
                }
            ]);
        }
    }, [userId, username]);

    const onTypingStatusReceive = useCallback((data: { userId: string, isTyping: boolean }) => {
        console.log('Typing status received:', data);
        setTypingUsers(prev => new Map(prev.set(data.userId, data.isTyping)));
    }, []);

    const loadMore = async () => {
        if (userId) {
            const olderMessages = await fetchMessages(userId, skip, limit);
            setMessages((prev) => [...olderMessages, ...prev]);
            setSkip(skip + limit);
        }

    };
    console.log(`loadmore data:`,loadMore)

    useEffect(() => {
        const socketIo = io(`${apiUrl}`);
        
        socketIo.on('connect', () => {
            console.log('Connected to socket server');
            setIsConnected(true);
        });

        socketIo.on('disconnect', () => {
            console.log('Disconnected from socket server');
            setIsConnected(false);
        });

        socketIo.on('private-message', onPrivateMessageReceive);
        socketIo.on('message-sent', onMessageSent);
        socketIo.on('typing-status', onTypingStatusReceive);
        
        setSocket(socketIo);

        return () => {
            socketIo.disconnect();
            socketIo.off('private-message', onPrivateMessageReceive);
            socketIo.off('message-sent', onMessageSent);
            socketIo.off('typing-status', onTypingStatusReceive);
        };
    }, [onPrivateMessageReceive, onMessageSent, onTypingStatusReceive]);
    
    return (
        <SocketContext.Provider value={{
            sendPrivateMessage,
            messages,
            joinUser,
            isConnected,
            sendTypingStatus,
            typingUsers
        }}>
            {children}
        </SocketContext.Provider>
    );
};

// Export the hook we defined above

const Chat: React.FC = () => {
    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-4000"></div>
            </div>

            {/* Header */}
            <header className="relative bg-gray-900/80 backdrop-blur-xl border-b border-gray-700 shadow-2xl z-10">
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                C
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Chat Demo</h1>
                                <p className="text-gray-400 text-sm">Simple and clean design</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2">
                                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                                <span className="text-sm text-white font-medium">Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
                <div className="space-y-4">
                    {/* Demo messages */}
                    <div className="flex justify-start animate-fadeInUp">
                        <div className="max-w-xs lg:max-w-md xl:max-w-lg group relative">
                            <div className="text-xs text-gray-400 mb-1 ml-2 font-medium">John Doe</div>
                            <div className="p-4 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-600/30 transition-all duration-300 hover:shadow-xl bg-gray-800/50 text-white">
                                <div className="text-sm leading-relaxed break-words">
                                    Hey! How's the simple chat design looking? 🚀
                                </div>
                                <div className="text-xs mt-2 flex items-center space-x-2 text-gray-400">
                                    <span>2:30 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <div className="max-w-xs lg:max-w-md xl:max-w-lg group relative">
                            <div className="p-4 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-600/30 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-purple-600 to-purple-700 text-white ml-auto">
                                <div className="text-sm leading-relaxed break-words">
                                    It looks amazing! Clean and simple without any complex indicators! ✨
                                </div>
                                <div className="text-xs mt-2 flex items-center space-x-2 text-purple-200">
                                    <span>2:31 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-start animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        <div className="max-w-xs lg:max-w-md xl:max-w-lg group relative">
                            <div className="text-xs text-gray-400 mb-1 ml-2 font-medium">John Doe</div>
                            <div className="p-4 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-600/30 transition-all duration-300 hover:shadow-xl bg-gray-800/50 text-white">
                                <div className="text-sm leading-relaxed break-words">
                                    I love the dimmer theme and the smooth animations! 🎨
                                </div>
                                <div className="text-xs mt-2 flex items-center space-x-2 text-gray-400">
                                    <span>2:32 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Typing indicator */}
                    <div className="flex justify-start animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-4 shadow-lg">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Input Area */}
            <footer className="relative bg-gray-900/80 backdrop-blur-xl border-t border-gray-700 p-6 z-10">
                <div className="flex space-x-4 items-end">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="w-full bg-gray-800/50 backdrop-blur-sm text-white border border-gray-600/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                            disabled
                        />
                    </div>
                    <button
                        disabled
                        className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform disabled:scale-100 disabled:cursor-not-allowed shadow-lg flex items-center space-x-2"
                    >
                        <span>Send</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </footer>
        </div>   
    );
};

export default Chat;

const fetchMessages = async (userId: string, skip: number, limit: number) => {
    const token = localStorage.getItem("token"); // Or from Redux
    const res = await axios.get(`/api/users/messages`, {
        params: { userId, skip, limit },
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data; // Assuming ApiResponse wraps in .data
};