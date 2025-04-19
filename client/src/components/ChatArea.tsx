import { useEffect, useRef } from "react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import { useChat } from "@/context/ChatContext";

const ChatArea = () => {
  const { messages, isProcessing } = useChat();
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  return (
    <main 
      ref={chatAreaRef}
      className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4" 
      id="chatArea"
    >
      {/* System initialization message */}
      <div className="flex justify-center mb-2">
        <div className="bg-hacker-dark rounded px-4 py-2 text-xs text-hacker-gray">
          <div className="terminal-text">system initialized. type or speak to interact with D4RLENE...</div>
        </div>
      </div>

      {/* Render all messages */}
      {messages.map((message, index) => (
        <Message 
          key={index}
          sender={message.sender}
          text={message.text}
          timestamp={message.timestamp}
          hasNews={message.news !== undefined}
          news={message.news}
        />
      ))}

      {/* Typing indicator (shown when processing) */}
      {isProcessing && <TypingIndicator />}
    </main>
  );
};

export default ChatArea;
