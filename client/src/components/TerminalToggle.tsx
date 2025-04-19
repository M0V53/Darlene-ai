import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalToggleProps {
  isOpen: boolean;
  toggle: () => void;
}

const TerminalToggle = ({ isOpen, toggle }: TerminalToggleProps) => {
  return (
    <button 
      onClick={toggle}
      className={`fixed bottom-4 right-4 z-50 p-3 rounded-full ${
        isOpen ? 'bg-hacker-red' : 'bg-hacker-blue'
      } text-hacker-black shadow-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105`}
      aria-label={isOpen ? 'Close Terminal' : 'Open Terminal'}
    >
      <TerminalIcon className="w-5 h-5" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-hacker-green rounded-full border border-hacker-black"></span>
    </button>
  );
};

export default TerminalToggle;