import React, { useState } from 'react';
import { generateBOQOptimization } from '../services/geminiService';
import { BOQItem, OptimizationSuggestion, Project } from '../types';
import { 
  TrendingDown, 
  ArrowRight, 
  Zap, 
  RefreshCw, 
  Layers, 
  Check, 
  Sparkles, 
  Clock, 
  Gauge, 
  Droplet, 
  SlidersHorizontal,
  Flame,
  Building
} from 'lucide-react';

interface BOQOptimizerProps {
  project: Project | null;
}

const DEFAULT_BOQ: BOQItem[] = [
  { item: 'Wall Masonry', description: 'Red Clay Bricks (Class 1) & Sand-Cement Mortar', quantity: 15000, unit: 'nos', rate: 10, amount: 150000 },
  { item: 'Internal Partitions', description: 'Internal Brick Partition Walls (4.5" Single Brick)', quantity: 3500, unit: 'sqft', rate: 45, amount: 157500 },
  { item: 'Structural Concrete', description: 'M25 Grade Site-Mixed Concrete (14-Day De-shuttering)', quantity: 50, unit: 'cum', rate: 6500, amount: 325000 },
  { item: 'Internal Plastering', description: 'Traditional 2-Coat Sand Plaster + POP Punning', quantity: 4000, unit: 'sqft', rate: 25, amount: 100000 },
  { item: 'Flooring Finish', description: 'Italian Marble for Living/Dining (Polishing & Wet Laying)', quantity: 800, unit: 'sqft', rate: 450, amount: 360000 },
  { item: 'Windows & Glazing', description: 'Custom Teak Wood Frames & Site-Fabricated Shutters', quantity: 12, unit: 'nos', rate: 15000, amount: 180000 }
];

