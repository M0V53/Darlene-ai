// Text to speech functionality using SpeechSynthesis API

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

class TextToSpeechService {
  private synth: SpeechSynthesis;
  private isSpeaking: boolean = false;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  public speak(text: string, options: SpeechOptions = {}): boolean {
    if (!this.synth) {
      options.onError?.("Text-to-speech not supported in this browser");
      return false;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice - try to find a female voice for Darlene
    const voices = this.synth.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('girl')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    // Set speech parameters with defaults
    utterance.rate = options.rate ?? 1.1;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;

    // Set event handlers
    utterance.onstart = () => {
      this.isSpeaking = true;
      options.onStart?.();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      options.onEnd?.();
    };

    utterance.onerror = (event) => {
      this.isSpeaking = false;
      options.onError?.(event.error);
    };

    // Start speaking
    try {
      this.synth.speak(utterance);
      return true;
    } catch (error) {
      console.error("Error speaking text:", error);
      options.onError?.("Failed to speak text");
      return false;
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  public isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

// Create singleton instance
const textToSpeech = new TextToSpeechService();
export default textToSpeech;
