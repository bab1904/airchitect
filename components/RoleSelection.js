import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { UserRole } from '../types';
import { Briefcase, HardHat, User, ClipboardCheck } from 'lucide-react';
const RoleSelection = ({ onSelectRole }) => {
    const roles = [
        {
            id: UserRole.PROJECT_MANAGER,
            label: 'Project Manager',
            icon: Briefcase,
            desc: 'Oversee multiple projects, budgets, and timelines.',
            color: 'bg-indigo-600'
        },
        {
            id: UserRole.SITE_MANAGER,
            label: 'Site Manager',
            icon: HardHat,
            desc: 'Manage daily operations, workforce, and materials.',
            color: 'bg-orange-600'
        },
        {
            id: UserRole.SITE_ENGINEER,
            label: 'Site Engineer',
            icon: ClipboardCheck,
            desc: 'Technical planning, compliance, and estimations.',
            color: 'bg-blue-600'
        },
        {
            id: UserRole.CLIENT,
            label: 'Client',
            icon: User,
            desc: 'View progress, plans, and request changes.',
            color: 'bg-green-600'
        },
    ];
    return (_jsx("div", { className: "min-h-screen bg-slate-900 flex items-center justify-center p-6", children: _jsxs("div", { className: "max-w-4xl w-full", children: [_jsxs("div", { className: "text-center mb-12 animate-fade-in-up", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-indigo-500 rounded-xl mb-4 text-white font-bold text-2xl shadow-lg", children: "AI" }), _jsx("h1", { className: "text-4xl font-bold text-white mb-2 tracking-tight", children: "AIrchitect" }), _jsx("p", { className: "text-slate-400 text-lg", children: "Select your role to access the workspace" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: roles.map((role) => (_jsxs("button", { onClick: () => onSelectRole(role.id), className: "bg-slate-800 border border-slate-700 hover:border-indigo-500 hover:bg-slate-750 rounded-2xl p-6 text-left transition-all duration-200 group hover:-translate-y-1 shadow-lg", children: [_jsx("div", { className: `${role.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`, children: _jsx(role.icon, { size: 24 }) }), _jsx("h3", { className: "text-xl font-bold text-white mb-2", children: role.label }), _jsx("p", { className: "text-sm text-slate-400 leading-relaxed", children: role.desc })] }, role.id))) })] }) }));
};
export default RoleSelection;
