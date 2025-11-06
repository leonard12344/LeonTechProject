
import React, { useState, useRef, useEffect } from 'react';
import { Project, ChatMessage, Asset } from '../types';
import { sendAdvancedMessage } from '../services/geminiService';
import Spinner from './common/Spinner';
import { AdvancedChatIcon } from './Icons';
import { FunctionDeclaration, Type, Tool, GenerateContentResponse } from '@google/genai';

interface AdvancedChatProps {
  project: Project;
  setProject: (project: Project) => void;
}

const AdvancedChat: React.FC<AdvancedChatProps> = ({ project, setProject }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addAssetFunctionDeclaration: FunctionDeclaration = {
    name: 'add_asset',
    description: 'Adds a new text asset to the current project, like a character description or a piece of lore.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        prompt: {
          type: Type.STRING,
          description: 'A summary or title for the asset.',
        },
        content: {
          type: Type.STRING,
          description: 'The full text content of the asset.',
        },
      },
      required: ['prompt', 'content'],
    },
  };

  const tools: Tool[] = [{ functionDeclarations: [addAssetFunctionDeclaration] }];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [project.chatHistory]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMessage: ChatMessage = { role: 'user', content: input };
    let updatedHistory = [...project.chatHistory, newUserMessage];
    setProject({ ...project, chatHistory: updatedHistory });
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const response: GenerateContentResponse | null = await sendAdvancedMessage(project.chatHistory, currentInput, tools);
    
    setIsLoading(false);

    if (response) {
      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const fc of response.functionCalls) {
          if (fc.name === 'add_asset') {
            const { prompt, content } = fc.args;
            const newAsset: Asset = {
              id: crypto.randomUUID(),
              type: 'text',
              prompt,
              content,
              url: '',
              createdAt: new Date(),
            };
            const updatedProject = { ...project, assets: [...project.assets, newAsset], chatHistory: updatedHistory };
            
            const toolResponseMessage: ChatMessage = { role: 'model', content: `Asset "${prompt}" has been created.`};
            updatedHistory = [...updatedHistory, toolResponseMessage];
            setProject({...updatedProject, chatHistory: updatedHistory});
          }
        }
      } else {
        const newModelMessage: ChatMessage = { role: 'model', content: response.text };
        updatedHistory = [...updatedHistory, newModelMessage];
        setProject({ ...project, chatHistory: updatedHistory });
      }
    } else {
      const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I encountered an error." };
      updatedHistory = [...updatedHistory, errorMessage];
      setProject({ ...project, chatHistory: updatedHistory });
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <AdvancedChatIcon className="w-10 h-10 text-yellow-400" />
        <h1 className="text-4xl font-bold">Advanced Chat (with Tools)</h1>
      </div>
      <div className="text-sm text-gray-400 mb-4 p-3 bg-gray-800 border border-gray-700 rounded-md">
        <p>This chat can create project assets for you. Try asking it to: <span className="font-mono text-yellow-300">"Create a character description for a brave knight named Arthur."</span></p>
      </div>
      <div className="flex-grow overflow-y-auto mb-4 bg-gray-800 p-4 rounded-lg border border-yellow-500/30">
        {project.chatHistory.map((msg, index) => (
          <div key={index} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`inline-block max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
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
          placeholder="Type your message..."
          className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-md hover:bg-yellow-400 disabled:bg-gray-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AdvancedChat;
