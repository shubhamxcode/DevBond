import { useSocket } from "./chat";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useParams } from "react-router-dom";

function Developer() {
  const { sendPrivateMessage, messages, joinUser, isConnected } = useSocket();
  const { recipientId } = useParams<{ recipientId: string }>();
  const currentUser = useSelector((state: RootState) => state.userProfile);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (message.trim() && recipientId) {
      sendPrivateMessage(recipientId, message);
      setMessage("");
    }
  };

  // Join user when component mounts
  useEffect(() => {
    if (currentUser.userId && currentUser.username && joinUser) {
      console.log('Joining user:', currentUser.userId, currentUser.username);
      joinUser(currentUser.userId, currentUser.username);
    }
  }, [currentUser.userId, currentUser.username, joinUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-800 p-5 border-b border-gray-700 shadow-md">
        <h1 className="text-2xl font-bold text-indigo-400">
          Private Chat {!isConnected && <span className="text-red-400">(Disconnected)</span>}
        </h1>
        {recipientId && (
          <p className="text-gray-400 text-sm">
            Chatting with: {recipientId}
          </p>
        )}
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 backdrop-blur-md text-white rounded-2xl max-w-sm break-words animate-fadeIn ${
                msg.senderId === currentUser.userId 
                  ? 'bg-blue-600 bg-opacity-50 ml-auto' 
                  : 'bg-indigo-700 bg-opacity-20'
              }`}
            >
              <div className="text-xs text-gray-300 mb-1">
                {msg.senderId === currentUser.userId ? 'You' : msg.senderName}
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
