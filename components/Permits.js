import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { generatePermitDocument } from '../services/geminiService';
import { MOCK_PERMITS } from '../constants';
import { ShieldCheck, Download, Plus, Save, PenTool, CheckCircle, FileBadge, Info, Trash2 } from 'lucide-react';
const Permits = ({ project }) => {
    const [documents, setDocuments] = useState(MOCK_PERMITS.filter(d => project ? d.projectId === project.id : true));
    const [activeDoc, setActiveDoc] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [loading, setLoading] = useState(false);
    // Generation Form State
    const [docType, setDocType] = useState('Building Permit');
    const [plotArea, setPlotArea] = useState('');
    const [buildingHeight, setBuildingHeight] = useState('');
    const [roadWidth, setRoadWidth] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    if (!project)
        return _jsx("div", { className: "p-6 text-slate-500", children: "Please select a project to manage permits." });
    const handleGenerate = async () => {
        if (!plotArea)
            return;
        setLoading(true);
        try {
            const details = `Project: ${project.name}, Location: ${project.location}. 
        Plot Area: ${plotArea}, Building Height: ${buildingHeight}, Access Road Width: ${roadWidth}.
        Authority: Vijayawada Municipal Corporation (VMC) / APCRDA.`;
            const content = await generatePermitDocument(docType, details);
            setGeneratedContent(content);
        }
        catch (error) {
            console.error(error);
            setGeneratedContent("Error generating document. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    const handleSave = () => {
        const newDoc = {
            id: Date.now().toString(),
            projectId: project.id,
            title: `${docType} - ${new Date().toLocaleDateString()}`,
            type: docType,
            content: generatedContent,
            status: 'Draft',
            date: new Date().toISOString().split('T')[0]
        };
        setDocuments([newDoc, ...documents]);
        setIsGenerating(false);
        setActiveDoc(newDoc);
        setGeneratedContent('');
    };
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this permit document?')) {
            setDocuments(documents.filter(d => d.id !== id));
            if (activeDoc?.id === id)
                setActiveDoc(null);
        }
    };
    const handleExport = () => {
        if (!activeDoc)
            return;
        const element = document.createElement("a");
        const file = new Blob([activeDoc.content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${activeDoc.title.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
    return (_jsxs("div", { className: "p-6 h-full flex flex-col gap-6 animate-fade-in", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-slate-800 flex items-center gap-2", children: [_jsx(ShieldCheck, { className: "text-teal-600" }), " AI Permit & Compliance Assistant"] }), _jsx("p", { className: "text-sm text-slate-500", children: "Automated documentation for Vijayawada Municipal Corporation (VMC) & APCRDA." })] }), !isGenerating && (_jsxs("button", { onClick: () => setIsGenerating(true), className: "bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm", children: [_jsx(Plus, { size: 18 }), " New Permit"] }))] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[500px]", children: [_jsxs("div", { className: "lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col", children: [_jsxs("div", { className: "p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 flex justify-between items-center", children: [_jsx("span", { children: "Permit Files" }), _jsx("span", { className: "text-xs bg-slate-200 px-2 py-1 rounded-full", children: documents.length })] }), _jsx("div", { className: "flex-1 overflow-y-auto divide-y divide-slate-100", children: documents.length === 0 ? (_jsx("div", { className: "p-6 text-center text-slate-400 text-sm", children: "No permits generated yet." })) : (documents.map(doc => (_jsxs("div", { onClick: () => { setActiveDoc(doc); setIsGenerating(false); }, className: `p-4 cursor-pointer hover:bg-slate-50 transition-colors ${activeDoc?.id === doc.id && !isGenerating ? 'bg-teal-50 border-l-4 border-teal-600' : ''}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-1", children: [_jsx("h4", { className: `font-semibold text-sm ${activeDoc?.id === doc.id ? 'text-teal-900' : 'text-slate-800'}`, children: doc.title }), doc.status === 'Draft' ? _jsx(FileBadge, { size: 14, className: "text-amber-500" }) : _jsx(CheckCircle, { size: 14, className: "text-green-500" })] }), _jsxs("div", { className: "flex justify-between items-center text-xs text-slate-500", children: [_jsx("span", { children: doc.type }), _jsx("span", { children: doc.date })] })] }, doc.id)))) })] }), _jsx("div", { className: "lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden", children: isGenerating ? (
                        /* GENERATOR FORM */
                        _jsxs("div", { className: "p-6 flex flex-col h-full", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("h3", { className: "text-lg font-bold text-slate-800 flex items-center gap-2", children: [_jsx(PenTool, { size: 18, className: "text-teal-500" }), " Generate Compliance Document"] }), _jsx("button", { onClick: () => setIsGenerating(false), className: "text-sm text-slate-500 hover:text-slate-800", children: "Cancel" })] }), _jsxs("div", { className: "bg-blue-50 p-4 rounded-lg mb-6 flex gap-3 text-sm text-blue-800", children: [_jsx(Info, { size: 20, className: "shrink-0 mt-0.5" }), _jsxs("p", { children: ["AI will auto-fill regulations based on ", _jsx("strong", { children: "Andhra Pradesh Building Rules 2017" }), " and ", _jsx("strong", { children: "VMC" }), " by-laws. Please provide accurate plot details."] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Document Type" }), _jsxs("select", { className: "w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white text-slate-900", value: docType, onChange: (e) => setDocType(e.target.value), children: [_jsx("option", { value: "Building Permit", children: "Building Permit Application (VMC)" }), _jsx("option", { value: "Fire NOC", children: "Fire Safety NOC Request" }), _jsx("option", { value: "Structural Stability", children: "Structural Stability Certificate" }), _jsx("option", { value: "Safety Checklist", children: "Site Safety Compliance Checklist" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Plot Area (sq yards / sq m)" }), _jsx("input", { type: "text", className: "w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white text-slate-900 placeholder-slate-400", placeholder: "e.g., 200 sq yards", value: plotArea, onChange: (e) => setPlotArea(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Building Height (m)" }), _jsx("input", { type: "text", className: "w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white text-slate-900 placeholder-slate-400", placeholder: "e.g., 12 meters", value: buildingHeight, onChange: (e) => setBuildingHeight(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Access Road Width (m/ft)" }), _jsx("input", { type: "text", className: "w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white text-slate-900 placeholder-slate-400", placeholder: "e.g., 40 ft road", value: roadWidth, onChange: (e) => setRoadWidth(e.target.value) })] })] }), _jsx("div", { className: "flex justify-end gap-3 pt-4 border-t border-slate-100 mt-auto", children: _jsx("button", { onClick: handleGenerate, disabled: loading || !plotArea, className: `px-6 py-2 rounded-lg text-white font-medium flex items-center gap-2 ${loading ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'}`, children: loading ? 'Consulting Regulations...' : 'Generate Document' }) }), generatedContent && (_jsxs("div", { className: "absolute inset-0 bg-white z-10 flex flex-col p-6 animate-fade-in", children: [_jsxs("div", { className: "flex justify-between items-center mb-4 pb-4 border-b border-slate-200", children: [_jsxs("h3", { className: "font-bold text-slate-800", children: ["Preview: ", docType] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setGeneratedContent(''), className: "px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded", children: "Discard" }), _jsxs("button", { onClick: handleSave, className: "px-4 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center gap-1", children: [_jsx(Save, { size: 14 }), " Save Permit"] })] })] }), _jsx("textarea", { className: "flex-1 w-full p-4 border border-slate-200 rounded-lg font-mono text-sm leading-relaxed focus:outline-none bg-slate-50 resize-none text-slate-900", value: generatedContent, onChange: (e) => setGeneratedContent(e.target.value) })] }))] })) : activeDoc ? (
                        /* VIEW / EDIT DOCUMENT */
                        _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-slate-800", children: activeDoc.title }), _jsxs("p", { className: "text-xs text-slate-500", children: [activeDoc.type, " \u2022 Created ", activeDoc.date] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleDelete(activeDoc.id), className: "p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors", title: "Delete", children: _jsx(Trash2, { size: 18 }) }), _jsx("button", { className: "p-2 text-slate-600 hover:bg-slate-200 rounded-lg", title: "Edit", children: _jsx(PenTool, { size: 18 }) }), _jsxs("button", { onClick: handleExport, className: "px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-900", children: [_jsx(Download, { size: 16 }), " Export"] })] })] }), _jsx("div", { className: "flex-1 p-6 overflow-y-auto", children: _jsx("pre", { className: "whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed max-w-3xl mx-auto bg-white p-8 shadow-sm border border-slate-100 min-h-full", children: activeDoc.content }) })] })) : (
                        /* EMPTY STATE */
                        _jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-slate-400 p-8", children: [_jsx(ShieldCheck, { size: 64, className: "mb-4 opacity-20" }), _jsx("p", { className: "text-lg font-medium", children: "Select a permit to view" }), _jsx("p", { className: "text-sm", children: "or generate a new one for VMC compliance" })] })) })] })] }));
};
export default Permits;
