import React from 'react';
import { Project, UserRole } from '../types';
import { MOCK_DAILY_ATTENDANCE, MOCK_WORKERS, MOCK_DOCUMENTS, MOCK_PERMITS } from '../constants';
import { Calendar, Clock, IndianRupee, FileText, CheckCircle2, BarChart3, ShieldCheck, FileBadge } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import TeamChatWidget from './TeamChatWidget';

interface ProjectExplorerProps {
  project: Project;
  userRole: UserRole;
}

const ProjectExplorer: React.FC<ProjectExplorerProps> = ({ project, userRole }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumSignificantDigits: 3
    }).format(val || 0);
  };

  // --- 1. CALCULATIONS ---
  const { 
    progressPercentage, 
    laborCostData, 
    totalLaborCost, 
    actualTotalSpent, 
    daysRemaining, 
    isOverdue, 
    phases 
  } = React.useMemo(() => {
    // Progress calculation
    let progress = 0;
    if (project.status === 'Completed') progress = 100;
    else if (project.status === 'Planning') progress = 5;
    else if (project.id === 'p1') progress = 58;
    else progress = 35;

    // Labor Cost calculation
    const roles = ['Mason', 'Carpenter', 'Electrician', 'Plumber', 'Helper'];
    const roleWages: {[key:string]: number} = {};
    MOCK_WORKERS.forEach(w => roleWages[w.role] = w.hourlyRate);

    let laborCost = 0;
    const laborData = roles.map(role => {
        const totalDaysWorked = MOCK_DAILY_ATTENDANCE.reduce((acc, day) => {
            return acc + (day[role as keyof typeof day] as number || 0);
        }, 0);
        
        const wage = roleWages[role] || 500; 
        const amount = totalDaysWorked * wage;
        laborCost += amount;

        return { role, amount };
    });

    // Spent calculation
    const totalTargetSpent = project.budget * (progress / 100);
    const estimatedMaterialSpent = Math.max(0, totalTargetSpent - laborCost);
    const totalSpent = laborCost + estimatedMaterialSpent;

    // Time calculations
    const today = new Date();
    const completion = new Date(project.completionDate);
    const validCompletion = !isNaN(completion.getTime()) ? completion : new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    const diffTime = validCompletion.getTime() - today.getTime();
    const remaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    // Phase calculations
    const startDate = new Date(validCompletion);
    startDate.setMonth(startDate.getMonth() - 12);
    const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const phasesDefinition = [
        { name: 'Planning & Approval', threshold: 15, monthOffset: 2 },
        { name: 'Foundation Works', threshold: 35, monthOffset: 4 },
        { name: 'Superstructure', threshold: 65, monthOffset: 8 },
        { name: 'MEP & Finishing', threshold: 90, monthOffset: 10 },
        { name: 'Handover', threshold: 100, monthOffset: 12 }
    ];

    const phases = phasesDefinition.map((p, index) => {
        const phaseDate = new Date(startDate);
        phaseDate.setMonth(phaseDate.getMonth() + p.monthOffset);
        let status = 'Pending';
        if (progress >= p.threshold) status = 'Completed';
        else {
             const prevThreshold = index === 0 ? 0 : phasesDefinition[index - 1].threshold;
             if (progress >= prevThreshold) status = 'In Progress';
        }
        return { ...p, status, date: formatDate(phaseDate) };
    });

    return {
        progressPercentage: progress,
        laborCostData: laborData,
        totalLaborCost: laborCost,
        actualTotalSpent: totalSpent,
        daysRemaining: remaining,
        isOverdue: remaining < 0,
        phases: phases
    };
  }, [project]);

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6'];


  // Combine Documents for Dashboard View
  const recentDocs = [...MOCK_DOCUMENTS, ...MOCK_PERMITS]
    .filter(d => d.projectId === project.id || d.projectId === 'p1')
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="p-6 space-y-8 animate-fade-in">
        {/* Header */}
        <div>
            <h2 className="text-3xl font-bold text-slate-800">{project.name}</h2>
            <div className="flex items-center gap-4 text-slate-500 mt-2">
                <span className="flex items-center gap-1"><Calendar size={16}/> Est. Completion: {project.completionDate}</span>
                <span className="flex items-center gap-1"><IndianRupee size={16}/> Budget: {formatCurrency(project.budget)}</span>
            </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-slate-500">Project Timeline</h3>
                    <Clock className={isOverdue ? "text-red-600" : "text-indigo-600"} size={20} />
                </div>
                <div className={`text-2xl font-bold ${isOverdue ? "text-red-600" : "text-slate-900"}`}>
                    {isOverdue ? `Overdue by ${Math.abs(daysRemaining)} Days` : `${daysRemaining} Days`}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                    {isOverdue ? "Completion delayed" : "Remaining until handover"}
                </p>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
                    <div 
                        className={`h-2 rounded-full ${isOverdue ? "bg-red-500" : "bg-indigo-600"}`} 
                        style={{width: `${Math.min(100, (1 - Math.max(0, daysRemaining)/365)*100)}%`}}
                    ></div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-slate-500">Financial Overview</h3>
                    <IndianRupee className="text-green-600" size={20} />
                </div>
                <div className="text-2xl font-bold text-slate-900">{formatCurrency(actualTotalSpent)}</div>
                <p className="text-xs text-slate-500 mt-1">Spent out of {formatCurrency(project.budget)}</p>
                <div className="mt-4 flex gap-2 text-xs items-center">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${progressPercentage > 90 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${progressPercentage}%`}}></div>
                    </div>
                    <span className="font-bold">{progressPercentage}%</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-slate-500">Generated Documents</h3>
                    <FileText className="text-orange-600" size={20} />
                </div>
                <div className="text-2xl font-bold text-slate-900">{MOCK_DOCUMENTS.length + MOCK_PERMITS.length} Total</div>
                <p className="text-xs text-slate-500 mt-1">Tenders, Agreements & Permits</p>
                <div className="mt-4 text-xs text-indigo-600 font-medium">
                    See 'Documents & Contracts' in sidebar
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Phase Timeline */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[500px] overflow-y-auto">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Construction Roadmap</h3>
                <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                    <div className="space-y-8">
                        {phases.map((phase, idx) => (
                            <div key={idx} className="relative flex items-center gap-6 pl-4">
                                <div className={`absolute left-[-5px] w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${
                                    phase.status === 'Completed' ? 'bg-green-500' : 
                                    phase.status === 'In Progress' ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'
                                }`}>
                                    {phase.status === 'Completed' && <CheckCircle2 size={12} className="text-white" />}
                                </div>
                                <div className={`flex-1 p-4 rounded-lg flex justify-between items-center transition-all ${
                                    phase.status === 'In Progress' ? 'bg-blue-50 border border-blue-100 shadow-sm' : 'bg-slate-50 hover:bg-slate-100'
                                }`}>
                                    <div>
                                        <h4 className={`font-semibold ${phase.status === 'In Progress' ? 'text-blue-800' : 'text-slate-900'}`}>
                                            {phase.name}
                                        </h4>
                                        <p className="text-sm text-slate-500">{phase.status}</p>
                                    </div>
                                    <span className={`text-sm font-mono ${phase.status === 'In Progress' ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                                        {phase.date}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Chat - EMBEDDED MODE */}
            <div className="lg:col-span-1">
                <TeamChatWidget project={project} userRole={userRole} variant="embedded" />
            </div>
        </div>

        {/* Bottom Section: Docs & Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Labor Cost Analysis Chart */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <BarChart3 size={18} className="text-indigo-600"/> Labor Cost Distribution
                    </h3>
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">Total: {formatCurrency(totalLaborCost)}</span>
                 </div>
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={laborCostData} layout="vertical" margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="role" type="category" width={80} tick={{fontSize: 12}} />
                            <Tooltip 
                                cursor={{fill: 'transparent'}}
                                formatter={(value: number) => [`₹${(value || 0).toLocaleString('en-IN')}`, 'Total Spent']}
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            />
                            <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                                {laborCostData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
             </div>

             {/* Recent Documents & Blueprints */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                 <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileBadge size={18} className="text-orange-600" /> Recent Documents
                 </h3>
                 <div className="flex-1 space-y-3">
                    {recentDocs.length > 0 ? recentDocs.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
                            <div className="flex items-center gap-3">
                                {doc.type.includes('Permit') ? <ShieldCheck className="text-teal-500" size={18}/> : <FileText className="text-indigo-500" size={18}/>}
                                <div>
                                    <p className="font-semibold text-sm text-slate-800">{doc.title}</p>
                                    <p className="text-xs text-slate-500">{doc.type}</p>
                                </div>
                            </div>
                            <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{doc.status}</span>
                        </div>
                    )) : (
                        <p className="text-slate-400 text-sm">No documents generated yet.</p>
                    )}
                 </div>
                 <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-700 mb-2">Latest Blueprints</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="group relative rounded-lg overflow-hidden shadow-sm cursor-pointer aspect-video bg-slate-100">
                            <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=400" alt="Ground Floor" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 text-white text-[10px] text-center">Ground Floor</div>
                        </div>
                        <div className="group relative rounded-lg overflow-hidden shadow-sm cursor-pointer aspect-video bg-slate-100">
                            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400" alt="Electrical" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 text-white text-[10px] text-center">Electrical</div>
                        </div>
                    </div>
                 </div>
             </div>
        </div>
    </div>
  );
};

export default ProjectExplorer;