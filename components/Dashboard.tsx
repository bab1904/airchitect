import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MOCK_STATS } from '../constants';
import { TrendingUp, AlertTriangle, Users, Clock } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DATA_SPEND = [
  { name: 'Material', value: 4500000 },
  { name: 'Labor', value: 3000000 },
  { name: 'Equipment', value: 1000000 },
];

const DATA_PROGRESS = [
  { name: 'Foundation', progress: 100 },
  { name: 'Structure', progress: 85 },
  { name: 'Brickwork', progress: 40 },
  { name: 'Finishing', progress: 10 },
];

const Dashboard: React.FC = () => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumSignificantDigits: 3
    }).format(val || 0);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Project Overview</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500">Total Budget</p>
                <p className="text-xl font-bold text-slate-900 flex items-center">
                    {formatCurrency(MOCK_STATS.totalBudget)}
                </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <TrendingUp size={24} />
            </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500">Spent to Date</p>
                <p className="text-xl font-bold text-slate-900 flex items-center">
                    {formatCurrency(MOCK_STATS.spent)}
                </p>
            </div>
            <div className={`p-2 rounded-lg ${MOCK_STATS.spent > MOCK_STATS.totalBudget * 0.6 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                <div className="text-xs font-mono">{Math.round((MOCK_STATS.spent/MOCK_STATS.totalBudget)*100)}%</div>
            </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500">Active Workforce</p>
                <p className="text-xl font-bold text-slate-900">12</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <Users size={24} />
            </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500">Days Remaining</p>
                <p className="text-xl font-bold text-slate-900">{MOCK_STATS.daysRemaining}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <Clock size={24} />
            </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DATA_SPEND}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DATA_SPEND.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => `₹${(val || 0).toLocaleString('en-IN')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm text-slate-500 mt-2">
            {DATA_SPEND.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                    {entry.name}
                </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Phase Progress (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA_PROGRESS} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="progress" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="text-blue-600 mt-1" size={20} />
        <div>
            <h4 className="font-semibold text-blue-800">AI Insight</h4>
            <p className="text-sm text-blue-700">
                Based on current consumption, you may need to order <strong>Tata TMT Bars</strong> by Friday. Also, <strong>Red Bricks</strong> consumption is 5% higher than estimated for the Brickwork phase.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;