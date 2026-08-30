import React, { useState } from 'react';
import { MOCK_MATERIALS, MOCK_VENDORS, MOCK_MATERIAL_REQUESTS, MOCK_SECURITY_ALERTS } from '../constants';
import { UserRole, Project, Vendor, MaterialRequest, SecurityAlert } from '../types';
import { Package, AlertTriangle, ShoppingCart, User, Plus, Phone, Star, MapPin, CheckCircle, ShieldAlert, Eye, TrendingDown, Check, ArrowLeft, Mail, MessageSquare, X, Send, Trash2 } from 'lucide-react';

interface MaterialsProps {
  userRole: UserRole;
  project: Project | null;
}

type Tab = 'INVENTORY' | 'REQUESTS' | 'VENDORS' | 'SECURITY';

const Materials: React.FC<MaterialsProps> = ({ userRole, project }) => {
  const [activeTab, setActiveTab] = useState<Tab>('INVENTORY');
  
  // Data States
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [requests, setRequests] = useState<MaterialRequest[]>(() => 
    MOCK_MATERIAL_REQUESTS.filter(r => project ? r.projectId === project.id : true)
  );
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>(() => 
    MOCK_SECURITY_ALERTS.filter(r => project ? r.projectId === project.id : true)
  );
  
  // View States
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderingItem, setOrderingItem] = useState<string>(''); // Context: What triggered the order
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null); // New: Vendor Detail View
  
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  // Investigation State
  const [investigationAlert, setInvestigationAlert] = useState<SecurityAlert | null>(null);
  const [investigationQuery, setInvestigationQuery] = useState('');
  const [investigationMessage, setInvestigationMessage] = useState('');

  // Form States
  const [newVendor, setNewVendor] = useState({ name: '', phone: '', category: 'Structural', location: '' });
  const [newRequest, setNewRequest] = useState({ materialName: '', quantity: 0, unit: 'pcs' });
  const [orderCart, setOrderCart] = useState<{[item: string]: number}>({}); // Cart for vendor order

  if (!project) return <div className="p-6 text-slate-500">Please select a project first.</div>;

  const isManager = userRole === UserRole.SITE_MANAGER || userRole === UserRole.PROJECT_MANAGER;
  const isEngineer = userRole === UserRole.SITE_ENGINEER;

  // Filter vendors based on project location (Simple string match)
  const projectCity = project.location.split(',')[0].trim();
  const nearbyVendors = vendors.filter(v => 
    v.location.includes(projectCity) || v.isFavorite
  );

  const activeSecurityAlerts = securityAlerts.filter(a => !a.isResolved).length;

  const handleAddVendor = () => {
      if (!newVendor.name || !newVendor.phone) return;
      const v: Vendor = {
          id: Date.now().toString(),
          ...newVendor,
          rating: 0,
          isFavorite: false
      };
      setVendors([...vendors, v]);
      setIsAddingVendor(false);
      setNewVendor({ name: '', phone: '', category: 'Structural', location: '' });
  };

  const handleDeleteVendor = (id: string) => {
      if (confirm('Are you sure you want to delete this vendor?')) {
          setVendors(vendors.filter(v => v.id !== id));
      }
  };

  const handleCreateRequest = () => {
      if (!newRequest.materialName || !newRequest.quantity || newRequest.quantity <= 0) {
          alert("Please enter a valid material name and quantity greater than 0.");
          return;
      }

      const r: MaterialRequest = {
          id: Date.now().toString(),
          projectId: project.id,
          requesterName: userRole === UserRole.SITE_ENGINEER ? 'Site Engineer' : 'You',
          requesterRole: userRole,
          materialName: newRequest.materialName,
          quantity: newRequest.quantity,
          unit: newRequest.unit,
          status: 'Pending',
          date: new Date().toISOString().split('T')[0]
      };

      MOCK_MATERIAL_REQUESTS.unshift(r);
      setRequests([r, ...requests]);
      setIsRequesting(false);
      setNewRequest({ materialName: '', quantity: 0, unit: 'pcs' });
      setActiveTab('REQUESTS');
  };

  const handleResolveAlert = (id: string) => {
      setSecurityAlerts(securityAlerts.map(a => a.id === id ? { ...a, isResolved: true } : a));
  };

  const handleInvestigate = (alert: SecurityAlert) => {
      setInvestigationAlert(alert);
      setInvestigationQuery(`Please explain the anomaly detected: ${alert.title}`);
      setInvestigationMessage('');
  };

  const submitInvestigation = () => {
      if (!investigationQuery) return;
      // In a real app, this would send an API request
      alert(`Investigation Request Sent!\n\nTarget: Site Team\nQuery: ${investigationQuery}\nNote: ${investigationMessage || 'None'}`);
      setInvestigationAlert(null);
      setInvestigationQuery('');
      setInvestigationMessage('');
  };

  const getVendorCatalog = (category: string) => {
      switch(category) {
          case 'Structural': return [
              { name: 'UltraTech Cement (50kg)', price: 380 }, 
              { name: 'Tata TMT Bars (10mm)', price: 6500 },
              { name: 'Tata TMT Bars (12mm)', price: 6800 },
              { name: 'Red Bricks (1000 pcs)', price: 9000 },
              { name: 'River Sand (Ton)', price: 4500 }
          ];
          case 'Finishing': return [
              { name: 'Asian Paints Royale (20L)', price: 8500 }, 
              { name: 'Primer (10L)', price: 1200 },
              { name: 'Ceramic Tiles (Box)', price: 650 },
              { name: 'Vitrified Tiles (Box)', price: 950 },
              { name: 'Wall Putty (40kg)', price: 850 }
          ];
          case 'Electrical': return [
              { name: 'Copper Wire 1.5mm (Bundle)', price: 1500 },
              { name: 'Switch Box (Modular)', price: 150 },
              { name: 'LED Panel Light', price: 450 },
              { name: 'MCB Double Pole', price: 350 }
          ];
          default: return [
              { name: 'General Supplies', price: 100 },
              { name: 'Safety Gloves', price: 50 },
              { name: 'Helmets', price: 250 }
          ];
      }
  };

  const handleSendOrder = (method: 'EMAIL' | 'SMS') => {
      if (!selectedVendor) return;
      
      const items = Object.entries(orderCart).filter(([_, qty]: [string, number]) => qty > 0);
      if (items.length === 0) {
          alert("Please select at least one item to order.");
          return;
      }

      const message = `URGENT Order Request for ${project.name}, ${project.location}.\n\nItems:\n${items.map(([name, qty]) => `- ${name}: ${qty}`).join('\n')}\n\nPlease confirm delivery date.`;

      if (method === 'EMAIL') {
           const subject = encodeURIComponent(`Order for ${project.name}`);
           const body = encodeURIComponent(message);
           // Opens default email client
           window.open(`mailto:orders@${selectedVendor.name.replace(/\s/g, '').toLowerCase()}.com?subject=${subject}&body=${body}`, '_blank');
      } else {
           // Simulates SMS
           alert(`SMS Message Sent to ${selectedVendor.phone}:\n\n"${message}"`);
      }
      
      // Keep vendor selected but maybe show success?
      // Reset cart? Let's just reset cart and go back to vendor list for flow.
      setOrderCart({});
      setSelectedVendor(null);
      setIsOrdering(false);
      setOrderingItem('');
      
      const relatedReq = requests.find(r => r.materialName === orderingItem && r.status === 'Approved');
      if (relatedReq) {
          const newStatus = 'Ordered';
          setRequests(requests.map(r => r.id === relatedReq.id ? { ...r, status: newStatus } : r));
          const mockReq = MOCK_MATERIAL_REQUESTS.find(r => r.id === relatedReq.id);
          if (mockReq) mockReq.status = newStatus;
      }
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col relative">
       {/* Header & Tabs */}
       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Package className="text-orange-600" /> 
                    {isManager ? "Inventory & Procurement" : "Site Inventory"}
                </h2>
                <p className="text-sm text-slate-500">Location: {project.location}</p>
            </div>
            
            {!isOrdering && (
                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200 overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('INVENTORY')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'INVENTORY' ? 'bg-orange-100 text-orange-700' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        Stock
                    </button>
                    <button 
                        onClick={() => setActiveTab('REQUESTS')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'REQUESTS' ? 'bg-orange-100 text-orange-700' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        Requests
                        {requests.filter(r => r.status === 'Pending').length > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                {requests.filter(r => r.status === 'Pending').length}
                            </span>
                        )}
                    </button>
                    {isManager && (
                        <button 
                            onClick={() => setActiveTab('VENDORS')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'VENDORS' ? 'bg-orange-100 text-orange-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            Vendors
                        </button>
                    )}
                    {/* SECURITY TAB */}
                    <button 
                        onClick={() => setActiveTab('SECURITY')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'SECURITY' ? 'bg-red-100 text-red-700' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        AI Security
                        {activeSecurityAlerts > 0 && (
                            <span className="animate-pulse w-2 h-2 bg-red-600 rounded-full"></span>
                        )}
                    </button>
                </div>
            )}
       </div>

       {/* MAIN CONTENT AREA */}
       <div className="flex-1">
           {/* 1. INVENTORY TAB */}
           {activeTab === 'INVENTORY' && !isOrdering && (
               <div className="space-y-6">
                    {activeSecurityAlerts > 0 && (
                        <div onClick={() => setActiveTab('SECURITY')} className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-red-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <ShieldAlert className="text-red-600" />
                                <div>
                                    <h4 className="font-bold text-red-800">Theft Risk Detected</h4>
                                    <p className="text-sm text-red-700">AI detected unusual activity. Click to view {activeSecurityAlerts} alerts.</p>
                                </div>
                            </div>
                            <span className="text-red-600 text-sm font-semibold">View Details &rarr;</span>
                        </div>
                    )}

                    <div className="flex justify-end">
                        {isEngineer && (
                            <button 
                                onClick={() => setIsRequesting(true)}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                                <Plus size={16} /> Request Material
                            </button>
                        )}
                        {isManager && (
                             <button 
                                onClick={() => { setOrderingItem('General Stock'); setIsOrdering(true); }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                                <ShoppingCart size={16} /> Order Stock
                            </button>
                        )}
                    </div>

                    {isRequesting && (
                        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-200 mb-6 animate-fade-in">
                            <h3 className="font-bold text-slate-800 mb-4">New Material Request</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Material Name (e.g. Cement)" 
                                    className="p-2 border rounded-lg bg-white text-slate-900 placeholder-slate-400"
                                    value={newRequest.materialName}
                                    onChange={e => setNewRequest({...newRequest, materialName: e.target.value})}
                                />
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        placeholder="Qty" 
                                        min="1"
                                        className="p-2 border rounded-lg w-full bg-white text-slate-900 placeholder-slate-400"
                                        value={newRequest.quantity === 0 ? '' : newRequest.quantity}
                                        onChange={e => setNewRequest({...newRequest, quantity: parseInt(e.target.value) || 0})}
                                    />
                                    <select 
                                        className="p-2 border rounded-lg bg-white text-slate-900"
                                        value={newRequest.unit}
                                        onChange={e => setNewRequest({...newRequest, unit: e.target.value})}
                                    >
                                        <option value="pcs">pcs</option>
                                        <option value="kg">kg</option>
                                        <option value="Bags">Bags</option>
                                        <option value="L">L</option>
                                        <option value="cft">cft</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setIsRequesting(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                    <button onClick={handleCreateRequest} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">Submit Request</button>
                                </div>
                            </div>
                        </div>
                    )}

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MOCK_MATERIALS.map(material => {
                            const isLow = material.quantity <= material.minLevel;
                            return (
                                <div key={material.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-slate-900">{material.name}</h3>
                                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{material.category}</span>
                                        </div>
                                        <div className="flex items-end gap-1 mb-4">
                                            <span className="text-3xl font-bold text-slate-800">{(material.quantity || 0).toLocaleString()}</span>
                                            <span className="text-sm text-slate-500 mb-1">{material.unit}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                                            <div 
                                                className={`h-1.5 rounded-full ${isLow ? 'bg-red-500' : 'bg-green-500'}`}
                                                style={{width: `${Math.min(100, (material.quantity / (material.minLevel * 3)) * 100)}%`}}
                                            ></div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center mt-4">
                                            {isLow ? (
                                                <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                                                    <AlertTriangle size={14} /> Low Stock
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-500">In Stock</span>
                                            )}
                                            
                                            {isManager && (
                                                <button 
                                                    onClick={() => { setOrderingItem(material.name); setIsOrdering(true); }}
                                                    className="text-orange-600 hover:bg-orange-50 p-2 rounded-full transition-colors" 
                                                    title="Reorder"
                                                >
                                                    <ShoppingCart size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                   </div>
               </div>
           )}

           {/* 2. ORDERING VIEW (VENDOR SELECTION + CATALOG) */}
           {isOrdering && (
               <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 animate-fade-in h-full flex flex-col">
                   {/* 2a. VENDOR SELECTION (If no vendor selected) */}
                   {!selectedVendor ? (
                       <>
                           <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Select Vendor</h3>
                                    <p className="text-sm text-slate-500">To purchase: <span className="font-bold text-indigo-600">{orderingItem}</span></p>
                                </div>
                                <button onClick={() => setIsOrdering(false)} className="text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg text-sm">Cancel Order</button>
                           </div>

                           <p className="text-sm text-slate-500 mb-4">Showing vendors near <strong>{projectCity}</strong>.</p>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
                                {nearbyVendors.length === 0 ? (
                                    <div className="col-span-2 text-center py-8 text-slate-400 border-2 border-dashed rounded-xl">
                                        No matching vendors found in {projectCity}. Check the Vendors tab to add one.
                                    </div>
                                ) : (
                                    nearbyVendors.map(vendor => (
                                        <div 
                                            key={vendor.id} 
                                            className="border border-slate-200 p-4 rounded-xl hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all group" 
                                            onClick={() => { setSelectedVendor(vendor); setOrderCart({}); }}
                                        >
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-slate-800 group-hover:text-indigo-600">{vendor.name}</h4>
                                                {vendor.isFavorite && <Star size={16} className="text-yellow-400 fill-current" />}
                                            </div>
                                            <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                                <MapPin size={14} /> {vendor.location}
                                            </div>
                                            <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                                <Phone size={14} /> {vendor.phone}
                                            </div>
                                            <div className="mt-3 flex items-center justify-between">
                                                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{vendor.category}</span>
                                                <span className="text-xs text-indigo-600 font-bold flex items-center gap-1">Tap to Order <ShoppingCart size={12}/></span>
                                            </div>
                                        </div>
                                    ))
                                )}
                           </div>
                       </>
                   ) : (
                       /* 2b. VENDOR CATALOG & CART */
                       <div className="flex flex-col h-full">
                           <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                               <button onClick={() => setSelectedVendor(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                                   <ArrowLeft size={20} />
                               </button>
                               <div>
                                   <h3 className="text-xl font-bold text-slate-800">{selectedVendor.name} Catalog</h3>
                                   <p className="text-sm text-slate-500">Category: {selectedVendor.category} • {selectedVendor.phone}</p>
                               </div>
                           </div>

                           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
                               {/* Catalog Items */}
                               <div className="lg:col-span-2 overflow-y-auto pr-2">
                                    <h4 className="font-semibold text-slate-700 mb-3">Available Items</h4>
                                    <div className="space-y-3">
                                        {getVendorCatalog(selectedVendor.category).map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
                                                <div>
                                                    <p className="font-medium text-slate-800">{item.name}</p>
                                                    <p className="text-xs text-slate-500">₹{item.price.toLocaleString()}</p>
                                                </div>
                                                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-1">
                                                    <button 
                                                        className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-600"
                                                        onClick={() => setOrderCart(prev => ({...prev, [item.name]: Math.max(0, (prev[item.name] || 0) - 1)}))}
                                                    >-</button>
                                                    <span className="w-8 text-center text-sm font-bold">{orderCart[item.name] || 0}</span>
                                                    <button 
                                                        className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-600"
                                                        onClick={() => setOrderCart(prev => ({...prev, [item.name]: (prev[item.name] || 0) + 1}))}
                                                    >+</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                               </div>

                               {/* Cart & Actions */}
                               <div className="lg:col-span-1 bg-slate-50 p-4 rounded-xl h-fit border border-slate-200">
                                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <ShoppingCart size={18} className="text-indigo-600"/> Order Summary
                                    </h4>
                                    
                                    <div className="space-y-2 mb-6 min-h-[100px]">
                                        {Object.entries(orderCart).filter(([_, qty]: [string, number]) => qty > 0).length === 0 ? (
                                            <p className="text-xs text-slate-400 italic">Select items from the catalog.</p>
                                        ) : (
                                            Object.entries(orderCart).filter(([_, qty]: [string, number]) => qty > 0).map(([name, qty]) => (
                                                <div key={name} className="flex justify-between text-sm">
                                                    <span className="text-slate-600 truncate max-w-[150px]">{name}</span>
                                                    <span className="font-bold text-slate-900">x {qty}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <button 
                                            onClick={() => handleSendOrder('EMAIL')}
                                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <Mail size={16} /> Send via Email
                                        </button>
                                        <button 
                                            onClick={() => handleSendOrder('SMS')}
                                            className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                                        >
                                            <MessageSquare size={16} /> Send via SMS
                                        </button>
                                    </div>
                               </div>
                           </div>
                       </div>
                   )}
               </div>
           )}

           {/* 4. VENDORS TAB */}
           {activeTab === 'VENDORS' && isManager && !isOrdering && (
               <div className="space-y-6">
                   <div className="flex justify-between items-center">
                       <h3 className="font-bold text-lg text-slate-800">Vendor Directory</h3>
                       <button 
                            onClick={() => setIsAddingVendor(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                        >
                            <User size={16} /> Add Vendor
                        </button>
                   </div>

                   {isAddingVendor && (
                       <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-fade-in">
                           <h4 className="font-semibold mb-4 text-slate-700">Add New Contact</h4>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input 
                                    type="text" 
                                    placeholder="Business Name" 
                                    className="p-2 border rounded-lg bg-white text-slate-900 placeholder-slate-400"
                                    value={newVendor.name}
                                    onChange={e => setNewVendor({...newVendor, name: e.target.value})}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Phone Number" 
                                    className="p-2 border rounded-lg bg-white text-slate-900 placeholder-slate-400"
                                    value={newVendor.phone}
                                    onChange={e => setNewVendor({...newVendor, phone: e.target.value})}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Location (City)" 
                                    className="p-2 border rounded-lg bg-white text-slate-900 placeholder-slate-400"
                                    value={newVendor.location}
                                    onChange={e => setNewVendor({...newVendor, location: e.target.value})}
                                />
                                <select 
                                    className="p-2 border rounded-lg bg-white text-slate-900"
                                    value={newVendor.category}
                                    onChange={e => setNewVendor({...newVendor, category: e.target.value})}
                                >
                                    <option value="Structural">Structural (Cement/Steel)</option>
                                    <option value="Finishing">Finishing (Paint/Tiles)</option>
                                    <option value="Aggregate">Aggregate (Sand/Stone)</option>
                                    <option value="Electrical">Electrical</option>
                                </select>
                           </div>
                           <div className="flex gap-2">
                               <button onClick={() => setIsAddingVendor(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                               <button onClick={handleAddVendor} className="bg-green-600 text-white px-6 py-2 rounded-lg">Save Contact</button>
                           </div>
                       </div>
                   )}

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {vendors.map(vendor => (
                           <div key={vendor.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4 group">
                               <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                                   {vendor.name.charAt(0)}
                               </div>
                               <div className="flex-1">
                                   <div className="flex justify-between">
                                       <h4 className="font-bold text-slate-800">{vendor.name}</h4>
                                       <div className="flex items-center gap-2">
                                           {vendor.isFavorite && <Star size={16} className="text-yellow-400 fill-current" />}
                                           <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteVendor(vendor.id); }}
                                                className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete Vendor"
                                           >
                                               <Trash2 size={16} />
                                           </button>
                                       </div>
                                   </div>
                                   <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><Phone size={12}/> {vendor.phone}</p>
                                   <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin size={12}/> {vendor.location}</p>
                                   <span className="inline-block mt-2 text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                                       {vendor.category}
                                   </span>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           )}

           {/* 5. NEW AI SECURITY TAB */}
           {activeTab === 'SECURITY' && !isOrdering && (
               <div className="space-y-6 animate-fade-in">
                   <div className="bg-slate-900 text-white p-6 rounded-xl flex items-start gap-4 shadow-lg">
                       <ShieldAlert size={48} className="text-red-500" />
                       <div>
                           <h3 className="text-2xl font-bold">AI Theft & Anomaly Detection</h3>
                           <p className="text-slate-300 mt-1 max-w-2xl">
                               The AI continuously monitors IoT sensors, inventory logs, and gate entries to detect suspicious patterns like night movement or sudden stock drops.
                           </p>
                       </div>
                   </div>

                   <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                       Recent Alerts ({securityAlerts.filter(a => !a.isResolved).length} Active)
                   </h4>

                   <div className="space-y-4">
                       {securityAlerts.length === 0 ? (
                           <div className="text-center py-12 text-slate-400">
                               <CheckCircle size={48} className="mx-auto mb-4 text-green-500 opacity-50" />
                               No security threats detected. Site is secure.
                           </div>
                       ) : (
                           securityAlerts.map(alert => (
                               <div key={alert.id} className={`p-5 rounded-xl border flex gap-4 transition-all ${
                                   alert.isResolved 
                                   ? 'bg-slate-50 border-slate-200 opacity-60' 
                                   : 'bg-white border-slate-200 shadow-md border-l-4'
                               }`}
                               style={{ borderLeftColor: alert.isResolved ? 'transparent' : alert.severity === 'HIGH' ? '#ef4444' : alert.severity === 'MEDIUM' ? '#f97316' : '#eab308' }}
                               >
                                   <div className={`mt-1 p-2 rounded-full h-fit ${
                                        alert.type === 'THEFT_RISK' ? 'bg-red-100 text-red-600' : 
                                        alert.type === 'INVENTORY_DROP' ? 'bg-orange-100 text-orange-600' : 
                                        'bg-yellow-100 text-yellow-600'
                                   }`}>
                                       {alert.type === 'THEFT_RISK' && <ShieldAlert size={20} />}
                                       {alert.type === 'INVENTORY_DROP' && <TrendingDown size={20} />}
                                       {alert.type === 'SUSPICIOUS_ACTIVITY' && <Eye size={20} />}
                                   </div>
                                   
                                   <div className="flex-1">
                                       <div className="flex justify-between items-start">
                                           <div>
                                               <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                   {alert.title}
                                                   {alert.isResolved && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Check size={10}/> Resolved</span>}
                                                   {!alert.isResolved && <span className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold ${
                                                       alert.severity === 'HIGH' ? 'bg-red-500' : alert.severity === 'MEDIUM' ? 'bg-orange-500' : 'bg-yellow-500'
                                                   }`}>{alert.severity}</span>}
                                               </h4>
                                               <p className="text-slate-600 mt-1 text-sm">{alert.description}</p>
                                           </div>
                                           <span className="text-xs text-slate-400 whitespace-nowrap">
                                               {new Date(alert.timestamp).toLocaleString()}
                                           </span>
                                       </div>
                                       
                                       {!alert.isResolved && (
                                           <div className="mt-4 flex gap-2">
                                               <button 
                                                    onClick={() => handleResolveAlert(alert.id)}
                                                    className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                                               >
                                                   Mark as Resolved
                                               </button>
                                               <button 
                                                    onClick={() => handleInvestigate(alert)}
                                                    className="px-3 py-1.5 text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded transition-colors"
                                               >
                                                   Investigate
                                               </button>
                                           </div>
                                       )}
                                   </div>
                               </div>
                           ))
                       )}
                   </div>
               </div>
           )}

           {/* INVESTIGATION MODAL */}
           {investigationAlert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="bg-red-600 p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold flex items-center gap-2">
                                <ShieldAlert size={20} /> Security Investigation
                            </h3>
                            <button onClick={() => setInvestigationAlert(null)} className="hover:bg-red-700 p-1 rounded-full"><X size={20}/></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                                <h4 className="font-bold text-red-800 text-sm">{investigationAlert.title}</h4>
                                <p className="text-red-700 text-xs mt-1">{investigationAlert.description}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Investigation Query / Explanation Request</label>
                                <textarea 
                                    className="w-full p-3 border border-slate-300 rounded-lg h-24 text-sm"
                                    placeholder="e.g., Why was the inventory moved at 2 AM? Please provide logs."
                                    value={investigationQuery}
                                    onChange={e => setInvestigationQuery(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Personal Message (Optional)</label>
                                <textarea 
                                    className="w-full p-3 border border-slate-300 rounded-lg h-20 text-sm"
                                    placeholder="Additional context or direct message to the Site Engineer..."
                                    value={investigationMessage}
                                    onChange={e => setInvestigationMessage(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={() => setInvestigationAlert(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">Cancel</button>
                                <button 
                                    onClick={submitInvestigation}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold flex items-center gap-2"
                                >
                                    <Send size={16} /> Send Investigation Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
           )}
       </div>
    </div>
  );
};

export default Materials;