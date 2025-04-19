import { useState } from "react";
import { useChat } from "@/context/ChatContext";

const Header = () => {
  const { isListening } = useChat();
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <header className="flex items-center justify-between p-4 border-b border-hacker-gray border-opacity-20">
      <div className="flex items-center">
        <div className={`status-indicator ${isListening ? 'status-listening' : 'status-online'}`}></div>
        <h1 className="text-hacker-blue font-mono font-bold text-xl">
          <span className="glitch" data-text="D4RLENE">D4RLENE</span>
        </h1>
      </div>
      <div className="flex space-x-2">
        <button 
          id="newsButton" 
          className="p-2 rounded-full text-hacker-light hover:bg-hacker-dark"
          aria-label="News"
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
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5v12h5z" 
            />
          </svg>
        </button>
        <button 
          id="settingsButton" 
          className="p-2 rounded-full text-hacker-light hover:bg-hacker-dark"
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Settings"
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
