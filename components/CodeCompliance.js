import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { runComplianceCheck } from '../services/geminiService';
import { BookOpen, CheckCircle, XCircle, AlertTriangle, Activity, Ruler, Wind, Flame } from 'lucide-react';
const CodeCompliance = ({ project }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    // Form State
    const [plotArea, setPlotArea] = useState('200'); // sq yards
    const [buildingHeight, setBuildingHeight] = useState('12'); // meters
    const [occupancy, setOccupancy] = useState('Residential');
    const [frontSetback, setFrontSetback] = useState('2.5');
    const [rearSetback, setRearSetback] = useState('1.5');
    const [sideSetback1, setSideSetback1] = useState('1.5');
    const [sideSetback2, setSideSetback2] = useState('1.5');
    const [roadWidth, setRoadWidth] = useState('30'); // feet
    const [additionalNotes, setAdditionalNotes] = useState('');
    const handleCheck = async () => {
        setLoading(true);
        try {
            const params = {
                projectLocation: project ? project.location : "Vijayawada, Andhra Pradesh",
                plotAreaSqYards: plotArea,
                buildingHeightMeters: buildingHeight,
                occupancyType: occupancy,
                roadWidthFeet: roadWidth,
                providedSetbacks: {
                    front: frontSetback + "m",
                    rear: rearSetback + "m",
                    side1: sideSetback1 + "m",
                    side2: sideSetback2 + "m"
                },
                description: additionalNotes || "Standard construction with staircase and ventilation."
            };
            const result = await runComplianceCheck(params);
            setReport(result);
        }
        catch (error) {
            console.error(error);
            alert("Failed to run compliance check.");
        }
        finally {
            setLoading(false);
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pass': return 'text-green-600 bg-green-50 border-green-200';
            case 'Fail': return 'text-red-600 bg-red-50 border-red-200';
            case 'Warning': return 'text-amber-600 bg-amber-50 border-amber-200';
            default: return 'text-slate-600 bg-slate-50';
        }
    };
    const getOverallBadge = (status) => {
        if (status === 'Compliant')
            return _jsxs("span", { className: "bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold border border-green-200 flex items-center gap-2", children: [_jsx(CheckCircle, { size: 16 }), " Compliant"] });
        if (status === 'Non-Compliant')
            return _jsxs("span", { className: "bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-bold border border-red-200 flex items-center gap-2", children: [_jsx(XCircle, { size: 16 }), " Violation Detected"] });
        return _jsxs("span", { className: "bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-sm font-bold border border-amber-200 flex items-center gap-2", children: [_jsx(AlertTriangle, { size: 16 }), " Conditional"] });
    };
    return (_jsxs("div", { className: "p-6 h-full flex flex-col gap-6 animate-fade-in", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-slate-800 flex items-center gap-2", children: [_jsx(BookOpen, { className: "text-blue-600" }), " AI Building Code Checker"] }), _jsx("p", { className: "text-sm text-slate-500", children: "Auto-verification against VMC, APCRDA, and NBC 2016 norms." })] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit", children: [_jsxs("h3", { className: "font-bold text-slate-800 mb-4 flex items-center gap-2", children: [_jsx(Ruler, { size: 18 }), " Building Parameters"] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Occupancy" }), _jsxs("select", { value: occupancy, onChange: e => setOccupancy(e.target.value), className: "w-full p-2 border rounded-lg text-sm bg-white text-slate-900", children: [_jsx("option", { value: "Residential", children: "Residential" }), _jsx("option", { value: "Commercial", children: "Commercial" }), _jsx("option", { value: "Institutional", children: "Institutional" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Plot Area (Sq Yd)" }), _jsx("input", { type: "number", value: plotArea, onChange: e => setPlotArea(e.target.value), className: "w-full p-2 border rounded-lg text-sm bg-white text-slate-900" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Height (m)" }), _jsx("input", { type: "number", value: buildingHeight, onChange: e => setBuildingHeight(e.target.value), className: "w-full p-2 border rounded-lg text-sm bg-white text-slate-900" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Road Width (ft)" }), _jsx("input", { type: "number", value: roadWidth, onChange: e => setRoadWidth(e.target.value), className: "w-full p-2 border rounded-lg text-sm bg-white text-slate-900" })] })] }), _jsxs("div", { className: "border-t border-slate-100 pt-3", children: [_jsx("label", { className: "block text-xs font-bold text-slate-700 mb-2", children: "Setbacks Provided (Meters)" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-[10px] text-slate-500", children: "Front" }), _jsx("input", { type: "number", step: "0.1", value: frontSetback, onChange: e => setFrontSetback(e.target.value), className: "w-full p-2 border rounded-lg text-sm bg-white text-slate-900" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-[10px] text-slate-500", children: "Rear" }), _jsx("input", { type: "number", step: "0.1", value: rearSetback, onChange: e => setRearSetback(e.target.value), className: "w-full p-2 border rounded-lg text-sm bg-white text-slate-900" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-[10px] text-slate-500", children: "Side 1" }), _jsx("input", { type: "number", step: "0.1", value: sideSetback1, onChange: e => setSideSetback1(e.target.value), className: "w-full p-2 border rounded-lg text-sm bg-white text-slate-900" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-[10px] text-slate-500", children: "Side 2" }), _jsx("input", { type: "number", step: "0.1", value: sideSetback2, onChange: e => setSideSetback2(e.target.value), className: "w-full p-2 border rounded-lg text-sm bg-white text-slate-900" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: "Additional Details (Stairs/Ventilation)" }), _jsx("textarea", { value: additionalNotes, onChange: e => setAdditionalNotes(e.target.value), className: "w-full p-2 border rounded-lg text-sm h-20 bg-white text-slate-900", placeholder: "e.g. Staircase width 1m, window area 15% of floor." })] }), _jsx("button", { onClick: handleCheck, disabled: loading, className: `w-full py-3 rounded-lg text-white font-bold flex items-center justify-center gap-2 ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}`, children: loading ? 'Analyzing Codes...' : 'Run Compliance Check' })] })] }), _jsx("div", { className: "lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-slate-200 overflow-y-auto max-h-[calc(100vh-200px)]", children: !report ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-slate-400 opacity-60", children: [_jsx(Activity, { size: 64, className: "mb-4" }), _jsx("p", { className: "text-lg font-medium", children: "No Report Generated" }), _jsx("p", { className: "text-sm", children: "Enter details and run check to see VMC/NBC violations." })] })) : (_jsxs("div", { className: "animate-fade-in", children: [_jsxs("div", { className: "flex justify-between items-start mb-6 border-b border-slate-100 pb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-slate-800", children: "Compliance Report" }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Based on AP Building Rules 2017 & NBC 2016" })] }), _jsxs("div", { className: "text-right", children: [getOverallBadge(report.overallStatus), _jsxs("div", { className: "mt-2 text-xs font-bold text-slate-400", children: ["Score: ", report.score, "/100"] })] })] }), _jsx("div", { className: "space-y-4", children: report.checks.map((check, idx) => (_jsxs("div", { className: `p-4 rounded-lg border ${getStatusColor(check.status)}`, children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [check.category === 'Setbacks' && _jsx(Ruler, { size: 16 }), check.category === 'Fire Safety' && _jsx(Flame, { size: 16 }), check.category === 'Ventilation' && _jsx(Wind, { size: 16 }), _jsx("span", { className: "font-bold text-sm uppercase tracking-wide", children: check.category })] }), _jsx("span", { className: `text-xs font-bold px-2 py-0.5 rounded uppercase ${check.status === 'Pass' ? 'bg-green-200 text-green-800' : check.status === 'Fail' ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'}`, children: check.status })] }), _jsx("p", { className: "font-semibold text-sm mt-1", children: check.requirement }), _jsxs("p", { className: "text-xs mt-1 opacity-80", children: ["Rule: ", check.rule] }), _jsxs("div", { className: "mt-3 flex flex-col md:flex-row gap-4 text-sm bg-white/50 p-2 rounded", children: [_jsxs("div", { className: "flex-1", children: [_jsx("span", { className: "block text-[10px] uppercase opacity-60 font-bold", children: "Provided" }), _jsx("span", { children: check.provided })] }), check.status !== 'Pass' && (_jsxs("div", { className: "flex-[2]", children: [_jsx("span", { className: "block text-[10px] uppercase opacity-60 font-bold", children: "Correction Required" }), _jsx("span", { className: "font-medium", children: check.recommendation })] }))] })] }, idx))) }), _jsx("div", { className: "mt-6 bg-slate-50 p-4 rounded-lg text-xs text-slate-500 italic", children: "Disclaimer: This AI analysis is for preliminary guidance only. Final approval is subject to VMC town planning verification." })] })) })] })] }));
};
export default CodeCompliance;
