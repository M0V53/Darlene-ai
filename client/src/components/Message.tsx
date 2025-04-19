import { formatDistanceToNow } from 'date-fns';
import CodeBlock from './CodeBlock';
import NewsDisplay from './NewsDisplay';
import { NewsItem } from '@/types';

interface MessageProps {
  sender: string;
  text: string;
  timestamp: Date;
  hasNews?: boolean;
  news?: NewsItem[];
}

const Message = ({ sender, text, timestamp, hasNews, news }: MessageProps) => {
  const isUser = sender === 'You';
  
  // Format message text by replacing 'Mouse' with highlighted version
  // and extracting code blocks if present
  const formatMessageText = (text: string) => {
    // Check for code blocks
    if (text.includes('```')) {
      const parts = text.split('```');
      return parts.map((part, index) => {
        // Even indices are regular text, odd indices are code
        if (index % 2 === 0) {
          // Regular text - highlight "Mouse" mentions
          return <span key={index} dangerouslySetInnerHTML={{ 
            __html: part.replace(/\bMouse\b/g, '<span class="text-hacker-green">Mouse</span>') 
          }} />;
        } else {
          // Code block
          return <CodeBlock key={index} code={part} />;
        }
      });
    }
    
    // No code blocks - just highlight "Mouse" mentions
    return <span dangerouslySetInnerHTML={{ 
      __html: text.replace(/\bMouse\b/g, '<span class="text-hacker-green">Mouse</span>') 
    }} />;
  };

  return (
    <div className={`flex justify-${isUser ? 'end' : 'start'}`}>
      <div className={`max-w-xs md:max-w-md rounded-${isUser ? 'tl-lg rounded-bl-lg rounded-br-lg bg-hacker-blue bg-opacity-20' : 'tr-lg rounded-br-lg rounded-bl-lg bg-hacker-dark text-hacker-light'} p-3`}>
        <div className={`flex items-center ${isUser ? 'justify-end' : ''} mb-1`}>
          {isUser ? (
            <>
              <span className="mr-2 text-xs text-hacker-gray">
                {formatDistanceToNow(timestamp, { addSuffix: true })}
              </span>
              <span className="font-bold text-sm">{sender}</span>
            </>
          ) : (
            <>
              <span className="font-bold text-hacker-blue text-sm">{sender}</span>
              <span className="ml-2 text-xs text-hacker-gray">
                {formatDistanceToNow(timestamp, { addSuffix: true })}
              </span>
            </>
          )}
        </div>
        
        <p className="text-sm">{formatMessageText(text)}</p>
        
        {/* News display */}
        {hasNews && news && news.length > 0 && (
          <NewsDisplay news={news} />
        )}
      </div>
    </div>
  );
};

export default Message;
