import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback,
  useRef,
  ReactNode 
} from "react";
import { apiRequest } from "@/lib/queryClient";
import { MessageType, DarleneResponse, NewsItem } from "@/types";
import speechRecognition from "@/lib/speechRecognition";
import textToSpeech from "@/lib/textToSpeech";
import { fetchTechNews, fetchSecurityNews, fetchNewsByTopic } from "@/lib/newsApi";
import { useDarleneResponse } from "@/hooks/useDarleneResponse";
import { useToast } from "@/hooks/use-toast";

interface ChatContextType {
  messages: MessageType[];
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  isMouse: boolean;
  isWakeWordActive: boolean;
  wakeWordDetected: boolean;
  sendMessage: (text: string) => Promise<void>;
  startListening: () => void;
  stopListening: () => void;
  toggleWakeWord: () => void;
  controlSmartDevice: (device: string, action: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Regular expressions for detecting intent
const NEWS_REGEX = /news|headlines|current events|what'?s happening|updates/i;
const SECURITY_NEWS_REGEX = /security news|cyber|hack|breach|vulnerability|attack/i;
const TOPIC_NEWS_REGEX = /news about (.+)|(.+) news|tell me about (.+)|what'?s happening with (.+)|updates (on|about) (.+)/i;

// Smart device control patterns
const SMART_DEVICE_REGEX = /turn (on|off) the (.+)|(turn|switch|set) (.+) (on|off|to) ?(.+)?|dim (.+) to (.+)|brighten (.+) to (.+)|(open|close) the (.+)/i;

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMouse, setIsMouse] = useState(false);
  const [isWakeWordActive, setIsWakeWordActive] = useState(false);
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const conversationContext = useRef<{topic?: string; lastIntent?: string; followUpExpected?: boolean}>({});
  const { toast } = useToast();
  
  const { getDarleneResponse } = useDarleneResponse();

