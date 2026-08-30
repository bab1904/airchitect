import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Mic, Bot, HardHat, Calculator, Scale, IndianRupee, Package } from 'lucide-react';
import { createChatSession } from '../services/geminiService';
import { MOCK_MATERIALS, MOCK_STATS } from '../constants';
const AIAssistant = ({ userRole, project }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 'init', role: 'model', text: 'Hi! I am your Virtual Civil Engineer. Ask me about material quantities, costs, or design comparisons.', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const [chatSession, setChatSession] = useState(null);
    // Memoize context data to avoid re-calculating on every render
    const contextPrompt = React.useMemo(() => {
        const materialSummary = MOCK_MATERIALS.map(m => `- ${m.name}: ${m.quantity} ${m.unit} in stock (Rate: ₹${m.unitPrice}/${m.unit})`).join('\n');
        const budgetSummary = `Total Budget: ₹${MOCK_STATS.totalBudget}, Spent: ₹${MOCK_STATS.spent}, Progress: ${MOCK_STATS.progress}%, Days Remaining: ${MOCK_STATS.daysRemaining}`;
        return `
        You are an expert Virtual Civil Engineer and Construction Advisor named "AIrchitect Assistant".
        
        PROJECT CONTEXT (Real-time Data):
        - Project Name: ${project ? project.name : "General Inquiry"}
        - Location: ${project ? project.location : "Unknown"}
        - Financials: ${budgetSummary}
        
        SITE INVENTORY (Available Stock):
        ${materialSummary}
        
        YOUR CAPABILITIES:
        1. Quantity Surveying: Calculate materials needed (e.g., "How many tiles for 100 sqft?"). Always ask for dimensions if not provided.
        2. Cost Estimation: Estimate costs using the provided material rates or standard market rates (INR).
        3. Inventory Checks: Answer questions about current stock (e.g., "Do we have enough cement?").
        4. Technical Comparisons: Compare materials technically and economically (e.g., "AAC block vs Red Brick").
        5. Design Advice: Describe floor plan layouts conceptually.
        
        CURRENT USER:
        - Role: ${userRole}
        
        RULES:
        1. If the user is a CLIENT, avoid technical jargon where possible.
        2. If the user is a SITE MANAGER/ENGINEER, be precise with technical specifications and IS Codes (Indian Standards).
        3. Use the Real-time Data provided above to answer questions about budget and stock accurately.
        4. Keep answers structured, concise, and helpful.
    `;
    }, [project, userRole]);
    // Re-create session if context changes
    useEffect(() => {
        if (isOpen && !chatSession) {
            setChatSession(createChatSession(contextPrompt));
        }
    }, [isOpen, contextPrompt, chatSession]);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    const handleSend = async (textOverride) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim() || !chatSession)
            return;
        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            text: textToSend,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);
        try {
            const result = await chatSession.sendMessageStream({ message: userMsg.text });
            let fullText = "";
            const botMsgId = (Date.now() + 1).toString();
            // Optimistically add bot message
            setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '', timestamp: new Date() }]);
            for await (const chunk of result) {
                const c = chunk;
                if (c.text) {
                    fullText += c.text;
                    setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: fullText } : m));
                }
            }
        }
        catch (error) {
            console.error("Chat error", error);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Sorry, I encountered an error. Please check your connection.", timestamp: new Date() }]);
        }
        finally {
            setIsTyping(false);
        }
    };
    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
            };
            recognition.start();
        }
        else {
            alert("Voice input not supported in this browser.");
        }
    };
    const suggestions = [
        { icon: Calculator, label: "Quantity Check", query: "How many 2x2 vitrified tiles do I need for a 12x14 ft room?" },
        { icon: IndianRupee, label: "Cost Estimate", query: "What is the approximate cost for a 1000 sqft RCC slab?" },
        { icon: Package, label: "Stock Check", query: "Do we have enough cement for the foundation work?" },
        { icon: Scale, label: "Material Compare", query: "Compare AAC blocks vs Red bricks for this project." },
    ];
    return (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setIsOpen(!isOpen), className: `fixed bottom-6 right-6 p-4 rounded-full shadow-xl transition-all z-50 flex items-center justify-center ${isOpen ? 'bg-red-500 hover:bg-red-600 rotate-90' : 'bg-indigo-600 hover:bg-indigo-700'}`, children: isOpen ? _jsx(X, { color: "white" }) : _jsx(HardHat, { color: "white" }) }), isOpen && (_jsxs("div", { className: "fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-40 overflow-hidden animate-fade-in-up", children: [_jsxs("div", { className: "bg-indigo-600 p-4 text-white flex items-center gap-2", children: [_jsx(Bot, { size: 20 }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold leading-tight", children: "Construction Advisor" }), _jsx("p", { className: "text-xs opacity-80 font-light", children: "Virtual Civil Engineer" })] })] }), _jsxs("div", { className: "flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4", children: [messages.map(msg => (_jsx("div", { className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`, children: _jsx("div", { className: "whitespace-pre-wrap", children: msg.text }) }) }, msg.id))), messages.length < 3 && !isTyping && (_jsx("div", { className: "grid grid-cols-2 gap-2 mt-4", children: suggestions.map((s, idx) => (_jsxs("button", { onClick: () => handleSend(s.query), className: "bg-white border border-slate-200 p-2 rounded-lg text-xs text-left hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex flex-col gap-1 shadow-sm", children: [_jsx(s.icon, { size: 14, className: "text-indigo-600" }), _jsx("span", { className: "font-medium text-slate-700", children: s.label })] }, idx))) })), isTyping && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm", children: _jsxs("div", { className: "flex gap-1", children: [_jsx("div", { className: "w-2 h-2 bg-slate-400 rounded-full animate-bounce" }), _jsx("div", { className: "w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" }), _jsx("div", { className: "w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" })] }) }) })), _jsx("div", { ref: messagesEndRef })] }), _jsx("div", { className: "p-3 bg-white border-t border-slate-200", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: handleVoiceInput, className: "p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors", children: _jsx(Mic, { size: 20 }) }), _jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleSend(), placeholder: "Ask about materials, costs, plans...", className: "flex-1 bg-white text-slate-900 border border-slate-200 rounded-full px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm placeholder-slate-400" }), _jsx("button", { onClick: () => handleSend(), disabled: !input.trim(), className: "p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors disabled:opacity-50", children: _jsx(Send, { size: 20 }) })] }) })] }))] }));
};
export default AIAssistant;
