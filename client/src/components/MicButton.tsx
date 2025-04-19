import { useChat } from "@/context/ChatContext";

const MicButton = () => {
  const { isListening, startListening, stopListening } = useChat();

  const handleMicButtonClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="fixed bottom-20 right-4">
      <button 
        id="micButton" 
        className={`relative w-14 h-14 rounded-full bg-hacker-blue text-white flex items-center justify-center shadow-lg focus:outline-none hover:bg-opacity-80 ${isListening ? 'mic-active' : ''}`}
        onClick={handleMicButtonClick}
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        <div className="mic-button-ripple"></div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
          />
        </svg>
      </button>
    </div>
  );
};

export default MicButton;
