import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { UserRole } from '../types';
import { authService } from '../services/authService';
import { Mail, Lock, User, Briefcase, HardHat, ClipboardCheck, ArrowRight } from 'lucide-react';
const Auth = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Password is visual only for mock
    const [name, setName] = useState('');
    const [role, setRole] = useState(UserRole.SITE_MANAGER);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            let user;
            if (isLogin) {
                user = await authService.login(email);
            }
            else {
                if (!name)
                    throw new Error("Name is required");
                user = await authService.register(name, email, role);
            }
            onLogin(user);
        }
        catch (err) {
            setError(err.message || 'Authentication failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-slate-900 flex items-center justify-center p-6", children: _jsxs("div", { className: "bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up", children: [_jsxs("div", { className: "bg-indigo-600 p-8 text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 bg-white rounded-lg mb-4 text-indigo-600 font-bold text-xl shadow-md", children: "AI" }), _jsx("h1", { className: "text-2xl font-bold text-white tracking-tight", children: "AIrchitect" }), _jsx("p", { className: "text-indigo-200 text-sm mt-1", children: isLogin ? 'Welcome back! Login to continue.' : 'Create an account to get started.' })] }), _jsxs("div", { className: "p-8", children: [_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [!isLogin && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Full Name" }), _jsxs("div", { className: "relative", children: [_jsx(User, { className: "absolute left-3 top-3 text-slate-400", size: 18 }), _jsx("input", { type: "text", required: true, value: name, onChange: (e) => setName(e.target.value), className: "w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder-slate-400", placeholder: "John Doe" })] })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-3 text-slate-400", size: 18 }), _jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder-slate-400", placeholder: "name@company.com" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-3 text-slate-400", size: 18 }), _jsx("input", { type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder-slate-400", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] })] }), !isLogin && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Select Role" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: [
                                                { r: UserRole.PROJECT_MANAGER, label: 'Manager', icon: Briefcase },
                                                { r: UserRole.SITE_MANAGER, label: 'Supervisor', icon: HardHat },
                                                { r: UserRole.SITE_ENGINEER, label: 'Engineer', icon: ClipboardCheck },
                                                { r: UserRole.CLIENT, label: 'Client', icon: User },
                                            ].map((opt) => (_jsxs("div", { onClick: () => setRole(opt.r), className: `cursor-pointer border rounded-lg p-2 flex flex-col items-center gap-1 text-center transition-all ${role === opt.r ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-slate-200 hover:bg-slate-50'}`, children: [_jsx(opt.icon, { size: 16 }), _jsx("span", { className: "text-xs font-medium", children: opt.label })] }, opt.r))) })] })), error && (_jsx("div", { className: "text-red-500 text-sm bg-red-50 p-2 rounded text-center", children: error })), _jsxs("button", { type: "submit", disabled: loading, className: `w-full py-3 rounded-lg text-white font-bold flex items-center justify-center gap-2 transition-all ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'}`, children: [loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account'), !loading && _jsx(ArrowRight, { size: 18 })] })] }), _jsxs("div", { className: "mt-6 text-center", children: [_jsxs("p", { className: "text-sm text-slate-600", children: [isLogin ? "Don't have an account? " : "Already have an account? ", _jsx("button", { onClick: () => { setIsLogin(!isLogin); setError(''); }, className: "text-indigo-600 font-bold hover:underline focus:outline-none", children: isLogin ? 'Sign Up' : 'Login' })] }), isLogin && (_jsx("div", { className: "mt-4 text-xs text-slate-400", children: "Demo Accounts: admin@airchitect.com, site@airchitect.com" }))] })] })] }) }));
};
export default Auth;
