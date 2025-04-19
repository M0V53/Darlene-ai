// Speech recognition functionality using Web Speech API

export interface SpeechRecognitionOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;

  constructor() {
    this.initRecognition();
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
