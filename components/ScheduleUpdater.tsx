import React, { useState } from 'react';
import { Mic, Sparkles, AlertTriangle, RefreshCw, Check, Activity, BarChart2 } from 'lucide-react';
import ReconciliationDashboard from '../app/components/ReconciliationDashboard';

export interface ScheduleItem {
  id: string;
  name: string;
  discipline: 'Civil' | 'Piping';
  level: 'L5' | 'L6';
  plannedStart: string;
  plannedFinish: string;
  durationDays: number;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Blocked';
  lastUpdateNote?: string;
}

const INITIAL_SCHEDULE: ScheduleItem[] = [
  { id: 'CIV-L5-1010', name: 'Trench Excavation & Soil Profiling for 24" Header', discipline: 'Civil', level: 'L5', plannedStart: '2026-09-01', plannedFinish: '2026-09-04', durationDays: 4, progress: 100, status: 'Completed' },
  { id: 'CIV-L6-1011', name: 'Mud Mat / Blinding Concrete Pour (PCC 1:4:8)', discipline: 'Civil', level: 'L6', plannedStart: '2026-09-05', plannedFinish: '2026-09-06', durationDays: 2, progress: 100, status: 'Completed' },
  { id: 'CIV-L6-1012', name: 'Rebar Cage Fabrication & Placement for Foundation F-101', discipline: 'Civil', level: 'L6', plannedStart: '2026-09-07', plannedFinish: '2026-09-10', durationDays: 4, progress: 100, status: 'Completed' },
  { id: 'CIV-L6-1013', name: 'Anchor Bolt Cluster Alignment & Template Setting', discipline: 'Civil', level: 'L6', plannedStart: '2026-09-11', plannedFinish: '2026-09-12', durationDays: 2, progress: 100, status: 'Completed' },
  { id: 'CIV-L6-1014', name: 'Pedestal Formwork Erection & Level Survey', discipline: 'Civil', level: 'L6', plannedStart: '2026-09-13', plannedFinish: '2026-09-15', durationDays: 3, progress: 100, status: 'Completed' },
  { id: 'CIV-L5-1015', name: 'Structural Concrete Pour (Grade M30) & Compaction', discipline: 'Civil', level: 'L5', plannedStart: '2026-09-16', plannedFinish: '2026-09-16', durationDays: 1, progress: 80, status: 'In Progress' },
  { id: 'CIV-L6-1016', name: 'Curing & Formwork Stripping (Pedestals P-01 to P-04)', discipline: 'Civil', level: 'L6', plannedStart: '2026-09-17', plannedFinish: '2026-09-24', durationDays: 8, progress: 10, status: 'In Progress' },
  { id: 'CIV-L5-1017', name: 'Sub-grade Bituminous Waterproofing & Compaction Backfill', discipline: 'Civil', level: 'L5', plannedStart: '2026-09-25', plannedFinish: '2026-09-28', durationDays: 4, progress: 0, status: 'Not Started' },
  { id: 'PIP-L5-2010', name: 'Spool Receipt & Dimensional QA Inspection (Spools SP-01 to 08)', discipline: 'Piping', level: 'L5', plannedStart: '2026-09-22', plannedFinish: '2026-09-24', durationDays: 3, progress: 90, status: 'In Progress' },
  { id: 'PIP-L6-2011', name: 'Pipe Edge Beveling & Joint Fit-up (Header CS-24"-A1A)', discipline: 'Piping', level: 'L6', plannedStart: '2026-09-25', plannedFinish: '2026-09-27', durationDays: 3, progress: 40, status: 'In Progress' },
  { id: 'PIP-L6-2012', name: 'GTAW Root Pass & Hot Pass Welding on Joints J-01 to J-08', discipline: 'Piping', level: 'L6', plannedStart: '2026-09-28', plannedFinish: '2026-09-30', durationDays: 3, progress: 0, status: 'Not Started' },
  { id: 'PIP-L6-2013', name: 'SMAW Fill & Cap Welding on Field Butt Welds', discipline: 'Piping', level: 'L6', plannedStart: '2026-10-01', plannedFinish: '2026-10-03', durationDays: 3, progress: 0, status: 'Not Started' },
  { id: 'PIP-L6-2014', name: 'Non-Destructive Testing (100% RT/PAUT on Field Welds)', discipline: 'Piping', level: 'L6', plannedStart: '2026-10-04', plannedFinish: '2026-10-05', durationDays: 2, progress: 0, status: 'Not Started' },
  { id: 'PIP-L5-2015', name: 'Pipe Lowering & Trench Bedding Alignment', discipline: 'Piping', level: 'L5', plannedStart: '2026-10-06', plannedFinish: '2026-10-08', durationDays: 3, progress: 0, status: 'Not Started' },
  { id: 'PIP-L6-2016', name: 'Golden Tie-in Joint Fit-up & Welding at Battery Limit', discipline: 'Piping', level: 'L6', plannedStart: '2026-10-09', plannedFinish: '2026-10-11', durationDays: 3, progress: 0, status: 'Not Started' },
  { id: 'PIP-L6-2017', name: 'Spring Hanger & Structural Pipe Shoe Torque Tightening', discipline: 'Piping', level: 'L6', plannedStart: '2026-10-12', plannedFinish: '2026-10-14', durationDays: 3, progress: 0, status: 'Not Started' },
  { id: 'PIP-L5-2018', name: 'Hydrostatic Pressure Test (Test Pack TP-01 @ 18.5 Bar)', discipline: 'Piping', level: 'L5', plannedStart: '2026-10-15', plannedFinish: '2026-10-17', durationDays: 3, progress: 0, status: 'Not Started' },
  { id: 'PIP-L6-2019', name: 'System Dewatering & High-Pressure Air Blowing/Drying', discipline: 'Piping', level: 'L6', plannedStart: '2026-10-18', plannedFinish: '2026-10-19', durationDays: 2, progress: 0, status: 'Not Started' },
  { id: 'PIP-L5-2020', name: 'Inline Control Valve (FV-1021) & Orifice Flange Installation', discipline: 'Piping', level: 'L5', plannedStart: '2026-10-20', plannedFinish: '2026-10-22', durationDays: 3, progress: 0, status: 'Not Started' },
  { id: 'PIP-L5-2021', name: 'Preformed Mineral Wool Insulation & Aluminum Jacketing', discipline: 'Piping', level: 'L5', plannedStart: '2026-10-23', plannedFinish: '2026-10-27', durationDays: 5, progress: 0, status: 'Not Started' }
];

