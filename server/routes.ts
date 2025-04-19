import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getNewsFromAPI } from "./services/newsapi";
import { getBotpressResponse } from "./services/botpress";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat API endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, isMouse } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      // Get response from Botpress or fallback to local logic
      const response = await getBotpressResponse(message, !!isMouse);
      
      return res.json(response);
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      return res.status(500).json({ message: "Error processing chat request" });
    }
  });

  // News API endpoints
  app.get("/api/news/tech", async (req, res) => {
    try {
      const articles = await getNewsFromAPI("technology");
      return res.json({ articles });
    } catch (error) {
      console.error("Error fetching tech news:", error);
      return res.status(500).json({ message: "Error fetching news" });
    }
  });

  app.get("/api/news/security", async (req, res) => {
    try {
      const articles = await getNewsFromAPI("cybersecurity");
      return res.json({ articles });
    } catch (error) {
      console.error("Error fetching security news:", error);
      return res.status(500).json({ message: "Error fetching news" });
    }
  });

  app.get("/api/news/topic/:topic", async (req, res) => {
    try {
      const { topic } = req.params;
      const articles = await getNewsFromAPI(topic);
      return res.json({ articles });
    } catch (error) {
      console.error(`Error fetching news for topic ${req.params.topic}:`, error);
      return res.status(500).json({ message: "Error fetching news" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
