import React from 'react';
import { UserRole } from '../types';
import { HardHat, User, ClipboardCheck } from 'lucide-react';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
  const roles = [
    { 
      id: UserRole.SITE_MANAGER, 
      label: 'Site Manager', 
      icon: HardHat, 
      desc: 'Manage daily site operations, workforce, materials, and contracts.',
      color: 'bg-orange-600'
    },
    { 
      id: UserRole.SITE_ENGINEER, 
      label: 'Site Engineer', 
      icon: ClipboardCheck, 
      desc: 'Technical planning, blueprints, code compliance, and estimations.',
      color: 'bg-blue-600'
    },
    { 
      id: UserRole.CLIENT, 
      label: 'Client / Owner', 
      icon: User, 
      desc: 'Track live construction progress, schedules, and request changes.',
      color: 'bg-green-600'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500 rounded-xl mb-4 text-white font-bold text-2xl shadow-lg">AI</div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">AIrchitect</h1>
            <p className="text-slate-400 text-lg">Select your role to access the workspace</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className="bg-slate-800 border border-slate-700 hover:border-indigo-500 hover:bg-slate-750 rounded-2xl p-6 text-left transition-all duration-200 group hover:-translate-y-1 shadow-lg"
            >
              <div className={`${role.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                <role.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{role.label}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{role.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;