const INITIAL_SUGGESTIONS: OptimizationSuggestion[] = [
  {
    id: 'OPT-MAS-01',
    category: 'Masonry',
    optimizationType: 'BALANCED',
    originalItem: 'Red Clay Bricks (Class 1) & Sand-Cement Mortar',
    proposedAlternative: 'Autoclaved Aerated Concrete (AAC) Blocks + Thin-Bed Jointing Adhesive',
    savingsPercentage: 24,
    potentialSavingsAmount: 36000,
    timeSavedDays: 18,
    speedMultiplier: '3.5x Faster Masonry',
    laborEfficiency: '140 sqft/day vs 45 sqft/day per mason',
    curingReductionDays: 14,
    reasoning: 'AAC blocks are 8x larger than traditional bricks, requiring 75% fewer joints. Using polymer-modified thin-bed adhesive eliminates 14 days of water curing, allows immediate subsequent plastering, and reduces structural dead load by 50%.',
    implementationStrategy: 'Replace traditional 9" and 4.5" red brick masonry with 600x200x150mm Grade-1 AAC blocks laid with 3mm polymer mortar.',
    timeOptimizationDetails: {
      speedBoost: '3.5x Speed Factor',
      curingTimeDays: 0,
      traditionalCuringDays: 14,
      laborProductivity: '1 Mason lays 140 sqft/day (vs 45 sqft with bricks)',
      scheduleImpact: 'Cuts overall wall construction cycle by 18 days'
    }
  },
  {
    id: 'OPT-MAS-02',
    category: 'Masonry',
    optimizationType: 'TIME',
    originalItem: 'Internal Brick Partition Walls (4.5" Single Brick)',
    proposedAlternative: 'Precast Lightweight ALC / Concrete Interlocking Wall Panels',
    savingsPercentage: 12,
    potentialSavingsAmount: 18000,
    timeSavedDays: 24,
    speedMultiplier: '5.0x Faster Installation',
    laborEfficiency: '300 sqft/day per 2-worker crew',
    curingReductionDays: 21,
    reasoning: 'Tongue-and-groove precast lightweight panels erect dry in minutes. Arrives pre-finished with a smooth surface, completely eliminating both internal sand-cement plastering and 21 days of water curing.',
    implementationStrategy: 'Install 75mm fiber-reinforced autoclaved lightweight panels for internal non-loadbearing room partitions.',
    timeOptimizationDetails: {
      speedBoost: '5.0x Speed Factor',
      curingTimeDays: 0,
      traditionalCuringDays: 21,
      laborProductivity: '2 Workers install 300 sqft/day with dry jointing',
      scheduleImpact: 'Eliminates internal plastering phase entirely (saves 24 days)'
    }
  },
  {
    id: 'OPT-CON-01',
    category: 'Concrete',
    optimizationType: 'TIME',
    originalItem: 'M25 Grade Site-Mixed Concrete (14-Day De-shuttering)',
    proposedAlternative: 'Rapid-Hardening RMC with Accelerating Superplasticizers (M35 Grade)',
    savingsPercentage: 10,
    potentialSavingsAmount: 32500,
    timeSavedDays: 12,
    speedMultiplier: '2.5x Faster Slab Cycle',
    laborEfficiency: 'Pour 50 cum in 4 hours vs 2 days manual mixing',
    curingReductionDays: 7,
    reasoning: 'High-early-strength concrete achieves 70% design strength in 72 hours using third-generation polycarboxylate ethers, reducing slab shuttering cycle time from 14 days down to 4–5 days.',
    implementationStrategy: 'Schedule ready-mix batching with boom placer pumps for 4-day early formwork stripping.',
    timeOptimizationDetails: {
      speedBoost: '2.5x Formwork Turnover',
      curingTimeDays: 4,
      traditionalCuringDays: 14,
      laborProductivity: 'Complete roof pour in 4 hours via boom pump',
      scheduleImpact: 'Shaves 12 days per elevated slab level'
    }
  },
  {
    id: 'OPT-PLAS-01',
    category: 'Finishing / Plaster',
    optimizationType: 'BALANCED',
    originalItem: 'Traditional 2-Coat Sand Plaster + POP Punning',
    proposedAlternative: 'Direct One-Coat Gypsum Machine Spray Plaster',
    savingsPercentage: 32,
    potentialSavingsAmount: 32000,
    timeSavedDays: 14,
    speedMultiplier: '4.0x Faster Application',
    laborEfficiency: '1 Plasterer finishes 450 sqft/day vs 100 sqft/day',
    curingReductionDays: 10,
    reasoning: 'One-coat gypsum plaster is applied directly over AAC/RCC blocks without sand preparation. Delivers direct paint-ready finish in a single pass with zero water curing and no shrinkage cracks.',
    implementationStrategy: 'Deploy mobile spray plastering machines for continuous internal wall application.',
    timeOptimizationDetails: {
      speedBoost: '4.0x Speed Factor',
      curingTimeDays: 0,
      traditionalCuringDays: 10,
      laborProductivity: '450 sqft/day per applicator',
      scheduleImpact: 'Saves 14 days and allows painting work to start 2 weeks early'
    }
  },
  {
    id: 'OPT-FLR-01',
    category: 'Flooring',
    optimizationType: 'COST',
    originalItem: 'Italian Marble for Living/Dining (Polishing & Wet Laying)',
    proposedAlternative: 'Glazed Vitrified Double-Charged GVT Tiles (800x1600mm)',
    savingsPercentage: 58,
    potentialSavingsAmount: 208800,
    timeSavedDays: 8,
    speedMultiplier: '2.0x Faster Tiling',
    laborEfficiency: 'Tile laying in 2 days vs 10 days diamond polishing',
    curingReductionDays: 0,
    reasoning: 'Large-format vitrified slabs duplicate Italian marble aesthetics with pre-polished factory gloss, eliminating lengthy on-site multi-grit diamond polishing and slurry mess.',
    implementationStrategy: 'Procure 800x1600mm Statuario book-match gloss vitrified tiles laid with rapid-set tile adhesive.',
    timeOptimizationDetails: {
      speedBoost: '2.0x Speed Factor',
      curingTimeDays: 1,
      traditionalCuringDays: 8,
      laborProductivity: 'Complete 800 sqft floor in 2 days',
      scheduleImpact: 'Walkable floor in 24 hours (saves 8 days)'
    }
  },
  {
    id: 'OPT-WIN-01',
    category: 'Joinery / Windows',
    optimizationType: 'BALANCED',
    originalItem: 'Custom Teak Wood Frames & Site-Fabricated Shutters',
    proposedAlternative: 'Factory-Prefabricated Multi-Chamber UPVC Sliding Systems',
    savingsPercentage: 45,
    potentialSavingsAmount: 81000,
    timeSavedDays: 10,
    speedMultiplier: '3.0x Faster Installation',
    laborEfficiency: 'Drop-in anchor fastening in 30 mins per window',
    curingReductionDays: 0,
    reasoning: 'Factory-glazed UPVC window units arrive finished with hardware and weather-stripping. Installs into masonry rough openings in 30 minutes with expansion foam vs weeks of carpentry and painting.',
    implementationStrategy: 'Standardize architectural rough openings to modular dimensions for 1-day site drop-in installation.',
    timeOptimizationDetails: {
      speedBoost: '3.0x Installation Speed',
      curingTimeDays: 0,
      traditionalCuringDays: 0,
      laborProductivity: 'Install 12 windows in 1 single workday',
      scheduleImpact: 'Eliminates wood polishing and seasoning delays (saves 10 days)'
    }
  }
];

