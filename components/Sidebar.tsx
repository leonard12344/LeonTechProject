
import React from 'react';
import { ProjectIcon, AssetIcon, ChatIcon, TranslateIcon, SongIcon, AdvancedChatIcon, MapsIcon, TTSIcon } from './Icons';

export type View = 'projects' | 'assets' | 'chatbot' | 'translator' | 'song' | 'advanced-chat' | 'maps-chat' | 'tts';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  hasActiveProject: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, hasActiveProject }) => {
  const navItems = [
    { id: 'projects', label: 'Projects', icon: ProjectIcon, disabled: false },
    { id: 'assets', label: 'Asset Generator', icon: AssetIcon, disabled: !hasActiveProject },
    { id: 'chatbot', label: 'Chatbot', icon: ChatIcon, disabled: !hasActiveProject },
    { id: 'translator', label: 'Translator', icon: TranslateIcon, disabled: !hasActiveProject },
    { id: 'song', label: 'Song Generator', icon: SongIcon, disabled: !hasActiveProject },
    { id: 'advanced-chat', label: 'Advanced Chat', icon: AdvancedChatIcon, disabled: !hasActiveProject },
    { id: 'maps-chat', label: 'Maps Chat', icon: MapsIcon, disabled: !hasActiveProject },
    { id: 'tts', label: 'TTS Generator', icon: TTSIcon, disabled: !hasActiveProject },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col">
      <div className="text-2xl font-bold text-yellow-400 mb-8">Creative Studio</div>
      <nav>
        <ul>
          {navItems.map(item => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => setCurrentView(item.id as View)}
                disabled={item.disabled}
                className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors ${
                  currentView === item.id
                    ? 'bg-yellow-500 text-gray-900'
                    : 'hover:bg-gray-700'
                } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <item.icon className="w-6 h-6" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