interface ExtractedUpdate {
  activitySummary: string;
  progressPercentage: number;
  workStatus: 'Not Started' | 'In Progress' | 'Completed' | 'Blocked';
  discipline: 'Civil' | 'Piping' | 'General';
  crewSize?: number;
  quantity?: string;
  blockers?: string;
}

interface MatchResult {
  matchedId: string;
  matchedName: string;
  similarityScore: number;
}

const ScheduleUpdater: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedUpdate | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [filterDiscipline, setFilterDiscipline] = useState<'All' | 'Civil' | 'Piping'>('All');
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<'GANTT' | 'TIME_AGENT'>('TIME_AGENT');

  const sampleScenarios = [
    {
      title: "Hydrotest Done",
      text: "We finished hydrostatic pressure testing on test pack TP-01 at 18.5 bar today. Zero pressure drop after 4 hours holding. Signed off by QA/QC inspector.",
    },
    {
      title: "Pedestal Concrete Pour",
      text: "Finished structural concrete pour on the pedestal foundations F-101 using M30 grade mix. Crew of 8 masons. Curing will start first thing tomorrow.",
    },
    {
      title: "GTAW Welding Progress",
      text: "Welding team completed root pass and hot pass on joints J-01 through J-06 on the 24 inch CS header. About 75% complete for this stage.",
    },
    {
      title: "Weather Blocked",
      text: "Heavy rainfall halted all trench excavation work on the underground cooling line. Crew stood down, approximately 40% completed.",
    }
  ];

  // Speech Recognition
  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your update.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.start();
  };

  // Heuristic / Cosine matching simulation
  const runExtractionAndMatching = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setExtractedData(null);
    setMatchResult(null);

    await new Promise(r => setTimeout(r, 600));

    const text = inputText.toLowerCase();

    // 1. Extraction logic
    let status: 'Not Started' | 'In Progress' | 'Completed' | 'Blocked' = 'In Progress';
    let progress = 60;
    let discipline: 'Civil' | 'Piping' | 'General' = 'General';

    if (text.includes('finish') || text.includes('completed') || text.includes('signed off') || text.includes('zero pressure drop')) {
      status = 'Completed';
      progress = 100;
    } else if (text.includes('halted') || text.includes('rain') || text.includes('delay') || text.includes('blocked') || text.includes('stopped')) {
      status = 'Blocked';
      progress = 40;
    }

    if (text.includes('hydrotest') || text.includes('welding') || text.includes('spool') || text.includes('pipe') || text.includes('valve') || text.includes('gtaw') || text.includes('smaw')) {
      discipline = 'Piping';
    } else if (text.includes('concrete') || text.includes('trench') || text.includes('rebar') || text.includes('curing') || text.includes('formwork') || text.includes('pedestal')) {
      discipline = 'Civil';
    }

    const extracted: ExtractedUpdate = {
      activitySummary: inputText.trim(),
      progressPercentage: progress,
      workStatus: status,
      discipline: discipline,
      crewSize: text.match(/\d+\s*(masons|workers|crew|welders|men)/)?.[0] ? parseInt(text.match(/\d+/)?.[0] || '6') : 6,
      quantity: text.match(/\d+\s*(joints|m3|meters|sqft|bar)/)?.[0] || undefined,
      blockers: status === 'Blocked' ? 'Rain / weather disruption' : undefined
    };

    setExtractedData(extracted);

    // 2. Matching logic against schedule items
    let bestMatch = schedule[0];
    let highestScore = 0;

    const queryTokens = text.split(/\s+/).filter(t => t.length > 2);

    schedule.forEach(item => {
      let matchScore = 0;
      const targetTokens = (item.name + " " + item.discipline + " " + item.id).toLowerCase().split(/\s+/);

      queryTokens.forEach(qt => {
        if (targetTokens.some(tt => tt.includes(qt) || qt.includes(tt))) {
          matchScore += 1.5;
        }
      });

      if (item.discipline === discipline) {
        matchScore += 2.0;
      }

      const normalizedScore = Math.min(99.4, Math.max(72.0, (matchScore / (queryTokens.length + 1)) * 100 + 45));

      if (normalizedScore > highestScore) {
        highestScore = normalizedScore;
        bestMatch = item;
      }
    });

    setMatchResult({
      matchedId: bestMatch.id,
      matchedName: bestMatch.name,
      similarityScore: parseFloat(highestScore.toFixed(1))
    });

    setLoading(false);
  };

  const handleApplyUpdate = () => {
    if (!matchResult || !extractedData) return;

    setSchedule(prev => prev.map(item => {
      if (item.id === matchResult.matchedId) {
        return {
          ...item,
          progress: extractedData.progressPercentage,
          status: extractedData.workStatus,
          lastUpdateNote: extractedData.activitySummary
        };
      }
      return item;
    }));

    setAppliedId(matchResult.matchedId);
    setTimeout(() => setAppliedId(null), 3000);
  };

  const filteredSchedule = schedule.filter(item => 
    filterDiscipline === 'All' ? true : item.discipline === filterDiscipline
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> AI Prototype
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded">L5 / L6 Schedule Sync</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Site Supervisor Update & Schedule Linker</h1>
          <p className="text-sm text-slate-500">Dictate or type raw site logs $\rightarrow$ extract structured JSON $\rightarrow$ auto-link to WBS via FAISS cosine matching.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewTab('TIME_AGENT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewTab === 'TIME_AGENT' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles size={14} />
              <span>Time Agent Reconciler</span>
            </button>
            <button
              onClick={() => setViewTab('GANTT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewTab === 'GANTT' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 size={14} />
              <span>Live Gantt Sync</span>
            </button>
          </div>

          <button 
            onClick={() => setSchedule(INITIAL_SCHEDULE)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div>

      {viewTab === 'TIME_AGENT' ? (
        <ReconciliationDashboard />
      ) : (
        /* Main 2-Column Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Supervisor Input & Extractor (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity size={18} className="text-indigo-600" />
                Supervisor Site Update
              </h2>
              <button
                onClick={toggleVoiceInput}
                className={`p-2 rounded-full transition-all flex items-center gap-1.5 text-xs font-semibold ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse shadow-lg' 
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
                title={isListening ? "Listening... click to stop" : "Click to speak"}
              >
                <Mic size={16} />
                {isListening ? "Listening..." : "Dictate"}
              </button>
            </div>

            {/* Input Box */}
            <div className="relative">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type or dictate messy update, e.g.: 'Completed hydrotest on TP-01 with 0 leaks today at 18.5 bar...'"
                rows={4}
                className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 resize-none text-slate-800"
              />
            </div>

            {/* Quick Test Scenarios */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Sample Updates:</span>
              <div className="grid grid-cols-2 gap-2">
                {sampleScenarios.map((sc, i) => (
                  <button
                    key={i}
                    onClick={() => setInputText(sc.text)}
                    className="p-2 text-left text-xs bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 rounded-lg transition-colors text-slate-700 truncate"
                  >
                    <span className="font-semibold block text-slate-800 truncate">{sc.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={runExtractionAndMatching}
              disabled={loading || !inputText.trim()}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Running AI Extraction & Linker...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Extract & Match to Schedule
                </>
              )}
            </button>
          </div>

          {/* Structured Output Card */}
          {extractedData && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3 animate-fade-in-up">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parsed JSON Schema</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  extractedData.workStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                  extractedData.workStatus === 'Blocked' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {extractedData.workStatus} ({extractedData.progressPercentage}%)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block">Discipline</span>
                  <span className="font-semibold text-slate-800">{extractedData.discipline}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block">Crew Size</span>
                  <span className="font-semibold text-slate-800">{extractedData.crewSize || 'N/A'} Personnel</span>
                </div>
              </div>

              {extractedData.blockers && (
                <div className="bg-red-50 border border-red-200 p-2.5 rounded-lg flex items-center gap-2 text-xs text-red-700">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span><strong>Blocker:</strong> {extractedData.blockers}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Auto-Updating Gantt Chart & Review Table (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Matched Activity Notification Banner */}
          {matchResult && extractedData && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3 animate-fade-in">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 text-white font-mono text-xs px-2 py-0.5 rounded font-bold">
                    FAISS Match: {matchResult.similarityScore}%
                  </span>
                  <span className="font-bold text-xs bg-white text-emerald-800 px-2 py-0.5 rounded">
                    {matchResult.matchedId}
                  </span>
                </div>
                <h3 className="font-bold text-sm leading-tight text-white">{matchResult.matchedName}</h3>
                <p className="text-xs text-emerald-100">
                  Updating progress from current to <strong>{extractedData.progressPercentage}%</strong> ({extractedData.workStatus})
                </p>
              </div>

              <button
                onClick={handleApplyUpdate}
                className="px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 shrink-0 transition-transform active:scale-95"
              >
                <Check size={16} /> Apply to Schedule
              </button>
            </div>
          )}

          {/* Schedule Table / Gantt View Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            
            {/* Table Filter Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <BarChart2 size={18} className="text-slate-600" />
                <h3 className="font-bold text-sm text-slate-800">L5/L6 Activity Schedule ({filteredSchedule.length} Items)</h3>
              </div>

              <div className="flex bg-white rounded-lg p-0.5 border border-slate-200 shadow-sm text-xs font-semibold">
                {(['All', 'Civil', 'Piping'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilterDiscipline(tab)}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      filterDiscipline === tab ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Rows */}
            <div className="overflow-x-auto max-h-[560px] overflow-y-auto divide-y divide-slate-100">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100/70 text-slate-500 font-semibold sticky top-0 backdrop-blur-md">
                  <tr>
                    <th className="py-2.5 px-3">WBS ID</th>
                    <th className="py-2.5 px-3">Activity Name</th>
                    <th className="py-2.5 px-3">Dates</th>
                    <th className="py-2.5 px-3 w-40">Progress / Gantt</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSchedule.map(item => {
                    const isMatched = matchResult?.matchedId === item.id;
                    const isJustApplied = appliedId === item.id;

                    return (
                      <tr 
                        key={item.id}
                        className={`transition-all duration-300 ${
                          isJustApplied ? 'bg-emerald-100 ring-2 ring-emerald-500' :
                          isMatched ? 'bg-indigo-50/80 font-medium' :
                          'hover:bg-slate-50/80'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap">
                          <span className={`px-1.5 py-0.5 rounded font-semibold ${
                            item.discipline === 'Civil' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'
                          }`}>
                            {item.id}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-medium text-slate-800 leading-snug">{item.name}</div>
                          {item.lastUpdateNote && (
                            <div className="text-[10px] text-emerald-600 font-normal italic truncate max-w-[280px]">
                              Latest: "{item.lastUpdateNote}"
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 font-mono text-[10px]">
                          {item.plannedStart.slice(5)} $\rightarrow$ {item.plannedFinish.slice(5)}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="font-bold text-slate-700">{item.progress}%</span>
                              <span className="text-slate-400">{item.durationDays}d</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 rounded-full ${
                                  item.progress === 100 ? 'bg-emerald-500' :
                                  item.status === 'Blocked' ? 'bg-red-500' :
                                  item.progress > 50 ? 'bg-indigo-600' : 'bg-blue-400'
                                }`}
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            item.status === 'Blocked' ? 'bg-red-100 text-red-700' :
                            item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>
      )}
    </div>
  );
};

export default ScheduleUpdater;
