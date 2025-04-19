// Message type for chat
export interface MessageType {
  sender: string;
  text: string;
  timestamp: Date;
  news?: NewsItem[];
}

// Response from Darlene AI
export interface DarleneResponse {
  text: string;
  context?: {
    isMouse?: boolean;
    topic?: string;
  };
}

// News item from NewsAPI
export interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    id?: string;
    name: string;
  };
}
