
import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { sendMapsMessage } from '../services/geminiService';
import Spinner from './common/Spinner';
import { MapsIcon } from './Icons';
import { GenerateContentResponse } from '@google/genai';

interface MapsChatProps {
    project: Project;
    setProject: (project: Project) => void;
}

interface MapMessage {
    text: string;
    isUser: boolean;
    grounding?: any[];
}

const MapsChat: React.FC<MapsChatProps> = ({ project, setProject }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<MapMessage[]>([]);
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setLocationError(null);
            },
            (error) => {
                console.error("Error getting location", error);
                setLocationError("Could not get your location. Please enable location services in your browser.");
            }
        );
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: MapMessage = { text: input, isUser: true };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const response: GenerateContentResponse | null = await sendMapsMessage(input, location);
        setIsLoading(false);

        if (response) {
            const modelMessage: MapMessage = {
                text: response.text,
                isUser: false,
                grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
            };
            setMessages(prev => [...prev, modelMessage]);
        } else {
            const errorMessage: MapMessage = { text: "Sorry, I encountered an error.", isUser: false };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    return (
        <div className="p-8 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
                <MapsIcon className="w-10 h-10 text-yellow-400" />
                <h1 className="text-4xl font-bold">Maps Chat</h1>
            </div>
            {locationError && <div className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4">{locationError}</div>}
            {!location && !locationError && <div className="bg-blue-900/50 text-blue-300 p-3 rounded-md mb-4">Getting your location...</div>}
            
            <div className="flex-grow overflow-y-auto mb-4 bg-gray-800 p-4 rounded-lg border border-yellow-500/30">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-4 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`inline-block max-w-xl p-3 rounded-lg ${msg.isUser ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            {msg.grounding && (
                                <div className="mt-2 pt-2 border-t border-gray-600">
                                    <h4 className="text-xs font-bold mb-1">Sources:</h4>
                                    <ul className="text-xs list-disc list-inside">
                                        {msg.grounding.map((chunk, i) => (
                                            chunk.maps && <li key={i}><a href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">{chunk.maps.title}</a></li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="mb-4 flex justify-start">
                        <div className="inline-block p-3 rounded-lg bg-gray-700">
                            <Spinner />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                    placeholder="e.g., What are some good cafes near me?"
                    className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    disabled={isLoading || !location}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim() || !location}
                    className="bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-md hover:bg-yellow-400 disabled:bg-gray-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default MapsChat;
