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

const ChatInterface = () => {
  const { isSpeaking } = useChat();
  const { isTerminalOpen, toggleTerminal } = useTerminal();
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

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col h-screen ${isTerminalOpen ? 'terminal-open' : ''}`}
    >
      <Header />
      <ChatArea />
      <InputArea />
      <MicButton />
      {isSpeaking && <VolumeIndicator />}
      <Terminal visible={isTerminalOpen} />
      <TerminalToggle isOpen={isTerminalOpen} toggle={toggleTerminal} />
    </div>
  );
};

export default ChatInterface;