const MASONRY_COMPARISON_MATRIX = [
  {
    type: 'Traditional Red Clay Bricks',
    speed: '40 - 50 sqft / day',
    curing: '14 - 21 Days (Water)',
    mortar: '1:6 Sand-Cement (12mm)',
    deadLoad: '1900 kg / m³ (Heavy)',
    timeRating: 'Slow (Baseline)',
    costRating: 'Moderate'
  },
  {
    type: 'AAC Blocks + Polymer Adhesive',
    speed: '130 - 160 sqft / day (3.5x)',
    curing: '0 Days (Self-Curing)',
    mortar: '3mm Thin-Bed Polymer',
    deadLoad: '600 kg / m³ (68% Lighter)',
    timeRating: '⚡ Fast (18 Days Saved)',
    costRating: '💰 24% Cheaper'
  },
  {
    type: 'Precast ALC Wall Panels',
    speed: '300 - 350 sqft / day (5x)',
    curing: '0 Days (Dry Joint)',
    mortar: 'Tongue & Groove Dry Seal',
    deadLoad: '700 kg / m³ (Lightweight)',
    timeRating: '🚀 Ultra-Fast (24 Days Saved)',
    costRating: '💰 12% Cheaper'
  },
  {
    type: 'Gypsum / Fiber Cement Drywall',
    speed: '400 sqft / day (6x)',
    curing: '0 Days (Dry System)',
    mortar: 'Stud Framing & Joint Tape',
    deadLoad: '350 kg / m³ (Ultra-Light)',
    timeRating: '⚡⚡ Instant Partition',
    costRating: 'Neutral'
  }
];

