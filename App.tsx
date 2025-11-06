
import React, { useState, useEffect } from 'react';
import Sidebar, { View } from './components/Sidebar';
import ProjectManager from './components/ProjectManager';
import AssetGenerator from './components/AssetGenerator';
import Chatbot from './components/Chatbot';
import Translator from './components/Translator';
import SongGenerator from './components/SongGenerator';
import AdvancedChat from './components/AdvancedChat';
import MapsChat from './components/MapsChat';
import TTSGenerator from './components/TTSGenerator';
import { Project } from './types';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const savedProjects = localStorage.getItem('projects');
      return savedProjects ? JSON.parse(savedProjects) : [];
    } catch (e) {
      console.error("Failed to parse projects from localStorage", e);
      return [];
    }
  });
  const [activeProject, setActiveProject] = useState<Project | null>(() => {
    try {
      const savedActiveProjectId = localStorage.getItem('activeProjectId');
      if (savedActiveProjectId) {
          const savedProjects = localStorage.getItem('projects');
          const allProjects: Project[] = savedProjects ? JSON.parse(savedProjects) : [];
          return allProjects.find(p => p.id === savedActiveProjectId) || null;
      }
    } catch(e) {
       console.error("Failed to parse active project from localStorage", e);
    }
    return null;
  });
  const [currentView, setCurrentView] = useState<View>('projects');

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
    if (activeProject) {
        localStorage.setItem('activeProjectId', activeProject.id);
    } else {
        localStorage.removeItem('activeProjectId');
    }
  }, [projects, activeProject]);

  const handleSetProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
  }

  const handleSetActiveProject = (project: Project | null) => {
    setActiveProject(project);
    if (!project) {
        // If no project is active (e.g., all deleted), switch to project manager
        setCurrentView('projects');
    }
  }

  const handleSetProject = (updatedProject: Project) => {
    if (!activeProject) return;
    const newProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    setProjects(newProjects);
    setActiveProject(updatedProject);
  };

  const renderView = () => {
    if (!activeProject && currentView !== 'projects') {
        return (
            <div className="flex-grow flex items-center justify-center p-8">
                <div className="text-center bg-gray-800 p-8 rounded-lg border border-yellow-500/30">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-4">No Active Project</h2>
                    <p className="text-gray-400">Please select or create a project to continue.</p>
                </div>
            </div>
        )
    }

    switch (currentView) {
      case 'projects':
        return <ProjectManager projects={projects} setProjects={handleSetProjects} activeProject={activeProject} setActiveProject={handleSetActiveProject} />;
      case 'assets':
        return <AssetGenerator project={activeProject!} setProject={handleSetProject} />;
      case 'chatbot':
        return <Chatbot project={activeProject!} setProject={handleSetProject} />;
      case 'translator':
        return <Translator project={activeProject!} setProject={handleSetProject} />;
      case 'song':
        return <SongGenerator project={activeProject!} setProject={handleSetProject} />;
      case 'advanced-chat':
        return <AdvancedChat project={activeProject!} setProject={handleSetProject} />;
      case 'maps-chat':
        return <MapsChat project={activeProject!} setProject={handleSetProject} />;
      case 'tts':
        return <TTSGenerator project={activeProject!} setProject={handleSetProject} />;
      default:
        return <ProjectManager projects={projects} setProjects={handleSetProjects} activeProject={activeProject} setActiveProject={handleSetActiveProject} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} hasActiveProject={!!activeProject} />
      <main className="flex-grow overflow-y-auto bg-gray-800/50">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
