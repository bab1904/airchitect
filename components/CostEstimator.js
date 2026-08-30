import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { generateBOQ } from '../services/geminiService';
import { Calculator, IndianRupee, FileText } from 'lucide-react';
const CostEstimator = () => {
    const [description, setDescription] = useState('');
    const [boq, setBoq] = useState([]);
    const [loading, setLoading] = useState(false);
    const calculateTotal = () => boq.reduce((acc, item) => acc + (item.amount || 0), 0);
    const handleEstimate = async () => {
        if (!description)
            return;
        setLoading(true);
        try {
            const data = await generateBOQ(description + " (Use Indian Rupees INR for rates)");
            setBoq(data);
        }
        catch (e) {
            console.error(e);
            alert('Failed to generate estimate. Please try again or check API key.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "p-6 h-full flex flex-col gap-6", children: [_jsxs("h2", { className: "text-2xl font-bold text-slate-800 flex items-center gap-2", children: [_jsx(Calculator, { className: "text-green-600" }), " Smart Cost Estimator"] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-1 space-y-4", children: _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-slate-200", children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Project Scope" }), _jsx("textarea", { className: "w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[200px] bg-white text-slate-900 placeholder-slate-400", placeholder: "Describe the construction work (e.g., Construction of a 10x10ft brick wall, plastered on both sides)...", value: description, onChange: (e) => setDescription(e.target.value) }), _jsx("button", { onClick: handleEstimate, disabled: loading || !description, className: `mt-4 w-full py-3 rounded-lg text-white font-medium transition-all ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700 shadow-md'}`, children: loading ? 'Analyzing Scope...' : 'Generate Estimate' })] }) }), _jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", children: [_jsxs("div", { className: "p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center", children: [_jsxs("h3", { className: "font-semibold text-slate-700 flex items-center gap-2", children: [_jsx(FileText, { size: 18 }), " Bill of Quantities (BoQ)"] }), boq.length > 0 && (_jsxs("div", { className: "flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold", children: [_jsx(IndianRupee, { size: 14 }), " Total: ", calculateTotal().toLocaleString('en-IN')] }))] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "bg-slate-50 text-slate-500 border-b border-slate-200", children: _jsxs("tr", { children: [_jsx("th", { className: "p-4 font-medium", children: "Item" }), _jsx("th", { className: "p-4 font-medium", children: "Description" }), _jsx("th", { className: "p-4 font-medium text-right", children: "Qty" }), _jsx("th", { className: "p-4 font-medium text-right", children: "Unit" }), _jsx("th", { className: "p-4 font-medium text-right", children: "Rate (\u20B9)" }), _jsx("th", { className: "p-4 font-medium text-right", children: "Amount (\u20B9)" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100", children: boq.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "p-12 text-center text-slate-400", children: "No estimate generated yet. Enter details to begin." }) })) : (boq.map((item, idx) => (_jsxs("tr", { className: "hover:bg-slate-50", children: [_jsx("td", { className: "p-4 font-medium text-slate-800", children: item.item }), _jsx("td", { className: "p-4 text-slate-600", children: item.description }), _jsx("td", { className: "p-4 text-right text-slate-700", children: item.quantity }), _jsx("td", { className: "p-4 text-right text-slate-500", children: item.unit }), _jsx("td", { className: "p-4 text-right text-slate-700", children: (item.rate || 0).toLocaleString('en-IN') }), _jsx("td", { className: "p-4 text-right font-medium text-slate-900", children: (item.amount || 0).toLocaleString('en-IN') })] }, idx)))) })] }) })] }) })] })] }));
};
export default CostEstimator;
