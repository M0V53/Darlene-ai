import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback,
  ReactNode 
} from "react";
import { apiRequest } from "@/lib/queryClient";
import { MessageType, DarleneResponse, NewsItem } from "@/types";
import speechRecognition from "@/lib/speechRecognition";
import textToSpeech from "@/lib/textToSpeech";
import { fetchTechNews } from "@/lib/newsApi";
import { useDarleneResponse } from "@/hooks/useDarleneResponse";

interface ChatContextType {
  messages: MessageType[];
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  isMouse: boolean;
  sendMessage: (text: string) => Promise<void>;
  startListening: () => void;
  stopListening: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMouse, setIsMouse] = useState(false);
  
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
      // Check if user identified as Mouse
      const textLower = text.toLowerCase();
      const userMentionsMouse = textLower.includes("i am mouse") || 
                               textLower.includes("i'm mouse") || 
                               textLower === "mouse";
      
      if (userMentionsMouse && !isMouse) {
        setIsMouse(true);
        localStorage.setItem("isMouse", "true");
      }

      // Get response from backend
      let darleneResponse: DarleneResponse;
      let newsItems: NewsItem[] | undefined;
      
      // Check if message is about news
      const isNewsRequest = textLower.includes("news") || 
                           textLower.includes("headlines") || 
                           textLower.includes("current events");
      
      if (isNewsRequest) {
        try {
          newsItems = await fetchTechNews();
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
  }, [isProcessing, isMouse, getDarleneResponse]);

  // Check if user has previously identified as Mouse
  useEffect(() => {
    const savedIsMouse = localStorage.getItem("isMouse");
    if (savedIsMouse === "true") {
      setIsMouse(true);
    }
  }, []);

  // Setup speech recognition callbacks
  const startListening = useCallback(() => {
    if (isProcessing) return;
    
    speechRecognition.start({
      onStart: () => setIsListening(true),
      onEnd: () => setIsListening(false),
      onResult: (transcript) => {
        if (transcript.trim()) {
          sendMessage(transcript);
        }
      },
      onError: (error) => {
        console.error("Speech recognition error:", error);
        setIsListening(false);
      }
    });
  }, [isProcessing, sendMessage]);

  const stopListening = useCallback(() => {
    speechRecognition.stop();
    setIsListening(false);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isListening,
        isProcessing,
        isSpeaking,
        isMouse,
        sendMessage,
        startListening,
        stopListening
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
