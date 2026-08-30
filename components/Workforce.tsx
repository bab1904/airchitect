import React, { useState } from 'react';
import { MOCK_WORKERS, MOCK_DAILY_ATTENDANCE } from '../constants';
import { Users, UserPlus, X, Save, Calendar, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const Workforce: React.FC = () => {
  const [attendanceHistory, setAttendanceHistory] = useState(MOCK_DAILY_ATTENDANCE);
  const [isLogging, setIsLogging] = useState(false);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  
  // State for the new log form (defaulting to 0 for all roles)
  const [newLog, setNewLog] = useState<{ [key: string]: number }>({
      Mason: 0,
      Carpenter: 0,
      Electrician: 0,
      Plumber: 0,
      Helper: 0
  });

  // Helper to get wage per role
  const getRoleWage = (role: string) => MOCK_WORKERS.find(w => w.role === role)?.hourlyRate || 0;

  // 1. DYNAMIC TABLE DATA: Based on the LATEST entry in attendance history
  const latestLog = attendanceHistory.length > 0 ? attendanceHistory[attendanceHistory.length - 1] : null;

  const tableData = Object.keys(newLog).map(role => {
      // Use latest log count if available, otherwise 0
      const count = latestLog ? (latestLog as any)[role] || 0 : 0;
      return {
          role,
          count: count,
          dailyWage: getRoleWage(role)
      };
  });

  // Colors for charts
  const roleColors: { [key: string]: string } = {
      'Mason': '#ef4444', // Red
      'Carpenter': '#f97316', // Orange
      'Electrician': '#eab308', // Yellow
      'Plumber': '#3b82f6', // Blue
      'Helper': '#8b5cf6' // Purple
  };

  const handleOpenLog = () => {
      // Pre-fill with today's date
      const today = new Date().toISOString().split('T')[0];
      setLogDate(today);
      
      // Pre-fill counts from the latest log for convenience
      if (latestLog) {
          setNewLog({
              Mason: latestLog.Mason,
              Carpenter: latestLog.Carpenter,
              Electrician: latestLog.Electrician,
              Plumber: latestLog.Plumber,
              Helper: latestLog.Helper
          });
      }
      setIsLogging(true);
  };

  const handleSubmitLog = () => {
      const total = Object.values(newLog).reduce((a, b) => Number(a) + Number(b), 0);
      
      // Create formatted date string (e.g., "Oct 27")
      const dateObj = new Date(logDate);
      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const newEntry = {
          date: formattedDate,
          ...newLog,
          totalWorkers: total
      };

      // Update history: Remove existing entry for same date if any, then add new one
      const historyWithoutNewDate = attendanceHistory.filter(h => h.date !== formattedDate);
      const updatedHistory = [...historyWithoutNewDate, newEntry as any];
      
      // Sort roughly by parsing the date string is tricky without year, 
      // but for this mock we just append. In a real app, use ISO dates for sorting.
      
      setAttendanceHistory(updatedHistory);
      setIsLogging(false);
  };

  // Custom Tooltip for the Chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 shadow-xl rounded-xl z-50">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          <div className="space-y-2">
              {payload.map((entry: any, index: number) => {
                  const roleWage = getRoleWage(entry.name);
                  return (
                    <div key={index} className="flex items-center gap-3 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <div className="flex-1 font-medium text-slate-700 w-24">{entry.name}</div>
                        <div className="font-bold text-slate-900">{entry.value} Workers</div>
                        <div className="text-slate-500 text-xs">(₹{roleWage}/person)</div>
                    </div>
                  );
              })}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
             <span className="text-sm font-bold text-slate-600">Total</span>
             <span className="text-sm font-bold text-indigo-600">{payload.reduce((acc: number, curr: any) => acc + curr.value, 0)} Workers Present</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in relative">
       <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Users className="text-purple-600" /> Workforce Log Book
            </h2>
            <button 
                onClick={handleOpenLog}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
                <UserPlus size={16} /> Log Attendance
            </button>
       </div>

       {/* LOGGING MODAL */}
       {isLogging && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                   <div className="bg-purple-600 p-4 flex justify-between items-center text-white">
                       <h3 className="font-bold text-lg flex items-center gap-2"><Calendar size={20}/> Log Daily Attendance</h3>
                       <button onClick={() => setIsLogging(false)} className="hover:bg-purple-700 p-1 rounded-full transition-colors"><X size={20}/></button>
                   </div>
                   
                   <div className="p-6 space-y-6">
                       <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                           <input 
                                type="date" 
                                value={logDate}
                                onChange={(e) => setLogDate(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                           />
                       </div>

                       <div className="space-y-3">
                           <label className="block text-sm font-medium text-slate-700">Worker Counts by Role</label>
                           {Object.keys(newLog).map(role => (
                               <div key={role} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                   <div className="flex items-center gap-2">
                                       <div className="w-3 h-3 rounded-full" style={{backgroundColor: roleColors[role]}}></div>
                                       <span className="font-medium text-slate-700">{role}</span>
                                   </div>
                                   <div className="flex items-center gap-3">
                                       <button 
                                            onClick={() => setNewLog({...newLog, [role]: Math.max(0, newLog[role] - 1)})}
                                            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                                       >-</button>
                                       <span className="w-8 text-center font-bold text-slate-900">{newLog[role]}</span>
                                       <button 
                                            onClick={() => setNewLog({...newLog, [role]: newLog[role] + 1})}
                                            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                                       >+</button>
                                   </div>
                               </div>
                           ))}
                       </div>

                       <div className="flex gap-3 pt-4 border-t border-slate-100">
                           <button onClick={() => setIsLogging(false)} className="flex-1 py-3 text-slate-500 hover:bg-slate-50 rounded-lg font-medium">Cancel</button>
                           <button onClick={handleSubmitLog} className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-lg flex items-center justify-center gap-2">
                               <Save size={18} /> Save Entry
                           </button>
                       </div>
                   </div>
               </div>
           </div>
       )}

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           
           {/* 1. AGGREGATED TABLE (Updates Dynamically) */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
             <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 flex justify-between items-center">
                <span>Current Roster Status</span>
                {latestLog && (
                    <span className="text-xs font-normal bg-green-100 text-green-700 px-2 py-1 rounded">
                        As of {latestLog.date}
                    </span>
                )}
             </div>
             <table className="w-full text-left">
                <thead className="bg-white text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                    <tr>
                        <th className="p-4 font-medium">Role</th>
                        <th className="p-4 font-medium text-center">Active</th>
                        <th className="p-4 font-medium text-right">Avg Wage (₹)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {tableData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-medium text-slate-900 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: roleColors[row.role] || '#ccc' }}></div>
                                {row.role}
                            </td>
                            <td className="p-4 text-center">
                                <span className={`px-2 py-1 rounded font-bold text-slate-700 ${row.count > 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100'}`}>
                                    {row.count}
                                </span>
                            </td>
                            <td className="p-4 text-right font-mono text-slate-600">
                                ₹{(row.dailyWage || 0).toLocaleString('en-IN')}
                            </td>
                        </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold text-slate-800">
                        <td className="p-4">Total</td>
                        <td className="p-4 text-center">{tableData.reduce((acc, r) => acc + r.count, 0)}</td>
                        <td className="p-4"></td>
                    </tr>
                </tbody>
             </table>
           </div>

           {/* 2. HISTORY CHART */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-[400px]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800">Attendance History</h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={12}/> Live Updates
                    </span>
                </div>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={attendanceHistory} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tick={{fontSize: 12}} />
                            <YAxis tick={{fontSize: 12}} />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                            <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}/>
                            
                            <Bar dataKey="Mason" stackId="a" fill={roleColors['Mason']} radius={[0, 0, 0, 0]} />
                            <Bar dataKey="Carpenter" stackId="a" fill={roleColors['Carpenter']} radius={[0, 0, 0, 0]} />
                            <Bar dataKey="Electrician" stackId="a" fill={roleColors['Electrician']} radius={[0, 0, 0, 0]} />
                            <Bar dataKey="Plumber" stackId="a" fill={roleColors['Plumber']} radius={[0, 0, 0, 0]} />
                            <Bar dataKey="Helper" stackId="a" fill={roleColors['Helper']} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
           </div>
       </div>
    </div>
  );
};

export default Workforce;