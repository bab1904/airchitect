import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { generateProjectOutline } from '../services/geminiService';
import { Mic, Sparkles, ArrowRight, X, Building2, MapPin, IndianRupee } from 'lucide-react';
import { MOCK_PROJECTS } from '../constants';
const NewProjectWizard = ({ onClose, onProjectCreated }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    // Form Inputs
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [location, setLocation] = useState('');
    // AI Output
    const [aiPlan, setAiPlan] = useState(null);
    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';
            setIsListening(true);
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setDescription(prev => prev ? `${prev} ${transcript}` : transcript);
                setIsListening(false);
            };
            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);
            recognition.start();
        }
        else {
            alert("Voice input not supported in this browser.");
        }
    };
    const handleGeneratePlan = async () => {
        if (!description || !budget || !location)
            return;
        setLoading(true);
        try {
            const outline = await generateProjectOutline(description, budget, location);
            setAiPlan(outline);
            setStep(2);
        }
        catch (e) {
            console.error(e);
            alert("Failed to generate plan. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    const handleFinalizeProject = () => {
        if (!aiPlan)
            return;
        const newProject = {
            id: `p${Date.now()}`,
            name: aiPlan.suggestedName,
            location: location,
            budget: parseFloat(budget.replace(/,/g, '')),
            status: 'Planning',
            thumbnail: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400', // Default placeholder
            completionDate: new Date(new Date().setMonth(new Date().getMonth() + aiPlan.estimatedDurationMonths)).toISOString().split('T')[0],
            team: []
        };
        // In a real app, API call here. For now, update Mock.
        MOCK_PROJECTS.push(newProject);
        onProjectCreated(newProject);
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in", children: _jsxs("div", { className: "bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]", children: [_jsxs("div", { className: "bg-slate-900 p-6 flex justify-between items-center text-white", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-bold flex items-center gap-2", children: [_jsx(Sparkles, { className: "text-indigo-400" }), " New Project Wizard"] }), _jsx("p", { className: "text-slate-400 text-sm", children: "AI-Assisted Project Setup" })] }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors", children: _jsx(X, { size: 24 }) })] }), _jsx("div", { className: "p-8 overflow-y-auto flex-1", children: step === 1 ? (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h3", { className: "text-2xl font-bold text-slate-800 mb-2", children: "Tell us about your new project" }), _jsx("p", { className: "text-slate-500", children: "Answer a few basic questions, and AI will structure the plan for you." })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Where is the site located?" }), _jsxs("div", { className: "relative", children: [_jsx(MapPin, { className: "absolute left-3 top-3 text-slate-400", size: 18 }), _jsx("input", { type: "text", value: location, onChange: e => setLocation(e.target.value), className: "w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none", placeholder: "e.g. Hyderabad, Telangana" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "What is the estimated budget?" }), _jsxs("div", { className: "relative", children: [_jsx(IndianRupee, { className: "absolute left-3 top-3 text-slate-400", size: 18 }), _jsx("input", { type: "number", value: budget, onChange: e => setBudget(e.target.value), className: "w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none", placeholder: "e.g. 5000000" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Describe the project (Use Voice or Text)" }), _jsxs("div", { className: "relative", children: [_jsx("textarea", { value: description, onChange: e => setDescription(e.target.value), className: "w-full p-4 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px]", placeholder: "e.g. I want to build a G+2 residential apartment with 6 units, parking on ground floor, and a small garden." }), _jsx("button", { onClick: handleVoiceInput, className: `absolute bottom-3 right-3 p-2 rounded-full shadow-sm transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-500 hover:text-indigo-600'}`, title: "Use Voice Input", children: _jsx(Mic, { size: 20 }) })] })] })] }), _jsx("button", { onClick: handleGeneratePlan, disabled: !location || !budget || !description || loading, className: `w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all mt-4 ${loading || !location || !budget || !description
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'}`, children: loading ? (_jsxs(_Fragment, { children: ["Thinking ", _jsx("div", { className: "w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" })] })) : (_jsxs(_Fragment, { children: ["Generate Project Structure ", _jsx(Sparkles, { size: 20 })] })) })] })) : (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-3", children: _jsx(Building2, { size: 24 }) }), _jsx("h3", { className: "text-2xl font-bold text-slate-800", children: "Project Outline Ready" }), _jsx("p", { className: "text-slate-500", children: "Review the AI-generated structure before creating." })] }), _jsxs("div", { className: "bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-slate-500 uppercase tracking-wider mb-1", children: "Project Name" }), _jsx("p", { className: "text-xl font-bold text-slate-900", children: aiPlan?.suggestedName })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-slate-500 uppercase tracking-wider mb-1", children: "Duration" }), _jsxs("p", { className: "text-slate-800 font-medium", children: [aiPlan?.estimatedDurationMonths, " Months"] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-slate-500 uppercase tracking-wider mb-1", children: "Budget" }), _jsxs("p", { className: "text-slate-800 font-medium", children: ["\u20B9 ", parseInt(budget).toLocaleString('en-IN')] })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Key Stages" }), _jsx("div", { className: "flex flex-wrap gap-2", children: aiPlan?.stages.map((stage, i) => (_jsx("span", { className: "px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-700 shadow-sm", children: stage }, i))) })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-slate-500 uppercase tracking-wider mb-2", children: "Major Materials" }), _jsx("div", { className: "flex flex-wrap gap-2", children: aiPlan?.keyMaterials.map((mat, i) => (_jsx("span", { className: "px-3 py-1 bg-orange-50 border border-orange-100 rounded-full text-sm text-orange-800", children: mat }, i))) })] }), _jsxs("div", { className: "bg-blue-50 p-4 rounded-lg text-sm text-blue-800 leading-relaxed", children: [_jsx("strong", { children: "Summary: " }), " ", aiPlan?.briefSummary] })] }), _jsxs("button", { onClick: handleFinalizeProject, className: "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all", children: ["Initialize Project ", _jsx(ArrowRight, { size: 20 })] })] })) })] }) }));
};
export default NewProjectWizard;
