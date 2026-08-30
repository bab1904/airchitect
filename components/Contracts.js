import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { generateDocument } from '../services/geminiService';
import { MOCK_DOCUMENTS } from '../constants';
import { FileText, Download, Plus, Save, PenTool, CheckCircle, FileSignature, Clock, Trash2 } from 'lucide-react';
const Contracts = ({ project }) => {
    const [documents, setDocuments] = useState(MOCK_DOCUMENTS.filter(d => project ? d.projectId === project.id : true));
    const [activeDoc, setActiveDoc] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [loading, setLoading] = useState(false);
    // Generation Form State
    const [docType, setDocType] = useState('Material Tender');
    const [docTitle, setDocTitle] = useState('');
    const [docDetails, setDocDetails] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    if (!project)
        return _jsx("div", { className: "p-6 text-slate-500", children: "Please select a project to manage contracts." });
    const handleGenerate = async () => {
        if (!docTitle || !docDetails)
            return;
        setLoading(true);
        try {
            const content = await generateDocument(docType, `Project: ${project.name}, Location: ${project.location}. ${docDetails}`);
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
            title: docTitle,
            type: docType,
            content: generatedContent,
            status: 'Draft',
            date: new Date().toISOString().split('T')[0]
        };
        setDocuments([newDoc, ...documents]);
        setIsGenerating(false);
        setActiveDoc(newDoc);
        // Reset Form
        setDocTitle('');
        setDocDetails('');
        setGeneratedContent('');
    };
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this document?')) {
            const updatedDocs = documents.filter(d => d.id !== id);
            setDocuments(updatedDocs);
            if (activeDoc?.id === id) {
                setActiveDoc(null);
            }
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
    return (_jsxs("div", { className: "p-6 h-full flex flex-col gap-6 animate-fade-in", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-slate-800 flex items-center gap-2", children: [_jsx(FileSignature, { className: "text-indigo-600" }), " Auto Tender & Contract Generator"] }), _jsx("p", { className: "text-sm text-slate-500", children: "Generate legal drafts, tenders, and schedules instantly." })] }), !isGenerating && (_jsxs("button", { onClick: () => setIsGenerating(true), className: "bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm", children: [_jsx(Plus, { size: 18 }), " New Document"] }))] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[500px]", children: [_jsxs("div", { className: "lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col", children: [_jsxs("div", { className: "p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 flex justify-between items-center", children: [_jsx("span", { children: "Documents" }), _jsx("span", { className: "text-xs bg-slate-200 px-2 py-1 rounded-full", children: documents.length })] }), _jsx("div", { className: "flex-1 overflow-y-auto divide-y divide-slate-100", children: documents.length === 0 ? (_jsx("div", { className: "p-6 text-center text-slate-400 text-sm", children: "No documents yet." })) : (documents.map(doc => (_jsxs("div", { onClick: () => { setActiveDoc(doc); setIsGenerating(false); }, className: `p-4 cursor-pointer hover:bg-slate-50 transition-colors ${activeDoc?.id === doc.id && !isGenerating ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-1", children: [_jsx("h4", { className: `font-semibold text-sm ${activeDoc?.id === doc.id ? 'text-indigo-900' : 'text-slate-800'}`, children: doc.title }), doc.status === 'Draft' ? _jsx(Clock, { size: 14, className: "text-amber-500" }) : _jsx(CheckCircle, { size: 14, className: "text-green-500" })] }), _jsxs("div", { className: "flex justify-between items-center text-xs text-slate-500", children: [_jsx("span", { children: doc.type }), _jsx("span", { children: doc.date })] })] }, doc.id)))) })] }), _jsx("div", { className: "lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden", children: isGenerating ? (
                        /* GENERATOR FORM */
                        _jsxs("div", { className: "p-6 flex flex-col h-full", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("h3", { className: "text-lg font-bold text-slate-800 flex items-center gap-2", children: [_jsx(PenTool, { size: 18, className: "text-indigo-500" }), " Generate New Document"] }), _jsx("button", { onClick: () => setIsGenerating(false), className: "text-sm text-slate-500 hover:text-slate-800", children: "Cancel" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Document Type" }), _jsxs("select", { className: "w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900", value: docType, onChange: (e) => setDocType(e.target.value), children: [_jsx("option", { value: "Material Tender", children: "Material Tender Document" }), _jsx("option", { value: "Contractor Agreement", children: "Contractor Agreement" }), _jsx("option", { value: "Payment Schedule", children: "Payment Schedule" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Title" }), _jsx("input", { type: "text", className: "w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 placeholder-slate-400", placeholder: "e.g., Cement Supply Tender Phase 2", value: docTitle, onChange: (e) => setDocTitle(e.target.value) })] })] }), _jsxs("div", { className: "mb-4 flex-1 flex flex-col", children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Key Details & Context" }), _jsx("textarea", { className: "w-full flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 placeholder-slate-400", placeholder: "Enter specific requirements, contractor names, quantities, dates, payment terms, or any clauses you want included...", value: docDetails, onChange: (e) => setDocDetails(e.target.value) })] }), _jsx("div", { className: "flex justify-end gap-3 pt-4 border-t border-slate-100", children: _jsx("button", { onClick: handleGenerate, disabled: loading || !docTitle || !docDetails, className: `px-6 py-2 rounded-lg text-white font-medium flex items-center gap-2 ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`, children: loading ? 'AI is writing...' : 'Generate Draft' }) }), generatedContent && (_jsxs("div", { className: "absolute inset-0 bg-white z-10 flex flex-col p-6 animate-fade-in", children: [_jsxs("div", { className: "flex justify-between items-center mb-4 pb-4 border-b border-slate-200", children: [_jsxs("h3", { className: "font-bold text-slate-800", children: ["Preview: ", docTitle] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setGeneratedContent(''), className: "px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded", children: "Discard" }), _jsxs("button", { onClick: handleSave, className: "px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1", children: [_jsx(Save, { size: 14 }), " Save to Project"] })] })] }), _jsx("textarea", { className: "flex-1 w-full p-4 border border-slate-200 rounded-lg font-mono text-sm leading-relaxed focus:outline-none bg-slate-50 resize-none text-slate-900", value: generatedContent, onChange: (e) => setGeneratedContent(e.target.value) })] }))] })) : activeDoc ? (
                        /* VIEW / EDIT DOCUMENT */
                        _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-slate-800", children: activeDoc.title }), _jsxs("p", { className: "text-xs text-slate-500", children: [activeDoc.type, " \u2022 Created ", activeDoc.date] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleDelete(activeDoc.id), className: "p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors", title: "Delete", children: _jsx(Trash2, { size: 18 }) }), _jsx("button", { className: "p-2 text-slate-600 hover:bg-slate-200 rounded-lg", title: "Edit", children: _jsx(PenTool, { size: 18 }) }), _jsxs("button", { onClick: handleExport, className: "px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-900", children: [_jsx(Download, { size: 16 }), " Export"] })] })] }), _jsx("div", { className: "flex-1 p-6 overflow-y-auto", children: _jsx("pre", { className: "whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed max-w-3xl mx-auto bg-white p-8 shadow-sm border border-slate-100 min-h-full", children: activeDoc.content }) })] })) : (
                        /* EMPTY STATE */
                        _jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-slate-400 p-8", children: [_jsx(FileText, { size: 64, className: "mb-4 opacity-20" }), _jsx("p", { className: "text-lg font-medium", children: "Select a document to view" }), _jsx("p", { className: "text-sm", children: "or generate a new one using AI" })] })) })] })] }));
};
export default Contracts;
