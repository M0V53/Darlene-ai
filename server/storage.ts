import { users, type User, type InsertUser, messages, type Message, type InsertMessage, news, type News, type InsertNews, messageNewsRelations } from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Message operations
  saveMessage(message: InsertMessage): Promise<Message>;
  getMessages(limit?: number): Promise<Message[]>;
  getMessageById(id: number): Promise<Message | undefined>;
  
  // News operations
  saveNews(newsItem: InsertNews): Promise<News>;
  getNewsByUrl(url: string): Promise<News | undefined>;
  getNewsByCategory(category: string, limit?: number): Promise<News[]>;
  
  // Relationship operations
  linkMessageToNews(messageId: number, newsId: number): Promise<void>;
  getNewsForMessage(messageId: number): Promise<News[]>;
}

// Database implementation using Drizzle ORM
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Message operations
  async saveMessage(message: InsertMessage): Promise<Message> {
    const [savedMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return savedMessage;
  }
  
  async getMessages(limit: number = 100): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .orderBy(desc(messages.timestamp))
      .limit(limit);
  }
  
  async getMessageById(id: number): Promise<Message | undefined> {
    const [message] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, id));
    return message || undefined;
  }
  
  // News operations
  async saveNews(newsItem: InsertNews): Promise<News> {
    try {
      // First check if we already have this news by URL
      const existingNews = await this.getNewsByUrl(newsItem.url);
      if (existingNews) {
        return existingNews;
      }
      
      // If not, create a new entry
      const [savedNews] = await db
        .insert(news)
        .values(newsItem)
        .returning();
      return savedNews;
    } catch (error) {
      console.error("Error saving news:", error);
      throw error;
    }
  }
  
  async getNewsByUrl(url: string): Promise<News | undefined> {
    const [newsItem] = await db
      .select()
      .from(news)
      .where(eq(news.url, url));
    return newsItem || undefined;
  }
  
  async getNewsByCategory(category: string, limit: number = 10): Promise<News[]> {
    return db
      .select()
      .from(news)
      .where(eq(news.category, category))
      .orderBy(desc(news.publishedAt))
      .limit(limit);
  }
  
  // Relationship operations
  async linkMessageToNews(messageId: number, newsId: number): Promise<void> {
    // Check if the relation already exists
    const [existingRelation] = await db
      .select()
      .from(messageNewsRelations)
      .where(
        and(
          eq(messageNewsRelations.messageId, messageId),
          eq(messageNewsRelations.newsId, newsId)
        )
      );
      
    if (!existingRelation) {
      await db
        .insert(messageNewsRelations)
        .values({ messageId, newsId });
    }
  }
  
  async getNewsForMessage(messageId: number): Promise<News[]> {
    const result = await db
      .select({
        news: news
      })
      .from(messageNewsRelations)
      .innerJoin(news, eq(messageNewsRelations.newsId, news.id))
      .where(eq(messageNewsRelations.messageId, messageId));
      
    return result.map(r => r.news);
  }
}

// Export singleton database storage instance
export const storage = new DatabaseStorage();
