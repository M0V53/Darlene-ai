// Speech recognition functionality using Web Speech API with wake word detection

// TypeScript definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  interpretation: any;
  emma: Document | null;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  abort(): void;
  start(): void;
  stop(): void;
}

// For TypeScript compatibility
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export interface SpeechRecognitionOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  onWakeWord?: () => void;
}

class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private wakeWordRecognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private isWakeWordListening: boolean = false;
  private wakeWords: string[] = ['hey darlene', 'hey darleen', 'darlene', 'darleen', 'hey d4rlene', 'd4rlene'];
  private wakeWordThreshold: number = 0.8; // Confidence threshold for wake word detection

  constructor() {
    this.initRecognition();
    this.initWakeWordRecognition();
  }

  private initRecognition() {
    // Browser compatibility check
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
  }

  private initWakeWordRecognition() {
    // Browser compatibility check
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser");
      return;
    }

    this.wakeWordRecognition = new SpeechRecognition();
    this.wakeWordRecognition.continuous = true;
    this.wakeWordRecognition.interimResults = true;
    this.wakeWordRecognition.lang = 'en-US';
  }

  /**
   * Start listening for the wake word
   */
  public startWakeWordDetection(options: SpeechRecognitionOptions = {}) {
    if (!this.wakeWordRecognition) {
      options.onError?.("Speech recognition not supported in this browser");
      return false;
    }

    if (this.isWakeWordListening) {
      return true;
    }

    console.log("Starting wake word detection...");

    // Set up event handlers
    this.wakeWordRecognition.onstart = () => {
      this.isWakeWordListening = true;
      console.log("Wake word detection started");
    };

    this.wakeWordRecognition.onend = () => {
      // Auto restart if we were supposed to be listening
      if (this.isWakeWordListening) {
        try {
          this.wakeWordRecognition?.start();
        } catch (error) {
          console.error("Error restarting wake word detection:", error);
          this.isWakeWordListening = false;
        }
      }
    };

    this.wakeWordRecognition.onresult = (event) => {
      const results = Array.from(event.results);
      
      // Check most recent result first (in case there are multiple)
      for (let i = results.length - 1; i >= 0; i--) {
        if (results[i].isFinal) {
          const transcript = results[i][0].transcript.trim().toLowerCase();
          const confidence = results[i][0].confidence;
          
          console.log(`Wake word check: "${transcript}" (confidence: ${confidence})`);
          
          // Check if the transcript contains any of our wake words with good confidence
          if (confidence >= this.wakeWordThreshold && 
              this.wakeWords.some(wakeWord => transcript.includes(wakeWord))) {
            console.log(`Wake word detected: "${transcript}"`);
            
            // Stop wake word detection and notify callback
            this.pauseWakeWordDetection();
            
            // Notify the callback
            options.onWakeWord?.();
            break;
          }
        }
      }
    };

    this.wakeWordRecognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        // This is normal, just restart
        return;
      }
      
      console.error("Wake word detection error:", event.error);
      options.onError?.(event.error);
      this.isWakeWordListening = false;
    };

    // Start listening
    try {
      this.wakeWordRecognition.start();
      return true;
    } catch (error) {
      console.error("Error starting wake word detection:", error);
      options.onError?.("Failed to start wake word detection");
      return false;
    }
  }

  /**
   * Temporarily pause wake word detection
   */
  public pauseWakeWordDetection() {
    if (this.wakeWordRecognition && this.isWakeWordListening) {
      try {
        this.isWakeWordListening = false;
        this.wakeWordRecognition.stop();
      } catch (error) {
        console.error("Error stopping wake word detection:", error);
      }
    }
  }

  /**
   * Stop wake word detection completely
   */
  public stopWakeWordDetection() {
    this.isWakeWordListening = false;
    if (this.wakeWordRecognition) {
      try {
        this.wakeWordRecognition.stop();
      } catch (error) {
        console.error("Error stopping wake word detection:", error);
      }
    }
  }

  /**
   * Start listening for a command after wake word
   */
  public start(options: SpeechRecognitionOptions = {}) {
    if (!this.recognition) {
      options.onError?.("Speech recognition not supported in this browser");
      return false;
    }

    if (this.isListening) {
      return true;
    }

    // Set up event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      options.onStart?.();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      options.onEnd?.();
      
      // Restart wake word detection after command is processed
      if (this.isWakeWordListening === false) {
        setTimeout(() => {
          this.startWakeWordDetection(options);
        }, 1000); // Small delay before restarting wake word detection
      }
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      options.onResult?.(transcript);
    };

    this.recognition.onerror = (event) => {
      options.onError?.(event.error);
      this.isListening = false;
    };

    // Start listening
    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      options.onError?.("Failed to start speech recognition");
      return false;
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }
  }

  public isSupported(): boolean {
    return !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition);
  }
}

// Create singleton instance
const speechRecognition = new SpeechRecognitionService();
export default speechRecognition;
