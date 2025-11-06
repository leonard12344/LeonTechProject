
import React, { useState } from 'react';
// FIX: removed .ts extension from import to resolve module error
import { Project, Asset } from '../types';
// FIX: removed .ts extension from import to resolve module error
import { generateImage } from '../services/geminiService';
import Spinner from './common/Spinner';
// FIX: removed .tsx extension from import to resolve module error
import { PromptIcon, PublishIcon } from './Icons';

interface AssetGeneratorProps {
  project: Project;
  setProject: (project: Project) => void;
}

const AssetGenerator: React.FC<AssetGeneratorProps> = ({ project, setProject }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setGeneratedImage(null);
    const imageUrl = await generateImage(prompt);
    if (imageUrl) {
      setGeneratedImage(imageUrl);
    } else {
        console.error("Image generation failed");
    }
    setIsLoading(false);
  };

  const saveAsset = () => {
    if (!generatedImage) return;
    const newAsset: Asset = {
        id: crypto.randomUUID(),
        type: 'image',
        prompt: prompt,
        url: generatedImage,
        content: '',
        createdAt: new Date(),
    };
    setProject({ ...project, assets: [...project.assets, newAsset] });
    setGeneratedImage(null);
    setPrompt('');
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <PromptIcon className="w-10 h-10 text-yellow-400" />
        <h1 className="text-4xl font-bold">Asset Generator</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-yellow-400">1. Describe your asset</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            placeholder="e.g., A heroic lion warrior with golden armor, fantasy style"
            className="w-full bg-gray-800 border border-gray-700 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full mt-4 bg-yellow-500 text-gray-900 font-bold py-3 rounded-md hover:bg-yellow-400 disabled:bg-gray-600"
          >
            {isLoading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>

        <div>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">2. Result</h2>
            <div className="aspect-square bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center">
                {isLoading && <Spinner />}
                {!isLoading && generatedImage && <img src={generatedImage} alt={prompt} className="w-full h-full object-cover rounded-lg" />}
                {!isLoading && !generatedImage && <p className="text-gray-500">Your generated image will appear here.</p>}
            </div>
            {generatedImage && !isLoading && (
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
      
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Project Assets</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {project.assets.filter(a => a.type === 'image').map(asset => (
                <div key={asset.id} className="bg-gray-800 rounded-lg overflow-hidden group relative aspect-square">
                    <img src={asset.url} alt={asset.prompt} className="w-full h-full object-cover"/>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        <p>{asset.prompt}</p>
                    </div>
                </div>
            ))}
            {project.assets.filter(a => a.type === 'image').length === 0 && <p className="text-gray-500 col-span-full">No image assets in this project yet.</p>}
        </div>
      </div>

    </div>
  );
};

export default AssetGenerator;
