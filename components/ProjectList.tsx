import React, { useState } from 'react';
import { Project, UserRole } from '../types';
import { MOCK_PROJECTS } from '../constants';
import { Plus, Wand2, Calculator } from 'lucide-react';
import NewProjectWizard from './NewProjectWizard';

interface ProjectListProps {
  onSelectProject: (project: Project) => void;
  onNewToolsSelect: (tool: 'floor' | 'cost') => void;
  userRole: UserRole;
}

const ProjectList: React.FC<ProjectListProps> = ({ onSelectProject, onNewToolsSelect, userRole }) => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [showWizard, setShowWizard] = useState(false);

  // Filter projects for Client Role (Mock logic: Client only sees 'Shanti Villa' for demo)
  const displayProjects = userRole === UserRole.CLIENT 
    ? projects.filter(p => p.id === 'p2') 
    : projects;

  const handleProjectCreated = (newProject: Project) => {
      setProjects([...projects, newProject]);
      setShowWizard(false);
      onSelectProject(newProject);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {showWizard && (
          <NewProjectWizard 
            onClose={() => setShowWizard(false)} 
            onProjectCreated={handleProjectCreated} 
          />
      )}

      {/* Brand Header */}
      <nav className="flex items-center justify-between px-8 py-6">
         <div className="text-xl font-bold text-slate-900 tracking-tight">AIrchitect</div>
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-600 font-bold">
                {userRole === UserRole.PROJECT_MANAGER ? 'PM' : userRole === UserRole.CLIENT ? 'CL' : 'SM'}
            </div>
         </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-4">
        {/* Welcome Section */}
        <div className="mb-10 pt-4 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Welcome to AIrchitect</h1>
                <p className="text-slate-500 text-lg">
                    {userRole === UserRole.CLIENT 
                        ? "Track your dream project progress." 
                        : "Your intelligent partner in construction management."}
                </p>
            </div>
            
            {userRole === UserRole.PROJECT_MANAGER && (
                <button 
                    onClick={() => setShowWizard(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                    <Plus size={20} /> Create New Project
                </button>
            )}
        </div>

        {/* New Project Tools (PM Only) - Reorganized */}
        {userRole === UserRole.PROJECT_MANAGER && (
            <div className="mb-12">
                <h2 className="text-lg font-semibold text-slate-600 mb-4 uppercase tracking-wide text-xs">Quick Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                        onClick={() => onNewToolsSelect('floor')}
                        className="bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 p-6 rounded-xl flex items-center gap-4 transition-colors text-left"
                    >
                        <div className="p-3 bg-indigo-600 text-white rounded-lg"><Wand2 size={24} /></div>
                        <div>
                            <h3 className="font-bold text-indigo-900">AI Floor Plan Generator</h3>
                            <p className="text-sm text-indigo-700">Create new layouts from sketches or prompts.</p>
                        </div>
                    </button>
                    
                    <button 
                         onClick={() => onNewToolsSelect('cost')}
                         className="bg-green-50 border border-green-100 hover:bg-green-100 p-6 rounded-xl flex items-center gap-4 transition-colors text-left"
                    >
                        <div className="p-3 bg-green-600 text-white rounded-lg"><Calculator size={24} /></div>
                        <div>
                            <h3 className="font-bold text-green-900">Smart Cost Estimator</h3>
                            <p className="text-sm text-green-700">Estimate budgets for new ideas.</p>
                        </div>
                    </button>
                </div>
            </div>
        )}

        {/* Existing Projects Grid */}
        <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {userRole === UserRole.CLIENT ? "My Project" : "Active Projects"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* 1. Project Cards */}
                {displayProjects.map((project) => (
                    <div 
                        key={project.id}
                        onClick={() => onSelectProject(project)}
                        className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all cursor-pointer group h-[300px] flex flex-col relative"
                    >
                        {/* Image Section */}
                        <div className="h-44 relative overflow-hidden bg-slate-100">
                            <img 
                                src={project.thumbnail} 
                                alt={project.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Status Tag */}
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md ${
                                    project.status === 'In Progress' ? 'bg-yellow-400/90 text-yellow-900' :
                                    project.status === 'Planning' ? 'bg-blue-400/90 text-blue-900' :
                                    project.status === 'Completed' ? 'bg-green-400/90 text-green-900' :
                                    'bg-slate-200 text-slate-800'
                                }`}>
                                    {project.status === 'In Progress' && <span className="inline-block w-2 h-2 rounded-full bg-yellow-700 mr-1"></span>}
                                    {project.status === 'Planning' && <span className="inline-block w-2 h-2 rounded-full bg-blue-700 mr-1"></span>}
                                    {project.status === 'Completed' && <span className="inline-block w-2 h-2 rounded-full bg-green-700 mr-1"></span>}
                                    {project.status}
                                </span>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-xl text-slate-900 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">{project.name}</h3>
                                <p className="text-slate-500 text-sm">
                                    {project.location}
                                </p>
                            </div>
                            {userRole !== UserRole.CLIENT && (
                                <div className="text-xs text-slate-400 mt-2">
                                    Click to open Explorer
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;