
import React, { useState } from 'react';
import { Project, Asset } from '../types';
import { generateSong } from '../services/geminiService';
import Spinner from './common/Spinner';
import { SongIcon, PublishIcon } from './Icons';

interface SongGeneratorProps {
  project: Project;
  setProject: (project: Project) => void;
}

const SongGenerator: React.FC<SongGeneratorProps> = ({ project, setProject }) => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('');
  const [generatedSong, setGeneratedSong] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim() || !style.trim()) return;
    setIsLoading(true);
    setGeneratedSong(null);
    const song = await generateSong(topic, style);
    if (song) {
      setGeneratedSong(song);
    } else {
        console.error("Song generation failed");
    }
    setIsLoading(false);
  };

  const saveAsset = () => {
    if (!generatedSong) return;
    const newAsset: Asset = {
        id: crypto.randomUUID(),
        type: 'text',
        prompt: `Song about ${topic} in style of ${style}`,
        url: '',
        content: generatedSong,
        createdAt: new Date(),
    };
    setProject({ ...project, assets: [...project.assets, newAsset] });
    setGeneratedSong(null);
    setTopic('');
    setStyle('');
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <SongIcon className="w-10 h-10 text-yellow-400" />
        <h1 className="text-4xl font-bold">Song Generator</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-yellow-400">1. Define your song</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., A space cowboy's lament"
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="e.g., Folk ballad, Synth-pop"
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim() || !style.trim()}
            className="w-full mt-4 bg-yellow-500 text-gray-900 font-bold py-3 rounded-md hover:bg-yellow-400 disabled:bg-gray-600"
          >
            {isLoading ? 'Writing...' : 'Write Song'}
          </button>
        </div>

        <div>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">2. Result</h2>
            <div className="h-96 bg-gray-800 border border-gray-700 rounded-lg p-4 overflow-y-auto">
                {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
                {!isLoading && generatedSong && <pre className="whitespace-pre-wrap font-sans">{generatedSong}</pre>}
                {!isLoading && !generatedSong && <p className="text-gray-500">Your generated song will appear here.</p>}
            </div>
            {generatedSong && !isLoading && (
                 <button
                    onClick={saveAsset}
                    className="w-full mt-4 bg-green-500 text-white font-bold py-3 rounded-md hover:bg-green-400 flex items-center justify-center gap-2"
                >
                    <PublishIcon className="w-5 h-5"/>
                    Save to Project
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default SongGenerator;
