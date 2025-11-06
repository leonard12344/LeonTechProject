
import React, { useState } from 'react';
// FIX: removed .ts extension from import to resolve module error
import { Project, Translation } from '../types';
// FIX: removed .ts extension from import to resolve module error
import { translateText } from '../services/geminiService';
import Spinner from './common/Spinner';
// FIX: removed .tsx extension from import to resolve module error
import { TranslateIcon, WorldIcon } from './Icons';

interface TranslatorProps {
  project: Project;
  setProject: (project: Project) => void;
}

const LANGUAGES = [
    "English", "Spanish", "French", "German", "Japanese", "Chinese", "Russian", "Korean"
];

const Translator: React.FC<TranslatorProps> = ({ project, setProject }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Japanese');
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsLoading(true);
    setTranslatedText('');
    const result = await translateText(sourceText, sourceLang, targetLang);
    setTranslatedText(result);
    setIsLoading(false);

    if (result !== 'Translation failed.') {
        const newTranslation: Translation = {
            id: crypto.randomUUID(),
            sourceText,
            translatedText: result,
            sourceLang,
            targetLang
        };
        setProject({ ...project, translations: [...project.translations, newTranslation]});
    }
  };

  return (
    <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
            <TranslateIcon className="w-10 h-10 text-yellow-400"/>
            <h1 className="text-4xl font-bold">Translator</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-yellow-500/30">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-yellow-400">Source Text</h2>
                    <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1">
                        {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                    </select>
                </div>
                <textarea
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    rows={8}
                    className="w-full bg-gray-700/50 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter text to translate..."
                />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-yellow-500/30">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-yellow-400">Translated Text</h2>
                     <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1">
                        {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                    </select>
                </div>
                <div className="w-full h-[196px] bg-gray-700/50 rounded-md p-3 overflow-y-auto">
                    {isLoading ? <div className="flex justify-center items-center h-full"><Spinner /></div> : <p className="whitespace-pre-wrap">{translatedText}</p>}
                </div>
            </div>
        </div>
        <div className="mt-6 flex justify-center">
            <button
                onClick={handleTranslate}
                disabled={isLoading || !sourceText.trim()}
                className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-md hover:bg-yellow-400 disabled:bg-gray-600 flex items-center gap-2"
            >
                <WorldIcon />
                Translate
            </button>
        </div>
    </div>
  );
};

export default Translator;
