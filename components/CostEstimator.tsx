import React, { useState, useEffect } from 'react';
import { generateBOQ } from '../services/geminiService';
import { BOQItem } from '../types';
import { Calculator, FileText, Download, Plus, Trash2, Sparkles, RefreshCw } from 'lucide-react';

const PRESET_SCOPES = [
  {
    title: "1500 sqft Complete Structure",
    desc: "Complete turnkey construction of a 1500 sqft residential G+1 building including excavation, RCC columns, slab casting, AAC block masonry, plastering, electrical, plumbing, and vitrified tiles."
  },
  {
    title: "10x10ft Brick Wall Masonry",
    desc: "Construction of a 10x10ft red clay brick wall (9-inch thickness) in cement mortar 1:6, plastered on both internal and external sides with curing."
  },
  {
    title: "RCC Roof Slab Casting",
    desc: "Reinforced cement concrete (RCC) roof slab casting for 1200 sqft area using M25 grade RMC concrete, Fe-550D TMT reinforcement steel, and waterproof shuttering."
  },
  {
    title: "2BHK Interior Painting",
    desc: "Interior painting for a 2BHK apartment (approx 2800 sqft wall surface) with 2 coats of acrylic emulsion over 2 coats of wall putty and primer."
  }
];

const CostEstimator: React.FC = () => {
  const [description, setDescription] = useState(PRESET_SCOPES[0].desc);
  const [boq, setBoq] = useState<BOQItem[]>([]);
  const [loading, setLoading] = useState(false);

  // New item inputs
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [newItemUnit, setNewItemUnit] = useState('sqft');
  const [newItemRate, setNewItemRate] = useState<number>(100);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    handleEstimate(PRESET_SCOPES[0].desc);
  }, []);

  const calculateTotal = () => boq.reduce((acc, item) => acc + (item.amount || 0), 0);

  const handleEstimate = async (customDesc?: string) => {
    const textToEstimate = customDesc || description;
    if (!textToEstimate) return;
    setLoading(true);
    try {
      const data = await generateBOQ(textToEstimate + " (Use Indian Rupees INR for rates)");
      setBoq(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;
    const newItem: BOQItem = {
      item: newItemName,
      description: `Manual line item: ${newItemName}`,
      quantity: Number(newItemQty) || 1,
      unit: newItemUnit,
      rate: Number(newItemRate) || 0,
      amount: (Number(newItemQty) || 1) * (Number(newItemRate) || 0)
    };
    setBoq(prev => [...prev, newItem]);
    setNewItemName('');
    setNewItemQty(1);
    setNewItemRate(100);
    setShowAddModal(false);
  };

  const handleDeleteItem = (index: number) => {
    setBoq(prev => prev.filter((_, i) => i !== index));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumSignificantDigits: 4
    }).format(val || 0);
  };

  const exportCSV = () => {
    if (boq.length === 0) return;
    const headers = "Item,Description,Quantity,Unit,Rate (INR),Amount (INR)\n";
    const rows = boq.map(b => `"${b.item}","${b.description}",${b.quantity},"${b.unit}",${b.rate},${b.amount}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BOQ_Cost_Estimate_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> AI Quantity Surveyor
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded">Indian Standard Rates 2026</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Calculator className="text-emerald-600" /> Smart Cost Estimator &amp; BOQ Generator
          </h1>
          <p className="text-sm text-slate-500">Provide any construction description or scope to instantly calculate material quantities, market rates, and budgets.</p>
        </div>

        <div className="flex items-center gap-3">
          {boq.length > 0 && (
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm"
            >
              <Download size={15} /> Export BOQ CSV
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scope & Presets (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Scope Presets</span>
            <div className="space-y-2">
              {PRESET_SCOPES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDescription(preset.desc);
                    handleEstimate(preset.desc);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all text-xs font-semibold text-slate-800 truncate"
                >
                  <span className="font-bold text-slate-900 block truncate">{preset.title}</span>
                  <span className="text-[10px] text-slate-500 truncate block">{preset.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Custom Scope Description</label>
            <textarea
              className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[140px] bg-slate-50 text-slate-900 placeholder-slate-400 text-xs resize-none"
              placeholder="Describe work (e.g. 2000 sqft commercial tile flooring, painting, brickwork)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              onClick={() => handleEstimate()}
              disabled={loading || !description}
              className={`w-full py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                loading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Calculating Quantities &amp; Rates...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Calculate Bill of Quantities
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: BOQ Table (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-800">
                  Itemized Bill of Quantities ({boq.length} Items)
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddModal(!showAddModal)}
                  className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-xs flex items-center gap-1 border border-emerald-200"
                >
                  <Plus size={14} /> Add Item
                </button>
                <div className="bg-emerald-600 text-white px-3 py-1 rounded-lg font-bold text-xs shadow-sm flex items-center gap-1">
                  <span>Total:</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>

            {/* Add Item Form Drawer */}
            {showAddModal && (
              <form onSubmit={handleAddItem} className="p-4 bg-emerald-50/70 border-b border-emerald-200 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs animate-fade-in">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scaffolding rental"
                    value={newItemName}
                    onChange={e => setNewItemName(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={newItemQty}
                    onChange={e => setNewItemQty(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Unit</label>
                  <input
                    type="text"
                    value={newItemUnit}
                    onChange={e => setNewItemUnit(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Rate (₹)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      value={newItemRate}
                      onChange={e => setNewItemRate(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                    <button
                      type="submit"
                      className="bg-emerald-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-emerald-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Table */}
            <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 text-slate-500 font-semibold sticky top-0 backdrop-blur-md">
                  <tr>
                    <th className="py-2.5 px-3">Item &amp; Description</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3 text-right">Rate (₹)</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                    <th className="py-2.5 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {boq.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{row.item}</div>
                        <div className="text-[11px] text-slate-500">{row.description}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-700">
                        {row.quantity.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                        {row.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                        ₹{row.rate.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                        {formatCurrency(row.amount)}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => handleDeleteItem(idx)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                          title="Delete item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {boq.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No BOQ items calculated yet. Click "Calculate Bill of Quantities" above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Total Footer */}
            {boq.length > 0 && (
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">ESTIMATED TOTAL BUDGET</span>
                  <span className="text-xs text-emerald-400 font-mono">Includes standard labor &amp; material contingencies</span>
                </div>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {formatCurrency(calculateTotal())}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostEstimator;