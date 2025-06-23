import React, { createContext, useContext, ReactNode, useCallback,useEffect } from "react";
import {io,Socket} from 'socket.io-client'
import { useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

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
}

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
    const [isConnected, setIsConnected] = useState(false);

    // Get current user info from Redux
    const userId = useSelector((state: RootState) => state.userProfile.userId);
    const username = useSelector((state: RootState) => state.userProfile.username);

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

    useEffect(() => {
        const socketIo = io('http://localhost:5001');
        
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
        
        setSocket(socketIo);

        return () => {
            socketIo.disconnect();
            socketIo.off('private-message', onPrivateMessageReceive);
            socketIo.off('message-sent', onMessageSent);
        };
    }, [onPrivateMessageReceive, onMessageSent]);
    
    return (
        <SocketContext.Provider value={{
            sendPrivateMessage,
            messages,
            joinUser,
            isConnected
        }}>
            {children}
        </SocketContext.Provider>
    );
};

// Export the hook we defined above

const Chat: React.FC = () => {
    return (
        <div>
            <h1>Chat Component</h1>
        </div>   
    );
};

export default Chat;