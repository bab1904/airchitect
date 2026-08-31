import React, { useState } from 'react';
import Layout from './components/Layout';
import ProjectExplorer from './components/ProjectExplorer';
import FloorPlanGenerator from './components/FloorPlanGenerator';
import CostEstimator from './components/CostEstimator';
import Workforce from './components/Workforce';
import Materials from './components/Materials';
import AIAssistant from './components/AIAssistant';
import ProjectList from './components/ProjectList';
import ClientRequest from './components/ClientRequests';
import TeamManagement from './components/TeamManagement';
import Contracts from './components/Contracts';
import Permits from './components/Permits';
import AutoSchedule from './components/AutoSchedule';
import CodeCompliance from './components/CodeCompliance';
import BOQOptimizer from './components/BOQOptimizer';
import Worklog from './components/Worklog';
import ProjectPlans from './components/ProjectPlans';
import RoleSelection from './components/RoleSelection';
import ScheduleUpdater from './components/ScheduleUpdater';
import { ViewState, Project, UserProfile, UserRole } from './types';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.PROJECT_LIST);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(authService.getCurrentUser());
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    const user = authService.loginAsRole(role);
    setCurrentUser(user);
    setCurrentView(ViewState.PROJECT_LIST);
    setCurrentProject(null);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentProject(null);
    setCurrentView(ViewState.PROJECT_LIST);
  };

  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project);
    setCurrentView(ViewState.EXPLORER);
  };

  const handleNewToolSelect = (tool: 'floor' | 'cost' | 'schedule') => {
    setCurrentProject(null);
    if (tool === 'floor') setCurrentView(ViewState.FLOOR_PLAN);
    if (tool === 'cost') setCurrentView(ViewState.COST_ESTIMATION);
    if (tool === 'schedule') setCurrentView(ViewState.SCHEDULE_UPDATER);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.PROJECT_LIST:
        return (
          <ProjectList 
            onSelectProject={handleProjectSelect} 
            onNewToolsSelect={handleNewToolSelect} 
            userRole={currentUser!.role} 
            onLogout={handleLogout}
          />
        );
      
      // Project Specific Views
      case ViewState.EXPLORER:
        return currentProject ? <ProjectExplorer project={currentProject} userRole={currentUser!.role} /> : null;
      case ViewState.WORKFORCE:
        return <Workforce />;
      case ViewState.MATERIALS:
        return <Materials userRole={currentUser!.role} project={currentProject} />;
      case ViewState.CLIENT_REQUESTS:
        return <ClientRequest userRole={currentUser!.role} project={currentProject} />;
      case ViewState.TEAM_MANAGEMENT:
        return currentProject ? <TeamManagement project={currentProject} /> : null;
      case ViewState.CONTRACTS:
        return <Contracts project={currentProject} />;
      case ViewState.PERMITS:
        return <Permits project={currentProject} />;
      case ViewState.SCHEDULE:
        return <AutoSchedule project={currentProject} />;
      case ViewState.SCHEDULE_UPDATER:
        return <ScheduleUpdater />;
      case ViewState.CODE_COMPLIANCE:
        return <CodeCompliance project={currentProject} />;
      case ViewState.BOQ_OPTIMIZER:
        return <BOQOptimizer project={currentProject} />;
      case ViewState.WORKLOG:
        return currentProject ? <Worklog project={currentProject} userRole={currentUser!.role} userName={currentUser!.name} /> : null;
      case ViewState.PROJECT_PLANS:
        return <ProjectPlans project={currentProject} userRole={currentUser!.role} />;
      
      // Global/New Project Tools
      case ViewState.FLOOR_PLAN:
        return <FloorPlanGenerator />;
      case ViewState.COST_ESTIMATION:
        return <CostEstimator />;
        
      default:
        return <div className="p-6 text-slate-500">View not found</div>;
    }
  };

  if (!currentUser) {
    return <RoleSelection onSelectRole={handleRoleSelect} />;
  }

  // If in Project List View, don't show the Main Sidebar Layout yet (Design choice)
  // But we pass the userRole to display correct welcome message and logout option
  if (currentView === ViewState.PROJECT_LIST) {
    return (
      <ProjectList 
        onSelectProject={handleProjectSelect} 
        onNewToolsSelect={handleNewToolSelect} 
        userRole={currentUser.role}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <Layout 
      currentView={currentView} 
      onViewChange={setCurrentView} 
      userRole={currentUser.role}
      currentProject={currentProject}
      onLogout={handleLogout}
      onSwitchProject={() => {
        setCurrentProject(null);
        setCurrentView(ViewState.PROJECT_LIST);
      }}
      onSelectProjectDirectly={handleProjectSelect}
    >
      {renderView()}
      <AIAssistant userRole={currentUser.role} project={currentProject} />
    </Layout>
  );
};

export default App;