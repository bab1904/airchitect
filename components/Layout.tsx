import React, { useState } from 'react';
import { ViewState, UserRole, Project } from '../types';
import { 
  LayoutDashboard, PenTool, Calculator, HardHat, Package, Menu, LogOut, 
  MessageSquare, Users, FileText, ShieldCheck, CalendarDays, BookOpen, 
  Zap, Activity, ChevronLeft, ChevronDown, Check, Building2, UserCheck, 
  ChevronRight, ArrowLeft, Layers
} from 'lucide-react';
import { MOCK_PROJECTS } from '../constants';
import TeamChatWidget from './TeamChatWidget';

interface LayoutProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  userRole: UserRole;
  currentProject: Project | null;
  onLogout: () => void;
  onGoBack: () => void;
  canGoBack?: boolean;
  onSwitchProject: () => void;
  onSelectProjectDirectly?: (project: Project) => void;
  children: React.ReactNode;
}

const VIEW_LABELS: Record<ViewState, string> = {
  [ViewState.DASHBOARD]: 'Dashboard',
  [ViewState.PROJECT_LIST]: 'Projects',
  [ViewState.EXPLORER]: 'Project Explorer',
  [ViewState.FLOOR_PLAN]: 'Floor Plan Generator',
  [ViewState.COST_ESTIMATION]: 'Smart Cost Estimator',
  [ViewState.SCHEDULE_UPDATER]: 'L5/L6 Schedule Sync',
  [ViewState.SCHEDULE]: 'AI Auto-Schedule',
  [ViewState.WORKFORCE]: 'Workforce & Wages',
  [ViewState.MATERIALS]: 'Site Inventory & Security',
  [ViewState.WORKLOG]: 'Daily Worklog',
  [ViewState.BOQ_OPTIMIZER]: 'BOQ Smart Optimizer',
  [ViewState.CONTRACTS]: 'Contracts & Tenders',
  [ViewState.PERMITS]: 'Permits & Compliance',
  [ViewState.CODE_COMPLIANCE]: 'Building Code Checker',
  [ViewState.CLIENT_REQUESTS]: 'Client Requests',
  [ViewState.TEAM_MANAGEMENT]: 'Team & Permissions',
  [ViewState.PROJECT_PLANS]: 'Blueprints & Plans'
};

