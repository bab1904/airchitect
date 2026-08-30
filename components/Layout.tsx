import React from 'react';
import { ViewState, UserRole, Project } from '../types';
import { LayoutDashboard, PenTool, Calculator, HardHat, Package, Menu, LogOut, MessageSquare, Grid, Users, FileText, ShieldCheck, CalendarDays, BookOpen, Zap, Activity } from 'lucide-react';
import TeamChatWidget from './TeamChatWidget';

interface LayoutProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  userRole: UserRole;
  currentProject: Project | null;
  onLogout: () => void;
  onSwitchProject: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ 
  currentView, 
  onViewChange, 
  userRole, 
  currentProject, 
  onLogout,
  onSwitchProject,
  children 
}) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // Define Nav items based on Role AND Context
  const getNavItems = () => {
    
    // Scenario 1: No Project Selected (e.g. creating new one)
    if (!currentProject) {
        return [
             { id: ViewState.FLOOR_PLAN, label: 'Floor Plan Generator', icon: PenTool },
             { id: ViewState.COST_ESTIMATION, label: 'Cost Estimator', icon: Calculator },
             { id: ViewState.SCHEDULE, label: 'AI Auto-Schedule', icon: CalendarDays },
             { id: ViewState.CODE_COMPLIANCE, label: 'Code Checker', icon: BookOpen },
        ];
    }

    // Scenario 2: Project Selected (Explorer Mode)
    
    // Base items for everyone
    const items = [
        { id: ViewState.EXPLORER, label: 'Project Explorer', icon: LayoutDashboard },
    ];

    // Client View
    if (userRole === UserRole.CLIENT) {
        return [
            ...items,
            { id: ViewState.SCHEDULE, label: 'Project Schedule', icon: CalendarDays },
            { id: ViewState.CLIENT_REQUESTS, label: 'My Requests', icon: MessageSquare },
        ];
    }

    // Site Staff View
    if (userRole === UserRole.SITE_MANAGER || userRole === UserRole.SITE_ENGINEER) {
        return [
            ...items,
            { id: ViewState.SCHEDULE, label: 'AI Auto-Schedule', icon: CalendarDays },
            { id: ViewState.SCHEDULE_UPDATER, label: 'L5/L6 Schedule Sync', icon: Activity },
            { id: ViewState.CODE_COMPLIANCE, label: 'Code Checker', icon: BookOpen },
            { id: ViewState.WORKFORCE, label: 'Workforce Log', icon: HardHat },
            { id: ViewState.MATERIALS, label: 'Inventory', icon: Package },
            { id: ViewState.CONTRACTS, label: 'Contracts & Tenders', icon: FileText },
            { id: ViewState.PERMITS, label: 'Permits & Compliance', icon: ShieldCheck },
            { id: ViewState.BOQ_OPTIMIZER, label: 'Smart Optimizer', icon: Zap },
            { id: ViewState.CLIENT_REQUESTS, label: 'Client Requests', icon: MessageSquare },
        ];
    }

    // PM View (Full Access)
    return [
        ...items,
        { id: ViewState.SCHEDULE, label: 'AI Auto-Schedule', icon: CalendarDays },
        { id: ViewState.SCHEDULE_UPDATER, label: 'L5/L6 Schedule Sync', icon: Activity },
        { id: ViewState.CODE_COMPLIANCE, label: 'Code Checker', icon: BookOpen },
        { id: ViewState.BOQ_OPTIMIZER, label: 'Smart Optimizer', icon: Zap },
        { id: ViewState.WORKFORCE, label: 'Workforce Log', icon: HardHat },
        { id: ViewState.MATERIALS, label: 'Inventory', icon: Package },
        { id: ViewState.CONTRACTS, label: 'Contracts & Tenders', icon: FileText },
        { id: ViewState.PERMITS, label: 'Permits & Compliance', icon: ShieldCheck },
        { id: ViewState.CLIENT_REQUESTS, label: 'Client Requests', icon: MessageSquare },
        { id: ViewState.TEAM_MANAGEMENT, label: 'Team & Access', icon: Users },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col shadow-xl z-20`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-indigo-500 w-8 h-8 rounded-lg flex items-center justify-center font-bold">AI</div>
          {sidebarOpen && <h1 className="font-bold text-xl tracking-tight">AIrchitect</h1>}
        </div>

        <div className="px-6 py-4 border-b border-slate-800">
             {currentProject ? (
                 <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Current Project</p>
                    {sidebarOpen ? (
                        <p className="font-medium text-sm truncate text-white">{currentProject.name}</p>
                    ) : (
                        <p className="font-bold text-white">{currentProject.name.charAt(0)}</p>
                    )}
                 </div>
             ) : (
                 <p className="text-xs text-slate-500 uppercase font-semibold">{sidebarOpen ? 'Tools Mode' : 'Tools'}</p>
             )}
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-colors ${
                currentView === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
           {currentProject && (
               <button 
                onClick={onSwitchProject}
                className="flex items-center gap-4 px-3 py-2 text-slate-400 hover:text-white w-full transition-colors hover:bg-slate-800 rounded-lg"
               >
                   <Grid size={20} />
                   {sidebarOpen && <span className="text-sm">Switch Project</span>}
               </button>
           )}
          <button 
            onClick={onLogout}
            className="flex items-center gap-4 px-3 py-2 text-red-400 hover:text-red-300 w-full transition-colors hover:bg-slate-800 rounded-lg"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                <Menu size={20} />
            </button>
            <h2 className="font-semibold text-slate-700 hidden md:block">
                {currentProject ? currentProject.name : 'New Project Workspace'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">{userRole}</p>
                <p className="text-xs text-slate-500">{currentProject ? currentProject.location : ''}</p>
             </div>
             <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                {userRole.charAt(0)}
             </div>
          </div>
        </header>
        
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