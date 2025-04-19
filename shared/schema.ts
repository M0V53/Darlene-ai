import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema - kept for compatibility with existing code
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
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
  timestamp: timestamp("timestamp").defaultNow(),
  isMouse: boolean("is_mouse").default(false),
  userId: integer("user_id").references(() => users.id),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  sender: true,
  text: true,
  isMouse: true,
  userId: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// News schema for storing cached news
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull().unique(),
  publishedAt: timestamp("published_at").notNull(),
  sourceName: text("source_name").notNull(),
  category: text("category").notNull(),
  fetchedAt: timestamp("fetched_at").defaultNow(),
  urlToImage: text("url_to_image"),
});

export const insertNewsSchema = createInsertSchema(news).pick({
  title: true,
  description: true,
  url: true,
  publishedAt: true,
  sourceName: true,
  category: true,
  urlToImage: true,
});

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;

// Junction table for many-to-many relationship between messages and news
export const messageNewsRelations = pgTable("message_news_relations", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull().references(() => messages.id),
  newsId: integer("news_id").notNull().references(() => news.id),
});

// Define relations after all tables are defined to avoid circular dependencies
export const usersRelations = relations(users, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
  newsItems: many(messageNewsRelations),
}));

export const newsRelations = relations(news, ({ many }) => ({
  messageNewsRelations: many(messageNewsRelations),
}));

export const messageNewsRelationsRelations = relations(messageNewsRelations, ({ one }) => ({
  message: one(messages, {
    fields: [messageNewsRelations.messageId],
    references: [messages.id],
  }),
  news: one(news, {
    fields: [messageNewsRelations.newsId],
    references: [news.id],
  }),
}));
