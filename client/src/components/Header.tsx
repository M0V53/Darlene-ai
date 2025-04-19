import { useState, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { useTerminal } from "@/context/TerminalContext";
import { Terminal as TerminalIcon } from "lucide-react";

const Header = () => {
  const { isListening, isSpeaking } = useChat();
  const { openTerminal } = useTerminal();
  const [showSettings, setShowSettings] = useState(false);
  const [time, setTime] = useState(new Date());
  const [cpuUsage, setCpuUsage] = useState(Math.floor(Math.random() * 40) + 10);
  const [memoryUsage, setMemoryUsage] = useState(Math.floor(Math.random() * 40) + 20);
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      
      // Simulate changing system stats for futuristic feel
      if (Math.random() > 0.7) {
        setCpuUsage(Math.floor(Math.random() * 40) + 10);
        setMemoryUsage(Math.floor(Math.random() * 40) + 20);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <header className="flex flex-col border-b border-hacker-blue border-opacity-30 bg-gradient-to-r from-hacker-black to-hacker-dark">
      {/* Top bar with system stats */}
      <div className="flex items-center justify-between px-4 py-1 text-xs text-hacker-gray font-mono bg-hacker-black bg-opacity-70">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-hacker-green">[SYS]</span>
            <span className="ml-1">{time.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center">
            <span className={`text-${cpuUsage > 40 ? 'hacker-red' : 'hacker-green'}`}>CPU: {cpuUsage}%</span>
          </div>
          <div className="flex items-center">
            <span className={`text-${memoryUsage > 60 ? 'hacker-red' : 'hacker-green'}`}>MEM: {memoryUsage}%</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span>NODE: <span className="text-hacker-green">ACTIVE</span></span>
          <span>NET: <span className="text-hacker-green">CONNECTED</span></span>
          <span>SEC: <span className="text-hacker-blue">ENCRYPTED</span></span>
        </div>
      </div>
      
      {/* Main header with title and controls */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center">
          <div className={`status-indicator ${isListening ? 'status-listening' : isSpeaking ? 'status-speaking' : 'status-online'}`}></div>
          <h1 className="text-hacker-blue font-mono font-bold text-xl ml-2 flex items-center">
            <span className="glitch" data-text="D4RLENE">D4RLENE</span>
            <span className="text-xs text-hacker-gray ml-2 px-2 py-0.5 rounded border border-hacker-gray border-opacity-30">
              v1.0
            </span>
          </h1>
        </div>
        <div className="flex space-x-3">
          <button 
            className="p-1.5 bg-hacker-dark border border-hacker-blue border-opacity-30 rounded text-hacker-green hover:bg-black hover:border-hacker-green transition duration-300 flex items-center"
            onClick={openTerminal}
            aria-label="Open Terminal"
          >
            <TerminalIcon className="h-4 w-4 mr-1" />
            <span className="text-xs font-mono">TERMINAL</span>
          </button>
          <button 
            id="newsButton" 
            className="p-1.5 bg-hacker-dark border border-hacker-blue border-opacity-30 rounded text-hacker-green hover:bg-black hover:border-hacker-green transition duration-300 flex items-center"
            aria-label="News"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
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
            <span className="text-xs font-mono">NEWS</span>
          </button>
          <button 
            id="settingsButton" 
            className="p-1.5 bg-hacker-dark border border-hacker-blue border-opacity-30 rounded text-hacker-green hover:bg-black hover:border-hacker-green transition duration-300 flex items-center"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Settings"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
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
            <span className="text-xs font-mono">CONFIG</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
