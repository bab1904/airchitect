import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
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
import { ViewState } from './types';
import { authService } from './services/authService';
const App = () => {
    const [currentView, setCurrentView] = useState(ViewState.PROJECT_LIST);
    const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
    const [currentProject, setCurrentProject] = useState(null);
    const handleRoleSelect = (role) => {
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
    const handleProjectSelect = (project) => {
        setCurrentProject(project);
        setCurrentView(ViewState.EXPLORER);
    };
    const handleNewToolSelect = (tool) => {
        setCurrentProject(null);
        if (tool === 'floor')
            setCurrentView(ViewState.FLOOR_PLAN);
        if (tool === 'cost')
            setCurrentView(ViewState.COST_ESTIMATION);
    };
    const renderView = () => {
        switch (currentView) {
            case ViewState.PROJECT_LIST:
                return _jsx(ProjectList, { onSelectProject: handleProjectSelect, onNewToolsSelect: handleNewToolSelect, userRole: currentUser.role });
            // Project Specific Views
            case ViewState.EXPLORER:
                return currentProject ? _jsx(ProjectExplorer, { project: currentProject, userRole: currentUser.role }) : null;
            case ViewState.WORKFORCE:
                return _jsx(Workforce, {});
            case ViewState.MATERIALS:
                return _jsx(Materials, { userRole: currentUser.role, project: currentProject });
            case ViewState.CLIENT_REQUESTS:
                return _jsx(ClientRequest, { userRole: currentUser.role, project: currentProject });
            case ViewState.TEAM_MANAGEMENT:
                return currentProject ? _jsx(TeamManagement, { project: currentProject }) : null;
            case ViewState.CONTRACTS:
                return _jsx(Contracts, { project: currentProject });
            case ViewState.PERMITS:
                return _jsx(Permits, { project: currentProject });
            case ViewState.SCHEDULE:
                return _jsx(AutoSchedule, { project: currentProject });
            case ViewState.CODE_COMPLIANCE:
                return _jsx(CodeCompliance, { project: currentProject });
            case ViewState.BOQ_OPTIMIZER:
                return _jsx(BOQOptimizer, { project: currentProject });
            case ViewState.WORKLOG:
                return currentProject ? _jsx(Worklog, { project: currentProject, userRole: currentUser.role, userName: currentUser.name }) : null;
            case ViewState.PROJECT_PLANS:
                return _jsx(ProjectPlans, { project: currentProject, userRole: currentUser.role });
            // Global/New Project Tools
            case ViewState.FLOOR_PLAN:
                return _jsx(FloorPlanGenerator, {});
            case ViewState.COST_ESTIMATION:
                return _jsx(CostEstimator, {});
            default:
                return _jsx("div", { className: "p-6 text-slate-500", children: "View not found" });
        }
    };
    if (!currentUser) {
        return _jsx(RoleSelection, { onSelectRole: handleRoleSelect });
    }
    // If in Project List View, don't show the Main Sidebar Layout yet (Design choice)
    // But we pass the userRole to display correct welcome message
    if (currentView === ViewState.PROJECT_LIST) {
        return _jsx(ProjectList, { onSelectProject: handleProjectSelect, onNewToolsSelect: handleNewToolSelect, userRole: currentUser.role });
    }
    return (_jsxs(Layout, { currentView: currentView, onViewChange: setCurrentView, userRole: currentUser.role, currentProject: currentProject, onLogout: handleLogout, onSwitchProject: () => {
            setCurrentProject(null);
            setCurrentView(ViewState.PROJECT_LIST);
        }, children: [renderView(), _jsx(AIAssistant, { userRole: currentUser.role, project: currentProject })] }));
};
export default App;
