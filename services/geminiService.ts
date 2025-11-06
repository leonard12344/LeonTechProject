
import { GoogleGenAI, GenerateContentResponse, Content, Tool, Modality } from "@google/genai";
import { ChatMessage } from "../types";

// FIX: Initialize GoogleGenAI with API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    // FIX: Use ai.models.generateImages for image generation with imagen model
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    return null;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
};

export const translateText = async (text: string, sourceLang: string, targetLang:string): Promise<string> => {
    try {
        const prompt = `Translate the following text from ${sourceLang} to ${targetLang}: "${text}"`;
        // FIX: Use ai.models.generateContent for text generation tasks
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        // FIX: Extract text directly from response.text
        return response.text.trim();
    } catch (error) {
        console.error("Translation error:", error);
        return "Translation failed.";
    }
};

export const sendMessage = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        const geminiHistory: Content[] = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        }));

        // FIX: Use ai.chats.create for conversational chat
        const chat = ai.chats.create({ 
            model: 'gemini-2.5-flash', 
            history: geminiHistory
        });
        
        const response = await chat.sendMessage({ message: newMessage });
        // FIX: Extract text directly from response.text
        return response.text.trim();
    } catch (error) {
        console.error("Chat error:", error);
        return "Sorry, I encountered an error.";
    }
};

export const generateSong = async (topic: string, style: string): Promise<string> => {
    try {
        const prompt = `Write a song about "${topic}" in the style of ${style}. Include verse, chorus, and bridge sections with chord progressions.`;
        // FIX: Use gemini-2.5-pro for more complex creative tasks
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });
        // FIX: Extract text directly from response.text
        return response.text.trim();
    } catch (error) {
        console.error("Song generation error:", error);
        return "Failed to generate song.";
    }
};

export const sendAdvancedMessage = async (history: ChatMessage[], newMessage: string, tools: Tool[]): Promise<GenerateContentResponse | null> => {
    try {
        const contents: Content[] = [
            ...history.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }]
            })),
            { role: 'user', parts: [{ text: newMessage }] }
        ];

        // FIX: Use ai.models.generateContent with tools config for function calling
        const response = await ai.models.generateContent({ 
            model: 'gemini-2.5-flash', 
            contents: contents,
            config: {
                tools: tools,
            }
        });
        return response;
    } catch (error) {
        console.error("Advanced Chat error:", error);
        return null;
    }
};

export const sendMapsMessage = async (message: string, location: { latitude: number, longitude: number } | null): Promise<GenerateContentResponse | null> => {
    try {
        // FIX: Set up config for Google Maps grounding tool
        const config: any = {
            tools: [{ googleMaps: {} }]
        };

        if (location) {
            config.toolConfig = {
                retrievalConfig: {
                    latLng: location
                }
            };
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: config
        });
        return response;
    } catch (error) {
        console.error("Maps Chat error:", error);
        return null;
    }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    try {
        // FIX: Use TTS model with responseModalities set to AUDIO
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Say cheerfully: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        // FIX: Extract base64 audio data from the response
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.error("TTS generation error:", error);
        return null;
    }
};
