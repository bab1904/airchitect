import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ViewState, UserRole } from '../types';
import { LayoutDashboard, PenTool, Calculator, HardHat, Package, Menu, LogOut, MessageSquare, Grid, Users, FileText, ShieldCheck, CalendarDays, BookOpen, Zap } from 'lucide-react';
import TeamChatWidget from './TeamChatWidget';
const Layout = ({ currentView, onViewChange, userRole, currentProject, onLogout, onSwitchProject, children }) => {
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
    return (_jsxs("div", { className: "flex h-screen bg-slate-50 overflow-hidden", children: [_jsxs("aside", { className: `bg-slate-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col shadow-xl z-20`, children: [_jsxs("div", { className: "p-6 flex items-center gap-3 border-b border-slate-800", children: [_jsx("div", { className: "bg-indigo-500 w-8 h-8 rounded-lg flex items-center justify-center font-bold", children: "AI" }), sidebarOpen && _jsx("h1", { className: "font-bold text-xl tracking-tight", children: "AIrchitect" })] }), _jsx("div", { className: "px-6 py-4 border-b border-slate-800", children: currentProject ? (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-500 uppercase font-semibold", children: "Current Project" }), sidebarOpen ? (_jsx("p", { className: "font-medium text-sm truncate text-white", children: currentProject.name })) : (_jsx("p", { className: "font-bold text-white", children: currentProject.name.charAt(0) }))] })) : (_jsx("p", { className: "text-xs text-slate-500 uppercase font-semibold", children: sidebarOpen ? 'Tools Mode' : 'Tools' })) }), _jsx("nav", { className: "flex-1 py-6 space-y-2 px-3", children: navItems.map(item => (_jsxs("button", { onClick: () => onViewChange(item.id), className: `w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-colors ${currentView === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`, children: [_jsx(item.icon, { size: 20 }), sidebarOpen && _jsx("span", { className: "font-medium text-sm", children: item.label })] }, item.id))) }), _jsxs("div", { className: "p-4 border-t border-slate-800 space-y-2", children: [currentProject && (_jsxs("button", { onClick: onSwitchProject, className: "flex items-center gap-4 px-3 py-2 text-slate-400 hover:text-white w-full transition-colors hover:bg-slate-800 rounded-lg", children: [_jsx(Grid, { size: 20 }), sidebarOpen && _jsx("span", { className: "text-sm", children: "Switch Project" })] })), _jsxs("button", { onClick: onLogout, className: "flex items-center gap-4 px-3 py-2 text-red-400 hover:text-red-300 w-full transition-colors hover:bg-slate-800 rounded-lg", children: [_jsx(LogOut, { size: 20 }), sidebarOpen && _jsx("span", { className: "text-sm", children: "Logout" })] })] })] }), _jsxs("main", { className: "flex-1 flex flex-col h-screen overflow-hidden relative", children: [_jsxs("header", { className: "h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => setSidebarOpen(!sidebarOpen), className: "p-2 hover:bg-slate-100 rounded-lg text-slate-600", children: _jsx(Menu, { size: 20 }) }), _jsx("h2", { className: "font-semibold text-slate-700 hidden md:block", children: currentProject ? currentProject.name : 'New Project Workspace' })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "text-right hidden sm:block", children: [_jsx("p", { className: "text-sm font-semibold text-slate-800", children: userRole }), _jsx("p", { className: "text-xs text-slate-500", children: currentProject ? currentProject.location : '' })] }), _jsx("div", { className: "h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200", children: userRole.charAt(0) })] })] }), _jsx("div", { className: "flex-1 overflow-auto bg-slate-50 relative", children: children }), userRole === UserRole.CLIENT && currentProject && (_jsx(TeamChatWidget, { project: currentProject, userRole: userRole, variant: "popup" }))] })] }));
};
export default Layout;
