import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { UserRole } from '../types';
import { MOCK_TEAM_MESSAGES } from '../constants';
import { MessageSquare, Send, X } from 'lucide-react';
const TeamChatWidget = ({ project, userRole, variant }) => {
    // Initialize from global mock to ensure persistence across views
    const [messages, setMessages] = useState(MOCK_TEAM_MESSAGES.filter(m => m.projectId === project.id || m.projectId === 'p1'));
    const [newMessage, setNewMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false); // Only used for popup mode
    const chatEndRef = useRef(null);
    useEffect(() => {
        // Refresh messages when opening or changing project
        setMessages(MOCK_TEAM_MESSAGES.filter(m => m.projectId === project.id || m.projectId === 'p1'));
    }, [project.id, isOpen]);
    useEffect(() => {
        if (variant === 'embedded' || isOpen) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, variant]);
    const handleSendMessage = () => {
        if (!newMessage.trim())
            return;
        const msg = {
            id: Date.now().toString(),
            projectId: project.id,
            senderId: 'current-user',
            senderName: userRole === UserRole.CLIENT ? 'You (Client)' : 'You',
            senderRole: userRole,
            text: newMessage,
            timestamp: new Date().toISOString()
        };
        // MOCK BACKEND PERSISTENCE: Push to the global array so it persists navigation
        MOCK_TEAM_MESSAGES.push(msg);
        setMessages((prev) => [...prev, msg]);
        setNewMessage('');
    };
    // --- POPUP BUTTON (Only for Popup Mode when closed) ---
    if (variant === 'popup' && !isOpen) {
        return (_jsx("button", { onClick: () => setIsOpen(true), className: "fixed bottom-6 right-24 p-4 rounded-full shadow-xl bg-indigo-600 hover:bg-indigo-700 transition-all z-50 flex items-center justify-center text-white animate-bounce-subtle", title: "Project Team Chat", children: _jsx(MessageSquare, { size: 24 }) }));
    }
    // --- CHAT WINDOW UI ---
    const containerClasses = variant === 'popup'
        ? "fixed bottom-24 right-24 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-fade-in-up"
        : "bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[500px]";
    return (_jsxs("div", { className: containerClasses, children: [_jsxs("div", { className: `p-4 border-b border-slate-200 flex justify-between items-center ${variant === 'popup' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 rounded-t-xl text-slate-800'}`, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MessageSquare, { size: 18, className: variant === 'popup' ? 'text-white' : 'text-indigo-600' }), _jsx("h3", { className: "font-bold", children: "Team Chat" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: `text-xs px-2 py-1 rounded-full ${variant === 'popup' ? 'bg-indigo-500 text-white' : 'bg-indigo-200 text-indigo-800'}`, children: [messages.length, " msgs"] }), variant === 'popup' && (_jsx("button", { onClick: () => setIsOpen(false), className: "hover:bg-indigo-700 p-1 rounded transition-colors", children: _jsx(X, { size: 18 }) }))] })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50", children: [messages.length === 0 ? (_jsx("div", { className: "text-center text-slate-400 mt-10 text-sm", children: userRole === UserRole.CLIENT
                            ? "Ask for changes or clarify doubts here."
                            : "No messages yet. Start the conversation!" })) : (messages.map((msg) => {
                        const isMe = msg.senderId === 'current-user';
                        return (_jsxs("div", { className: `flex flex-col ${isMe ? 'items-end' : 'items-start'}`, children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "text-xs font-bold text-slate-700", children: msg.senderName }), _jsx("span", { className: "text-[10px] text-slate-400", children: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })] }), _jsx("div", { className: `px-3 py-2 rounded-lg text-sm max-w-[85%] ${isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`, children: msg.text })] }, msg.id));
                    })), _jsx("div", { ref: chatEndRef })] }), _jsx("div", { className: `p-3 bg-white border-t border-slate-200 ${variant === 'embedded' ? 'rounded-b-xl' : ''}`, children: _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", className: "flex-1 bg-white text-slate-900 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400", placeholder: "Ask for changes or updates...", value: newMessage, onChange: (e) => setNewMessage(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleSendMessage() }), _jsx("button", { onClick: handleSendMessage, disabled: !newMessage.trim(), className: "bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50", children: _jsx(Send, { size: 18 }) })] }) })] }));
};
export default TeamChatWidget;
