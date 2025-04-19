import { useState, KeyboardEvent } from "react";
import { useChat } from "@/context/ChatContext";

const InputArea = () => {
  const [inputText, setInputText] = useState("");
  const { sendMessage, isProcessing } = useChat();

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputText.trim() && !isProcessing) {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim() && !isProcessing) {
      sendMessage(inputText);
      setInputText("");
    }
  };

  return (
    <div className="p-4 border-t border-hacker-gray border-opacity-20 bg-hacker-dark">
      <div className="relative flex items-center">
        <input 
          type="text" 
          id="messageInput" 
          className="w-full bg-hacker-black border border-hacker-gray border-opacity-30 rounded-full py-3 px-5 pr-12 text-sm focus:outline-none focus:border-hacker-blue" 
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          autoComplete="off"
          disabled={isProcessing}
        />
        <button 
          className="absolute right-3 text-hacker-blue hover:text-hacker-light"
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isProcessing}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M13 5l7 7-7 7M5 5l7 7-7 7" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default InputArea;
