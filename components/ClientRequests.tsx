import React, { useState, useEffect } from 'react';
import { ClientRequest, UserRole, Project } from '../types';
import { MOCK_REQUESTS } from '../constants';
import { Camera, Send, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ClientRequestsProps {
  userRole: UserRole;
  project: Project | null;
}

const ClientRequests: React.FC<ClientRequestsProps> = ({ userRole, project }) => {
  // Initialize with requests for the current project
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [newRequest, setNewRequest] = useState({ title: '', description: '', image: null as string | null });
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Update requests when project changes
  useEffect(() => {
    if (project) {
        setRequests(MOCK_REQUESTS.filter(r => r.projectId === project.id));
    } else {
        setRequests([]);
    }
  }, [project]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewRequest({ ...newRequest, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!newRequest.title || !newRequest.description || !project) return;
    
    const req: ClientRequest = {
        id: Date.now().toString(),
        projectId: project.id,
        title: newRequest.title,
        description: newRequest.description,
        image: newRequest.image || undefined,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
    };

    setRequests([req, ...requests]);
    setNewRequest({ title: '', description: '', image: null });
    setIsFormOpen(false);
  };

  const isClient = userRole === UserRole.CLIENT;

  if (!project) {
      return (
          <div className="p-6 h-full flex items-center justify-center text-slate-500">
              Please select a project to view requests.
          </div>
      );
  }

  return (
    <div className="p-6 h-full flex flex-col gap-6">
       <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    Client Requests & Approvals
                </h2>
                <p className="text-sm text-slate-500">Project: {project.name}</p>
            </div>
            {isClient && !isFormOpen && (
                <button 
                    onClick={() => setIsFormOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg"
                >
                    + New Request
                </button>
            )}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Request Form for Clients */}
            {isClient && isFormOpen && (
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-slate-200 animate-fade-in h-fit">
                    <h3 className="font-semibold text-lg mb-4">Submit Change Request</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                            <input 
                                type="text" 
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 placeholder-slate-400"
                                placeholder="e.g. Change Kitchen Tile"
                                value={newRequest.title}
                                onChange={e => setNewRequest({...newRequest, title: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea 
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[100px] bg-white text-slate-900 placeholder-slate-400"
                                placeholder="Describe the change or issue..."
                                value={newRequest.description}
                                onChange={e => setNewRequest({...newRequest, description: e.target.value})}
                            />
                        </div>
                        
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Attach Photo (Optional)</label>
                             <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 relative">
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                {newRequest.image ? (
                                    <div className="relative">
                                        <img src={newRequest.image} alt="Preview" className="h-32 mx-auto object-contain rounded" />
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setNewRequest({...newRequest, image: null});
                                            }}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2 text-xs"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-slate-500">
                                        <Camera className="mx-auto mb-1" size={24} />
                                        <span className="text-xs">Tap to upload</span>
                                    </div>
                                )}
                             </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button onClick={() => setIsFormOpen(false)} className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                            <button onClick={handleSubmit} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex justify-center items-center gap-2">
                                <Send size={16} /> Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Request Feed */}
            <div className={`${isClient && isFormOpen ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
                {requests.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        No requests found for this project.
                    </div>
                ) : (
                    requests.map(req => (
                        <div key={req.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow">
                            {req.image && (
                                <img src={req.image} alt="Request" className="w-full md:w-48 h-32 object-cover rounded-lg bg-slate-100" />
                            )}
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-slate-800">{req.title}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
                                        req.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' :
                                        req.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                        'bg-slate-100 text-slate-600 border-slate-200'
                                    }`}>
                                        {req.status === 'Approved' ? <CheckCircle size={12} /> : req.status === 'Pending' ? <Clock size={12} /> : <XCircle size={12} />}
                                        {req.status}
                                    </span>
                                </div>
                                <p className="text-slate-600 mt-2 text-sm">{req.description}</p>
                                <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                                    <span>ID: #{req.id}</span>
                                    <span>•</span>
                                    <span>{req.date}</span>
                                </div>
                            </div>
                            
                            {!isClient && req.status === 'Pending' && (
                                <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
                                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Approve</button>
                                    <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300">Reject</button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
       </div>
    </div>
  );
};

export default ClientRequests;