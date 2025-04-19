import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema - kept for compatibility with existing code
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Message schema for chat history
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  sender: text("sender").notNull(),
  text: text("text").notNull(),
  timestamp: text("timestamp").notNull(),
  isMouse: boolean("is_mouse").default(false),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  sender: true,
  text: true,
  timestamp: true,
  isMouse: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// News schema for storing cached news
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  publishedAt: text("published_at").notNull(),
  sourceName: text("source_name").notNull(),
  category: text("category").notNull(),
  fetchedAt: text("fetched_at").notNull(),
});

export const insertNewsSchema = createInsertSchema(news).pick({
  title: true,
  description: true,
  url: true,
  publishedAt: true,
  sourceName: true,
  category: true,
  fetchedAt: true,
});

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;