const Layout: React.FC<LayoutProps> = ({ 
  currentView, 
  onViewChange, 
  userRole, 
  currentProject, 
  onLogout,
  onGoBack,
  canGoBack = true,
  onSwitchProject,
  onSelectProjectDirectly,
  children 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Define Nav items based on Role AND Context
  const getNavItems = () => {
    // Scenario 1: No Project Selected (Standalone AI Tools)
    if (!currentProject) {
      return [
        { id: ViewState.FLOOR_PLAN, label: 'Floor Plan Generator', icon: PenTool },
        { id: ViewState.COST_ESTIMATION, label: 'Smart Cost Estimator', icon: Calculator },
        { id: ViewState.SCHEDULE_UPDATER, label: 'L5/L6 Schedule Sync', icon: Activity },
        { id: ViewState.SCHEDULE, label: 'AI Auto-Schedule', icon: CalendarDays },
        { id: ViewState.CODE_COMPLIANCE, label: 'Code Checker', icon: BookOpen },
      ];
    }

    // Scenario 2: Project Selected (Explorer Mode)
    const baseItems = [
      { id: ViewState.EXPLORER, label: 'Project Explorer', icon: LayoutDashboard },
    ];

    // Client View
    if (userRole === UserRole.CLIENT) {
      return [
        ...baseItems,
        { id: ViewState.PROJECT_PLANS, label: 'Blueprints & Plans', icon: PenTool },
        { id: ViewState.SCHEDULE, label: 'Project Schedule', icon: CalendarDays },
        { id: ViewState.CLIENT_REQUESTS, label: 'My Requests', icon: MessageSquare },
      ];
    }

    // Site Staff View
    if (userRole === UserRole.SITE_MANAGER || userRole === UserRole.SITE_ENGINEER) {
      return [
        ...baseItems,
        { id: ViewState.SCHEDULE_UPDATER, label: 'L5/L6 Schedule Sync', icon: Activity },
        { id: ViewState.SCHEDULE, label: 'AI Auto-Schedule', icon: CalendarDays },
        { id: ViewState.PROJECT_PLANS, label: 'Blueprints & Plans', icon: PenTool },
        { id: ViewState.WORKFORCE, label: 'Workforce & Wages', icon: HardHat },
        { id: ViewState.MATERIALS, label: 'Site Inventory & Security', icon: Package },
        { id: ViewState.WORKLOG, label: 'Daily Worklog', icon: FileText },
        { id: ViewState.BOQ_OPTIMIZER, label: 'BOQ Smart Optimizer', icon: Zap },
        { id: ViewState.CONTRACTS, label: 'Contracts & Tenders', icon: FileText },
        { id: ViewState.PERMITS, label: 'Permits & Compliance', icon: ShieldCheck },
        { id: ViewState.CODE_COMPLIANCE, label: 'Building Code Checker', icon: BookOpen },
        { id: ViewState.CLIENT_REQUESTS, label: 'Client Requests', icon: MessageSquare },
      ];
    }

    // PM View (Full Access)
    return [
      ...baseItems,
      { id: ViewState.SCHEDULE_UPDATER, label: 'L5/L6 Schedule Sync', icon: Activity },
      { id: ViewState.SCHEDULE, label: 'AI Auto-Schedule', icon: CalendarDays },
      { id: ViewState.PROJECT_PLANS, label: 'Blueprints & Plans', icon: PenTool },
      { id: ViewState.BOQ_OPTIMIZER, label: 'BOQ Smart Optimizer', icon: Zap },
      { id: ViewState.WORKFORCE, label: 'Workforce & Wages', icon: HardHat },
      { id: ViewState.MATERIALS, label: 'Site Inventory & Security', icon: Package },
      { id: ViewState.WORKLOG, label: 'Daily Worklog', icon: FileText },
      { id: ViewState.CONTRACTS, label: 'Contracts & Tenders', icon: FileText },
      { id: ViewState.PERMITS, label: 'Permits & Compliance', icon: ShieldCheck },
      { id: ViewState.CODE_COMPLIANCE, label: 'Building Code Checker', icon: BookOpen },
      { id: ViewState.CLIENT_REQUESTS, label: 'Client Requests', icon: MessageSquare },
      { id: ViewState.TEAM_MANAGEMENT, label: 'Team & Permissions', icon: Users },
      { id: ViewState.FLOOR_PLAN, label: 'Floor Plan Generator', icon: PenTool },
      { id: ViewState.COST_ESTIMATION, label: 'Smart Cost Estimator', icon: Calculator },
    ];
  };

  const navItems = getNavItems();
  const currentViewLabel = VIEW_LABELS[currentView] || 'Overview';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col shadow-2xl z-20 shrink-0`}>
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">AI</div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg tracking-tight leading-tight">AIrchitect</h1>
                <span className="text-[10px] text-indigo-400 font-mono">PRO PLATFORM</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Context Card */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          {currentProject ? (
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Active Project</span>
              {sidebarOpen ? (
                <div className="space-y-0.5">
                  <p className="font-bold text-sm truncate text-white">{currentProject.name}</p>
                  <p className="text-xs text-slate-400 truncate">{currentProject.location}</p>
                </div>
              ) : (
                <p className="font-bold text-white text-center">{currentProject.name.charAt(0)}</p>
              )}
            </div>
          ) : (
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Mode</span>
              {sidebarOpen ? (
                <p className="font-bold text-sm text-indigo-400">Standalone AI Tools</p>
              ) : (
                <p className="font-bold text-indigo-400 text-center">AI</p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons in Sidebar: Step Back & All Projects */}
        <div className="p-3 border-b border-slate-800/80 space-y-1.5">
          {canGoBack && (
            <button 
              onClick={onGoBack}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-indigo-300 hover:text-white bg-indigo-950/50 hover:bg-indigo-600 transition-all shadow-xs group"
              title="Go one step back in navigation history"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              {sidebarOpen && <span>← Step Back</span>}
            </button>
          )}

          <button 
            onClick={onSwitchProject}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Return to the Project Selection screen"
          >
            <Layers size={15} />
            {sidebarOpen && <span>All Projects</span>}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-3 space-y-1 px-3 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                currentView === item.id 
                  ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium text-xs'
              }`}
            >
              <item.icon size={18} className="shrink-0" />
              {sidebarOpen && <span className="truncate text-xs">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/60">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 w-full transition-colors hover:bg-slate-800 rounded-xl text-xs font-medium"
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Switch Role / Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header Bar with Step-Back & Breadcrumbs */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3.5">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
              title="Toggle sidebar"
            >
              <Menu size={20} />
            </button>

            {/* 1. Step-Back Button: Goes ONE STEP BACK */}
            <button
              onClick={onGoBack}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 hover:border-indigo-200 shadow-xs active:scale-95"
              title="Go one step back to the previous screen"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>

            {/* 2. Interactive Breadcrumbs Trail */}
            <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <button 
                onClick={onSwitchProject}
                className="hover:text-indigo-600 transition-colors"
              >
                Projects
              </button>

              {currentProject && (
                <>
                  <ChevronRight size={13} className="text-slate-400 shrink-0" />
                  <button 
                    onClick={() => onViewChange(ViewState.EXPLORER)}
                    className="hover:text-indigo-600 transition-colors truncate max-w-[140px] font-semibold text-slate-700"
                  >
                    {currentProject.name}
                  </button>
                </>
              )}

              {currentView !== ViewState.EXPLORER && (
                <>
                  <ChevronRight size={13} className="text-slate-400 shrink-0" />
                  <span className="font-bold text-slate-900 truncate">
                    {currentViewLabel}
                  </span>
                </>
              )}
            </nav>

            {/* Project Switcher Dropdown */}
            {currentProject && (
              <div className="relative ml-1">
                <button
                  onClick={() => setProjectMenuOpen(!projectMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors"
                >
                  <Building2 size={15} className="text-indigo-600" />
                  <span className="max-w-[160px] truncate">{currentProject.name}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {projectMenuOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                    <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                      Switch Active Project
                    </div>
                    {MOCK_PROJECTS.map(proj => (
                      <button
                        key={proj.id}
                        onClick={() => {
                          if (onSelectProjectDirectly) onSelectProjectDirectly(proj);
                          setProjectMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-indigo-50 hover:text-indigo-900 transition-colors ${
                          proj.id === currentProject.id ? 'bg-indigo-50/70 font-bold text-indigo-700' : 'text-slate-700'
                        }`}
                      >
                        <div className="truncate">
                          <p className="truncate font-semibold">{proj.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{proj.location}</p>
                        </div>
                        {proj.id === currentProject.id && <Check size={14} className="text-indigo-600 shrink-0" />}
                      </button>
                    ))}
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          onSwitchProject();
                          setProjectMenuOpen(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-xs text-indigo-600 font-bold hover:bg-indigo-50"
                      >
                        + View All Projects
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Header: User Role Badge & Dropdown */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                {userRole.replace('_', ' ')}
              </p>
              <p className="text-[11px] text-slate-500">
                {currentProject ? currentProject.location : 'AI Studio'}
              </p>
            </div>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="h-9 w-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-md transition-transform active:scale-95"
                title="User Profile & Settings"
              >
                {userRole.charAt(0)}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-800">Role: {userRole.replace('_', ' ')}</p>
                    <p className="text-[10px] text-slate-400">Signed In</p>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <UserCheck size={14} className="text-indigo-600" /> Switch Role
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-auto bg-slate-50 relative">
          {children}
        </div>

        {/* Global Client Chat Popup */}
        {userRole === UserRole.CLIENT && currentProject && (
          <TeamChatWidget project={currentProject} userRole={userRole} variant="popup" />
        )}
      </main>
    </div>
  );
};

export default Layout;