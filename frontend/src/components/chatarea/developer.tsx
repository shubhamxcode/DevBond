import { usersocket } from "./chat";
import { useState } from "react";

function Developer() {
  const { sendmessage, messages } = usersocket();
  const [message, setmessage] = useState("");

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Dark Chat</h1>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className="p-2 bg-gray-700 text-white rounded-lg max-w-xs"
            >
              {msg}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No messages yet.</p>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-4 bg-gray-800">
        <div className="flex space-x-2">
          <input
            onChange={(e) => setmessage(e.target.value)}
            value={message}
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => {
              sendmessage(message);
              setmessage(""); // Clear input after sending
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Developer;
