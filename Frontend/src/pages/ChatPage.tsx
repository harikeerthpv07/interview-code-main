import React, { useEffect, useState } from "react";
import { socketService } from "../services/socketService";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [username, setUsername] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const connectSocket = async () => {
      try {
        const socket = await socketService.connect("http://localhost:3000");
        setIsConnected(true);

        socket.on("initial messages", (initialMessages: ChatMessage[]) => {
          setMessages(initialMessages);
        });

        socket.on("chat message", (msg: ChatMessage) => {
          setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socket.on("disconnect", () => {
          setIsConnected(false);
          console.log("Socket disconnected");
        });
      } catch (error) {
        console.error("Failed to connect to socket:", error);
      }
    };

    connectSocket();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleSendMessage = (text: string) => {
    if (socketService.socket && isConnected) {
      socketService.emit("chat message", {
        user: username || "Anonymous",
        text,
      });
    }
  };

  if (!username) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.target as HTMLFormElement).elements.namedItem(
              "username"
            ) as HTMLInputElement;
            if (input.value.trim()) {
              setUsername(input.value.trim());
            }
          }}
          className="bg-white p-8 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-4">Enter your username</h2>
          <input
            type="text"
            name="username"
            placeholder="Your username"
            className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Join Chat
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Chat App - User: {username}</h1>
      </header>
      <ChatWindow messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatPage;
