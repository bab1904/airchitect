import React, { useState } from 'react';
import { Project } from '../types';
import { generateProjectOutline } from '../services/geminiService';
import { Mic, Sparkles, ArrowRight, X, Building2, MapPin, IndianRupee } from 'lucide-react';
import { MOCK_PROJECTS } from '../constants';

interface NewProjectWizardProps {
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

const NewProjectWizard: React.FC<NewProjectWizardProps> = ({ onClose, onProjectCreated }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Form Inputs
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  
  // AI Output
  const [aiPlan, setAiPlan] = useState<any>(null);

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      
      setIsListening(true);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDescription(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      
      recognition.start();
    } else {
      alert("Voice input not supported in this browser.");
    }
  };

  const handleGeneratePlan = async () => {
    if (!description || !budget || !location) return;
    setLoading(true);
    try {
        const outline = await generateProjectOutline(description, budget, location);
        setAiPlan(outline);
        setStep(2);
    } catch (e) {
        console.error(e);
        alert("Failed to generate plan. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const handleFinalizeProject = () => {
      if (!aiPlan) return;
      
      const newProject: Project = {
          id: `p${Date.now()}`,
          name: aiPlan.suggestedName,
          location: location,
          budget: parseFloat(budget.replace(/,/g, '')),
          status: 'Planning',
          thumbnail: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400', // Default placeholder
          completionDate: new Date(new Date().setMonth(new Date().getMonth() + aiPlan.estimatedDurationMonths)).toISOString().split('T')[0],
          team: []
      };

      // In a real app, API call here. For now, update Mock.
      MOCK_PROJECTS.push(newProject);
      onProjectCreated(newProject);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="text-indigo-400" /> New Project Wizard
                    </h2>
                    <p className="text-slate-400 text-sm">AI-Assisted Project Setup</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Body */}
            <div className="p-8 overflow-y-auto flex-1">
                {step === 1 ? (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Tell us about your new project</h3>
                            <p className="text-slate-500">Answer a few basic questions, and AI will structure the plan for you.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Where is the site located?</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        value={location}
                                        onChange={e => setLocation(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="e.g. Hyderabad, Telangana"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">What is the estimated budget?</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input 
                                        type="number" 
                                        value={budget}
                                        onChange={e => setBudget(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="e.g. 5000000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Describe the project (Use Voice or Text)</label>
                                <div className="relative">
                                    <textarea 
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        className="w-full p-4 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px]"
                                        placeholder="e.g. I want to build a G+2 residential apartment with 6 units, parking on ground floor, and a small garden."
                                    />
                                    <button 
                                        onClick={handleVoiceInput}
                                        className={`absolute bottom-3 right-3 p-2 rounded-full shadow-sm transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-500 hover:text-indigo-600'}`}
                                        title="Use Voice Input"
                                    >
                                        <Mic size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleGeneratePlan}
                            disabled={!location || !budget || !description || loading}
                            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all mt-4 ${
                                loading || !location || !budget || !description 
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {loading ? (
                                <>Thinking <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /></>
                            ) : (
                                <>Generate Project Structure <Sparkles size={20} /></>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-3">
                                <Building2 size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800">Project Outline Ready</h3>
                            <p className="text-slate-500">Review the AI-generated structure before creating.</p>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
                             <div>
                                 <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Project Name</h4>
                                 <p className="text-xl font-bold text-slate-900">{aiPlan?.suggestedName}</p>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-4">
                                 <div>
                                     <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Duration</h4>
                                     <p className="text-slate-800 font-medium">{aiPlan?.estimatedDurationMonths} Months</p>
                                 </div>
                                 <div>
                                     <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Budget</h4>
                                     <p className="text-slate-800 font-medium">₹ {parseInt(budget).toLocaleString('en-IN')}</p>
                                 </div>
                             </div>

                             <div>
                                 <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Key Stages</h4>
                                 <div className="flex flex-wrap gap-2">
                                     {aiPlan?.stages.map((stage: string, i: number) => (
                                         <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-700 shadow-sm">
                                             {stage}
                                         </span>
                                     ))}
                                 </div>
                             </div>

                             <div>
                                 <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Major Materials</h4>
                                 <div className="flex flex-wrap gap-2">
                                     {aiPlan?.keyMaterials.map((mat: string, i: number) => (
                                         <span key={i} className="px-3 py-1 bg-orange-50 border border-orange-100 rounded-full text-sm text-orange-800">
                                             {mat}
                                         </span>
                                     ))}
                                 </div>
                             </div>

                             <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 leading-relaxed">
                                 <strong>Summary: </strong> {aiPlan?.briefSummary}
                             </div>
                        </div>

                        <button 
                            onClick={handleFinalizeProject}
                            className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all"
                        >
                            Initialize Project <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default NewProjectWizard;