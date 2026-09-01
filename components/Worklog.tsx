
import React, { useState } from 'react';
import { Project, UserRole, DailyLog } from '../types';
import { MOCK_DAILY_LOGS } from '../constants';
import { ClipboardList, CloudSun, AlertTriangle, Send, History } from 'lucide-react';

interface WorklogProps {
  project: Project;
  userRole: UserRole;
  userName?: string;
}

const Worklog: React.FC<WorklogProps> = ({ project, userRole, userName }) => {
  const [logs, setLogs] = useState<DailyLog[]>(MOCK_DAILY_LOGS.filter(l => l.projectId === project.id));
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [workDescription, setWorkDescription] = useState('');
  const [issues, setIssues] = useState('');
  const [weather, setWeather] = useState<'Sunny' | 'Rainy' | 'Cloudy' | 'Stormy'>('Sunny');
  const [status, setStatus] = useState<'On Track' | 'Delayed' | 'Ahead' | 'Completed'>('On Track');

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!workDescription) return;

      const newLog: DailyLog = {
          id: Date.now().toString(),
          projectId: project.id,
          date,
          author: userName || 'Unknown',
          role: userRole,
          workDescription,
          weather,
          issues: issues || 'None',
          status,
      };

      setLogs([newLog, ...logs]);
      
      // Reset critical fields
      setWorkDescription('');
      setIssues('');
      setStatus('On Track');
  };

  const isClient = userRole === UserRole.CLIENT;

  return (
    <div className="p-6 h-full flex flex-col gap-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <ClipboardList className="text-indigo-600" /> Daily Work Log
                </h2>
                <p className="text-sm text-slate-500">Track daily site progress, weather conditions, and blockers.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: Entry Form */}
            {!isClient && (
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
                    <h3 className="font-bold text-slate-800 mb-4">Update Work of the Day</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                            <input 
                                type="date" 
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Work Description</label>
                            <textarea 
                                value={workDescription}
                                onChange={e => setWorkDescription(e.target.value)}
                                className="w-full p-3 border border-slate-300 rounded-lg h-32 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500"
                                placeholder="Detail the activities completed today..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Weather</label>
                                <select 
                                    value={weather}
                                    onChange={e => setWeather(e.target.value as any)}
                                    className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                                >
                                    <option value="Sunny">Sunny</option>
                                    <option value="Cloudy">Cloudy</option>
                                    <option value="Rainy">Rainy</option>
                                    <option value="Stormy">Stormy</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select 
                                    value={status}
                                    onChange={e => setStatus(e.target.value as any)}
                                    className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                                >
                                    <option value="On Track">On Track</option>
                                    <option value="Ahead">Ahead</option>
                                    <option value="Delayed">Delayed</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Issues / Blockers (Optional)</label>
                            <textarea 
                                value={issues}
                                onChange={e => setIssues(e.target.value)}
                                className="w-full p-3 border border-slate-300 rounded-lg h-20 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500"
                                placeholder="Any delays, material shortages, or safety incidents..."
                            />
                        </div>

                        <button 
                            type="submit"
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                        >
                            <Send size={18} /> Submit Daily Log
                        </button>
                    </form>
                </div>
            )}

            {/* RIGHT: History Feed */}
            <div className={`${isClient ? 'lg:col-span-3' : 'lg:col-span-2'} bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col`}>
                <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 flex items-center gap-2">
                    <History size={18} /> Log History
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {logs.length === 0 ? (
                        <div className="text-center text-slate-400 py-10">No logs recorded for this project yet.</div>
                    ) : (
                        logs.map((log) => (
                            <div key={log.id} className="relative pl-8 pb-2 border-l-2 border-slate-200 last:border-0">
                                {/* Timeline Dot */}
                                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-indigo-500"></div>
                                
                                <div className="mb-1 flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                    <div>
                                        <span className="text-sm font-bold text-slate-800">{log.date}</span>
                                        <span className="mx-2 text-slate-300">|</span>
                                        <span className="text-sm text-slate-500 font-medium">{log.author} ({log.role})</span>
                                    </div>
                                    <div className={`mt-1 sm:mt-0 text-xs px-2.5 py-0.5 rounded-full font-bold w-fit ${
                                        log.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                        log.status === 'Delayed' ? 'bg-red-100 text-red-700' :
                                        log.status === 'Ahead' ? 'bg-green-100 text-green-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                        {log.status}
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mt-2">
                                    <p className="text-slate-700 whitespace-pre-wrap text-sm">{log.workDescription}</p>
                                    
                                    <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-4 text-xs text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <CloudSun size={14} /> {log.weather}
                                        </div>
                                        {log.issues && log.issues !== 'None' && (
                                            <div className="flex items-center gap-1 text-amber-600 font-semibold">
                                                <AlertTriangle size={14} /> Issue: {log.issues}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Worklog;
