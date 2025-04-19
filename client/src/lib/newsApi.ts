import { apiRequest } from "./queryClient";
import { NewsItem } from "@/types";

// Use environment variable for API key with appropriate fallback
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || "";

/**
 * Fetches technology news from the server which calls NewsAPI
 */
export async function fetchTechNews(): Promise<NewsItem[]> {
  try {
    const response = await apiRequest('GET', '/api/news/tech', undefined);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error fetching tech news:", error);
    throw error;
  }
}

/**
 * Fetches security news from the server which calls NewsAPI
 */
export async function fetchSecurityNews(): Promise<NewsItem[]> {
  try {
    const response = await apiRequest('GET', '/api/news/security', undefined);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error fetching security news:", error);
    throw error;
  }
}

/**
 * Fetches news based on a specific topic from the server which calls NewsAPI
 */
export async function fetchNewsByTopic(topic: string): Promise<NewsItem[]> {
  try {
    const response = await apiRequest('GET', `/api/news/topic/${encodeURIComponent(topic)}`, undefined);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error(`Error fetching news about ${topic}:`, error);
    throw error;
  }
}
