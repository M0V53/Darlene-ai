// Text to speech functionality using SpeechSynthesis API
// Customized to sound more like Darlene from Mr. Robot

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceIndex?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

// Darlene from Mr. Robot voice characteristics:
// - Slightly raspy
// - Medium-high pitch but not too high
// - Faster speech rate
// - Somewhat sarcastic/edgy tone
// - Slight vocal fry

class TextToSpeechService {
  private synth: SpeechSynthesis;
  private isSpeaking: boolean = false;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoiceIndex: number = -1;
  private darleneVoiceSettings = {
    rate: 1.1,    // Slightly faster than normal
    pitch: 1.15,  // Slightly higher pitch
    volume: 0.95  // Not too loud
  };

  constructor() {
    this.synth = window.speechSynthesis;
    
    // Load voices
    if (this.synth) {
      // Chrome loads voices asynchronously
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = this.loadVoices.bind(this);
      }
      
      // Initial load attempt (works in Firefox)
      this.loadVoices();
    }
  }
  
  private loadVoices(): void {
    this.voices = this.synth.getVoices();
    
    // Try to find the best voice for Darlene
    // Preference order:
    // 1. US English female voices
    // 2. Any English female voices
    // 3. Any female voices
    // 4. Any English voice
    
    // Check for US English female voice
    const usEnglishFemale = this.voices.findIndex(voice => 
      voice.lang.includes('en-US') && 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('woman') ||
       voice.name.toLowerCase().includes('girl') ||
       voice.name.toLowerCase().includes('samantha') ||
       voice.name.toLowerCase().includes('alex'))
    );
    
    if (usEnglishFemale !== -1) {
      this.selectedVoiceIndex = usEnglishFemale;
      return;
    }
    
    // Check for any English female voice
    const englishFemale = this.voices.findIndex(voice => 
      voice.lang.includes('en') && 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('woman') ||
       voice.name.toLowerCase().includes('girl') ||
       voice.name.toLowerCase().includes('samantha') ||
       voice.name.toLowerCase().includes('alex'))
    );
    
    if (englishFemale !== -1) {
      this.selectedVoiceIndex = englishFemale;
      return;
    }
    
    // Check for any female voice
    const femaleVoice = this.voices.findIndex(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('girl')
    );
    
    if (femaleVoice !== -1) {
      this.selectedVoiceIndex = femaleVoice;
      return;
    }
    
    // Default to first English voice
    const englishVoice = this.voices.findIndex(voice => voice.lang.includes('en'));
    if (englishVoice !== -1) {
      this.selectedVoiceIndex = englishVoice;
    }
  }
  
  // Process text to better match Darlene's speech patterns and quirks
  private processDarleneText(text: string): string {
    // Standard browsers don't support SSML tags, so we'll use other techniques
    
    // Add pauses by using commas and ellipses for sentence breaks
    text = text.replace(/\.\s+/g, '... ');
    text = text.replace(/\?\s+/g, '? ... ');
    text = text.replace(/\!\s+/g, '! ... ');
    
    // Emphasize key Darlene-related words with capitalization
    const emphasisWords = [
      'hack', 'system', 'security', 'firewall', 'encrypted', 'password',
      'code', 'breach', 'access', 'network', 'backdoor', 'exploit', 
      'vulnerable', 'attack', 'target', 'server', 'encrypted', 'fsociety',
      'revolution', 'control', 'corporation', 'surveillance', 'privacy'
    ];
    
    // Emphasize words without using tags
    emphasisWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      text = text.replace(regex, match => match.toUpperCase());
    });
    
    // Add mild sarcasm markers
    const sarcasmPatterns = [
      { regex: /great\./gi, replacement: 'great... right.' },
      { regex: /awesome\./gi, replacement: 'awesome... I guess.' },
      { regex: /fantastic\./gi, replacement: 'fantastic... whatever.' },
      { regex: /wonderful\./gi, replacement: 'wonderful... sure.' }
    ];
    
    sarcasmPatterns.forEach(pattern => {
      text = text.replace(pattern.regex, pattern.replacement);
    });
    
    // Add occasional mild vocal fry at sentence ends
    if (Math.random() > 0.7) {
      text = text.replace(/\.\s+/g, (match, offset) => {
        // Only add vocal fry to some sentence endings
        return offset > text.length / 2 ? '... ' : match;
      });
    }
    
    return text;
  }

  public speak(text: string, options: SpeechOptions = {}): boolean {
    if (!this.synth) {
      options.onError?.("Text-to-speech not supported in this browser");
      return false;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    // Process text to be more like Darlene's speech patterns
    text = this.processDarleneText(text);
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to reload voices if they weren't loaded initially
    if (this.voices.length === 0) {
      this.voices = this.synth.getVoices();
    }
    
    // Use specified voice or selected default
    const voiceIndex = options.voiceIndex !== undefined ? 
      options.voiceIndex : this.selectedVoiceIndex;
    
    if (voiceIndex >= 0 && voiceIndex < this.voices.length) {
      utterance.voice = this.voices[voiceIndex];
    }

    // Set speech parameters with Darlene-specific defaults
    utterance.rate = options.rate ?? this.darleneVoiceSettings.rate;
    utterance.pitch = options.pitch ?? this.darleneVoiceSettings.pitch;
    utterance.volume = options.volume ?? this.darleneVoiceSettings.volume;

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