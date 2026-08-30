import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Upload, Wand2, Download, Layers, X, Eye } from 'lucide-react';
import { generateFloorPlanImage, generate3DView } from '../services/geminiService';
import { SAMPLE_PROMPTS } from '../constants';
const FloorPlanGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState('2D');
    const [error, setError] = useState('');
    const [uploadedSketch, setUploadedSketch] = useState(null);
    const handleGenerate = async (targetMode) => {
        if (!prompt && !uploadedSketch)
            return;
        setLoading(true);
        setMode(targetMode);
        setError('');
        try {
            let result;
            if (targetMode === '3D') {
                // Generate 3D Perspective
                result = await generate3DView(prompt || "Modern interior design based on architectural plan");
            }
            else {
                // Generate 2D Plan
                result = await generateFloorPlanImage(prompt, uploadedSketch || undefined);
            }
            setGeneratedImage(result);
        }
        catch (err) {
            setError(err.message || 'Failed to generate');
        }
        finally {
            setLoading(false);
        }
    };
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedSketch(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const clearSketch = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setUploadedSketch(null);
    };
    return (_jsxs("div", { className: "p-6 h-full flex flex-col gap-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("h2", { className: "text-2xl font-bold text-slate-800 flex items-center gap-2", children: [_jsx(Wand2, { className: "text-indigo-600" }), " AI Floor Plan & Design"] }), generatedImage && (_jsxs("button", { className: "flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors", children: [_jsx(Download, { size: 16 }), " Save Image"] }))] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 h-full", children: [_jsxs("div", { className: "lg:col-span-1 space-y-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-slate-200", children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Design Requirements" }), _jsx("textarea", { className: "w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[120px] bg-white text-slate-900 placeholder-slate-400", placeholder: "E.g., A 1500 sqft residential house with 3 bedrooms, open kitchen...", value: prompt, onChange: (e) => setPrompt(e.target.value) }), _jsxs("div", { className: "mt-4", children: [_jsx("p", { className: "text-xs text-slate-500 mb-2", children: "Try a sample:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: SAMPLE_PROMPTS.map((p, i) => (_jsxs("button", { onClick: () => setPrompt(p), className: "text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md text-slate-600 transition-colors", children: [p.substring(0, 30), "..."] }, i))) })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-slate-200", children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Upload Reference Sketch (For 2D)" }), _jsxs("div", { className: "border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors relative group", children: [_jsx("input", { type: "file", accept: "image/*", onChange: handleFileUpload, className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10", title: uploadedSketch ? "Click to replace sketch" : "Click to upload sketch" }), uploadedSketch ? (_jsxs("div", { className: "relative z-0", children: [_jsx("img", { src: uploadedSketch, alt: "Sketch", className: "max-h-40 mx-auto object-contain rounded shadow-sm" }), _jsx("button", { onClick: clearSketch, className: "absolute -top-3 -right-3 bg-white text-red-500 p-1.5 rounded-full shadow-md hover:bg-red-50 z-20 border border-slate-200", title: "Remove Sketch", children: _jsx(X, { size: 16 }) }), _jsx("p", { className: "text-xs text-slate-400 mt-3 font-medium", children: "Click image to replace" })] })) : (_jsxs("div", { className: "flex flex-col items-center text-slate-500 py-2", children: [_jsx(Upload, { size: 32, className: "mb-2 opacity-50" }), _jsx("span", { className: "text-sm font-medium", children: "Click to upload rough sketch" }), _jsx("span", { className: "text-xs opacity-70 mt-1", children: "Supports JPG, PNG" })] }))] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("button", { onClick: () => handleGenerate('2D'), disabled: loading || (!prompt && !uploadedSketch), className: `py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all ${loading || (!prompt && !uploadedSketch) ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'}`, children: [loading && mode === '2D' ? _jsx("div", { className: "animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" }) : _jsx(Wand2, { size: 18 }), "Generate Plan"] }), _jsxs("button", { onClick: () => handleGenerate('3D'), disabled: loading || !prompt, className: `py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all ${loading || !prompt ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-md'}`, children: [loading && mode === '3D' ? _jsx("div", { className: "animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" }) : _jsx(Eye, { size: 18 }), "3D View"] })] }), error && (_jsx("div", { className: "bg-red-50 text-red-600 p-3 rounded-lg text-sm", children: error }))] }), _jsxs("div", { className: "lg:col-span-2 bg-slate-900 rounded-xl overflow-hidden shadow-inner flex flex-col relative min-h-[500px]", children: [_jsxs("div", { className: "absolute top-4 left-4 z-10 bg-slate-800/80 backdrop-blur-sm p-2 rounded-lg flex gap-2", children: [_jsx("div", { className: `px-3 py-1 rounded text-xs font-bold ${mode === '2D' ? 'bg-white text-slate-900' : 'text-slate-400'}`, children: "2D Plan" }), _jsx("div", { className: `px-3 py-1 rounded text-xs font-bold ${mode === '3D' ? 'bg-purple-500 text-white' : 'text-slate-400'}`, children: "3D Perspective" })] }), _jsx("div", { className: "flex-1 flex items-center justify-center p-8", children: generatedImage ? (_jsx("img", { src: generatedImage, alt: "Generated Design", className: "max-w-full max-h-full shadow-2xl rounded-lg border-4 border-white" })) : (_jsxs("div", { className: "text-center text-slate-500", children: [_jsx(Layers, { size: 48, className: "mx-auto mb-4 opacity-20" }), _jsx("p", { children: "Select \"Generate Plan\" for blueprint or \"3D View\" for a perspective render." })] })) })] })] })] }));
};
export default FloorPlanGenerator;
