
import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { authService } from '../services/authService';
import { Mail, Lock, User, Briefcase, HardHat, ClipboardCheck, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Password is visual only for mock
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.SITE_MANAGER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        let user;
        if (isLogin) {
            user = await authService.login(email);
        } else {
            if (!name) throw new Error("Name is required");
            user = await authService.register(name, email, role);
        }
        onLogin(user);
    } catch (err: any) {
        setError(err.message || 'Authentication failed');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-center">
             <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-lg mb-4 text-indigo-600 font-bold text-xl shadow-md">AI</div>
             <h1 className="text-2xl font-bold text-white tracking-tight">AIrchitect</h1>
             <p className="text-indigo-200 text-sm mt-1">{isLogin ? 'Welcome back! Login to continue.' : 'Create an account to get started.'}</p>
        </div>

        {/* Form */}
        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name (Signup Only) */}
                {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>
                )}

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                            placeholder="name@company.com"
                        />
                    </div>
                </div>

                {/* Password (Visual Only) */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {/* Role Selection (Signup Only) */}
                {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Role</label>
                        <div className="grid grid-cols-2 gap-2">
                             {[
                                 { r: UserRole.PROJECT_MANAGER, label: 'Manager', icon: Briefcase },
                                 { r: UserRole.SITE_MANAGER, label: 'Supervisor', icon: HardHat },
                                 { r: UserRole.SITE_ENGINEER, label: 'Engineer', icon: ClipboardCheck },
                                 { r: UserRole.CLIENT, label: 'Client', icon: User },
                             ].map((opt) => (
                                 <div 
                                    key={opt.r}
                                    onClick={() => setRole(opt.r)}
                                    className={`cursor-pointer border rounded-lg p-2 flex flex-col items-center gap-1 text-center transition-all ${
                                        role === opt.r ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-slate-200 hover:bg-slate-50'
                                    }`}
                                 >
                                     <opt.icon size={16} />
                                     <span className="text-xs font-medium">{opt.label}</span>
                                 </div>
                             ))}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="text-red-500 text-sm bg-red-50 p-2 rounded text-center">
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-3 rounded-lg text-white font-bold flex items-center justify-center gap-2 transition-all ${
                        loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                    }`}
                >
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
                    {!loading && <ArrowRight size={18} />}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="text-indigo-600 font-bold hover:underline focus:outline-none"
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
                {isLogin && (
                    <div className="mt-4 text-xs text-slate-400">
                        Demo Accounts: admin@airchitect.com, site@airchitect.com
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
