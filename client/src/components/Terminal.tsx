import { useState, useRef, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface TerminalProps {
  visible: boolean;
}

const Terminal = ({ visible }: TerminalProps) => {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentDirectory, setCurrentDirectory] = useState<string>('/home/user');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on input when terminal becomes visible
  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Add welcome message on first load
  useEffect(() => {
    setHistory([
      '██████╗  █████╗ ██████╗ ██╗     ███████╗███╗   ██╗███████╗',
      '██╔══██╗██╔══██╗██╔══██╗██║     ██╔════╝████╗  ██║██╔════╝',
      '██║  ██║███████║██████╔╝██║     █████╗  ██╔██╗ ██║█████╗  ',
      '██║  ██║██╔══██║██╔══██╗██║     ██╔══╝  ██║╚██╗██║██╔══╝  ',
      '██████╔╝██║  ██║██║  ██║███████╗███████╗██║ ╚████║███████╗',
      '╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝╚══════╝',
      '                                                           ',
      '> Terminal v1.0 - Execute real commands and scripts',
      '> Type "help" for available commands',
      '> BE CAUTIOUS: Commands run with the same permissions as the application',
      ''
    ]);
  }, []);

  const executeCommand = async (command: string) => {
    // Skip empty commands
    if (!command.trim()) return;

    // Add command to history
    const commandWithPrompt = `${currentDirectory}$ ${command}`;
    setHistory(prev => [...prev, commandWithPrompt]);
    
    // Clear input field
    setInput('');
    
    // Process built-in commands
    const cmd = command.trim().split(' ')[0].toLowerCase();
    const args = command.trim().split(' ').slice(1);

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    if (cmd === 'help') {
      setHistory(prev => [
        ...prev,
        'Available commands:',
        '  help        - Show this help message',
        '  clear       - Clear terminal',
        '  cd <dir>    - Change directory',
        '  python <args> - Run Python script',
        '  node <args> - Run Node.js script',
        '  ls          - List files',
        '  cat <file>  - Show file contents',
        '  mkdir <dir> - Create directory',
        '  rm <file>   - Remove file',
        '  script <name> <lang> - Create a new script in specified language',
        '  run <code>  - Execute code snippet',
        '  sys        - Show system resource usage',
        '  net        - Show network status',
        '  * Any other command will be executed directly in the shell',
        ''
      ]);
      return;
    }

    // Handle code execution
    if (cmd === 'run') {
      const code = args.join(' ');
      if (!code) {
        setHistory(prev => [...prev, 'Error: No code provided']);
        return;
      }

      try {
        setIsProcessing(true);
        const response = await apiRequest('POST', '/api/terminal/execute', {
          command: code,
          directory: currentDirectory
        });
        
        const data = await response.json();
        if (data.output) {
          const outputLines = data.output.split('\n');
          setHistory(prev => [...prev, ...outputLines]);
        }
      } catch (error) {
        setHistory(prev => [...prev, `Error executing code: ${error instanceof Error ? error.message : String(error)}`]);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Handle the script command for creating new scripts
    if (cmd === 'script' && args.length >= 2) {
      const scriptName = args[0];
      const language = args[1].toLowerCase();
      let template = '';
      
      if (language === 'python') {
        template = `#!/usr/bin/env python3\n\n# ${scriptName} - Created by D4RLENE\n\ndef main():\n    print("Hello from D4RLENE")\n    # Your code here\n\nif __name__ == "__main__":\n    main()`;
      } else if (language === 'js' || language === 'javascript' || language === 'node') {
        template = `#!/usr/bin/env node\n\n// ${scriptName} - Created by D4RLENE\n\nconsole.log("Hello from D4RLENE");\n// Your code here`;
      } else if (language === 'bash' || language === 'sh') {
        template = `#!/bin/bash\n\n# ${scriptName} - Created by D4RLENE\n\necho "Hello from D4RLENE"\n# Your code here`;
      } else {
        setHistory(prev => [...prev, `Error: Unsupported language: ${language}`, 'Supported languages: python, js, bash']);
        return;
      }

      try {
        setIsProcessing(true);
        const response = await apiRequest('POST', '/api/terminal/create-script', {
          name: scriptName,
          content: template,
          directory: currentDirectory
        });
        
        const data = await response.json();
        setHistory(prev => [...prev, data.message]);
      } catch (error) {
        setHistory(prev => [...prev, `Error creating script: ${error instanceof Error ? error.message : String(error)}`]);
      } finally {
        setIsProcessing(false);
      }
      
      return;
    }

    // Send command to server for execution
    try {
      setIsProcessing(true);
      const response = await apiRequest('POST', '/api/terminal/execute', {
        command,
        directory: currentDirectory
      });
      
      const data = await response.json();
      
      // Update current directory if it was changed by the command
      if (data.newDirectory) {
        setCurrentDirectory(data.newDirectory);
      }
      
      // Add command output to history
      if (data.output) {
        const outputLines = data.output.split('\n');
        setHistory(prev => [...prev, ...outputLines]);
      }
    } catch (error) {
      setHistory(prev => [...prev, `Error: ${error instanceof Error ? error.message : String(error)}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isProcessing) {
      executeCommand(input);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 h-2/5 bg-hacker-black border-t border-hacker-blue">
      <div className="flex items-center justify-between bg-hacker-dark p-2 border-b border-hacker-blue">
        <div className="flex items-center">
          <div className="status-indicator status-online"></div>
          <span className="text-hacker-green font-mono">D4RLENE Terminal</span>
        </div>
        <div className="text-xs text-hacker-gray font-mono">{currentDirectory}</div>
      </div>
      
      <div 
        ref={terminalRef}
        className="h-[calc(100%-40px)] overflow-y-auto p-3 font-mono text-sm text-hacker-light"
      >
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">{line}</div>
        ))}
        
        <div className="flex items-center mt-1">
          <span className="text-hacker-green mr-2">{currentDirectory}$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-hacker-light font-mono"
            disabled={isProcessing}
            autoFocus
          />
          {isProcessing && <span className="typing-dots text-hacker-gray ml-2"></span>}
        </div>
      </div>
    </div>
  );
};

export default Terminal;