
import React, { useState } from 'react';
// FIX: removed .ts extension from import to resolve module error
import { Project } from '../types';
import Modal from './common/Modal';
// FIX: removed .tsx extension from import to resolve module error
import { PlusIcon, ProjectIcon } from './Icons';

interface ProjectManagerProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ projects, setProjects, activeProject, setActiveProject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: newProjectName,
      description: newProjectDesc,
      assets: [],
      chatHistory: [],
      translations: [],
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    setActiveProject(newProject);
    setIsModalOpen(false);
    setNewProjectName('');
    setNewProjectDesc('');
  };

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
  };

  const handleDeleteProject = (projectId: string) => {
    if (activeProject?.id === projectId) {
      setActiveProject(null);
    }
    setProjects(projects.filter(p => p.id !== projectId));
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
            <ProjectIcon className="w-10 h-10 text-yellow-400"/>
            <h1 className="text-4xl font-bold">Project Manager</h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-400 flex items-center gap-2"
        >
          <PlusIcon />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`bg-gray-800 p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:border-yellow-400 ${
              activeProject?.id === project.id ? 'border-yellow-500' : 'border-gray-700'
            }`}
            onClick={() => handleSelectProject(project)}
          >
            <h2 className="text-2xl font-bold mb-2 text-yellow-400">{project.name}</h2>
            <p className="text-gray-400 mb-4 h-12 overflow-hidden">{project.description || 'No description.'}</p>
            <div className="text-sm text-gray-500 flex justify-between items-center">
                <span>{project.assets.length} assets</span>
                <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}
                    className="text-red-500 hover:text-red-400 font-semibold"
                >
                    Delete
                </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
            <div className="col-span-full text-center py-16 text-gray-500">
                <p>No projects yet. Click "New Project" to get started!</p>
            </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Project Name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <textarea
            placeholder="Project Description (optional)"
            value={newProjectDesc}
            onChange={(e) => setNewProjectDesc(e.target.value)}
            rows={4}
            className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            onClick={handleCreateProject}
            className="bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-400"
          >
            Create Project
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectManager;
