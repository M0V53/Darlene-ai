import { createContext, useContext, useState, ReactNode } from 'react';

interface TerminalContextType {
  isTerminalOpen: boolean;
  toggleTerminal: () => void;
  closeTerminal: () => void;
  openTerminal: () => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export const TerminalProvider = ({ children }: { children: ReactNode }) => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const toggleTerminal = () => {
    setIsTerminalOpen(prev => !prev);
  };

  const closeTerminal = () => {
    setIsTerminalOpen(false);
  };

  const openTerminal = () => {
    setIsTerminalOpen(true);
  };

  return (
    <TerminalContext.Provider
      value={{
        isTerminalOpen,
        toggleTerminal,
        closeTerminal,
        openTerminal
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
};

export const useTerminal = () => {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
};