import React, { useState } from 'react';
import { runComplianceCheck } from '../services/geminiService';
import { Project, ComplianceReport } from '../types';
import { BookOpen, CheckCircle, XCircle, AlertTriangle, Activity, Ruler, Wind, Flame } from 'lucide-react';

interface CodeComplianceProps {
  project: Project | null;
}

const CodeCompliance: React.FC<CodeComplianceProps> = ({ project }) => {
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [plotArea, setPlotArea] = useState('200'); // sq yards
  const [buildingHeight, setBuildingHeight] = useState('12'); // meters
  const [occupancy, setOccupancy] = useState('Residential');
  const [frontSetback, setFrontSetback] = useState('2.5');
  const [rearSetback, setRearSetback] = useState('1.5');
  const [sideSetback1, setSideSetback1] = useState('1.5');
  const [sideSetback2, setSideSetback2] = useState('1.5');
  const [roadWidth, setRoadWidth] = useState('30'); // feet
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleCheck = async () => {
    setLoading(true);
    try {
        const params = {
            projectLocation: project ? project.location : "Vijayawada, Andhra Pradesh",
            plotAreaSqYards: plotArea,
            buildingHeightMeters: buildingHeight,
            occupancyType: occupancy,
            roadWidthFeet: roadWidth,
            providedSetbacks: {
                front: frontSetback + "m",
                rear: rearSetback + "m",
                side1: sideSetback1 + "m",
                side2: sideSetback2 + "m"
            },
            description: additionalNotes || "Standard construction with staircase and ventilation."
        };
        
        const result = await runComplianceCheck(params);
        setReport(result);
    } catch (error) {
        console.error(error);
        alert("Failed to run compliance check.");
    } finally {
        setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Pass': return 'text-green-600 bg-green-50 border-green-200';
          case 'Fail': return 'text-red-600 bg-red-50 border-red-200';
          case 'Warning': return 'text-amber-600 bg-amber-50 border-amber-200';
          default: return 'text-slate-600 bg-slate-50';
      }
  };

  const getOverallBadge = (status: string) => {
    if (status === 'Compliant') return <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold border border-green-200 flex items-center gap-2"><CheckCircle size={16} /> Compliant</span>;
    if (status === 'Non-Compliant') return <span className="bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-bold border border-red-200 flex items-center gap-2"><XCircle size={16} /> Violation Detected</span>;
    return <span className="bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-sm font-bold border border-amber-200 flex items-center gap-2"><AlertTriangle size={16} /> Conditional</span>;
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="text-blue-600" /> AI Building Code Checker
                </h2>
                <p className="text-sm text-slate-500">Auto-verification against VMC, APCRDA, and NBC 2016 norms.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* INPUT FORM */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Ruler size={18} /> Building Parameters
                </h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Occupancy</label>
                            <select value={occupancy} onChange={e => setOccupancy(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-white text-slate-900">
                                <option value="Residential">Residential</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Institutional">Institutional</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Plot Area (Sq Yd)</label>
                            <input type="number" value={plotArea} onChange={e => setPlotArea(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-white text-slate-900" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Height (m)</label>
                            <input type="number" value={buildingHeight} onChange={e => setBuildingHeight(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-white text-slate-900" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Road Width (ft)</label>
                            <input type="number" value={roadWidth} onChange={e => setRoadWidth(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-white text-slate-900" />
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                        <label className="block text-xs font-bold text-slate-700 mb-2">Setbacks Provided (Meters)</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] text-slate-500">Front</label>
                                <input type="number" step="0.1" value={frontSetback} onChange={e => setFrontSetback(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-white text-slate-900" />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500">Rear</label>
                                <input type="number" step="0.1" value={rearSetback} onChange={e => setRearSetback(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-white text-slate-900" />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500">Side 1</label>
                                <input type="number" step="0.1" value={sideSetback1} onChange={e => setSideSetback1(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-white text-slate-900" />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500">Side 2</label>
                                <input type="number" step="0.1" value={sideSetback2} onChange={e => setSideSetback2(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-white text-slate-900" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Additional Details (Stairs/Ventilation)</label>
                        <textarea 
                            value={additionalNotes} 
                            onChange={e => setAdditionalNotes(e.target.value)} 
                            className="w-full p-2 border rounded-lg text-sm h-20 bg-white text-slate-900"
                            placeholder="e.g. Staircase width 1m, window area 15% of floor."
                        ></textarea>
                    </div>

                    <button 
                        onClick={handleCheck}
                        disabled={loading}
                        className={`w-full py-3 rounded-lg text-white font-bold flex items-center justify-center gap-2 ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}`}
                    >
                        {loading ? 'Analyzing Codes...' : 'Run Compliance Check'}
                    </button>
                </div>
            </div>

            {/* RESULTS REPORT */}
            <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-slate-200 overflow-y-auto max-h-[calc(100vh-200px)]">
                {!report ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
                        <Activity size={64} className="mb-4" />
                        <p className="text-lg font-medium">No Report Generated</p>
                        <p className="text-sm">Enter details and run check to see VMC/NBC violations.</p>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Compliance Report</h3>
                                <p className="text-xs text-slate-500 mt-1">Based on AP Building Rules 2017 & NBC 2016</p>
                            </div>
                            <div className="text-right">
                                {getOverallBadge(report.overallStatus)}
                                <div className="mt-2 text-xs font-bold text-slate-400">Score: {report.score}/100</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {report.checks.map((check, idx) => (
                                <div key={idx} className={`p-4 rounded-lg border ${getStatusColor(check.status)}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2 mb-1">
                                            {check.category === 'Setbacks' && <Ruler size={16} />}
                                            {check.category === 'Fire Safety' && <Flame size={16} />}
                                            {check.category === 'Ventilation' && <Wind size={16} />}
                                            <span className="font-bold text-sm uppercase tracking-wide">{check.category}</span>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${check.status === 'Pass' ? 'bg-green-200 text-green-800' : check.status === 'Fail' ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'}`}>
                                            {check.status}
                                        </span>
                                    </div>
                                    
                                    <p className="font-semibold text-sm mt-1">{check.requirement}</p>
                                    <p className="text-xs mt-1 opacity-80">Rule: {check.rule}</p>
                                    
                                    <div className="mt-3 flex flex-col md:flex-row gap-4 text-sm bg-white/50 p-2 rounded">
                                        <div className="flex-1">
                                            <span className="block text-[10px] uppercase opacity-60 font-bold">Provided</span>
                                            <span>{check.provided}</span>
                                        </div>
                                        {check.status !== 'Pass' && (
                                            <div className="flex-[2]">
                                                <span className="block text-[10px] uppercase opacity-60 font-bold">Correction Required</span>
                                                <span className="font-medium">{check.recommendation}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 bg-slate-50 p-4 rounded-lg text-xs text-slate-500 italic">
                            Disclaimer: This AI analysis is for preliminary guidance only. Final approval is subject to VMC town planning verification.
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default CodeCompliance;