
import React, { useState } from 'react';
import { Project, UserRole, TeamMember } from '../types';
import { Users, Trash2, Mail, Plus, Info } from 'lucide-react';

interface TeamManagementProps {
  project: Project;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ project }) => {
  const [team, setTeam] = useState<TeamMember[]>(project.team || []);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.SITE_MANAGER);

  const handleAddMember = () => {
    if (!newEmail || !newName) return;
    
    const newMember: TeamMember = {
        id: Date.now().toString(),
        name: newName,
        email: newEmail,
        role: newRole
    };
    setTeam([...team, newMember]);
    setNewName('');
    setNewEmail('');
  };

  const handleRemoveMember = (id: string) => {
    setTeam(team.filter(m => m.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
       <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Users className="text-indigo-600" /> Team & Access Management
            </h2>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Member Form */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
                    <h3 className="font-semibold text-lg mb-4">Add Team Member</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 placeholder-slate-400"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                value={newEmail}
                                onChange={e => setNewEmail(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 placeholder-slate-400"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role & Access</label>
                            <select 
                                value={newRole}
                                onChange={e => setNewRole(e.target.value as UserRole)}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
                            >
                                <option value={UserRole.SITE_MANAGER}>Site Manager</option>
                                <option value={UserRole.SITE_ENGINEER}>Site Engineer</option>
                                <option value={UserRole.CLIENT}>Client</option>
                            </select>
                        </div>
                        <button 
                            onClick={handleAddMember}
                            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 font-medium"
                        >
                            <Plus size={18} /> Send Invitation
                        </button>
                    </div>
                </div>

                {/* Role Guide for Managers */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold">
                        <Info size={18} /> Role Permissions Guide
                    </div>
                    <p className="text-xs text-blue-700 mb-3">Control who can access Docs, Contracts, and Finance data by assigning the correct role:</p>
                    <ul className="text-xs space-y-2 text-slate-600">
                        <li>
                            <strong className="text-slate-800">Site Manager:</strong> Full Access to Inventory, Workforce, Contracts, Permits & AI Optimizer.
                        </li>
                        <li>
                            <strong className="text-slate-800">Client:</strong> Access to Dashboard, Schedule, Contracts, Permits & Optimizer (View Only).
                        </li>
                        <li>
                            <strong className="text-slate-800">Site Engineer:</strong> Restricted. Can log work/attendance & check codes. <span className="text-red-500 font-bold">No access</span> to Contracts, Permits, or Financial Optimizer.
                        </li>
                    </ul>
                </div>
            </div>

            {/* Team List */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
                <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                    Active Members ({team.length})
                </div>
                <div className="divide-y divide-slate-100">
                    {team.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">No team members added yet.</div>
                    ) : (
                        team.map(member => (
                            <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800">{member.name}</h4>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Mail size={12} /> {member.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                        member.role === UserRole.CLIENT ? 'bg-green-100 text-green-700 border-green-200' :
                                        member.role === UserRole.PROJECT_MANAGER ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                        member.role === UserRole.SITE_MANAGER ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                        'bg-blue-100 text-blue-700 border-blue-200'
                                    }`}>
                                        {member.role}
                                    </span>
                                    <button 
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                        title="Remove Member"
                                    >
                                        <Trash2 size={18} />
                                    </button>
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

export default TeamManagement;
