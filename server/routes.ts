import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from 'ws';
import { storage } from "./storage";
import { getNewsFromAPI } from "./services/newsapi";
import { getDarleneResponse } from "./services/botpress";
import { executeCommand, createScript } from "./services/terminal";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat API endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, isMouse } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      // Get response from LLAMA 70B or fallback to local logic
      const response = await getDarleneResponse(message, !!isMouse);
      
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

  // Terminal API endpoints
  app.post("/api/terminal/execute", async (req, res) => {
    try {
      const { command, directory } = req.body;
      
      if (!command) {
        return res.status(400).json({ message: "Command is required" });
      }
      
      const result = await executeCommand(command, directory || process.cwd());
      return res.json(result);
    } catch (error) {
      console.error("Error executing terminal command:", error);
      return res.status(500).json({ 
        output: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
      });
    }
  });

  app.post("/api/terminal/create-script", async (req, res) => {
    try {
      const { name, content, directory } = req.body;
      
      if (!name || !content) {
        return res.status(400).json({ message: "Script name and content are required" });
      }
      
      const result = await createScript(name, content, directory || process.cwd());
      return res.json(result);
    } catch (error) {
      console.error("Error creating script:", error);
      return res.status(500).json({ 
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
      });
    }
  });

  const httpServer = createServer(app);
  
  // Add WebSocket server for real-time terminal updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });
  
  return httpServer;
}
