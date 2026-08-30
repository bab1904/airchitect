import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { MOCK_WORKERS, MOCK_DAILY_ATTENDANCE } from '../constants';
import { Users, UserPlus, X, Save, Calendar, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
const Workforce = () => {
    const [attendanceHistory, setAttendanceHistory] = useState(MOCK_DAILY_ATTENDANCE);
    const [isLogging, setIsLogging] = useState(false);
    const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
    // State for the new log form (defaulting to 0 for all roles)
    const [newLog, setNewLog] = useState({
        Mason: 0,
        Carpenter: 0,
        Electrician: 0,
        Plumber: 0,
        Helper: 0
    });
    // Helper to get wage per role
    const getRoleWage = (role) => MOCK_WORKERS.find(w => w.role === role)?.hourlyRate || 0;
    // 1. DYNAMIC TABLE DATA: Based on the LATEST entry in attendance history
    const latestLog = attendanceHistory.length > 0 ? attendanceHistory[attendanceHistory.length - 1] : null;
    const tableData = Object.keys(newLog).map(role => {
        // Use latest log count if available, otherwise 0
        const count = latestLog ? latestLog[role] || 0 : 0;
        return {
            role,
            count: count,
            dailyWage: getRoleWage(role)
        };
    });
    // Colors for charts
    const roleColors = {
        'Mason': '#ef4444', // Red
        'Carpenter': '#f97316', // Orange
        'Electrician': '#eab308', // Yellow
        'Plumber': '#3b82f6', // Blue
        'Helper': '#8b5cf6' // Purple
    };
    const handleOpenLog = () => {
        // Pre-fill with today's date
        const today = new Date().toISOString().split('T')[0];
        setLogDate(today);
        // Pre-fill counts from the latest log for convenience
        if (latestLog) {
            setNewLog({
                Mason: latestLog.Mason,
                Carpenter: latestLog.Carpenter,
                Electrician: latestLog.Electrician,
                Plumber: latestLog.Plumber,
                Helper: latestLog.Helper
            });
        }
        setIsLogging(true);
    };
    const handleSubmitLog = () => {
        const total = Object.values(newLog).reduce((a, b) => Number(a) + Number(b), 0);
        // Create formatted date string (e.g., "Oct 27")
        const dateObj = new Date(logDate);
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const newEntry = {
            date: formattedDate,
            ...newLog,
            totalWorkers: total
        };
        // Update history: Remove existing entry for same date if any, then add new one
        const historyWithoutNewDate = attendanceHistory.filter(h => h.date !== formattedDate);
        const updatedHistory = [...historyWithoutNewDate, newEntry];
        // Sort roughly by parsing the date string is tricky without year, 
        // but for this mock we just append. In a real app, use ISO dates for sorting.
        setAttendanceHistory(updatedHistory);
        setIsLogging(false);
    };
    // Custom Tooltip for the Chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (_jsxs("div", { className: "bg-white p-4 border border-slate-200 shadow-xl rounded-xl z-50", children: [_jsx("p", { className: "font-bold text-slate-800 mb-2", children: label }), _jsx("div", { className: "space-y-2", children: payload.map((entry, index) => {
                            const roleWage = getRoleWage(entry.name);
                            return (_jsxs("div", { className: "flex items-center gap-3 text-sm", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: entry.color } }), _jsx("div", { className: "flex-1 font-medium text-slate-700 w-24", children: entry.name }), _jsxs("div", { className: "font-bold text-slate-900", children: [entry.value, " Workers"] }), _jsxs("div", { className: "text-slate-500 text-xs", children: ["(\u20B9", roleWage, "/person)"] })] }, index));
                        }) }), _jsxs("div", { className: "mt-3 pt-3 border-t border-slate-100 flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-bold text-slate-600", children: "Total" }), _jsxs("span", { className: "text-sm font-bold text-indigo-600", children: [payload.reduce((acc, curr) => acc + curr.value, 0), " Workers Present"] })] })] }));
        }
        return null;
    };
    return (_jsxs("div", { className: "p-6 space-y-6 animate-fade-in relative", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("h2", { className: "text-2xl font-bold text-slate-800 flex items-center gap-2", children: [_jsx(Users, { className: "text-purple-600" }), " Workforce Log Book"] }), _jsxs("button", { onClick: handleOpenLog, className: "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all", children: [_jsx(UserPlus, { size: 16 }), " Log Attendance"] })] }), isLogging && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up", children: [_jsxs("div", { className: "bg-purple-600 p-4 flex justify-between items-center text-white", children: [_jsxs("h3", { className: "font-bold text-lg flex items-center gap-2", children: [_jsx(Calendar, { size: 20 }), " Log Daily Attendance"] }), _jsx("button", { onClick: () => setIsLogging(false), className: "hover:bg-purple-700 p-1 rounded-full transition-colors", children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Date" }), _jsx("input", { type: "date", value: logDate, onChange: (e) => setLogDate(e.target.value), className: "w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900" })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "block text-sm font-medium text-slate-700", children: "Worker Counts by Role" }), Object.keys(newLog).map(role => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: roleColors[role] } }), _jsx("span", { className: "font-medium text-slate-700", children: role })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => setNewLog({ ...newLog, [role]: Math.max(0, newLog[role] - 1) }), className: "w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100", children: "-" }), _jsx("span", { className: "w-8 text-center font-bold text-slate-900", children: newLog[role] }), _jsx("button", { onClick: () => setNewLog({ ...newLog, [role]: newLog[role] + 1 }), className: "w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100", children: "+" })] })] }, role)))] }), _jsxs("div", { className: "flex gap-3 pt-4 border-t border-slate-100", children: [_jsx("button", { onClick: () => setIsLogging(false), className: "flex-1 py-3 text-slate-500 hover:bg-slate-50 rounded-lg font-medium", children: "Cancel" }), _jsxs("button", { onClick: handleSubmitLog, className: "flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-lg flex items-center justify-center gap-2", children: [_jsx(Save, { size: 18 }), " Save Entry"] })] })] })] }) })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit", children: [_jsxs("div", { className: "p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 flex justify-between items-center", children: [_jsx("span", { children: "Current Roster Status" }), latestLog && (_jsxs("span", { className: "text-xs font-normal bg-green-100 text-green-700 px-2 py-1 rounded", children: ["As of ", latestLog.date] }))] }), _jsxs("table", { className: "w-full text-left", children: [_jsx("thead", { className: "bg-white text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100", children: _jsxs("tr", { children: [_jsx("th", { className: "p-4 font-medium", children: "Role" }), _jsx("th", { className: "p-4 font-medium text-center", children: "Active" }), _jsx("th", { className: "p-4 font-medium text-right", children: "Avg Wage (\u20B9)" })] }) }), _jsxs("tbody", { className: "divide-y divide-slate-100", children: [tableData.map((row, idx) => (_jsxs("tr", { className: "hover:bg-slate-50 transition-colors", children: [_jsxs("td", { className: "p-4 font-medium text-slate-900 flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full", style: { backgroundColor: roleColors[row.role] || '#ccc' } }), row.role] }), _jsx("td", { className: "p-4 text-center", children: _jsx("span", { className: `px-2 py-1 rounded font-bold text-slate-700 ${row.count > 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100'}`, children: row.count }) }), _jsxs("td", { className: "p-4 text-right font-mono text-slate-600", children: ["\u20B9", (row.dailyWage || 0).toLocaleString('en-IN')] })] }, idx))), _jsxs("tr", { className: "bg-slate-50 font-bold text-slate-800", children: [_jsx("td", { className: "p-4", children: "Total" }), _jsx("td", { className: "p-4 text-center", children: tableData.reduce((acc, r) => acc + r.count, 0) }), _jsx("td", { className: "p-4" })] })] })] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-[400px]", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "font-bold text-slate-800", children: "Attendance History" }), _jsxs("span", { className: "text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1", children: [_jsx(CheckCircle2, { size: 12 }), " Live Updates"] })] }), _jsx("div", { className: "flex-1 w-full min-h-0", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: attendanceHistory, margin: { top: 20, right: 30, left: 0, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false }), _jsx(XAxis, { dataKey: "date", tick: { fontSize: 12 } }), _jsx(YAxis, { tick: { fontSize: 12 } }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}), cursor: { fill: 'transparent' } }), _jsx(Legend, { wrapperStyle: { fontSize: '12px', paddingTop: '10px' } }), _jsx(Bar, { dataKey: "Mason", stackId: "a", fill: roleColors['Mason'], radius: [0, 0, 0, 0] }), _jsx(Bar, { dataKey: "Carpenter", stackId: "a", fill: roleColors['Carpenter'], radius: [0, 0, 0, 0] }), _jsx(Bar, { dataKey: "Electrician", stackId: "a", fill: roleColors['Electrician'], radius: [0, 0, 0, 0] }), _jsx(Bar, { dataKey: "Plumber", stackId: "a", fill: roleColors['Plumber'], radius: [0, 0, 0, 0] }), _jsx(Bar, { dataKey: "Helper", stackId: "a", fill: roleColors['Helper'], radius: [4, 4, 0, 0] })] }) }) })] })] })] }));
};
export default Workforce;
