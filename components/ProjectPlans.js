import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { UserRole } from '../types';
import { Map, Download, Maximize2, X, Layers, Grid, Zap, Plus, Upload, FileImage } from 'lucide-react';
// Mock Data for Plans (In a real app, this would come from an API based on projectId)
const INITIAL_PLANS = [
    {
        id: 'plan1',
        title: 'Ground Floor Layout',
        category: 'Architectural',
        version: 'v3.2',
        date: '2023-10-15',
        imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 'plan2',
        title: 'First Floor Layout',
        category: 'Architectural',
        version: 'v2.0',
        date: '2023-09-20',
        imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 'plan3',
        title: 'Structural Column Grid',
        category: 'Structural',
        version: 'v1.5',
        date: '2023-08-10',
        imageUrl: 'https://plus.unsplash.com/premium_photo-1661876638656-74b711e5dc42?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 'plan4',
        title: 'Electrical Wiring Diagram',
        category: 'MEP',
        version: 'v1.0',
        date: '2023-10-05',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 'plan5',
        title: 'Plumbing & Drainage',
        category: 'MEP',
        version: 'v1.1',
        date: '2023-10-08',
        imageUrl: 'https://images.unsplash.com/photo-1581093583449-ed25213407e4?auto=format&fit=crop&q=80&w=1000'
    }
];
const ProjectPlans = ({ project, userRole }) => {
    const [plans, setPlans] = useState(INITIAL_PLANS);
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    // Upload Form State
    const [newPlanTitle, setNewPlanTitle] = useState('');
    const [newPlanCategory, setNewPlanCategory] = useState('Architectural');
    const [newPlanVersion, setNewPlanVersion] = useState('v1.0');
    const [newPlanImage, setNewPlanImage] = useState(null);
    if (!project)
        return _jsx("div", { className: "p-6 text-slate-500", children: "Please select a project to view plans." });
    const canUpload = userRole === UserRole.PROJECT_MANAGER || userRole === UserRole.SITE_MANAGER;
    const categories = ['All', 'Architectural', 'Structural', 'MEP'];
    const filteredPlans = activeCategory === 'All'
        ? plans
        : plans.filter(p => p.category === activeCategory);
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPlanImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSavePlan = () => {
        if (!newPlanTitle || !newPlanImage)
            return;
        const newPlan = {
            id: `plan-${Date.now()}`,
            title: newPlanTitle,
            category: newPlanCategory,
            version: newPlanVersion,
            date: new Date().toISOString().split('T')[0],
            imageUrl: newPlanImage
        };
        setPlans([newPlan, ...plans]);
        setIsUploading(false);
        // Reset
        setNewPlanTitle('');
        setNewPlanImage(null);
        setNewPlanVersion('v1.0');
    };
    return (_jsxs("div", { className: "p-6 h-full flex flex-col gap-6 animate-fade-in relative", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-slate-800 flex items-center gap-2", children: [_jsx(Map, { className: "text-indigo-600" }), " Project Plans & Blueprints"] }), _jsxs("p", { className: "text-sm text-slate-500", children: ["View approved drawings for ", project.name] })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "flex bg-white rounded-lg p-1 shadow-sm border border-slate-200 overflow-x-auto", children: categories.map(cat => (_jsxs("button", { onClick: () => setActiveCategory(cat), className: `px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeCategory === cat ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`, children: [cat === 'Architectural' && _jsx(Layers, { size: 14 }), cat === 'Structural' && _jsx(Grid, { size: 14 }), cat === 'MEP' && _jsx(Zap, { size: 14 }), cat] }, cat))) }), canUpload && !isUploading && (_jsxs("button", { onClick: () => setIsUploading(true), className: "bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm whitespace-nowrap", children: [_jsx(Plus, { size: 18 }), " Add Plan"] }))] })] }), isUploading && (_jsxs("div", { className: "bg-white p-6 rounded-xl shadow-md border border-indigo-200 animate-fade-in", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("h3", { className: "text-lg font-bold text-slate-800 flex items-center gap-2", children: [_jsx(Upload, { size: 20, className: "text-indigo-500" }), " Upload New Blueprint"] }), _jsx("button", { onClick: () => setIsUploading(false), className: "text-slate-400 hover:text-slate-600", children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Plan Title" }), _jsx("input", { type: "text", className: "w-full p-2 border border-slate-300 rounded-lg", placeholder: "e.g. Second Floor HVAC Layout", value: newPlanTitle, onChange: e => setNewPlanTitle(e.target.value) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Category" }), _jsxs("select", { className: "w-full p-2 border border-slate-300 rounded-lg bg-white", value: newPlanCategory, onChange: e => setNewPlanCategory(e.target.value), children: [_jsx("option", { value: "Architectural", children: "Architectural" }), _jsx("option", { value: "Structural", children: "Structural" }), _jsx("option", { value: "MEP", children: "MEP (Mech/Elec/Plumb)" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Version" }), _jsx("input", { type: "text", className: "w-full p-2 border border-slate-300 rounded-lg", placeholder: "e.g. v1.2", value: newPlanVersion, onChange: e => setNewPlanVersion(e.target.value) })] })] }), _jsx("button", { onClick: handleSavePlan, disabled: !newPlanTitle || !newPlanImage, className: `w-full py-3 rounded-lg text-white font-medium ${!newPlanTitle || !newPlanImage ? 'bg-slate-300' : 'bg-green-600 hover:bg-green-700'}`, children: "Save & Publish Plan" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Plan Image" }), _jsxs("div", { className: "border-2 border-dashed border-slate-300 rounded-lg h-48 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 relative cursor-pointer", children: [_jsx("input", { type: "file", accept: "image/*", onChange: handleImageUpload, className: "absolute inset-0 opacity-0 cursor-pointer" }), newPlanImage ? (_jsx("img", { src: newPlanImage, alt: "Preview", className: "h-full w-full object-contain p-2" })) : (_jsxs(_Fragment, { children: [_jsx(FileImage, { size: 32, className: "mb-2 opacity-50" }), _jsx("span", { children: "Click to upload image file" })] }))] })] })] })] })), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: filteredPlans.map(plan => (_jsxs("div", { onClick: () => setSelectedPlan(plan), className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer group hover:shadow-lg transition-all", children: [_jsxs("div", { className: "relative aspect-[4/3] bg-slate-100 overflow-hidden", children: [_jsx("img", { src: plan.imageUrl, alt: plan.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" }), _jsx("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center", children: _jsx(Maximize2, { className: "text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg", size: 32 }) }), _jsx("div", { className: "absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm", children: plan.category })] }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "font-bold text-slate-800 text-sm mb-1", children: plan.title }), _jsx("div", { className: "flex justify-between items-center text-xs text-slate-500", children: _jsxs("span", { children: [plan.version, " \u2022 ", plan.date] }) })] })] }, plan.id))) }), selectedPlan && (_jsxs("div", { className: "fixed inset-0 z-50 bg-black/90 flex flex-col animate-fade-in", children: [_jsxs("div", { className: "h-16 flex items-center justify-between px-6 text-white bg-black/50 backdrop-blur-md", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-lg", children: selectedPlan.title }), _jsxs("p", { className: "text-xs text-slate-300", children: [selectedPlan.version, " \u2022 ", selectedPlan.category, " \u2022 ", selectedPlan.date] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { className: "flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors", children: [_jsx(Download, { size: 16 }), " Download"] }), _jsx("button", { onClick: () => setSelectedPlan(null), className: "p-2 bg-white/10 hover:bg-red-500/80 rounded-full transition-colors", children: _jsx(X, { size: 20 }) })] })] }), _jsx("div", { className: "flex-1 overflow-auto flex items-center justify-center p-4", children: _jsx("img", { src: selectedPlan.imageUrl, alt: selectedPlan.title, className: "max-w-full max-h-full object-contain shadow-2xl" }) })] }))] }));
};
export default ProjectPlans;
