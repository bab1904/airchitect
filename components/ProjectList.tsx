import React, { useState } from 'react';
import { Project, UserRole } from '../types';
import { MOCK_PROJECTS } from '../constants';
import { Plus, Wand2, Calculator, Search, Activity, Building2, MapPin, Calendar, IndianRupee, LogOut, ArrowRight } from 'lucide-react';
import NewProjectWizard from './NewProjectWizard';

interface ProjectListProps {
  onSelectProject: (project: Project) => void;
  onNewToolsSelect: (tool: 'floor' | 'cost' | 'schedule') => void;
  userRole: UserRole;
  onLogout?: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  onSelectProject, 
  onNewToolsSelect, 
  userRole,
  onLogout 
}) => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [showWizard, setShowWizard] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Filter projects for Client Role (Client sees assigned projects)
  const roleFilteredProjects = userRole === UserRole.CLIENT 
    ? projects.filter(p => p.id === 'p2' || p.team.some(t => t.role === UserRole.CLIENT)) 
    : projects;

  const displayProjects = roleFilteredProjects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' ? true : p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleProjectCreated = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    setShowWizard(false);
    onSelectProject(newProject);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumSignificantDigits: 3
    }).format(val || 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {showWizard && (
        <NewProjectWizard 
          onClose={() => setShowWizard(false)} 
          onProjectCreated={handleProjectCreated} 
        />
      )}

      {/* Brand Header */}
      <nav className="bg-white border-b border-slate-200 px-6 lg:px-12 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-md">AI</div>
          <div>
            <span className="text-xl font-bold text-slate-900 tracking-tight block leading-tight">AIrchitect</span>
            <span className="text-[10px] text-indigo-600 font-mono font-bold tracking-wider">CIVIL SUITE</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-800 uppercase block">{userRole.replace('_', ' ')}</span>
            <span className="text-[11px] text-slate-500">Active Session</span>
          </div>
          
          <div className="h-9 w-9 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 text-xs">
            {userRole.charAt(0)}
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors ml-2"
              title="Switch role or log out"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Switch Role</span>
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {userRole === UserRole.CLIENT ? "Welcome Back, Client Portal" : "Construction & Project Workspace"}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {userRole === UserRole.CLIENT 
                ? "Review milestones, blueprints, and request approvals in real-time." 
                : "Manage site engineering, AI scheduling, BOQs, materials, and workforce across projects."}
            </p>
          </div>
          
          {userRole === UserRole.PROJECT_MANAGER && (
            <button 
              onClick={() => setShowWizard(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-xl transition-all shrink-0"
            >
              <Plus size={18} /> Create New Project
            </button>
          )}
        </div>

        {/* Quick Tools Section */}
        <div>
          <h2 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">AI Engineering Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => onNewToolsSelect('floor')}
              className="bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md p-4 rounded-2xl flex items-center gap-4 transition-all text-left group"
            >
              <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-md group-hover:scale-105 transition-transform">
                <Wand2 size={20} />
              </div>
              <div className="flex-1 truncate">
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">AI Floor Plan Generator</h3>
                <p className="text-xs text-slate-500 truncate">Generate 2D CAD blueprints &amp; 3D renders</p>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
            </button>
            
            <button 
              onClick={() => onNewToolsSelect('cost')}
              className="bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md p-4 rounded-2xl flex items-center gap-4 transition-all text-left group"
            >
              <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md group-hover:scale-105 transition-transform">
                <Calculator size={20} />
              </div>
              <div className="flex-1 truncate">
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">Smart Cost Estimator</h3>
                <p className="text-xs text-slate-500 truncate">Instant BOQ and material pricing in INR</p>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
            </button>

            <button 
              onClick={() => onNewToolsSelect('schedule')}
              className="bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md p-4 rounded-2xl flex items-center gap-4 transition-all text-left group"
            >
              <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md group-hover:scale-105 transition-transform">
                <Activity size={20} />
              </div>
              <div className="flex-1 truncate">
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">L5/L6 Schedule Sync</h3>
                <p className="text-xs text-slate-500 truncate">Voice/text site log auto-matching to WBS</p>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
            </button>
          </div>
        </div>

        {/* Existing Projects Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {userRole === UserRole.CLIENT ? "Assigned Projects" : "Active Construction Projects"}
              </h2>
              <p className="text-xs text-slate-500">Select any project to open the full management suite.</p>
            </div>

            {/* Search & Status Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400 shadow-sm"
                />
              </div>

              <div className="flex bg-white rounded-xl p-0.5 border border-slate-200 shadow-sm text-xs font-semibold">
                {['All', 'In Progress', 'Planning', 'Completed'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setSelectedStatus(tab)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      selectedStatus === tab ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project) => (
              <div 
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer group flex flex-col relative"
              >
                {/* Thumbnail */}
                <div className="h-44 relative overflow-hidden bg-slate-100">
                  <img 
                    src={project.thumbnail} 
                    alt={project.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold shadow-md backdrop-blur-md ${
                      project.status === 'In Progress' ? 'bg-yellow-400 text-yellow-900' :
                      project.status === 'Planning' ? 'bg-blue-400 text-blue-900' :
                      project.status === 'Completed' ? 'bg-emerald-500 text-white' :
                      'bg-slate-200 text-slate-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {project.name}
                    </h3>
                    <p className="text-slate-500 text-xs flex items-center gap-1.5 mt-1">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">BUDGET</span>
                      <span className="font-bold text-slate-800 flex items-center gap-0.5">
                        <IndianRupee size={12} className="text-slate-500" />
                        {formatCurrency(project.budget)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">COMPLETION</span>
                      <span className="font-medium text-slate-700 flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        {project.completionDate}
                      </span>
                    </div>
                  </div>

                  <button className="w-full py-2 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5">
                    <span>Open Project Explorer</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}

            {displayProjects.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                <Building2 size={36} className="mx-auto text-slate-300" />
                <h3 className="text-sm font-bold text-slate-700">No projects matching your search</h3>
                <p className="text-xs text-slate-400">Try clearing filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;