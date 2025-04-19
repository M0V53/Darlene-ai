import { useChat } from "@/context/ChatContext";
import { Mic, Ear, EarOff, Waves } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MicButton = () => {
  const { 
    isListening, 
    isWakeWordActive, 
    wakeWordDetected,
    startListening, 
    stopListening,
    toggleWakeWord 
  } = useChat();

  const handleMicButtonClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="fixed bottom-20 right-4 flex flex-col space-y-4 items-center">
      {/* Wake Word Toggle Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              className={`w-10 h-10 rounded-full ${isWakeWordActive ? 'bg-emerald-500' : 'bg-gray-700'} text-white flex items-center justify-center shadow-lg focus:outline-none hover:bg-opacity-80 transition-colors`}
              onClick={toggleWakeWord}
              aria-label={isWakeWordActive ? "Disable wake word" : "Enable wake word"}
            >
              {isWakeWordActive ? (
                <Ear className="h-5 w-5" />
              ) : (
                <EarOff className="h-5 w-5" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            {isWakeWordActive ? "Wake word active: 'Hey Darlene'" : "Enable wake word detection"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Mic Button */}
      <button 
        id="micButton" 
        className={`relative w-14 h-14 rounded-full bg-hacker-blue text-white flex items-center justify-center shadow-lg focus:outline-none hover:bg-opacity-80 ${isListening ? 'mic-active' : ''} ${wakeWordDetected ? 'bg-purple-600' : ''}`}
        onClick={handleMicButtonClick}
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        <div className={`mic-button-ripple ${wakeWordDetected ? 'wake-word-ripple' : ''}`}></div>
        {wakeWordDetected ? (
          <Waves className="h-6 w-6 animate-pulse" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </button>
    </div>
  );
};

export default MicButton;
