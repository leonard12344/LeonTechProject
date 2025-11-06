
import React, { useState, useRef, useEffect } from 'react';
import { Project, ChatMessage } from '../types';
import { sendMessage } from '../services/geminiService';
import Spinner from './common/Spinner';
import { ChatIcon } from './Icons';

interface ChatbotProps {
  project: Project;
  setProject: (project: Project) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ project, setProject }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [project.chatHistory]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMessage: ChatMessage = { role: 'user', content: input };
    const updatedHistory = [...project.chatHistory, newUserMessage];
    setProject({ ...project, chatHistory: updatedHistory });
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const modelResponse = await sendMessage(project.chatHistory, currentInput);
    
    const newModelMessage: ChatMessage = { role: 'model', content: modelResponse };
    setProject({ ...project, chatHistory: [...updatedHistory, newModelMessage]});
    setIsLoading(false);
  };

  return (
    <div className="p-8 h-full flex flex-col">
        <div className="flex items-center gap-4 mb-8">
            <ChatIcon className="w-10 h-10 text-yellow-400"/>
            <h1 className="text-4xl font-bold">Chatbot</h1>
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

export default Chatbot;
