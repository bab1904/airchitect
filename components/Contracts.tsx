import React, { useState } from 'react';
import { generateDocument } from '../services/geminiService';
import { Project, GeneratedDocument } from '../types';
import { MOCK_DOCUMENTS } from '../constants';
import { FileText, Download, Plus, Save, PenTool, CheckCircle, FileSignature, Clock, Trash2 } from 'lucide-react';

interface ContractsProps {
  project: Project | null;
}

const Contracts: React.FC<ContractsProps> = ({ project }) => {
  const [documents, setDocuments] = useState<GeneratedDocument[]>(MOCK_DOCUMENTS.filter(d => project ? d.projectId === project.id : true));
  const [activeDoc, setActiveDoc] = useState<GeneratedDocument | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Generation Form State
  const [docType, setDocType] = useState<'Material Tender' | 'Contractor Agreement' | 'Payment Schedule'>('Material Tender');
  const [docTitle, setDocTitle] = useState('');
  const [docDetails, setDocDetails] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

  if (!project) return <div className="p-6 text-slate-500">Please select a project to manage contracts.</div>;

  const handleGenerate = async () => {
    if (!docTitle || !docDetails) return;
    setLoading(true);
    try {
        const content = await generateDocument(docType, `Project: ${project.name}, Location: ${project.location}. ${docDetails}`);
        setGeneratedContent(content);
    } catch (error) {
        console.error(error);
        setGeneratedContent("Error generating document. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const handleSave = () => {
      const newDoc: GeneratedDocument = {
          id: Date.now().toString(),
          projectId: project.id,
          title: docTitle,
          type: docType,
          content: generatedContent,
          status: 'Draft',
          date: new Date().toISOString().split('T')[0]
      };
      setDocuments([newDoc, ...documents]);
      setIsGenerating(false);
      setActiveDoc(newDoc);
      // Reset Form
      setDocTitle('');
      setDocDetails('');
      setGeneratedContent('');
  };

  const handleDelete = (id: string) => {
      if (confirm('Are you sure you want to delete this document?')) {
          const updatedDocs = documents.filter(d => d.id !== id);
          setDocuments(updatedDocs);
          if (activeDoc?.id === id) {
              setActiveDoc(null);
          }
      }
  };

  const handleExport = () => {
      if (!activeDoc) return;
      const element = document.createElement("a");
      const file = new Blob([activeDoc.content], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${activeDoc.title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <FileSignature className="text-indigo-600" /> Auto Tender & Contract Generator
                </h2>
                <p className="text-sm text-slate-500">Generate legal drafts, tenders, and schedules instantly.</p>
            </div>
            {!isGenerating && (
                <button 
                    onClick={() => setIsGenerating(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm"
                >
                    <Plus size={18} /> New Document
                </button>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[500px]">
            {/* LEFT SIDEBAR: Document List */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 flex justify-between items-center">
                    <span>Documents</span>
                    <span className="text-xs bg-slate-200 px-2 py-1 rounded-full">{documents.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {documents.length === 0 ? (
                         <div className="p-6 text-center text-slate-400 text-sm">No documents yet.</div>
                    ) : (
                        documents.map(doc => (
                            <div 
                                key={doc.id} 
                                onClick={() => { setActiveDoc(doc); setIsGenerating(false); }}
                                className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${activeDoc?.id === doc.id && !isGenerating ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`font-semibold text-sm ${activeDoc?.id === doc.id ? 'text-indigo-900' : 'text-slate-800'}`}>{doc.title}</h4>
                                    {doc.status === 'Draft' ? <Clock size={14} className="text-amber-500"/> : <CheckCircle size={14} className="text-green-500"/>}
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-500">
                                    <span>{doc.type}</span>
                                    <span>{doc.date}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* MAIN AREA: Generator or Editor */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                {isGenerating ? (
                    /* GENERATOR FORM */
                    <div className="p-6 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <PenTool size={18} className="text-indigo-500"/> Generate New Document
                            </h3>
                            <button onClick={() => setIsGenerating(false)} className="text-sm text-slate-500 hover:text-slate-800">Cancel</button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
                                <select 
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
                                    value={docType}
                                    onChange={(e) => setDocType(e.target.value as any)}
                                >
                                    <option value="Material Tender">Material Tender Document</option>
                                    <option value="Contractor Agreement">Contractor Agreement</option>
                                    <option value="Payment Schedule">Payment Schedule</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 placeholder-slate-400"
                                    placeholder="e.g., Cement Supply Tender Phase 2"
                                    value={docTitle}
                                    onChange={(e) => setDocTitle(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-4 flex-1 flex flex-col">
                             <label className="block text-sm font-medium text-slate-700 mb-1">Key Details & Context</label>
                             <textarea 
                                className="w-full flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 placeholder-slate-400"
                                placeholder="Enter specific requirements, contractor names, quantities, dates, payment terms, or any clauses you want included..."
                                value={docDetails}
                                onChange={(e) => setDocDetails(e.target.value)}
                             />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                             <button 
                                onClick={handleGenerate} 
                                disabled={loading || !docTitle || !docDetails}
                                className={`px-6 py-2 rounded-lg text-white font-medium flex items-center gap-2 ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                             >
                                 {loading ? 'AI is writing...' : 'Generate Draft'}
                             </button>
                        </div>

                        {generatedContent && (
                             <div className="absolute inset-0 bg-white z-10 flex flex-col p-6 animate-fade-in">
                                 <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                                     <h3 className="font-bold text-slate-800">Preview: {docTitle}</h3>
                                     <div className="flex gap-2">
                                         <button onClick={() => setGeneratedContent('')} className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded">Discard</button>
                                         <button onClick={handleSave} className="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"><Save size={14}/> Save to Project</button>
                                     </div>
                                 </div>
                                 <textarea 
                                    className="flex-1 w-full p-4 border border-slate-200 rounded-lg font-mono text-sm leading-relaxed focus:outline-none bg-slate-50 resize-none text-slate-900"
                                    value={generatedContent}
                                    onChange={(e) => setGeneratedContent(e.target.value)}
                                 />
                             </div>
                        )}
                    </div>
                ) : activeDoc ? (
                    /* VIEW / EDIT DOCUMENT */
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="font-bold text-slate-800">{activeDoc.title}</h3>
                                <p className="text-xs text-slate-500">{activeDoc.type} • Created {activeDoc.date}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleDelete(activeDoc.id)} className="p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                                <button className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg" title="Edit">
                                    <PenTool size={18} />
                                </button>
                                <button onClick={handleExport} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-900">
                                    <Download size={16} /> Export
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto">
                            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed max-w-3xl mx-auto bg-white p-8 shadow-sm border border-slate-100 min-h-full">
                                {activeDoc.content}
                            </pre>
                        </div>
                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                        <FileText size={64} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium">Select a document to view</p>
                        <p className="text-sm">or generate a new one using AI</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Contracts;