import axios from "axios";
import { NewsItem } from "@/types";

// NewsAPI configuration
const NEWS_API_KEY = process.env.NEWS_API_KEY || "";
const NEWS_API_URL = "https://newsapi.org/v2";

// Mock data for when API key is not available
const mockNewsData: { [key: string]: NewsItem[] } = {
  technology: [
    {
      title: "Major Security Breach at Tech Giant",
      description: "Over 5 million user accounts were compromised in what experts are calling \"one of the most sophisticated attacks this year\".",
      url: "https://example.com/tech-breach",
      publishedAt: new Date().toISOString(),
      source: { name: "Tech News Daily" }
    },
    {
      title: "New AI Regulations Proposed",
      description: "Lawmakers are pushing for stricter controls on artificial intelligence development amid growing concerns.",
      url: "https://example.com/ai-regulations",
      publishedAt: new Date().toISOString(),
      source: { name: "AI Insider" }
    },
    {
      title: "Breakthrough in Quantum Computing",
      description: "Researchers achieve stable quantum entanglement at room temperature, paving the way for practical quantum computing.",
      url: "https://example.com/quantum-breakthrough",
      publishedAt: new Date().toISOString(),
      source: { name: "Science Today" }
    }
  ],
  cybersecurity: [
    {
      title: "New Ransomware Strain Targets Healthcare",
      description: "Security researchers have identified a new ransomware variant specifically targeting hospital systems.",
      url: "https://example.com/ransomware-healthcare",
      publishedAt: new Date().toISOString(),
      source: { name: "Security Watch" }
    },
    {
      title: "Critical Vulnerability Found in Popular Framework",
      description: "Developers urged to patch immediately as zero-day exploit circulates online.",
      url: "https://example.com/framework-vulnerability",
      publishedAt: new Date().toISOString(),
      source: { name: "Hacker News" }
    },
    {
      title: "Phishing Attacks Increased 70% This Quarter",
      description: "New report shows alarming rise in sophisticated phishing campaigns targeting remote workers.",
      url: "https://example.com/phishing-increase",
      publishedAt: new Date().toISOString(),
      source: { name: "Threat Intel" }
    }
  ],
  default: [
    {
      title: "Latest Technology Trends for 2023",
      description: "Experts predict the technologies that will shape the coming year.",
      url: "https://example.com/tech-trends",
      publishedAt: new Date().toISOString(),
      source: { name: "Tech Review" }
    },
    {
      title: "Startup Raises $50M for New Computing Platform",
      description: "Investors flock to back revolutionary computing approach that promises 10x performance.",
      url: "https://example.com/startup-funding",
      publishedAt: new Date().toISOString(),
      source: { name: "Venture News" }
    },
    {
      title: "Global Chip Shortage Expected to Ease",
      description: "Supply chain analysts predict gradual improvement in semiconductor availability.",
      url: "https://example.com/chip-shortage",
      publishedAt: new Date().toISOString(),
      source: { name: "Industry Today" }
    }
  ]
};

/**
 * Gets news from NewsAPI or falls back to mock data if API key is not provided
 */
export async function getNewsFromAPI(topic: string = "technology"): Promise<NewsItem[]> {
  if (!NEWS_API_KEY) {
    console.log("NewsAPI key not found, using mock news data");
    // Return appropriate mock data based on topic or default
    return mockNewsData[topic.toLowerCase()] || mockNewsData.default;
  }
  
  try {
    // Format the query based on the topic
    const query = encodeURIComponent(topic);
    const url = `${NEWS_API_URL}/everything?q=${query}&sortBy=publishedAt&language=en&pageSize=3&apiKey=${NEWS_API_KEY}`;
    
    const response = await axios.get(url);
    
    if (response.data && response.data.articles) {
      return response.data.articles;
    } else {
      throw new Error("Invalid response from NewsAPI");
    }
  } catch (error) {
    console.error("Error fetching news from NewsAPI:", error);
    // Fall back to mock data if API call fails
    return mockNewsData[topic.toLowerCase()] || mockNewsData.default;
  }
}
