import { NewsItem } from "@/types";

interface NewsDisplayProps {
  news: NewsItem[];
}

const NewsDisplay = ({ news }: NewsDisplayProps) => {
  return (
    <div className="bg-black bg-opacity-30 p-3 rounded text-xs mt-2">
      <div className="text-hacker-green mb-1">$ fetching from NewsAPI...</div>
      
      {news.slice(0, 3).map((item, index) => (
        <div 
          key={index} 
          className={`${index < news.length - 1 ? 'mb-2 border-b border-hacker-gray border-opacity-20 pb-2' : ''}`}
        >
          <p className="font-bold text-hacker-light mb-1">{item.title}</p>
          <p className="text-hacker-gray">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default NewsDisplay;
