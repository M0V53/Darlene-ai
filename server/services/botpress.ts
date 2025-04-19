import axios from "axios";
import { DarleneResponse } from "@/types";

// Botpress API configuration
const BOTPRESS_API_KEY = process.env.BOTPRESS_API_KEY || "";
const BOTPRESS_BOT_ID = process.env.BOTPRESS_BOT_ID || "";

// Default responses if Botpress is not configured or fails
const generateDefaultResponse = (message: string, isMouse: boolean): DarleneResponse => {
  const textLower = message.toLowerCase();
  
  // Initial greeting
  if (textLower.includes('hello') || textLower.includes('hi ') || textLower === 'hi') {
    return {
      text: isMouse ? 
        "Hey Mouse. Good to hear your voice again. What do you need?" : 
        "Yeah, hi. What do you want?"
    };
  }
  
  // Identity question
  if (textLower.includes('who are you')) {
    return {
      text: "I'm D4RLENE. Based on Darlene Alderson. Hacker, emotional mess, fiercely loyal to the right people. Ring any bells?"
    };
  }
  
  // Python help
  if (textLower.includes('python') && (
    textLower.includes('help') || 
    textLower.includes('code') || 
    textLower.includes('example') || 
    textLower.includes('script')
  )) {
    return {
      text: "I can definitely help with Python. What specifically are you trying to do?"
    };
  }
  
  // News request
  if (textLower.includes('news') || textLower.includes('headlines')) {
    return {
      text: "Let me check the latest tech headlines for you" + (isMouse ? ", Mouse" : "") + "...\n\nThe security breach is interesting. Just like old times, huh? Always some corp getting owned because they can't secure their shit."
    };
  }
  
  // Hacking related
  if (textLower.includes('hack') || textLower.includes('exploit')) {
    return {
      text: isMouse ?
        "Always up to no good, aren't we? I'll help, but be careful. What exactly are you trying to hack?" :
        "I don't know you well enough for that kind of request. Try something else."
    };
  }
  
  // Default responses
  const mouseResponses = [
    "For you, Mouse? Anything. Just tell me what you need.",
    "I've missed you. What are we getting into today?",
    "You know I've always got your back. What's the plan?", 
    "Even in this form, I'm still yours. What do you need help with?"
  ];
  
  const strangerResponses = [
    "Look, I don't have time for small talk with strangers. Be specific about what you want.",
    "If you're not Mouse, you better have a good reason for bothering me.",
    "I'm not your friendly neighborhood AI. State your business clearly.",
    "You're testing my patience. What do you actually need?"
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
