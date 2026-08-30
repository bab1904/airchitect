import React, { useState } from 'react';
import { generateBOQOptimization } from '../services/geminiService';
import { BOQItem, OptimizationSuggestion, Project } from '../types';
import { TrendingDown, ArrowRight, Zap, CheckCircle2, DollarSign, RefreshCw, Layers } from 'lucide-react';

interface BOQOptimizerProps {
  project: Project | null;
}

// Default Mock BOQ if none provided
const DEFAULT_BOQ: BOQItem[] = [
    { item: 'Wall Construction', description: 'Red Clay Bricks (Class 1)', quantity: 15000, unit: 'nos', rate: 10, amount: 150000 },
    { item: 'Plastering', description: 'Cement Mortar 1:6 for Internal Walls', quantity: 4000, unit: 'sqft', rate: 25, amount: 100000 },
    { item: 'Flooring', description: 'Italian Marble for Living/Dining', quantity: 800, unit: 'sqft', rate: 450, amount: 360000 },
    { item: 'Concrete', description: 'M25 Grade RMC for Slabs', quantity: 50, unit: 'cum', rate: 6500, amount: 325000 },
    { item: 'Windows', description: 'Teak Wood Frames & Shutters', quantity: 12, unit: 'nos', rate: 15000, amount: 180000 }
];

const BOQOptimizer: React.FC<BOQOptimizerProps> = ({ project }) => {
  const [boqItems] = useState<BOQItem[]>(DEFAULT_BOQ);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const calculateTotal = (items: BOQItem[]) => items.reduce((acc, item) => acc + (item.amount || 0), 0);
  const totalCost = calculateTotal(boqItems);

  const handleOptimize = async () => {
    setLoading(true);
    try {
        const location = project ? project.location : "Vijayawada, India";
        const result = await generateBOQOptimization(boqItems, location);
        setSuggestions(result);
    } catch (error) {
        console.error(error);
        alert("Optimization failed. Please check API connection.");
    } finally {
        setLoading(false);
    }
  };

  const potentialSavings = suggestions.reduce((acc, s) => acc + (s.potentialSavingsAmount || 0), 0);

  return (
    <div className="p-6 h-full flex flex-col gap-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Zap className="text-yellow-500" /> AI BOQ Optimizer
                </h2>
                <p className="text-sm text-slate-500">Value Engineering to reduce costs without compromising quality.</p>
            </div>
            {!loading && suggestions.length === 0 && (
                <button 
                    onClick={handleOptimize}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                    <RefreshCw size={18} /> Run Optimization
                </button>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* LEFT: Current BOQ */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <Layers size={18} /> Current Bill of Quantities
                    </h3>
                    <span className="font-mono font-bold text-slate-800">Total: ₹{(totalCost || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {boqItems.map((item, idx) => (
                        <div key={idx} className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 flex justify-between items-center">
                            <div>
                                <h4 className="font-semibold text-slate-800 text-sm">{item.item}</h4>
                                <p className="text-xs text-slate-500">{item.description}</p>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-sm">₹{(item.amount || 0).toLocaleString('en-IN')}</div>
                                <div className="text-xs text-slate-400">{item.quantity} {item.unit} @ ₹{item.rate}</div>
                            </div>
                        </div>
                    ))}
                    <div className="p-4 text-center text-xs text-slate-400 border-t border-dashed border-slate-200 mt-4">
                        (This is a sample BOQ. In production, this would pull from your Cost Estimator)
                    </div>
                </div>
            </div>

            {/* RIGHT: AI Suggestions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full relative">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <TrendingDown size={18} className="text-green-600" /> Optimization Report
                    </h3>
                    {suggestions.length > 0 && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                            Potential Savings: ₹{(potentialSavings || 0).toLocaleString('en-IN')}
                        </span>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            <p className="animate-pulse">Analyzing materials and market rates...</p>
                        </div>
                    ) : suggestions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <Zap size={64} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium">Ready to Optimize</p>
                            <p className="text-sm text-center max-w-xs mt-2">
                                AI will find alternative materials, better suppliers, and method changes to save costs.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {suggestions.map((suggestion) => (
                                <div key={suggestion.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                        SAVE {suggestion.savingsPercentage}%
                                    </div>
                                    
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="bg-indigo-50 p-2 rounded-lg">
                                            <RefreshCw size={20} className="text-indigo-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{suggestion.originalItem}</h4>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                <span className="line-through opacity-70">{suggestion.originalItem}</span>
                                                <ArrowRight size={12} />
                                                <span className="font-bold text-green-700 bg-green-50 px-1 rounded">{suggestion.proposedAlternative}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-slate-600 mb-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        {suggestion.reasoning}
                                    </p>
                                    
                                    <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <CheckCircle2 size={14} className="text-green-500" />
                                            Quality Maintained
                                        </div>
                                        <div className="font-bold text-green-600 flex items-center gap-1">
                                            <DollarSign size={14} />
                                            Save ₹{(suggestion.potentialSavingsAmount || 0).toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-2 text-[10px] text-slate-400">
                                        Strategy: {suggestion.implementationStrategy}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default BOQOptimizer;