  // Add initial welcome message
  useEffect(() => {
    const welcomeMessage: MessageType = {
      sender: "D4RLENE",
      text: "Well, well... look who finally decided to show up. I'm D4RLENE. And you are...?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Smart device control - fake function for demo
  const controlSmartDevice = useCallback(async (device: string, action: string) => {
    console.log(`Controlling device: ${device}, action: ${action}`);
    
    // In a real app, this would make API calls to smart home services
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return success message
      toast({
        title: "Smart Home Control",
        description: `${action} ${device}`,
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error controlling smart device:", error);
      return Promise.reject(error);
    }
  }, [toast]);

  // Extract topics from news requests
  const extractTopic = useCallback((text: string): string | null => {
    const topicMatch = text.match(TOPIC_NEWS_REGEX);
    if (topicMatch) {
      // Find the first non-empty capturing group (that's our topic)
      for (let i = 1; i < topicMatch.length; i++) {
        if (topicMatch[i] && !topicMatch[i].match(/^(on|about)$/i)) {
          return topicMatch[i].trim();
        }
      }
    }
    return null;
  }, []);

  // Parse smart device commands
  const parseSmartDeviceCommand = useCallback((text: string): { device: string; action: string } | null => {
    const match = text.match(SMART_DEVICE_REGEX);
    
    if (!match) return null;
    
    // Different patterns for different types of commands
    if (match[1] && match[2]) { 
      // "turn on/off the light"
      return {
        device: match[2].toLowerCase(),
        action: match[1].toLowerCase()
      };
    } else if (match[3] && match[4] && match[5]) {
      // "turn/switch/set light on/off/to 50%"
      let device = match[4].toLowerCase();
      let action = match[5].toLowerCase();
      let value = match[6] ? match[6].toLowerCase() : '';
      
      return {
        device,
        action: value ? `${action} ${value}` : action
      };
    } else if (match[7] && match[8]) {
      // "dim light to 50%"
      return {
        device: match[7].toLowerCase(),
        action: `dim to ${match[8].toLowerCase()}`
      };
    } else if (match[9] && match[10]) {
      // "brighten light to 80%"
      return {
        device: match[9].toLowerCase(),
        action: `brighten to ${match[10].toLowerCase()}`
      };
    } else if (match[11] && match[12]) {
      // "open/close the garage"
      return {
        device: match[12].toLowerCase(),
        action: match[11].toLowerCase()
      };
    }
    
    return null;
  }, []);

  // Process the message for intent and maintain conversation context
  const processMessageContext = useCallback((text: string) => {
    const textLower = text.toLowerCase();
    
    // Extract and store conversation context
    if (NEWS_REGEX.test(textLower)) {
      conversationContext.current.topic = 'news';
      conversationContext.current.lastIntent = 'news_request';
      conversationContext.current.followUpExpected = true;
    }
    
    // Look for topic-specific news
    const topic = extractTopic(text);
    if (topic) {
      conversationContext.current.topic = topic;
    }
    
    // Smart device control
    const deviceCommand = parseSmartDeviceCommand(text);
    if (deviceCommand) {
      conversationContext.current.lastIntent = 'device_control';
      conversationContext.current.followUpExpected = true;
    }
    
    // User mentioned Mouse
    const userMentionsMouse = textLower.includes("i am mouse") || 
                             textLower.includes("i'm mouse") || 
                             textLower === "mouse";
    
    return {
      isNewsRequest: NEWS_REGEX.test(textLower),
      isSecurityNewsRequest: SECURITY_NEWS_REGEX.test(textLower),
      topic,
      deviceCommand,
      userMentionsMouse
    };
  }, [extractTopic, parseSmartDeviceCommand]);

  // Handle sending a message
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isProcessing) return;

    // Add user message to chat
    const userMessage: MessageType = {
      sender: "You",
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Start processing
    setIsProcessing(true);

    try {
      // Process message for intent and context
      const { 
        isNewsRequest, 
        isSecurityNewsRequest, 
        topic, 
        deviceCommand, 
        userMentionsMouse 
      } = processMessageContext(text);
      
      // Update Mouse status if identified
      if (userMentionsMouse && !isMouse) {
        setIsMouse(true);
        localStorage.setItem("isMouse", "true");
      }

      // Handle device control first if detected
      if (deviceCommand) {
        try {
          await controlSmartDevice(deviceCommand.device, deviceCommand.action);
          
          // Add device control confirmation
          const deviceResponse: MessageType = {
            sender: "D4RLENE",
            text: `Done. ${deviceCommand.action} the ${deviceCommand.device}. Anything else you need?`,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, deviceResponse]);
          
          // Speak the response
          textToSpeech.speak(deviceResponse.text, {
            onStart: () => setIsSpeaking(true),
            onEnd: () => setIsSpeaking(false)
          });
          
          setIsProcessing(false);
          return;
        } catch (error) {
          console.error("Error controlling device:", error);
          // Continue to normal response if device control fails
        }
      }

      // Get response from backend
      let darleneResponse: DarleneResponse;
      let newsItems: NewsItem[] | undefined;
      
      // Fetch news if requested
      if (isNewsRequest || isSecurityNewsRequest || topic) {
        try {
          if (isSecurityNewsRequest) {
            newsItems = await fetchSecurityNews();
          } else if (topic) {
            newsItems = await fetchNewsByTopic(topic);
          } else {
            newsItems = await fetchTechNews();
          }
        } catch (error) {
          console.error("Error fetching news:", error);
        }
      }

      // Get Darlene's response
      try {
        const response = await apiRequest(
          "POST", 
          "/api/chat", 
          { message: text, isMouse: isMouse || userMentionsMouse }
        );
        darleneResponse = await response.json();
      } catch (error) {
        console.error("Error getting response from API:", error);
        // Fallback to local responses if API fails
        darleneResponse = getDarleneResponse(text, isMouse || userMentionsMouse);
      }

      // Add Darlene's response to chat
      const darleneMessage: MessageType = {
        sender: "D4RLENE",
        text: darleneResponse.text,
        timestamp: new Date(),
        news: newsItems
      };
      
      setMessages(prev => [...prev, darleneMessage]);
      
      // Speak the response
      textToSpeech.speak(darleneResponse.text, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: (error) => {
          console.error("Text-to-speech error:", error);
          setIsSpeaking(false);
        }
      });
      
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, isMouse, getDarleneResponse, processMessageContext, controlSmartDevice]);

  // Check if user has previously identified as Mouse
  useEffect(() => {
    const savedIsMouse = localStorage.getItem("isMouse");
    if (savedIsMouse === "true") {
      setIsMouse(true);
    }
  }, []);

  // Toggle wake word detection
  const toggleWakeWord = useCallback(() => {
    setIsWakeWordActive(prev => {
      const newState = !prev;
      
      if (newState) {
        // Start wake word detection
        speechRecognition.startWakeWordDetection({
          onWakeWord: () => {
            console.log("Wake word detected!");
            setWakeWordDetected(true);
            
            // Alert user that wake word was detected
            textToSpeech.speak("Yes?", {
              onStart: () => setIsSpeaking(true),
              onEnd: () => {
                setIsSpeaking(false);
                // Start listening for command
                startListening();
              }
            });
          },
          onError: (error) => {
            console.error("Wake word detection error:", error);
            setIsWakeWordActive(false);
          }
        });
        
        toast({
          title: "Wake Word Detection Active",
          description: "Say 'Hey Darlene' to activate",
        });
      } else {
        // Stop wake word detection
        speechRecognition.stopWakeWordDetection();
        toast({
          title: "Wake Word Detection Disabled",
          description: "Manual activation only",
        });
      }
      
      return newState;
    });
  }, [toast]);

  // Setup speech recognition callbacks
  const startListening = useCallback(() => {
    if (isProcessing || isSpeaking) return;
    
    speechRecognition.start({
      onStart: () => setIsListening(true),
      onEnd: () => {
        setIsListening(false);
        setWakeWordDetected(false);
      },
      onResult: (transcript) => {
        if (transcript.trim()) {
          sendMessage(transcript);
        }
      },
      onError: (error) => {
        console.error("Speech recognition error:", error);
        setIsListening(false);
        setWakeWordDetected(false);
      }
    });
  }, [isProcessing, isSpeaking, sendMessage]);

  const stopListening = useCallback(() => {
    speechRecognition.stop();
    setIsListening(false);
    setWakeWordDetected(false);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isListening,
        isProcessing,
        isSpeaking,
        isMouse,
        isWakeWordActive,
        wakeWordDetected,
        sendMessage,
        startListening,
        stopListening,
        toggleWakeWord,
        controlSmartDevice
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
