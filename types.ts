
export interface Asset {
  id: string;
  type: 'image' | 'text' | 'audio';
  prompt: string;
  url: string; // for image/audio data URL
  content: string; // for text content like songs
  createdAt: Date;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface Translation {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  assets: Asset[];
  chatHistory: ChatMessage[];
  translations: Translation[];
}
