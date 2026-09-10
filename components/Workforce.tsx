import React, { useState } from 'react';
import { MOCK_DAILY_ATTENDANCE } from '../constants';
import { UserRole, Project, DailyAttendance } from '../types';
import { 
  Users, 
  UserPlus, 
  X, 
  Save, 
  Calendar, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp, 
  BadgeCheck, 
  BarChart2, 
  HardHat, 
  Info
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface WorkforceProps {
  userRole?: UserRole;
  userName?: string;
  project?: Project | null;
}

const DEFAULT_STANDARD_WAGES: { [key: string]: number } = {
  Mason: 850,
  Carpenter: 900,
  Electrician: 1000,
  Plumber: 950,
  Helper: 500
};

const ROLE_COLORS: { [key: string]: string } = {
  'Mason': '#ef4444', // Red
  'Carpenter': '#f97316', // Orange
  'Electrician': '#eab308', // Yellow
  'Plumber': '#3b82f6', // Blue
  'Helper': '#8b5cf6' // Purple
};

const Workforce: React.FC<WorkforceProps> = ({ userRole, userName, project }) => {
  const [attendanceHistory, setAttendanceHistory] = useState<DailyAttendance[]>(MOCK_DAILY_ATTENDANCE);
  const [isLogging, setIsLogging] = useState(false);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'HEADCOUNT' | 'WAGE_PAYOUT'>('HEADCOUNT');
  const [shiftNote, setShiftNote] = useState('Standard Day Shift');

  // State for daily worker counts
  const [newLogCounts, setNewLogCounts] = useState<{ [key: string]: number }>({
    Mason: 6,
    Carpenter: 4,
    Electrician: 3,
    Plumber: 2,
    Helper: 10
  });

  // State for daily wage rates (editable every day)
  const [dailyWageRates, setDailyWageRates] = useState<{ [key: string]: number }>({
    Mason: DEFAULT_STANDARD_WAGES.Mason,
    Carpenter: DEFAULT_STANDARD_WAGES.Carpenter,
    Electrician: DEFAULT_STANDARD_WAGES.Electrician,
    Plumber: DEFAULT_STANDARD_WAGES.Plumber,
    Helper: DEFAULT_STANDARD_WAGES.Helper
  });

  // 1. DYNAMIC LATEST ENTRY
  const latestLog = attendanceHistory.length > 0 ? attendanceHistory[attendanceHistory.length - 1] : null;

  // Compute live current wages and payouts based on latest entry
  const tableData = Object.keys(DEFAULT_STANDARD_WAGES).map(role => {
    const count = latestLog ? (latestLog as any)[role] || 0 : 0;
    const dailyWage = latestLog?.wages ? (latestLog.wages as any)[role] || DEFAULT_STANDARD_WAGES[role] : DEFAULT_STANDARD_WAGES[role];
    const totalRolePayout = count * dailyWage;

    return {
      role,
      count,
      dailyWage,
      totalRolePayout
    };
  });

  // Live Modal Payout Calculations
  const modalTotalWorkers = Object.values(newLogCounts).reduce((a, b) => Number(a) + Number(b), 0);
  const modalTotalWagePayout = Object.keys(newLogCounts).reduce((acc, role) => {
    const count = Number(newLogCounts[role]) || 0;
    const rate = Number(dailyWageRates[role]) || 0;
    return acc + (count * rate);
  }, 0);

  // High-Level Dashboard Calculations
  const activeWorkersToday = tableData.reduce((acc, r) => acc + r.count, 0);
  const todaysTotalWagePayout = tableData.reduce((acc, r) => acc + r.totalRolePayout, 0);
  const cumulativeWageBill = attendanceHistory.reduce((acc, h) => acc + (h.totalPayout || 0), 0);
  const averageWagePerWorker = activeWorkersToday > 0 ? Math.round(todaysTotalWagePayout / activeWorkersToday) : 0;

  const handleOpenLog = () => {
    const today = new Date().toISOString().split('T')[0];
    setLogDate(today);
    
    // Pre-fill with latest values for convenience
    if (latestLog) {
      setNewLogCounts({
        Mason: latestLog.Mason || 0,
        Carpenter: latestLog.Carpenter || 0,
        Electrician: latestLog.Electrician || 0,
        Plumber: latestLog.Plumber || 0,
        Helper: latestLog.Helper || 0
      });

      if (latestLog.wages) {
        setDailyWageRates({
          Mason: latestLog.wages.Mason || DEFAULT_STANDARD_WAGES.Mason,
          Carpenter: latestLog.wages.Carpenter || DEFAULT_STANDARD_WAGES.Carpenter,
          Electrician: latestLog.wages.Electrician || DEFAULT_STANDARD_WAGES.Electrician,
          Plumber: latestLog.wages.Plumber || DEFAULT_STANDARD_WAGES.Plumber,
          Helper: latestLog.wages.Helper || DEFAULT_STANDARD_WAGES.Helper
        });
      }
    }
    setIsLogging(true);
  };

  const handleSubmitLog = () => {
    const total = Object.values(newLogCounts).reduce((a, b) => Number(a) + Number(b), 0);
    const dateObj = new Date(logDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const totalPayoutForDay = Object.keys(newLogCounts).reduce((acc, role) => {
      const count = Number(newLogCounts[role]) || 0;
      const rate = Number(dailyWageRates[role]) || 0;
      return acc + (count * rate);
    }, 0);

    const newEntry: DailyAttendance = {
      date: formattedDate,
      Mason: newLogCounts.Mason,
      Carpenter: newLogCounts.Carpenter,
      Electrician: newLogCounts.Electrician,
      Plumber: newLogCounts.Plumber,
      Helper: newLogCounts.Helper,
      totalWorkers: total,
      wages: {
        Mason: Number(dailyWageRates.Mason) || DEFAULT_STANDARD_WAGES.Mason,
        Carpenter: Number(dailyWageRates.Carpenter) || DEFAULT_STANDARD_WAGES.Carpenter,
        Electrician: Number(dailyWageRates.Electrician) || DEFAULT_STANDARD_WAGES.Electrician,
        Plumber: Number(dailyWageRates.Plumber) || DEFAULT_STANDARD_WAGES.Plumber,
        Helper: Number(dailyWageRates.Helper) || DEFAULT_STANDARD_WAGES.Helper
      },
      totalPayout: totalPayoutForDay,
      notes: shiftNote,
      loggedByRole: userRole,
      loggedByName: userName || 'Site Supervisor'
    };

    const historyWithoutNewDate = attendanceHistory.filter(h => h.date !== formattedDate);
    const updatedHistory = [...historyWithoutNewDate, newEntry];
    
    setAttendanceHistory(updatedHistory);
    setIsLogging(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const entryData = attendanceHistory.find(h => h.date === label);
      return (
        <div className="bg-slate-900 text-white p-4 border border-slate-700 shadow-2xl rounded-2xl z-50 text-xs">
          <div className="flex items-center justify-between gap-4 border-b border-slate-700 pb-2 mb-2">
            <p className="font-bold text-white text-sm">{label}</p>
            {entryData?.notes && (
              <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/40">
                {entryData.notes}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => {
              const roleWage = entryData?.wages ? (entryData.wages as any)[entry.name] : DEFAULT_STANDARD_WAGES[entry.name];
              const rolePayout = (entry.value || 0) * (roleWage || 0);
              return (
                <div key={index} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                    <span className="font-medium text-slate-300">{entry.name}:</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-white">{entry.value} Workers</span>
                    <span className="text-slate-400 text-[10px] ml-1.5">(₹{roleWage}/day $\rightarrow$ {formatCurrency(rolePayout)})</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-700 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Total Workers:</span>
              <span className="font-bold text-indigo-400">
                {payload.reduce((acc: number, curr: any) => acc + curr.value, 0)} Workers
              </span>
            </div>
            {entryData?.totalPayout && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Total Daily Wage Payout:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {formatCurrency(entryData.totalPayout)}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in relative text-slate-900 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Users size={12} /> Workforce &amp; Daily Wage Ledger
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1">
              <BadgeCheck size={12} className="text-emerald-600" />
              Role: {userRole === UserRole.SITE_ENGINEER ? 'Site Engineer' : 'Site Manager'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <HardHat className="text-purple-600" /> Workforce Log Book &amp; Daily Wage Tracker
          </h2>
          <p className="text-sm text-slate-500">
            Log worker headcounts and custom daily wage rates per trade with instant payroll calculation for {project ? project.name : 'active project'}.
          </p>
        </div>

        <button 
          onClick={handleOpenLog}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:shadow-xl transition-all self-start md:self-auto"
        >
          <UserPlus size={16} /> Log Today's Attendance &amp; Wages
        </button>
      </div>

      {/* 4-Column Key Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active On-Site Workforce</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
            {activeWorkersToday} <span className="text-xs font-normal text-slate-500">Workers</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Recorded across 5 specialized trades</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-indigo-800 text-white p-5 rounded-2xl shadow-lg shadow-purple-600/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider">Today's Daily Wage Payout</span>
            <DollarSign size={18} className="text-purple-200" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">
            {formatCurrency(todaysTotalWagePayout)}
          </div>
          <p className="text-xs text-purple-200 mt-1 font-medium">
            Calculated at today's active wage rates
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Weekly Cumulative Wage Bill</span>
            <TrendingUp size={16} className="text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {formatCurrency(cumulativeWageBill)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Logged across {attendanceHistory.length} recorded site shifts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Avg Daily Wage / Worker</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {formatCurrency(averageWagePerWorker)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Weighted daily average across trades</p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ATTENDANCE & DAILY WAGE LOGGING MODAL                     */}
      {/* ========================================================= */}
      {isLogging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 my-8 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-purple-600 p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Log Daily Attendance &amp; Custom Wages</h3>
                  <p className="text-xs text-purple-100">Enter headcount and adjust today's daily wage rate per trade</p>
                </div>
              </div>
              <button 
                onClick={() => setIsLogging(false)} 
                className="hover:bg-purple-700 p-1.5 rounded-full transition-colors"
                title="Close"
              >
                <X size={20}/>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-900">
              {/* Date & Shift Type Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Attendance Date</label>
                  <input 
                    type="date" 
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Shift Specification / Note</label>
                  <input 
                    type="text" 
                    value={shiftNote}
                    onChange={(e) => setShiftNote(e.target.value)}
                    placeholder="e.g. Standard Shift, Overtime 2h included"
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Trade-by-Trade Inputs (Headcount + Daily Wage Rate) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Trade-Wise Attendance &amp; Daily Wage Rate (₹)
                  </label>
                  <span className="text-[11px] text-slate-400 italic">Adjust rates daily as needed</span>
                </div>

                {Object.keys(newLogCounts).map(role => {
                  const count = newLogCounts[role];
                  const rate = dailyWageRates[role] || DEFAULT_STANDARD_WAGES[role];
                  const subtotal = count * rate;

                  return (
                    <div key={role} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Role Identifier */}
                      <div className="flex items-center gap-2.5 min-w-[130px]">
                        <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: ROLE_COLORS[role] }} />
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">{role}</span>
                          <span className="text-[10px] text-slate-400">Default: ₹{DEFAULT_STANDARD_WAGES[role]}/day</span>
                        </div>
                      </div>

                      {/* Middle: Worker Count Controls */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 font-semibold mr-1">Count:</span>
                        <button 
                          onClick={() => setNewLogCounts({ ...newLogCounts, [role]: Math.max(0, newLogCounts[role] - 1) })}
                          className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors shadow-xs"
                        >
                          -
                        </button>
                        <input 
                          type="number"
                          min="0"
                          value={newLogCounts[role]}
                          onChange={(e) => setNewLogCounts({ ...newLogCounts, [role]: Math.max(0, parseInt(e.target.value) || 0) })}
                          className="w-12 text-center font-bold text-slate-900 bg-white border border-slate-300 rounded-xl py-1 text-sm focus:ring-2 focus:ring-purple-500"
                        />
                        <button 
                          onClick={() => setNewLogCounts({ ...newLogCounts, [role]: newLogCounts[role] + 1 })}
                          className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors shadow-xs"
                        >
                          +
                        </button>
                      </div>

                      {/* Right: Daily Wage Input (₹ / day) */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 font-semibold">Rate (₹):</span>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-bold">₹</span>
                          <input 
                            type="number"
                            min="0"
                            step="50"
                            value={dailyWageRates[role]}
                            onChange={(e) => setDailyWageRates({ ...dailyWageRates, [role]: Math.max(0, parseInt(e.target.value) || 0) })}
                            className="w-24 pl-6 pr-2 py-1 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 text-right"
                          />
                        </div>
                      </div>

                      {/* Subtotal Pill */}
                      <div className="text-right sm:min-w-[100px] border-t sm:border-t-0 pt-2 sm:pt-0">
                        <span className="text-[10px] text-slate-400 block font-semibold">Total Payout</span>
                        <span className="font-mono font-bold text-indigo-700 text-sm">
                          {formatCurrency(subtotal)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Daily Wage Summary Banner in Modal */}
              <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider block">Total Scheduled Workforce</span>
                  <span className="text-xl font-bold text-white">{modalTotalWorkers} Active Workers</span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">Today's Total Daily Wage Bill</span>
                  <span className="text-2xl font-extrabold text-emerald-300 font-mono">
                    {formatCurrency(modalTotalWagePayout)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button 
                onClick={() => setIsLogging(false)} 
                className="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitLog} 
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Save size={16} /> Save &amp; Publish Daily Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid: Dynamic Table & History Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Current Roster & Daily Wage Table (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-fit">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Users size={16} className="text-purple-600" /> Active Roster &amp; Daily Wage Breakdown
              </h3>
              <p className="text-[11px] text-slate-500">Live headcount × daily wage rate</p>
            </div>
            {latestLog && (
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={12} /> {latestLog.date}
              </span>
            )}
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-white text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 text-[11px]">
              <tr>
                <th className="p-3.5">Trade / Role</th>
                <th className="p-3.5 text-center">Active</th>
                <th className="p-3.5 text-right">Daily Wage</th>
                <th className="p-3.5 text-right">Today's Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: ROLE_COLORS[row.role] || '#ccc' }} />
                    {row.role}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded-lg font-bold ${row.count > 0 ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-400'}`}>
                      {row.count}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono text-slate-700 font-semibold">
                    ₹{row.dailyWage.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-indigo-700">
                    {formatCurrency(row.totalRolePayout)}
                  </td>
                </tr>
              ))}
              {/* Grand Total Row */}
              <tr className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-200">
                <td className="p-3.5">Total</td>
                <td className="p-3.5 text-center font-extrabold text-purple-700">
                  {tableData.reduce((acc, r) => acc + r.count, 0)}
                </td>
                <td className="p-3.5 text-right text-slate-400 font-normal text-[10px]">Grand Daily Sum</td>
                <td className="p-3.5 text-right font-mono font-extrabold text-emerald-700 text-sm">
                  {formatCurrency(todaysTotalWagePayout)}
                </td>
              </tr>
            </tbody>
          </table>

          {latestLog?.notes && (
            <div className="p-3 bg-purple-50/50 border-t border-purple-100 text-xs flex items-center gap-2 text-purple-900">
              <Info size={14} className="text-purple-600 shrink-0" />
              <span className="italic">Latest Shift Note: {latestLog.notes}</span>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Attendance & Wage Bill History (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col min-h-[420px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Workforce &amp; Wage Payout History</h3>
                <p className="text-xs text-slate-500">Track daily fluctuations in worker strength and daily wage expenditures</p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewMode('HEADCOUNT')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    viewMode === 'HEADCOUNT' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <BarChart2 size={13} /> Headcount
                </button>
                <button
                  onClick={() => setViewMode('WAGE_PAYOUT')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    viewMode === 'WAGE_PAYOUT' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <DollarSign size={13} /> Daily Wage Bill (₹)
                </button>
              </div>
            </div>

            {/* Recharts Render */}
            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {viewMode === 'HEADCOUNT' ? (
                  <BarChart data={attendanceHistory} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    
                    <Bar dataKey="Mason" stackId="a" fill={ROLE_COLORS['Mason']} />
                    <Bar dataKey="Carpenter" stackId="a" fill={ROLE_COLORS['Carpenter']} />
                    <Bar dataKey="Electrician" stackId="a" fill={ROLE_COLORS['Electrician']} />
                    <Bar dataKey="Plumber" stackId="a" fill={ROLE_COLORS['Plumber']} />
                    <Bar dataKey="Helper" stackId="a" fill={ROLE_COLORS['Helper']} radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <BarChart data={attendanceHistory} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#64748b' }} 
                      tickFormatter={(val) => `₹${val / 1000}k`} 
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar 
                      dataKey="totalPayout" 
                      name="Daily Wage Expenditure (₹)" 
                      fill="#7c3aed" 
                      radius={[6, 6, 0, 0]} 
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workforce;