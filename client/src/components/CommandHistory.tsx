
import { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface CommandHistoryProps {
  history: Array<{
    command: string;
    status: 'success' | 'error';
    timestamp: Date;
  }>;
  onReplay: (command: string) => void;
}

const CommandHistory = ({ history, onReplay }: CommandHistoryProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-200px)] w-64 border-l border-hacker-dark">
      <div className="p-4">
        <h3 className="text-sm font-semibold mb-4 text-hacker-blue">Command History</h3>
        <div className="space-y-2">
          {history.map((item, index) => (
            <div
              key={index}
              className="p-2 bg-hacker-dark rounded-md cursor-pointer hover:bg-black transition-colors"
              onClick={() => onReplay(item.command)}
            >
              <div className="flex items-center justify-between mb-1">
                <code className="text-xs text-hacker-green">{item.command}</code>
                <Badge variant={item.status === 'success' ? 'default' : 'destructive'}>
                  {item.status}
                </Badge>
              </div>
              <div className="text-xs text-hacker-gray">
                {item.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default CommandHistory;
