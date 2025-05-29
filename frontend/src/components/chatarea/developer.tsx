import { usersocket } from "./chat";
import { useState, useEffect, useRef } from "react";

function Developer() {
  const { sendmessage, messages } = usersocket();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendmessage(message);
      setMessage("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-800 p-5 border-b border-gray-700 shadow-md">
        <h1 className="text-2xl font-bold text-indigo-400">Dark Chat</h1>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className="p-3 bg-indigo-700 bg-opacity-20 backdrop-blur-md text-white rounded-2xl max-w-sm break-words animate-fadeIn"
            >
              {msg}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-10">No messages yet. Start the conversation!</p>
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