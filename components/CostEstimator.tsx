import React, { useState } from 'react';
import { generateBOQ } from '../services/geminiService';
import { BOQItem } from '../types';
import { Calculator, IndianRupee, FileText } from 'lucide-react';

const CostEstimator: React.FC = () => {
  const [description, setDescription] = useState('');
  const [boq, setBoq] = useState<BOQItem[]>([]);
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => boq.reduce((acc, item) => acc + (item.amount || 0), 0);

  const handleEstimate = async () => {
    if (!description) return;
    setLoading(true);
    try {
      const data = await generateBOQ(description + " (Use Indian Rupees INR for rates)");
      setBoq(data);
    } catch (e) {
      console.error(e);
      alert('Failed to generate estimate. Please try again or check API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6">
       <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Calculator className="text-green-600" /> Smart Cost Estimator
       </h2>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Scope</label>
                <textarea
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[200px] bg-white text-slate-900 placeholder-slate-400"
                    placeholder="Describe the construction work (e.g., Construction of a 10x10ft brick wall, plastered on both sides)..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button
                    onClick={handleEstimate}
                    disabled={loading || !description}
                    className={`mt-4 w-full py-3 rounded-lg text-white font-medium transition-all ${
                        loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700 shadow-md'
                    }`}
                >
                    {loading ? 'Analyzing Scope...' : 'Generate Estimate'}
                </button>
              </div>
          </div>

          <div className="lg:col-span-2">
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                        <FileText size={18} /> Bill of Quantities (BoQ)
                    </h3>
                    {boq.length > 0 && (
                        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                            <IndianRupee size={14} /> Total: {calculateTotal().toLocaleString('en-IN')}
                        </div>
                    )}
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-medium">Item</th>
                                <th className="p-4 font-medium">Description</th>
                                <th className="p-4 font-medium text-right">Qty</th>
                                <th className="p-4 font-medium text-right">Unit</th>
                                <th className="p-4 font-medium text-right">Rate (₹)</th>
                                <th className="p-4 font-medium text-right">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {boq.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-slate-400">
                                        No estimate generated yet. Enter details to begin.
                                    </td>
                                </tr>
                            ) : (
                                boq.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="p-4 font-medium text-slate-800">{item.item}</td>
                                        <td className="p-4 text-slate-600">{item.description}</td>
                                        <td className="p-4 text-right text-slate-700">{item.quantity}</td>
                                        <td className="p-4 text-right text-slate-500">{item.unit}</td>
                                        <td className="p-4 text-right text-slate-700">{(item.rate || 0).toLocaleString('en-IN')}</td>
                                        <td className="p-4 text-right font-medium text-slate-900">{(item.amount || 0).toLocaleString('en-IN')}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default CostEstimator;