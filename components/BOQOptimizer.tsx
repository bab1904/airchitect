import React, { useState } from 'react';
import { generateBOQOptimization } from '../services/geminiService';
import { BOQItem, OptimizationSuggestion, Project } from '../types';
import { TrendingDown, ArrowRight, Zap, RefreshCw, Layers, Check, Sparkles } from 'lucide-react';

interface BOQOptimizerProps {
  project: Project | null;
}

const DEFAULT_BOQ: BOQItem[] = [
  { item: 'Wall Construction', description: 'Red Clay Bricks (Class 1)', quantity: 15000, unit: 'nos', rate: 10, amount: 150000 },
  { item: 'Plastering', description: 'Cement Mortar 1:6 for Internal Walls', quantity: 4000, unit: 'sqft', rate: 25, amount: 100000 },
  { item: 'Flooring', description: 'Italian Marble for Living/Dining', quantity: 800, unit: 'sqft', rate: 450, amount: 360000 },
  { item: 'Concrete', description: 'M25 Grade RMC for Slabs', quantity: 50, unit: 'cum', rate: 6500, amount: 325000 },
  { item: 'Windows', description: 'Teak Wood Frames & Shutters', quantity: 12, unit: 'nos', rate: 15000, amount: 180000 }
];

const BOQOptimizer: React.FC<BOQOptimizerProps> = ({ project }) => {
  const [boqItems, setBoqItems] = useState<BOQItem[]>(DEFAULT_BOQ);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const calculateTotal = (items: BOQItem[]) => items.reduce((acc, item) => acc + (item.amount || 0), 0);
  const currentTotal = calculateTotal(boqItems);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const location = project ? project.location : "Vijayawada, India";
      const result = await generateBOQOptimization(boqItems, location);
      setSuggestions(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAlternative = (sug: OptimizationSuggestion) => {
    if (appliedIds.includes(sug.id)) return;

    setBoqItems(prev => prev.map(item => {
      if (item.description.toLowerCase().includes(sug.originalItem.toLowerCase().slice(0, 8)) ||
          item.item.toLowerCase().includes(sug.originalItem.toLowerCase().slice(0, 8))) {
        const discountedAmount = Math.round(item.amount * (1 - sug.savingsPercentage / 100));
        return {
          ...item,
          description: `${sug.proposedAlternative} (Optimized)`,
          amount: discountedAmount,
          rate: Math.round(discountedAmount / item.quantity)
        };
      }
      return item;
    }));

    setAppliedIds(prev => [...prev, sug.id]);
  };

  const potentialSavings = suggestions.reduce((acc, s) => acc + (s.potentialSavingsAmount || 0), 0);
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumSignificantDigits: 4
    }).format(val || 0);
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> Value Engineering
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded">Smart Material Substitutions</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Zap className="text-yellow-500" /> AI BOQ Smart Cost Optimizer
          </h1>
          <p className="text-sm text-slate-500">Analyze material specifications and discover high-performance alternative materials to reduce project expenditure.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleOptimize}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-xl transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? "Analyzing Materials..." : "Run AI Optimization"}
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Baseline BOQ Cost</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{formatCurrency(currentTotal)}</div>
          <p className="text-xs text-slate-500 mt-1">{boqItems.length} active material line items</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-5 rounded-2xl shadow-lg shadow-emerald-500/20">
          <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Identified Potential Savings</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {suggestions.length > 0 ? formatCurrency(potentialSavings) : "₹3,68,300"}
          </div>
          <p className="text-xs text-emerald-100 mt-1 flex items-center gap-1">
            <TrendingDown size={14} /> Up to 28% overall expenditure reduction
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applied Optimizations</span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">{appliedIds.length} / {suggestions.length || 4}</div>
          <p className="text-xs text-slate-500 mt-1">Alternatives synced into active BOQ</p>
        </div>
      </div>

      {/* Main Grid: Suggestions & Current BOQ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Suggestions (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Zap size={18} className="text-yellow-500" /> AI Value Engineering Recommendations
            </h3>
            {suggestions.length === 0 && !loading && (
              <span className="text-xs text-slate-400 italic">Click 'Run AI Optimization' to generate</span>
            )}
          </div>

          <div className="space-y-3">
            {(suggestions.length > 0 ? suggestions : [
              {
                id: 'OPT-01',
                originalItem: 'Red Clay Bricks (Class 1)',
                proposedAlternative: 'Autoclaved Aerated Concrete (AAC) Blocks',
                savingsPercentage: 22,
                potentialSavingsAmount: 33000,
                reasoning: 'AAC blocks require 70% less mortar, speed up wall masonry by 40%, and reduce dead load on RCC columns.',
                implementationStrategy: 'Replace internal 4" and external 8" wall specifications with 600x200x150mm Grade-1 AAC blocks with polymer adhesive.'
              },
              {
                id: 'OPT-02',
                originalItem: 'Italian Marble for Living/Dining',
                proposedAlternative: 'Glazed Vitrified Double-Charged GVT Tiles (800x1600mm)',
                savingsPercentage: 58,
                potentialSavingsAmount: 208800,
                reasoning: 'Large-format vitrified tiles replicate Italian marble veining with zero porosity, higher scratch resistance, and zero polishing downtime.',
                implementationStrategy: 'Procure 800x1600mm Statuario gloss vitrified tiles from local distributor.'
              },
              {
                id: 'OPT-03',
                originalItem: 'Teak Wood Frames & Shutters',
                proposedAlternative: 'Reinforced UPVC / Thermal Break Aluminum Windows',
                savingsPercentage: 45,
                potentialSavingsAmount: 81000,
                reasoning: 'UPVC windows provide 100% termite proofing, superior sound insulation (35dB reduction), and zero painting maintenance.',
                implementationStrategy: 'Standardize opening sizes to modular dimensions and order factory-glazed 3-track sliding UPVC systems.'
              }
            ]).map(sug => {
              const isApplied = appliedIds.includes(sug.id);

              return (
                <div 
                  key={sug.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isApplied 
                      ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-200' 
                      : 'bg-white border-slate-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">{sug.id}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="line-through text-slate-400 font-semibold text-xs">{sug.originalItem}</span>
                        <ArrowRight size={14} className="text-slate-400" />
                        <span className="font-bold text-slate-900 text-sm text-indigo-700">{sug.proposedAlternative}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                        -{sug.savingsPercentage}% (Save {formatCurrency(sug.potentialSavingsAmount)})
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{sug.reasoning}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 italic max-w-sm truncate">
                      Strategy: {sug.implementationStrategy}
                    </span>
                    <button
                      onClick={() => handleApplyAlternative(sug)}
                      disabled={isApplied}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isApplied 
                          ? 'bg-emerald-600 text-white cursor-default' 
                          : 'bg-slate-900 hover:bg-indigo-600 text-white shadow-sm hover:shadow'
                      }`}
                    >
                      {isApplied ? <Check size={14} /> : <Zap size={14} />}
                      {isApplied ? "Applied to BOQ" : "Apply Substitution"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Live BOQ Table (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Layers size={16} className="text-indigo-600" /> Live BOQ Summary
              </h3>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                Total: {formatCurrency(currentTotal)}
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
              {boqItems.map((item, idx) => (
                <div key={idx} className="p-3.5 hover:bg-slate-50 text-xs flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="font-bold text-slate-800 block truncate">{item.item}</span>
                    <span className="text-[11px] text-slate-500 truncate block">{item.description}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.quantity} {item.unit} @ ₹{item.rate}/{item.unit}
                    </span>
                  </div>
                  <div className="font-mono font-bold text-slate-900 text-right shrink-0">
                    {formatCurrency(item.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BOQOptimizer;