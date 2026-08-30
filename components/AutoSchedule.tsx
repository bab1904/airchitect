import React, { useState } from 'react';
import { generateConstructionSchedule } from '../services/geminiService';
import { ScheduleTask, Project } from '../types';
import { CalendarDays, PlayCircle, Users, Box, Flag, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

interface AutoScheduleProps {
  project: Project | null;
}

const AutoSchedule: React.FC<AutoScheduleProps> = ({ project }) => {
  const [tasks, setTasks] = useState<ScheduleTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1); // 1 = 100% (40px per day)
  
  // Inputs if project is null (Manual Mode) or refinement
  const [buildingType, setBuildingType] = useState('Residential G+1');
  const [area, setArea] = useState('1500 sqft');
  const [location, setLocation] = useState(project?.location || 'Vijayawada, India');

  const handleGenerate = async () => {
    setLoading(true);
    try {
        const details = `Type: ${buildingType}, Area: ${area}, Location: ${location}. 
        Project: ${project ? project.name : 'New Project'}.
        Include realistic construction phases for this region.`;
        
        const scheduleData = await generateConstructionSchedule(details);
        if (Array.isArray(scheduleData) && scheduleData.length > 0) {
            setTasks(scheduleData);
        } else {
            alert("AI returned an empty schedule. Please try adjusting details.");
        }
    } catch (error) {
        console.error("Schedule generation failed", error);
        alert("Failed to generate schedule. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

  // Helper to find max duration for Gantt chart width
  const totalDays = tasks.reduce((acc, task) => Math.max(acc, task.startDay + task.durationDays), 0) + 10; // buffer
  
  // Dynamic Width Configuration
  const BASE_DAY_WIDTH = 40;
  const dayWidthPx = BASE_DAY_WIDTH * zoom;
  const chartWidth = totalDays * dayWidthPx;
  const sidebarWidth = 220; // Fixed width for task names
  
  // Color map for phases
  const getPhaseColor = (phase: string) => {
      const p = phase.toLowerCase();
      if (p.includes('foundation')) return 'bg-orange-500 border-orange-600 text-white';
      if (p.includes('structure') || p.includes('framing')) return 'bg-blue-500 border-blue-600 text-white';
      if (p.includes('finish') || p.includes('interior')) return 'bg-green-500 border-green-600 text-white';
      if (p.includes('electric') || p.includes('plumb')) return 'bg-yellow-500 border-yellow-600 text-white';
      return 'bg-slate-500 border-slate-600 text-white';
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 animate-fade-in overflow-hidden">
        <div className="flex justify-between items-center shrink-0">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <CalendarDays className="text-indigo-600" /> AI Auto-Scheduling
                </h2>
                <p className="text-sm text-slate-500">Generates Gantt charts, Manpower mapping & Milestones automatically.</p>
            </div>
        </div>

        {tasks.length === 0 ? (
            /* INPUT FORM - Centered and scrollable if needed */
            <div className="flex-1 flex flex-col items-center justify-center overflow-auto">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 max-w-lg w-full">
                    <div className="text-center mb-6">
                        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                            <PlayCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Generate Construction Plan</h3>
                        <p className="text-slate-500 text-sm mt-1">AI will calculate dependencies, resources, and timelines.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Building Type</label>
                            <input 
                                type="text" 
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 placeholder-slate-400"
                                value={buildingType}
                                onChange={(e) => setBuildingType(e.target.value)}
                                placeholder="e.g. Commercial Complex, 3BHK Villa"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Total Area</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 placeholder-slate-400"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    placeholder="e.g. 2000 sqft"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 placeholder-slate-400"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="City, Region"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleGenerate}
                            disabled={loading}
                            className={`w-full py-3 rounded-lg text-white font-bold text-lg mt-2 ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'}`}
                        >
                            {loading ? 'AI is Planning...' : 'Generate Schedule'}
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            /* SCHEDULE VIEW - Flex layout to fit screen */
            <div className="flex flex-col flex-1 min-h-0 gap-6">
                
                {/* 1. GANTT CHART VISUALIZATION (Fixed Height Area) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[55%] shrink-0">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">Project Timeline (Gantt)</h3>
                        <div className="flex items-center gap-2">
                             <div className="flex items-center bg-white border border-slate-300 rounded-lg p-1 shadow-sm">
                                 <button onClick={handleZoomOut} className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Zoom Out"><ZoomOut size={16}/></button>
                                 <span className="text-xs font-mono w-12 text-center text-slate-500">{Math.round(zoom * 100)}%</span>
                                 <button onClick={handleZoomIn} className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Zoom In"><ZoomIn size={16}/></button>
                             </div>
                             <button onClick={() => setTasks([])} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 px-3 py-1.5 bg-white border border-red-200 rounded-lg transition-colors">
                                <RefreshCw size={14} /> Reset
                             </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-auto relative bg-slate-50/30">
                        {/* Dynamic Width Container */}
                        <div style={{ width: `${Math.max(800, chartWidth + sidebarWidth)}px` }} className="relative min-h-full">
                            
                            {/* Sticky Header Row */}
                            <div className="flex border-b border-slate-300 h-10 items-center sticky top-0 bg-slate-100 z-30 shadow-sm">
                                <div className="sticky left-0 z-40 bg-slate-100 w-[220px] font-bold text-xs text-slate-700 uppercase tracking-wider pl-4 border-r border-slate-300 h-full flex items-center shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)]">
                                    Task Name
                                </div>
                                <div className="flex-1 relative h-full"> 
                                    {/* Weeks Markers */}
                                    {Array.from({ length: Math.ceil(totalDays / 7) }).map((_, i) => (
                                        <div key={i} className="absolute h-full border-l border-slate-300 pl-1 text-[10px] font-semibold text-slate-500 truncate" style={{ left: `${i * 7 * dayWidthPx}px` }}>
                                            Week {i + 1}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Task Rows */}
                            <div className="divide-y divide-slate-100">
                                {tasks.map((task) => (
                                    <div key={task.id} className="flex items-center h-12 group hover:bg-indigo-50/30 transition-colors">
                                        {/* Task Label Fixed Left */}
                                        <div className="sticky left-0 z-20 w-[220px] bg-white group-hover:bg-indigo-50/50 pr-4 pl-4 h-full flex flex-col justify-center border-r border-slate-300 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]">
                                            <div className="font-medium text-xs text-slate-800 truncate" title={task.task}>{task.task}</div>
                                            <div className="text-[10px] text-slate-400">{task.phase}</div>
                                        </div>
                                        
                                        {/* Gantt Bar Area */}
                                        <div className="flex-1 relative h-full">
                                            {/* Vertical Grid Lines */}
                                            {Array.from({ length: Math.ceil(totalDays / 7) }).map((_, i) => (
                                                <div key={`g-${i}`} className="absolute top-0 bottom-0 border-l border-slate-100 pointer-events-none" style={{ left: `${i * 7 * dayWidthPx}px` }}></div>
                                            ))}
                                            
                                            {/* The Bar */}
                                            <div 
                                                className={`absolute h-7 top-2.5 rounded-md shadow-sm flex items-center px-2 text-[10px] font-bold whitespace-nowrap overflow-hidden transition-all duration-300 border ${getPhaseColor(task.phase)}`}
                                                style={{
                                                    left: `${task.startDay * dayWidthPx}px`,
                                                    width: `${Math.max(dayWidthPx, task.durationDays * dayWidthPx)}px`
                                                }}
                                                title={`Duration: ${task.durationDays} days | Resources: ${task.resources}`}
                                            >
                                                {/* Text inside bar if wide enough, otherwise just visually distinct */}
                                                {task.durationDays * dayWidthPx > 30 && `${task.durationDays}d`}
                                            </div>
                                            
                                            {/* Label next to bar if bar is too small */}
                                            {task.durationDays * dayWidthPx <= 30 && (
                                                <span 
                                                    className="absolute text-[10px] text-slate-500 font-medium ml-1 top-3.5"
                                                    style={{ left: `${(task.startDay * dayWidthPx) + (task.durationDays * dayWidthPx)}px` }}
                                                >
                                                    {task.durationDays}d
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. DETAILED LIST WITH RESOURCES (Scrollable Area) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-y-auto">
                         <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 sticky top-0 bg-white z-10 pb-2 border-b border-slate-100">
                             <Box size={18} className="text-orange-600"/> Resource & Material Mapping
                         </h3>
                         <div className="space-y-4">
                             {tasks.map(task => (
                                 <div key={task.id} className="border-b border-slate-100 pb-3 last:border-0 hover:bg-slate-50 p-2 rounded transition-colors">
                                     <div className="flex justify-between">
                                         <h4 className="font-semibold text-sm text-slate-700">{task.task}</h4>
                                         <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">Day {task.startDay} - {task.startDay + task.durationDays}</span>
                                     </div>
                                     <div className="flex items-start gap-2 mt-2 text-sm text-slate-600 bg-orange-50 p-2 rounded border border-orange-100">
                                         <Users size={14} className="mt-0.5 shrink-0 text-orange-500" />
                                         <span>{task.resources}</span>
                                     </div>
                                     {task.dependencies.length > 0 && (
                                         <div className="text-xs text-slate-400 mt-1 pl-2 border-l-2 border-slate-200">
                                             Depends on: {task.dependencies.join(', ')}
                                         </div>
                                     )}
                                 </div>
                             ))}
                         </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-y-auto">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 sticky top-0 bg-white z-10 pb-2 border-b border-slate-100">
                             <Flag size={18} className="text-red-600"/> Milestones & Phases
                        </h3>
                        <div className="relative border-l-2 border-indigo-200 ml-3 space-y-6 pl-6 py-2">
                            {tasks.filter(t => t.milestone || t.durationDays > 5).map((task, idx) => (
                                <div key={idx} className="relative group">
                                    <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-125 ${task.milestone ? 'bg-red-500' : 'bg-indigo-500'}`}></span>
                                    <h4 className={`font-bold text-sm ${task.milestone ? 'text-red-700' : 'text-slate-800'}`}>
                                        {task.task}
                                    </h4>
                                    <p className="text-xs text-slate-500">Completed by Day {task.startDay + task.durationDays}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100 text-sm text-green-800">
                             <strong>AI Insight:</strong> Seasonal adjustment applied for {location}. Timelines include buffer for potential weather delays.
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default AutoSchedule;