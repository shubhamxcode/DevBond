import { useSocket } from "./chat";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useParams } from "react-router-dom";
import axios from "axios";

// API URL configuration
const apiUrl = import.meta.env.DEV
  ? "http://localhost:4001"  // Local backend for development
  : import.meta.env.VITE_RENDER_URL_;  // Render backend for production

// Add interface for database message structure
interface DbMessage {
  _id: string;
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: Date;
  senderName?: string;
}

function Developer() {
  const { sendPrivateMessage, messages: socketMessages, joinUser, isConnected, sendTypingStatus, typingUsers } = useSocket();
  const { recipientId } = useParams<{ recipientId: string }>();
  const currentUser = useSelector((state: RootState) => state.userProfile);
  const [message, setMessage] = useState("");
  const [dbMessages, setDbMessages] = useState<DbMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatName, setChatName] = useState("Private Chat");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Check if the other user is typing
  const isOtherUserTyping = recipientId ? typingUsers.get(recipientId) : false;

  // Load chat name from localStorage on component mount
  useEffect(() => {
    if (recipientId) {
      const savedName = localStorage.getItem(`chatName_${recipientId}`);
      if (savedName) {
        setChatName(savedName);
      }
    }
  }, [recipientId]);

  // Function to save chat name to localStorage
  const saveChatName = (name: string) => {
    if (recipientId) {
      localStorage.setItem(`chatName_${recipientId}`, name);
      setChatName(name);
    }
  };

  // Function to handle name editing
  const handleNameEdit = () => {
    setIsEditingName(true);
    setEditNameValue(chatName);
    setTimeout(() => {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    }, 100);
  };

  // Function to save edited name
  const handleNameSave = () => {
    const trimmedName = editNameValue.trim();
    if (trimmedName) {
      saveChatName(trimmedName);
    }
    setIsEditingName(false);
  };

  // Function to cancel name editing
  const handleNameCancel = () => {
    setIsEditingName(false);
    setEditNameValue(chatName);
  };

  // Handle Enter key in name input
  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSave();
    } else if (e.key === "Escape") {
      handleNameCancel();
    }
  };

  // Function to fetch messages from database
  const fetchMessages = useCallback(async () => {
    if (!currentUser.userId || !recipientId) {
      return;
    }
    
    setIsLoading(true);
    try {
      const token = currentUser.accessToken;
      
      if (!token) {
        console.error('No access token available');
        return;
      }
      
      const response = await axios.get(`${apiUrl}/api/users/messages`, {
        params: { 
          otherUserId: recipientId,
          skip: 0,
          limit: 50
        },
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });
      
      if (response.data.success) {
        setDbMessages(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser.userId, currentUser.accessToken, recipientId]);

  // Combine database messages with socket messages and remove duplicates
  const allMessages = useMemo(() => {
    const filteredSocketMessages = socketMessages.filter(socketMsg => {
      return !dbMessages.some(dbMsg => 
        dbMsg.message === socketMsg.message && 
        dbMsg.senderId === socketMsg.senderId &&
        Math.abs(new Date(dbMsg.timestamp).getTime() - new Date(socketMsg.timestamp).getTime()) < 10000
      );
    });
    
    const combined = [...dbMessages, ...filteredSocketMessages];
    return combined.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [dbMessages, socketMessages]);

  const handleSendMessage = () => {
    if (message.trim() && recipientId) {
      // Create the message object
      const newMessage: DbMessage = {
        _id: `temp-${Date.now()}`, // Temporary ID for local display
        senderId: currentUser.userId!,
        recipientId: recipientId,
        message: message.trim(),
        timestamp: new Date(),
        senderName: currentUser.username || undefined
      };

      // Add message to local state immediately
      setDbMessages(prev => [...prev, newMessage]);
      
      // Send message via socket
      sendPrivateMessage(recipientId, message.trim());
      
      // Stop typing status
      setIsTyping(false);
      sendTypingStatus(recipientId, false);
      clearTimeout((window as any).typingTimer);
      
      // Clear input
      setMessage("");
    }
  };

  // Handle typing animation
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    if (!isTyping && recipientId) {
      setIsTyping(true);
      // Send typing status to other user
      sendTypingStatus(recipientId, true);
    }
    
    // Reset typing state after 2 seconds of no input
    clearTimeout((window as any).typingTimer);
    (window as any).typingTimer = setTimeout(() => {
      setIsTyping(false);
      // Send stop typing status to other user
      if (recipientId) {
        sendTypingStatus(recipientId, false);
      }
    }, 2000);
  };

  // Join user when component mounts
  useEffect(() => {
    if (currentUser.userId && currentUser.username && joinUser) {
      joinUser(currentUser.userId, currentUser.username);
    }
  }, [currentUser.userId, currentUser.username, joinUser]);

  // Fetch messages when component mounts or recipientId changes
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Cleanup typing status when component unmounts or recipientId changes
  useEffect(() => {
    return () => {
      if (recipientId && isTyping) {
        sendTypingStatus(recipientId, false);
        clearTimeout((window as any).typingTimer);
      }
    };
  }, [recipientId, isTyping, sendTypingStatus]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // Format timestamp
  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

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
              {/* Avatar placeholder */}
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {chatName.charAt(0).toUpperCase()}
              </div>
              
              <div>
                <div className="flex items-center space-x-3">
                  {isEditingName ? (
                    <div className="flex items-center space-x-2">
                      <input
                        ref={nameInputRef}
                        type="text"
                        value={editNameValue}
                        onChange={(e) => setEditNameValue(e.target.value)}
                        onKeyDown={handleNameKeyDown}
                        onBlur={handleNameSave}
                        className="text-2xl font-bold text-white bg-transparent border-b-2 border-purple-400 focus:outline-none focus:border-purple-300 px-1 transition-all duration-300"
                        maxLength={50}
                      />
                      <button
                        onClick={handleNameSave}
                        className="text-green-400 hover:text-green-300 text-lg transition-colors duration-200 hover:scale-110"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleNameCancel}
                        className="text-red-400 hover:text-red-300 text-lg transition-colors duration-200 hover:scale-110"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 group">
                      <h1 
                        className="text-2xl font-bold text-white cursor-pointer hover:text-purple-300 transition-all duration-300 hover:scale-105"
                        onClick={handleNameEdit}
                        title="Click to edit chat name"
                      >
                        {chatName}
                      </h1>
                      <button
                        onClick={handleNameEdit}
                        className="text-gray-400 hover:text-purple-400 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                        title="Edit chat name"
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </div>
                {chatName === "Private Chat" && recipientId && (
                  <p className="text-gray-400 text-sm mt-1">
                    Chatting with: {recipientId}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className="text-sm text-white font-medium">
                  {isConnected ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
        {isLoading ? (
          <div className="flex items-center justify-center mt-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            <span className="ml-3 text-white">Loading messages...</span>
          </div>
        ) : allMessages.length ? (
          <div className="space-y-4">
            {allMessages.map((msg, index) => (
              <div
                key={'_id' in msg ? msg._id : `${msg.senderId}-${msg.timestamp}-${index}`}
                className={`flex ${msg.senderId === currentUser.userId ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`max-w-xs lg:max-w-md xl:max-w-lg group relative`}>
                  {msg.senderId !== currentUser.userId && (
                    <div className="text-xs text-gray-400 mb-1 ml-2 font-medium">
                      {msg.senderName || 'Unknown'}
                    </div>
                  )}
                  <div
                    className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-600/30 transition-all duration-300 hover:shadow-xl ${
                      msg.senderId === currentUser.userId 
                        ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white ml-auto' 
                        : 'bg-gray-800/50 text-white'
                    }`}
                  >
                    <div className="text-sm leading-relaxed break-words">
                      {msg.message}
                    </div>
                    <div className={`text-xs mt-2 flex items-center space-x-2 ${
                      msg.senderId === currentUser.userId ? 'text-purple-200' : 'text-gray-400'
                    }`}>
                      <span>{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isOtherUserTyping && (
              <div className="flex justify-start animate-fadeInUp">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-400 ml-2">typing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No messages yet</h3>
            <p className="text-gray-400 max-w-md">
              Start the conversation by sending your first message!
            </p>
            {!recipientId && (
              <p className="text-red-400 mt-4 font-medium">
                Error: No recipient specified
              </p>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="relative bg-gray-900/80 backdrop-blur-xl border-t border-gray-700 p-6 z-10">
        <div className="flex space-x-4 items-end">
          <div className="flex-1 relative">
            <input
              ref={messageInputRef}
              type="text"
              value={message}
              onChange={handleTyping}
              placeholder="Type your message..."
              className="w-full bg-gray-800/50 backdrop-blur-sm text-white border border-gray-600/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center space-x-2"
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
}

export default Developer;
