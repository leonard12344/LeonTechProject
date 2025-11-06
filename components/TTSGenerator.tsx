
import React, { useState, useRef } from 'react';
import { Project, Asset } from '../types';
import { generateSpeech } from '../services/geminiService';
import Spinner from './common/Spinner';
import { TTSIcon, PublishIcon } from './Icons';

interface TTSGeneratorProps {
    project: Project;
    setProject: (project: Project) => void;
}

const TTSGenerator: React.FC<TTSGeneratorProps> = ({ project, setProject }) => {
    const [text, setText] = useState('');
    const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handleGenerate = async () => {
        if (!text.trim()) return;
        setIsLoading(true);
        setGeneratedAudio(null);
        const audioB64 = await generateSpeech(text);
        if (audioB64) {
            // Assuming the TTS model returns a format playable by the browser, like WAV or MP3.
            // Raw PCM would require Web Audio API for playback. For simplicity, we use the <audio> tag.
            setGeneratedAudio(`data:audio/mpeg;base64,${audioB64}`);
        } else {
            console.error("TTS generation failed");
            alert("Audio generation failed. Please check the console for errors.");
        }
        setIsLoading(false);
    };

    const saveAsset = () => {
        if (!generatedAudio) return;
        const newAsset: Asset = {
            id: crypto.randomUUID(),
            type: 'audio',
            prompt: text,
            url: generatedAudio,
            content: '',
            createdAt: new Date(),
        };
        setProject({ ...project, assets: [...project.assets, newAsset] });
        setGeneratedAudio(null);
        setText('');
    };

    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <TTSIcon className="w-10 h-10 text-yellow-400" />
                <h1 className="text-4xl font-bold">TTS Generator</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-yellow-400">1. Enter your text</h2>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={8}
                        placeholder="e.g., In a world of creativity, one tool stands above the rest."
                        className="w-full bg-gray-800 border border-gray-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !text.trim()}
                        className="w-full mt-4 bg-yellow-500 text-gray-900 font-bold py-3 rounded-md hover:bg-yellow-400 disabled:bg-gray-600"
                    >
                        {isLoading ? 'Generating...' : 'Generate Audio'}
                    </button>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-yellow-400">2. Result</h2>
                    <div className="h-[228px] bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center p-4">
                        {isLoading && <Spinner />}
                        {!isLoading && generatedAudio && (
                            <audio ref={audioRef} controls src={generatedAudio} className="w-full">
                                Your browser does not support the audio element.
                            </audio>
                        )}
                        {!isLoading && !generatedAudio && <p className="text-gray-500">Your generated audio will appear here.</p>}
                    </div>
                    {generatedAudio && !isLoading && (
                        <button
                            onClick={saveAsset}
                            className="w-full mt-4 bg-green-500 text-white font-bold py-3 rounded-md hover:bg-green-400 flex items-center justify-center gap-2"
                        >
                            <PublishIcon className="w-5 h-5" />
                            Save to Project
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TTSGenerator;
