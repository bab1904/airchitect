import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Mic, HardHat, Calculator, Scale, IndianRupee, Package, Bot, Sparkles } from 'lucide-react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage, UserRole, Project } from '../types';
import { MOCK_MATERIALS, MOCK_STATS } from '../constants';

interface AIAssistantProps {
  userRole: UserRole;
  project: Project | null;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ userRole, project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 'init', 
      role: 'model', 
      text: 'Hello! I am your AI Civil Engineering & Construction Assistant. Ask me about material quantities, costs in INR, IS Codes, or inventory stock.', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatSession, setChatSession] = useState<any>(null);

  const contextPrompt = React.useMemo(() => {
    const materialSummary = MOCK_MATERIALS.map(m => `- ${m.name}: ${m.quantity} ${m.unit} in stock (Rate: ₹${m.unitPrice}/${m.unit})`).join('\n');
    const budgetSummary = `Total Budget: ₹${MOCK_STATS.totalBudget}, Spent: ₹${MOCK_STATS.spent}, Progress: ${MOCK_STATS.progress}%, Days Remaining: ${MOCK_STATS.daysRemaining}`;
    
    return `
        You are an expert Virtual Civil Engineer and Construction Advisor named "AIrchitect Assistant".
        
        PROJECT CONTEXT:
        - Project: ${project ? project.name : "General Site"}
        - Location: ${project ? project.location : "India"}
        - Financials: ${budgetSummary}
        
        SITE INVENTORY:
        ${materialSummary}
        
        USER ROLE: ${userRole}
    `;
  }, [project, userRole]);

  useEffect(() => {
    if (isOpen && !chatSession) {
      try {
        setChatSession(createChatSession(contextPrompt));
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen, contextPrompt, chatSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const session = chatSession || createChatSession(contextPrompt);

    try {
      if (session.sendMessageStream) {
        const result = await session.sendMessageStream({ message: userMsg.text });
        let fullText = "";
        const botMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '', timestamp: new Date() }]);

        for await (const chunk of result) {
          if (chunk.text) {
            fullText += chunk.text;
            setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: fullText } : m));
          }
        }
      } else {
        const res = await session.sendMessage({ message: userMsg.text });
        const replyText = res.text || res || "I have analyzed your request based on standard civil engineering guidelines.";
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'model', 
          text: replyText, 
          timestamp: new Date() 
        }]);
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "Based on civil engineering norms: For structural calculations, ensure standard safety factors (1.5 for dead/live load combinations under IS 456). How can I assist with your materials or schedule?", 
        timestamp: new Date() 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev ? `${prev} ${transcript}` : transcript);
    };
    recognition.start();
  };

  const suggestions = [
    { icon: Calculator, label: "Quantity Check", query: "How many bags of cement for 10 cubic meters of M25 concrete?" },
    { icon: IndianRupee, label: "Cost Benchmark", query: "What is the standard cost per sqft for residential turnkey construction?" },
    { icon: Package, label: "Stock Check", query: "Do we have sufficient cement and TMT steel in inventory?" }, 
    { icon: Scale, label: "Material Compare", query: "Compare AAC blocks vs Red bricks for high-rise buildings." },
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-2xl shadow-2xl transition-all z-50 flex items-center justify-center ${
          isOpen ? 'bg-red-500 hover:bg-red-600 rotate-90' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105'
        }`}
        title={isOpen ? "Close Assistant" : "Open AI Civil Engineer Assistant"}
      >
        {isOpen ? <X color="white" size={24} /> : <HardHat color="white" size={24} />}
      </button>

      {/* Chat Drawer Dialog */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[400px] max-w-[calc(100vw-32px)] h-[580px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-fade-in-up font-sans">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  AIrchitect Assistant <Sparkles size={13} className="text-yellow-400" />
                </h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Civil Engineer AI Online
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Questions Strip */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto flex gap-2 shrink-0">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s.query)}
                className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
              >
                <s.icon size={12} className="text-indigo-600" />
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'model' && (
                  <div className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot size={15} />
                  </div>
                )}
                
                <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white font-medium rounded-tr-xs shadow-sm' 
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-xs space-y-1'
                }`}>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>

                {m.role === 'user' && (
                  <div className="w-7 h-7 bg-slate-800 text-white rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-xs">
                    U
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-slate-400">
                <div className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center shrink-0 shadow-xs">
                  <Bot size={15} />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <button
              onClick={handleVoiceInput}
              className={`p-2 rounded-xl border transition-colors ${
                isListening ? 'bg-red-500 text-white border-red-600 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
              }`}
              title="Voice input"
            >
              <Mic size={16} />
            </button>

            <input
              type="text"
              placeholder="Ask quantities, rates, IS codes..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400"
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-all shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;