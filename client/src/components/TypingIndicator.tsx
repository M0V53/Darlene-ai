const TypingIndicator = () => {
  return (
    <div id="typingIndicator" className="flex justify-start">
      <div className="max-w-xs md:max-w-md rounded-tr-lg rounded-br-lg rounded-bl-lg bg-hacker-dark p-3 text-hacker-light">
        <div className="flex items-center mb-1">
          <span className="font-bold text-hacker-blue text-sm">D4RLENE</span>
          <span className="ml-2 text-xs text-hacker-gray">typing</span>
        </div>
        <div className="audio-wave">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