const BOQOptimizer: React.FC<BOQOptimizerProps> = ({ project }) => {
  const [boqItems, setBoqItems] = useState<BOQItem[]>(DEFAULT_BOQ);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>(INITIAL_SUGGESTIONS);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'TIME' | 'COST' | 'MASONRY'>('ALL');
  const [showMatrix, setShowMatrix] = useState(false);

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
          description: `${sug.proposedAlternative} (Speed & Cost Optimized)`,
          amount: discountedAmount,
          rate: Math.round(discountedAmount / item.quantity)
        };
      }
      return item;
    }));

    setAppliedIds(prev => [...prev, sug.id]);
  };

  // Filter suggestions
  const filteredSuggestions = suggestions.filter(sug => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'TIME') return sug.optimizationType === 'TIME' || (sug.timeSavedDays && sug.timeSavedDays >= 12);
    if (activeFilter === 'COST') return sug.optimizationType === 'COST' || sug.savingsPercentage >= 25;
    if (activeFilter === 'MASONRY') return sug.category === 'Masonry' || sug.originalItem.toLowerCase().includes('brick') || sug.originalItem.toLowerCase().includes('wall');
    return true;
  });

  const totalPotentialSavings = suggestions.reduce((acc, s) => acc + (s.potentialSavingsAmount || 0), 0);
  const totalDaysSaved = suggestions.reduce((acc, s) => acc + (s.timeSavedDays || 0), 0);
  const totalCuringDaysEliminated = suggestions.reduce((acc, s) => acc + (s.curingReductionDays || 0), 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumSignificantDigits: 4
    }).format(val || 0);
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> Dual Value &amp; Speed Engineering
            </span>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded">
              Cost + Fast-Track Timeline Optimizer
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Zap className="text-amber-500" /> AI BOQ Smart Cost &amp; Time Optimizer
          </h1>
          <p className="text-sm text-slate-500">
            Discover advanced masonry alternatives (AAC blocks, ALC precast panels, thin-bed adhesives) and rapid-hardening materials to cut project duration and expenditure simultaneously.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowMatrix(!showMatrix)}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Building size={14} className="text-indigo-600" />
            {showMatrix ? "Hide Masonry Matrix" : "Masonry Speed Matrix"}
          </button>

          <button 
            onClick={handleOptimize}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-xl transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? "Analyzing BOQ & Timeline..." : "Run AI Dual Optimization"}
          </button>
        </div>
      </div>

      {/* 4-Column High-Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Baseline BOQ */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Baseline BOQ Cost</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{formatCurrency(currentTotal)}</div>
          <p className="text-xs text-slate-500 mt-1">{boqItems.length} active material line items</p>
        </div>

        {/* Card 2: Cost Savings Identified */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-5 rounded-2xl shadow-lg shadow-emerald-600/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider">Identified Cost Savings</span>
            <TrendingDown size={18} className="text-emerald-200" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">
            {formatCurrency(totalPotentialSavings)}
          </div>
          <p className="text-xs text-emerald-100 mt-1 font-medium">
            Up to 32% overall expenditure reduction
          </p>
        </div>

        {/* Card 3: Project Time Acceleration (New) */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-800 text-white p-5 rounded-2xl shadow-lg shadow-indigo-600/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-100 uppercase tracking-wider">Timeline Acceleration</span>
            <Clock size={18} className="text-indigo-200" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">
            -{totalDaysSaved} Days Saved
          </div>
          <p className="text-xs text-indigo-100 mt-1 font-medium flex items-center gap-1">
            <Gauge size={13} /> Up to 3.8x faster critical path
          </p>
        </div>

        {/* Card 4: Water Curing Days Eliminated (New) */}
        <div className="bg-gradient-to-br from-sky-600 to-cyan-800 text-white p-5 rounded-2xl shadow-lg shadow-sky-600/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-sky-100 uppercase tracking-wider">Curing Downtime Saved</span>
            <Droplet size={18} className="text-sky-200" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">
            -{totalCuringDaysEliminated} Curing Days
          </div>
          <p className="text-xs text-sky-100 mt-1 font-medium">
            Zero-curing polymer &amp; dry tech
          </p>
        </div>
      </div>

      {/* Interactive Fast-Track Masonry Speed Comparison Matrix (Collapsible) */}
      {showMatrix && (
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-2xl border border-slate-800 animate-fade-in space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-600/30 text-indigo-400 rounded-lg">
                <Building size={18} />
              </span>
              <div>
                <h3 className="font-bold text-base text-white">Masonry &amp; Partition Speed Comparison Matrix</h3>
                <p className="text-xs text-slate-400">Benchmarking traditional red brickwork against modern high-speed walling technologies</p>
              </div>
            </div>
            <span className="text-xs bg-indigo-950 text-indigo-300 px-3 py-1 rounded-full border border-indigo-800 font-mono font-bold">
              Target: Fast-Track Delivery
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-300 font-bold uppercase tracking-wider border-b border-slate-700">
                <tr>
                  <th className="p-3">Wall Material &amp; Method</th>
                  <th className="p-3">Erection Speed</th>
                  <th className="p-3">Water Curing Time</th>
                  <th className="p-3">Jointing &amp; Plastering</th>
                  <th className="p-3">Dead Load Weight</th>
                  <th className="p-3">Schedule Impact</th>
                  <th className="p-3">Cost Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {MASONRY_COMPARISON_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-red-400' : idx === 1 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                      {row.type}
                    </td>
                    <td className="p-3 font-mono text-indigo-300 font-bold">{row.speed}</td>
                    <td className="p-3">{row.curing}</td>
                    <td className="p-3 text-slate-400">{row.mortar}</td>
                    <td className="p-3 text-slate-400">{row.deadLoad}</td>
                    <td className="p-3 font-semibold text-amber-300">{row.timeRating}</td>
                    <td className="p-3 font-bold text-emerald-400">{row.costRating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Strategy Mode Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Optimization Filter:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Recommendations ({suggestions.length})
          </button>

          <button
            onClick={() => setActiveFilter('MASONRY')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeFilter === 'MASONRY'
                ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-300'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Building size={14} /> Fast-Track Masonry ({suggestions.filter(s => s.category === 'Masonry').length})
          </button>

          <button
            onClick={() => setActiveFilter('TIME')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeFilter === 'TIME'
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <Clock size={14} /> Time Optimizers (Speed First)
          </button>

          <button
            onClick={() => setActiveFilter('COST')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeFilter === 'COST'
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <TrendingDown size={14} /> Cost Savers (Value Eng)
          </button>
        </div>
      </div>

      {/* Main Grid: Suggestions & Current BOQ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Suggestions (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Zap size={18} className="text-amber-500" /> Value &amp; Speed Engineering Suggestions
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Showing {filteredSuggestions.length} of {suggestions.length} items
            </span>
          </div>

          <div className="space-y-4">
            {filteredSuggestions.map(sug => {
              const isApplied = appliedIds.includes(sug.id);

              return (
                <div 
                  key={sug.id}
                  className={`p-5 rounded-2xl border transition-all duration-200 ${
                    isApplied 
                      ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-200 shadow-sm' 
                      : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md'
                  }`}
                >
                  {/* Top Row: Category & Badges */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {sug.id}
                        </span>
                        {sug.category && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {sug.category}
                          </span>
                        )}
                        {sug.optimizationType === 'TIME' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 flex items-center gap-1">
                            <Clock size={10} /> Fast-Track Speed
                          </span>
                        )}
                        {sug.optimizationType === 'BALANCED' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                            <Flame size={10} /> Speed + Cost Optimized
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="line-through text-slate-400 font-semibold text-xs">{sug.originalItem}</span>
                        <ArrowRight size={14} className="text-slate-400 shrink-0" />
                        <span className="font-bold text-slate-900 text-sm text-indigo-700">{sug.proposedAlternative}</span>
                      </div>
                    </div>

                    {/* Dual Metrics Pill */}
                    <div className="text-right shrink-0 space-y-1">
                      {sug.timeSavedDays && sug.timeSavedDays > 0 && (
                        <div className="bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 justify-end">
                          <Clock size={12} /> -{sug.timeSavedDays} Days ({sug.speedMultiplier || 'Accelerated'})
                        </div>
                      )}
                      <div className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 justify-end">
                        <TrendingDown size={12} /> -{sug.savingsPercentage}% (Save {formatCurrency(sug.potentialSavingsAmount)})
                      </div>
                    </div>
                  </div>

                  {/* Speed & Productivity Spec Box */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 my-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Gauge size={14} className="text-indigo-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Labor Efficiency</span>
                        <span className="font-bold text-slate-800 text-xs">{sug.laborEfficiency || 'Increased output per crew'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Droplet size={14} className="text-sky-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Water Curing Downtime</span>
                        <span className="font-bold text-slate-800 text-xs">
                          {sug.curingReductionDays && sug.curingReductionDays > 0 
                            ? `-${sug.curingReductionDays} Days Eliminated (Zero Wet Curing)` 
                            : 'Standard Rapid Curing'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Rationale */}
                  <p className="text-xs text-slate-600 leading-relaxed">{sug.reasoning}</p>

                  {/* Strategy Footer & Action */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500 italic max-w-md truncate">
                      Strategy: {sug.implementationStrategy}
                    </span>
                    <button
                      onClick={() => handleApplyAlternative(sug)}
                      disabled={isApplied}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0 ${
                        isApplied 
                          ? 'bg-emerald-600 text-white cursor-default shadow-xs' 
                          : 'bg-slate-900 hover:bg-indigo-600 text-white shadow-sm hover:shadow'
                      }`}
                    >
                      {isApplied ? <Check size={14} /> : <Zap size={14} />}
                      {isApplied ? "Applied to BOQ & Timeline" : "Apply to BOQ & Schedule"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Live BOQ & Timeline Schedule Impact Table (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Cumulative Schedule Acceleration Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-xl border border-indigo-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={14} /> Project Fast-Track Impact
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                {appliedIds.length} Optimizations Active
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Schedule Duration Reduced:</span>
                <span className="font-mono font-bold text-amber-300">
                  -{appliedIds.length > 0 ? appliedIds.length * 14 : 0} Days
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Masonry &amp; Partition Acceleration:</span>
                <span className="font-mono font-bold text-emerald-300">3.5x - 5.0x Speed</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Direct BOQ Cost Saved:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatCurrency(DEFAULT_BOQ.reduce((a,b)=>a+b.amount,0) - currentTotal)}
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((appliedIds.length / suggestions.length) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Live BOQ Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Layers size={16} className="text-indigo-600" /> Live BOQ Summary
              </h3>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                Total: {formatCurrency(currentTotal)}
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {boqItems.map((item, idx) => (
                <div key={idx} className="p-3.5 hover:bg-slate-50 text-xs flex items-center justify-between transition-colors">
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