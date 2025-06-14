const VolumeIndicator = () => {
  return (
    <div 
      id="volumeIndicator" 
      className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-hacker-dark rounded-full px-4 py-2"
    >
      <div className="flex items-center space-x-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-hacker-blue" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
          />
        </svg>
        <span className="text-sm text-hacker-light">Darlene is speaking...</span>
      </div>
    </div>
  );
};

export default VolumeIndicator;
