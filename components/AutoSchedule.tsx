import React, { useState, useEffect } from 'react';
import { generateConstructionSchedule } from '../services/geminiService';
import { ScheduleTask, Project } from '../types';
import { CalendarDays, PlayCircle, Flag, RefreshCw, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';

interface AutoScheduleProps {
  project: Project | null;
}

const AutoSchedule: React.FC<AutoScheduleProps> = ({ project }) => {
  const [tasks, setTasks] = useState<ScheduleTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedTask, setSelectedTask] = useState<ScheduleTask | null>(null);
  
  const [buildingType, setBuildingType] = useState('Residential G+1 Villa');
  const [area, setArea] = useState('1800 sqft');
  const [location, setLocation] = useState(project?.location || 'Vijayawada, India');

  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const details = `Type: ${buildingType}, Area: ${area}, Location: ${location}. 
      Project: ${project ? project.name : 'New Project'}.
      Include realistic construction phases for this region.`;
      
      const scheduleData = await generateConstructionSchedule(details);
      if (Array.isArray(scheduleData) && scheduleData.length > 0) {
        setTasks(scheduleData);
      }
    } catch (error) {
      console.error("Schedule generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

  const totalDays = tasks.reduce((acc, task) => Math.max(acc, task.startDay + task.durationDays), 0) + 10;
  const BASE_DAY_WIDTH = 36;
  const dayWidthPx = BASE_DAY_WIDTH * zoom;
  const chartWidth = Math.max(totalDays * dayWidthPx, 800);
  const sidebarWidth = 240;

  const getPhaseColor = (phase: string) => {
    const p = phase.toLowerCase();
    if (p.includes('mobilization')) return 'bg-slate-600 border-slate-700 text-white';
    if (p.includes('foundation')) return 'bg-orange-500 border-orange-600 text-white';
    if (p.includes('substructure')) return 'bg-amber-600 border-amber-700 text-white';
    if (p.includes('structure') || p.includes('superstructure') || p.includes('framing')) return 'bg-blue-600 border-blue-700 text-white';
    if (p.includes('masonry')) return 'bg-indigo-600 border-indigo-700 text-white';
    if (p.includes('finish') || p.includes('interior')) return 'bg-emerald-600 border-emerald-700 text-white';
    if (p.includes('mep') || p.includes('electric') || p.includes('plumb')) return 'bg-purple-600 border-purple-700 text-white';
    if (p.includes('handover')) return 'bg-teal-600 border-teal-700 text-white';
    return 'bg-indigo-500 border-indigo-600 text-white';
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> AI CPM Engine
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded">Gantt &amp; Milestones</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <CalendarDays className="text-blue-600" /> AI Construction Auto-Scheduler
          </h1>
          <p className="text-sm text-slate-500">Automatically sequence critical path tasks, durations, milestones, and labor resources based on regional site parameters.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
            <button 
              onClick={handleZoomOut} 
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
              title="Zoom out timeline"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-[11px] font-bold px-2 text-slate-600">{Math.round(zoom * 100)}%</span>
            <button 
              onClick={handleZoomIn} 
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
              title="Zoom in timeline"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? "Sequencing..." : "Regenerate Schedule"}
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Building Category</label>
          <input
            type="text"
            value={buildingType}
            onChange={e => setBuildingType(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Built-up Area</label>
          <input
            type="text"
            value={area}
            onChange={e => setArea(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Site Location</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <PlayCircle size={15} /> Apply Parameters
          </button>
        </div>
      </div>

      {/* Interactive Gantt Chart Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1 min-h-[480px]">
        {/* Timeline Header */}
        <div className="flex border-b border-slate-200 bg-slate-100 sticky top-0 z-10 text-xs font-bold text-slate-700">
          <div style={{ width: sidebarWidth }} className="p-3 border-r border-slate-200 shrink-0">
            Work Package / Task ({tasks.length})
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex" style={{ width: chartWidth }}>
              {Array.from({ length: Math.ceil(totalDays / 10) }).map((_, i) => (
                <div
                  key={i}
                  style={{ width: dayWidthPx * 10 }}
                  className="border-r border-slate-300 px-2 py-3 text-[11px] text-slate-500 font-mono"
                >
                  Day {i * 10} - {(i + 1) * 10}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Rows */}
        <div className="overflow-auto flex-1 divide-y divide-slate-100">
          {tasks.map((task) => {
            const leftPx = task.startDay * dayWidthPx;
            const widthPx = Math.max(task.durationDays * dayWidthPx, 24);
            const isSelected = selectedTask?.id === task.id;

            return (
              <div 
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`flex hover:bg-slate-50 transition-colors cursor-pointer text-xs ${
                  isSelected ? 'bg-indigo-50/70' : ''
                }`}
              >
                {/* Task Label Sidebar */}
                <div style={{ width: sidebarWidth }} className="p-3 border-r border-slate-200 shrink-0 truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400">{task.id}</span>
                    <span className="font-semibold text-slate-900 truncate">{task.task}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                    <span className="text-indigo-600 font-medium">{task.phase}</span>
                    <span>• {task.durationDays}d</span>
                  </div>
                </div>

                {/* Gantt Bar Lane */}
                <div className="flex-1 relative h-14 flex items-center bg-slate-50/40">
                  <div
                    style={{ left: leftPx, width: widthPx }}
                    className={`absolute h-8 rounded-lg shadow-sm border px-2.5 flex items-center justify-between transition-all group hover:brightness-110 ${getPhaseColor(task.phase)} ${
                      task.milestone ? 'ring-2 ring-yellow-400' : ''
                    }`}
                  >
                    <span className="text-[11px] font-bold truncate">{task.task}</span>
                    {task.milestone && <Flag size={12} className="text-yellow-300 shrink-0 ml-1" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Task Details Drawer */}
      {selectedTask && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500 font-mono px-2 py-0.5 rounded font-bold">{selectedTask.id}</span>
              <span className="font-bold text-sm">{selectedTask.task}</span>
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{selectedTask.phase}</span>
            </div>
            <p className="text-slate-400">
              Start: Day {selectedTask.startDay} | Duration: {selectedTask.durationDays} Days | Required Resources: <strong className="text-white">{selectedTask.resources}</strong>
            </p>
          </div>

          <button
            onClick={() => setSelectedTask(null)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold self-start sm:self-auto"
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default AutoSchedule;