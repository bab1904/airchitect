import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { UserRole } from '../types';
import { MOCK_DAILY_LOGS } from '../constants';
import { ClipboardList, CloudSun, AlertTriangle, Send, History } from 'lucide-react';
const Worklog = ({ project, userRole, userName }) => {
    const [logs, setLogs] = useState(MOCK_DAILY_LOGS.filter(l => l.projectId === project.id));
    // Form State
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [workDescription, setWorkDescription] = useState('');
    const [issues, setIssues] = useState('');
    const [weather, setWeather] = useState('Sunny');
    const [status, setStatus] = useState('On Track');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!workDescription)
            return;
        const newLog = {
            id: Date.now().toString(),
            projectId: project.id,
            date,
            author: userName || 'Unknown',
            role: userRole,
            workDescription,
            weather,
            issues: issues || 'None',
            status,
        };
        setLogs([newLog, ...logs]);
        // Reset critical fields
        setWorkDescription('');
        setIssues('');
        setStatus('On Track');
    };
    const isClient = userRole === UserRole.CLIENT;
    return (_jsxs("div", { className: "p-6 h-full flex flex-col gap-6 animate-fade-in", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-slate-800 flex items-center gap-2", children: [_jsx(ClipboardList, { className: "text-indigo-600" }), " Daily Work Log"] }), _jsx("p", { className: "text-sm text-slate-500", children: "Track daily site progress, weather conditions, and blockers." })] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [!isClient && (_jsxs("div", { className: "lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit", children: [_jsx("h3", { className: "font-bold text-slate-800 mb-4", children: "Update Work of the Day" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Date" }), _jsx("input", { type: "date", value: date, onChange: e => setDate(e.target.value), className: "w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Work Description" }), _jsx("textarea", { value: workDescription, onChange: e => setWorkDescription(e.target.value), className: "w-full p-3 border border-slate-300 rounded-lg h-32 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500", placeholder: "Detail the activities completed today...", required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Weather" }), _jsxs("select", { value: weather, onChange: e => setWeather(e.target.value), className: "w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900", children: [_jsx("option", { value: "Sunny", children: "Sunny" }), _jsx("option", { value: "Cloudy", children: "Cloudy" }), _jsx("option", { value: "Rainy", children: "Rainy" }), _jsx("option", { value: "Stormy", children: "Stormy" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Status" }), _jsxs("select", { value: status, onChange: e => setStatus(e.target.value), className: "w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900", children: [_jsx("option", { value: "On Track", children: "On Track" }), _jsx("option", { value: "Ahead", children: "Ahead" }), _jsx("option", { value: "Delayed", children: "Delayed" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Issues / Blockers (Optional)" }), _jsx("textarea", { value: issues, onChange: e => setIssues(e.target.value), className: "w-full p-3 border border-slate-300 rounded-lg h-20 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500", placeholder: "Any delays, material shortages, or safety incidents..." })] }), _jsxs("button", { type: "submit", className: "w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center gap-2", children: [_jsx(Send, { size: 18 }), " Submit Daily Log"] })] })] })), _jsxs("div", { className: `${isClient ? 'lg:col-span-3' : 'lg:col-span-2'} bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col`, children: [_jsxs("div", { className: "p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 flex items-center gap-2", children: [_jsx(History, { size: 18 }), " Log History"] }), _jsx("div", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: logs.length === 0 ? (_jsx("div", { className: "text-center text-slate-400 py-10", children: "No logs recorded for this project yet." })) : (logs.map((log) => (_jsxs("div", { className: "relative pl-8 pb-2 border-l-2 border-slate-200 last:border-0", children: [_jsx("div", { className: "absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-indigo-500" }), _jsxs("div", { className: "mb-1 flex flex-col sm:flex-row sm:justify-between sm:items-start", children: [_jsxs("div", { children: [_jsx("span", { className: "text-sm font-bold text-slate-800", children: log.date }), _jsx("span", { className: "mx-2 text-slate-300", children: "|" }), _jsxs("span", { className: "text-sm text-slate-500 font-medium", children: [log.author, " (", log.role, ")"] })] }), _jsx("div", { className: `mt-1 sm:mt-0 text-xs px-2 py-0.5 rounded-full font-bold w-fit ${log.status === 'Delayed' ? 'bg-red-100 text-red-700' :
                                                        log.status === 'Ahead' ? 'bg-green-100 text-green-700' :
                                                            'bg-blue-100 text-blue-700'}`, children: log.status })] }), _jsxs("div", { className: "bg-slate-50 p-4 rounded-lg border border-slate-100 mt-2", children: [_jsx("p", { className: "text-slate-700 whitespace-pre-wrap text-sm", children: log.workDescription }), _jsxs("div", { className: "mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-4 text-xs text-slate-500", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(CloudSun, { size: 14 }), " ", log.weather] }), log.issues && log.issues !== 'None' && (_jsxs("div", { className: "flex items-center gap-1 text-amber-600 font-semibold", children: [_jsx(AlertTriangle, { size: 14 }), " Issue: ", log.issues] }))] })] })] }, log.id)))) })] })] })] }));
};
export default Worklog;
