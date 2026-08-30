import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { MOCK_DAILY_ATTENDANCE, MOCK_WORKERS, MOCK_DOCUMENTS, MOCK_PERMITS } from '../constants';
import { Calendar, Clock, IndianRupee, FileText, CheckCircle2, BarChart3, ShieldCheck, FileBadge } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import TeamChatWidget from './TeamChatWidget';
const ProjectExplorer = ({ project, userRole }) => {
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumSignificantDigits: 3
        }).format(val || 0);
    };
    // --- 1. CALCULATIONS ---
    const { progressPercentage, laborCostData, totalLaborCost, actualTotalSpent, daysRemaining, isOverdue, phases } = React.useMemo(() => {
        // Progress calculation
        let progress = 0;
        if (project.status === 'Completed')
            progress = 100;
        else if (project.status === 'Planning')
            progress = 5;
        else if (project.id === 'p1')
            progress = 58;
        else
            progress = 35;
        // Labor Cost calculation
        const roles = ['Mason', 'Carpenter', 'Electrician', 'Plumber', 'Helper'];
        const roleWages = {};
        MOCK_WORKERS.forEach(w => roleWages[w.role] = w.hourlyRate);
        let laborCost = 0;
        const laborData = roles.map(role => {
            const totalDaysWorked = MOCK_DAILY_ATTENDANCE.reduce((acc, day) => {
                return acc + (day[role] || 0);
            }, 0);
            const wage = roleWages[role] || 500;
            const amount = totalDaysWorked * wage;
            laborCost += amount;
            return { role, amount };
        });
        // Spent calculation
        const totalTargetSpent = project.budget * (progress / 100);
        const estimatedMaterialSpent = Math.max(0, totalTargetSpent - laborCost);
        const totalSpent = laborCost + estimatedMaterialSpent;
        // Time calculations
        const today = new Date();
        const completion = new Date(project.completionDate);
        const validCompletion = !isNaN(completion.getTime()) ? completion : new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        const diffTime = validCompletion.getTime() - today.getTime();
        const remaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // Phase calculations
        const startDate = new Date(validCompletion);
        startDate.setMonth(startDate.getMonth() - 12);
        const formatDate = (d) => d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const phasesDefinition = [
            { name: 'Planning & Approval', threshold: 15, monthOffset: 2 },
            { name: 'Foundation Works', threshold: 35, monthOffset: 4 },
            { name: 'Superstructure', threshold: 65, monthOffset: 8 },
            { name: 'MEP & Finishing', threshold: 90, monthOffset: 10 },
            { name: 'Handover', threshold: 100, monthOffset: 12 }
        ];
        const phases = phasesDefinition.map((p, index) => {
            const phaseDate = new Date(startDate);
            phaseDate.setMonth(phaseDate.getMonth() + p.monthOffset);
            let status = 'Pending';
            if (progress >= p.threshold)
                status = 'Completed';
            else {
                const prevThreshold = index === 0 ? 0 : phasesDefinition[index - 1].threshold;
                if (progress >= prevThreshold)
                    status = 'In Progress';
            }
            return { ...p, status, date: formatDate(phaseDate) };
        });
        return {
            progressPercentage: progress,
            laborCostData: laborData,
            totalLaborCost: laborCost,
            actualTotalSpent: totalSpent,
            daysRemaining: remaining,
            isOverdue: remaining < 0,
            phases: phases
        };
    }, [project]);
    const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6'];
    // Combine Documents for Dashboard View
    const recentDocs = [...MOCK_DOCUMENTS, ...MOCK_PERMITS]
        .filter(d => d.projectId === project.id || d.projectId === 'p1')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
    return (_jsxs("div", { className: "p-6 space-y-8 animate-fade-in", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold text-slate-800", children: project.name }), _jsxs("div", { className: "flex items-center gap-4 text-slate-500 mt-2", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { size: 16 }), " Est. Completion: ", project.completionDate] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(IndianRupee, { size: 16 }), " Budget: ", formatCurrency(project.budget)] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-slate-200", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("h3", { className: "text-sm font-medium text-slate-500", children: "Project Timeline" }), _jsx(Clock, { className: isOverdue ? "text-red-600" : "text-indigo-600", size: 20 })] }), _jsx("div", { className: `text-2xl font-bold ${isOverdue ? "text-red-600" : "text-slate-900"}`, children: isOverdue ? `Overdue by ${Math.abs(daysRemaining)} Days` : `${daysRemaining} Days` }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: isOverdue ? "Completion delayed" : "Remaining until handover" }), _jsx("div", { className: "w-full bg-slate-100 rounded-full h-2 mt-4", children: _jsx("div", { className: `h-2 rounded-full ${isOverdue ? "bg-red-500" : "bg-indigo-600"}`, style: { width: `${Math.min(100, (1 - Math.max(0, daysRemaining) / 365) * 100)}%` } }) })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-slate-200", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("h3", { className: "text-sm font-medium text-slate-500", children: "Financial Overview" }), _jsx(IndianRupee, { className: "text-green-600", size: 20 })] }), _jsx("div", { className: "text-2xl font-bold text-slate-900", children: formatCurrency(actualTotalSpent) }), _jsxs("p", { className: "text-xs text-slate-500 mt-1", children: ["Spent out of ", formatCurrency(project.budget)] }), _jsxs("div", { className: "mt-4 flex gap-2 text-xs items-center", children: [_jsx("div", { className: "flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden", children: _jsx("div", { className: `h-full ${progressPercentage > 90 ? 'bg-red-500' : 'bg-green-500'}`, style: { width: `${progressPercentage}%` } }) }), _jsxs("span", { className: "font-bold", children: [progressPercentage, "%"] })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-slate-200", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("h3", { className: "text-sm font-medium text-slate-500", children: "Generated Documents" }), _jsx(FileText, { className: "text-orange-600", size: 20 })] }), _jsxs("div", { className: "text-2xl font-bold text-slate-900", children: [MOCK_DOCUMENTS.length + MOCK_PERMITS.length, " Total"] }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Tenders, Agreements & Permits" }), _jsx("div", { className: "mt-4 text-xs text-indigo-600 font-medium", children: "See 'Documents & Contracts' in sidebar" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[500px] overflow-y-auto", children: [_jsx("h3", { className: "text-lg font-bold text-slate-800 mb-6", children: "Construction Roadmap" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" }), _jsx("div", { className: "space-y-8", children: phases.map((phase, idx) => (_jsxs("div", { className: "relative flex items-center gap-6 pl-4", children: [_jsx("div", { className: `absolute left-[-5px] w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${phase.status === 'Completed' ? 'bg-green-500' :
                                                        phase.status === 'In Progress' ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`, children: phase.status === 'Completed' && _jsx(CheckCircle2, { size: 12, className: "text-white" }) }), _jsxs("div", { className: `flex-1 p-4 rounded-lg flex justify-between items-center transition-all ${phase.status === 'In Progress' ? 'bg-blue-50 border border-blue-100 shadow-sm' : 'bg-slate-50 hover:bg-slate-100'}`, children: [_jsxs("div", { children: [_jsx("h4", { className: `font-semibold ${phase.status === 'In Progress' ? 'text-blue-800' : 'text-slate-900'}`, children: phase.name }), _jsx("p", { className: "text-sm text-slate-500", children: phase.status })] }), _jsx("span", { className: `text-sm font-mono ${phase.status === 'In Progress' ? 'text-blue-600 font-bold' : 'text-slate-400'}`, children: phase.date })] })] }, idx))) })] })] }), _jsx("div", { className: "lg:col-span-1", children: _jsx(TeamChatWidget, { project: project, userRole: userRole, variant: "embedded" }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-slate-200", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("h3", { className: "text-lg font-bold text-slate-800 flex items-center gap-2", children: [_jsx(BarChart3, { size: 18, className: "text-indigo-600" }), " Labor Cost Distribution"] }), _jsxs("span", { className: "text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold", children: ["Total: ", formatCurrency(totalLaborCost)] })] }), _jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: laborCostData, layout: "vertical", margin: { top: 5, right: 30, left: 20, bottom: 5 }, children: [_jsx(XAxis, { type: "number", hide: true }), _jsx(YAxis, { dataKey: "role", type: "category", width: 80, tick: { fontSize: 12 } }), _jsx(Tooltip, { cursor: { fill: 'transparent' }, formatter: (value) => [`₹${(value || 0).toLocaleString('en-IN')}`, 'Total Spent'], contentStyle: { borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' } }), _jsx(Bar, { dataKey: "amount", radius: [0, 4, 4, 0], children: laborCostData.map((_, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) })] }) }) })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col", children: [_jsxs("h3", { className: "text-lg font-bold text-slate-800 mb-4 flex items-center gap-2", children: [_jsx(FileBadge, { size: 18, className: "text-orange-600" }), " Recent Documents"] }), _jsx("div", { className: "flex-1 space-y-3", children: recentDocs.length > 0 ? recentDocs.map(doc => (_jsxs("div", { className: "flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50", children: [_jsxs("div", { className: "flex items-center gap-3", children: [doc.type.includes('Permit') ? _jsx(ShieldCheck, { className: "text-teal-500", size: 18 }) : _jsx(FileText, { className: "text-indigo-500", size: 18 }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-sm text-slate-800", children: doc.title }), _jsx("p", { className: "text-xs text-slate-500", children: doc.type })] })] }), _jsx("span", { className: "text-xs font-mono bg-slate-100 px-2 py-1 rounded", children: doc.status })] }, doc.id))) : (_jsx("p", { className: "text-slate-400 text-sm", children: "No documents generated yet." })) }), _jsxs("div", { className: "mt-4 pt-4 border-t border-slate-100", children: [_jsx("h4", { className: "text-sm font-bold text-slate-700 mb-2", children: "Latest Blueprints" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "group relative rounded-lg overflow-hidden shadow-sm cursor-pointer aspect-video bg-slate-100", children: [_jsx("img", { src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=400", alt: "Ground Floor", className: "w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" }), _jsx("div", { className: "absolute bottom-0 left-0 right-0 p-1 bg-black/50 text-white text-[10px] text-center", children: "Ground Floor" })] }), _jsxs("div", { className: "group relative rounded-lg overflow-hidden shadow-sm cursor-pointer aspect-video bg-slate-100", children: [_jsx("img", { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400", alt: "Electrical", className: "w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" }), _jsx("div", { className: "absolute bottom-0 left-0 right-0 p-1 bg-black/50 text-white text-[10px] text-center", children: "Electrical" })] })] })] })] })] })] }));
};
export default ProjectExplorer;
