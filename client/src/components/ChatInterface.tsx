import { useEffect, useRef } from "react";
import Header from "./Header";
import ChatArea from "./ChatArea";
import InputArea from "./InputArea";
import MicButton from "./MicButton";
import VolumeIndicator from "./VolumeIndicator";
import Terminal from "./Terminal";
import TerminalToggle from "./TerminalToggle";
import { useChat } from "@/context/ChatContext";
import { useTerminal } from "@/context/TerminalContext";

import { useState } from "react";
import { Tablet, X } from "lucide-react";
import SmartDeviceControl from "./SmartDeviceControl";

const ChatInterface = () => {
  const { isSpeaking, wakeWordDetected } = useChat();
  const { isTerminalOpen, toggleTerminal } = useTerminal();
  const [isDeviceControlOpen, setIsDeviceControlOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set body styles to match design reference
  useEffect(() => {
    document.body.style.backgroundColor = "#121212";
    document.body.style.color = "#e0e0e0";
    document.body.style.fontFamily = "'Roboto Mono', monospace";
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";

    // Cleanup function
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
      document.body.style.fontFamily = "";
      document.body.style.height = "";
      document.body.style.overflow = "";
    };
  }, []);

  const toggleDeviceControl = () => {
    setIsDeviceControlOpen(prev => !prev);
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col h-screen ${isTerminalOpen ? 'terminal-open' : ''} ${isDeviceControlOpen ? 'device-control-open' : ''}`}
    >
      <Header />
      
      {/* Main chat area */}
      <div className="flex-1 flex relative overflow-hidden">
        <ChatArea />
        
        {/* Smart Device Control Panel */}
        <div 
          className={`absolute inset-0 bg-zinc-950 transform transition-transform duration-300 ${
            isDeviceControlOpen ? 'translate-x-0' : 'translate-x-full'
          } overflow-y-auto`}
        >
          <div className="sticky top-0 z-10 bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Tablet className="h-5 w-5" />
              Smart Home Control
            </h2>
            <button 
              onClick={toggleDeviceControl}
              className="rounded-full p-2 hover:bg-zinc-800 transition-colors"
              aria-label="Close device control"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <SmartDeviceControl />
        </div>
      </div>
      
      <InputArea />
      
      {/* Device Control Toggle Button */}
      <div className="fixed bottom-20 left-4">
        <button 
          onClick={toggleDeviceControl}
          className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center shadow-lg transition-colors"
          aria-label="Toggle smart device control"
        >
          <Tablet className="h-5 w-5" />
        </button>
      </div>
      
      <MicButton />
      {(isSpeaking || wakeWordDetected) && <VolumeIndicator />}
      <Terminal visible={isTerminalOpen} />
      <TerminalToggle isOpen={isTerminalOpen} toggle={toggleTerminal} />
    </div>
  );
};

export default ChatInterface;
