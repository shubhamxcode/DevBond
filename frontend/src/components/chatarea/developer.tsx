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

// Import PrivateMessage type from chat file
interface PrivateMessage {
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
}

// Add interface for database message structure
interface DbMessage {
  _id: string;
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: Date;
  senderName?: string;
}

// Union type for all messages
type Message = DbMessage | PrivateMessage;

function Developer() {
  const { sendPrivateMessage, messages: socketMessages, joinUser, isConnected } = useSocket();
  const { recipientId } = useParams<{ recipientId: string }>();
  const currentUser = useSelector((state: RootState) => state.userProfile);
  const [message, setMessage] = useState("");
  const [dbMessages, setDbMessages] = useState<DbMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatName, setChatName] = useState("Private Chat");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const token = currentUser.accessToken; // Use Redux token instead of localStorage
      
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
    // Filter out socket messages that already exist in database messages
    const filteredSocketMessages = socketMessages.filter(socketMsg => {
      return !dbMessages.some(dbMsg => 
        dbMsg.message === socketMsg.message && 
        dbMsg.senderId === socketMsg.senderId &&
        Math.abs(new Date(dbMsg.timestamp).getTime() - new Date(socketMsg.timestamp).getTime()) < 10000 // Within 10 seconds
      );
    });
    
    // Combine and sort
    const combined = [...dbMessages, ...filteredSocketMessages];
    return combined.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [dbMessages, socketMessages]);

  const handleSendMessage = () => {
    if (message.trim() && recipientId) {
      sendPrivateMessage(recipientId, message);
      setMessage("");
    }
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-800 p-5 border-b border-gray-700 shadow-md">
        <div className="flex items-center justify-between">
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
                    className="text-2xl font-bold text-indigo-400 bg-transparent border-b-2 border-indigo-400 focus:outline-none focus:border-indigo-300 px-1"
                    maxLength={50}
                  />
                  <button
                    onClick={handleNameSave}
                    className="text-green-400 hover:text-green-300 text-sm"
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleNameCancel}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 group">
                  <h1 
                    className="text-2xl font-bold text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors"
                    onClick={handleNameEdit}
                    title="Click to edit chat name"
                  >
                    {chatName}
                  </h1>
                  <button
                    onClick={handleNameEdit}
                    className="text-gray-400 hover:text-indigo-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Edit chat name"
                  >
                    ✏️
                  </button>
                </div>
              )}
              {!isConnected && <span className="text-red-400 ml-2">(Disconnected)</span>}
            </div>
            {chatName === "Private Chat" && recipientId && (
              <p className="text-gray-400 text-sm mt-1">
                Chatting with: {recipientId}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-400">
              {isConnected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {isLoading ? (
          <p className="text-gray-400 text-center mt-10">Loading messages...</p>
        ) : allMessages.length ? (
          allMessages.map((msg, index) => (
            <div
              key={'_id' in msg ? msg._id : `${msg.senderId}-${msg.timestamp}-${index}`}
              className={`p-3 backdrop-blur-md text-white rounded-2xl max-w-sm break-words animate-fadeIn ${
                msg.senderId === currentUser.userId 
                  ? 'bg-blue-600 bg-opacity-50 ml-auto' 
                  : 'bg-indigo-700 bg-opacity-20'
              }`}
            >
              <div className="text-xs text-gray-300 mb-1">
                {msg.senderId === currentUser.userId ? 'You' : (msg.senderName || 'Unknown')}
              </div>
              {msg.message}
              <div className="text-xs text-gray-400 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-10">
            No messages yet. Start the conversation!
            {!recipientId && (
              <span className="block text-red-400 mt-2">
                Error: No recipient specified
              </span>
            )}
          </p>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="border-t border-gray-700 p-5 bg-gray-800">
        <div className="flex space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <button
            onClick={handleSendMessage}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold transition-all"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Developer;
