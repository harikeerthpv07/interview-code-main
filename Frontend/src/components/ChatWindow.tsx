import React, { useEffect, useRef } from "react";

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

interface ChatWindowProps {
  messages: ChatMessage[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
      {messages.map((msg) => (
        <div key={msg.id} className="mb-2">
          <div className="font-bold text-blue-600">{msg.user}</div>
          <div className="bg-white p-2 rounded-lg shadow-sm inline-block max-w-full break-words">
            {msg.text}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
