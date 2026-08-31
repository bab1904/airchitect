import React, { useState, useEffect } from 'react';
import { Upload, Wand2, Download, Layers, X, Eye, Grid, Sparkles, Check, Home, Building, Building2, Compass, Ruler } from 'lucide-react';
import { generateFloorPlanImage, generate3DView } from '../services/geminiService';
import { SAMPLE_PROMPTS } from '../constants';

const PRESET_DESIGNS = [
  {
    title: "1500 sqft Modern 3BHK Villa",
    prompt: "A 1500 sqft modern 3BHK residential house with master bedroom ensuite, modular kitchen, living and dining hall, guest bedroom, balcony, and front car parking.",
    type: "Villa",
    icon: Home,
    rooms: [
      { name: "Living & Dining", dimensions: "18'-6\" x 14'-0\"", area: "259 sqft", floor: "Italian Vitrified Tiles" },
      { name: "Master Bedroom", dimensions: "14'-0\" x 13'-6\"", area: "189 sqft", floor: "Hardwood Laminated" },
      { name: "Ensuite Bathroom", dimensions: "6'-0\" x 8'-0\"", area: "48 sqft", floor: "Anti-skid Ceramic" },
      { name: "Bedroom 2 (Guest)", dimensions: "12'-0\" x 11'-0\"", area: "132 sqft", floor: "Vitrified Tiles" },
      { name: "Modular Kitchen", dimensions: "10'-0\" x 12'-0\"", area: "120 sqft", floor: "Granite Countertop" },
      { name: "Balcony & Utility", dimensions: "10'-0\" x 5'-0\"", area: "50 sqft", floor: "Rustic Matte" }
    ]
  },
  {
    title: "2400 sqft Luxury Duplex",
    prompt: "2400 sqft luxury 4BHK duplex villa with double height foyer, open kitchen with breakfast bar, home theater, landscaped patio, and covered portico.",
    type: "Duplex",
    icon: Building2,
    rooms: [
      { name: "Double-Height Foyer", dimensions: "20'-0\" x 16'-0\"", area: "320 sqft", floor: "Statuario Marble" },
      { name: "Master Suite with Walk-in", dimensions: "16'-0\" x 15'-0\"", area: "240 sqft", floor: "Teak Hardwood" },
      { name: "Open Gourmet Kitchen", dimensions: "14'-0\" x 12'-0\"", area: "168 sqft", floor: "Quartz Countertop" },
      { name: "Home Theater / Media Room", dimensions: "15'-0\" x 14'-0\"", area: "210 sqft", floor: "Acoustic Carpet" }
    ]
  },
  {
    title: "3500 sqft Commercial Suite",
    prompt: "3500 sqft commercial corporate office with conference room, 4 executive cabins, 30 open workstations, reception lobby, server room, and cafeteria.",
    type: "Commercial",
    icon: Building,
    rooms: [
      { name: "Reception & Waiting Lobby", dimensions: "22'-0\" x 18'-0\"", area: "396 sqft", floor: "Polished Granite" },
      { name: "Board Conference Room", dimensions: "24'-0\" x 14'-0\"", area: "336 sqft", floor: "Acoustic Modular" },
      { name: "Executive Cabins (x4)", dimensions: "12'-0\" x 12'-0\" each", area: "576 sqft", floor: "Engineered Wood" },
      { name: "Open Workspace (30 Desks)", dimensions: "40'-0\" x 30'-0\"", area: "1200 sqft", floor: "Heavy Duty Carpet" }
    ]
  }
];

const FloorPlanGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState(SAMPLE_PROMPTS[0] || '1500 sqft 3BHK residential house with modern open kitchen and master bedroom');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'2D' | '3D'>('2D');
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [uploadedSketch, setUploadedSketch] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Generate initial plan on mount
  useEffect(() => {
    handleGenerate('2D');
  }, []);

  const handleGenerate = async (targetMode: '2D' | '3D', customPrompt?: string) => {
    const activePrompt = customPrompt || prompt || "1500 sqft residential 3BHK house";
    setLoading(true);
    setMode(targetMode);
    try {
      let result;
      if (targetMode === '3D') {
        result = await generate3DView(activePrompt);
      } else {
        result = await generateFloorPlanImage(activePrompt, uploadedSketch || undefined);
      }
      setGeneratedImage(result);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (index: number) => {
    setActivePresetIndex(index);
    const selected = PRESET_DESIGNS[index];
    setPrompt(selected.prompt);
    handleGenerate(mode, selected.prompt);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedSketch(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSketch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadedSketch(null);
  };

  const downloadPlan = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `AIrchitect-${mode}-Plan.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const currentRooms = PRESET_DESIGNS[activePresetIndex]?.rooms || PRESET_DESIGNS[0].rooms;

  return (
    <div className="p-6 h-full flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> AI CAD Generator
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded">Architectural Blueprint v2.0</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Wand2 className="text-indigo-600" /> AI Floor Plan &amp; 3D Design
          </h1>
          <p className="text-sm text-slate-500">Transform natural language prompts or sketches into professional 2D CAD drawings and 3D perspectives.</p>
        </div>

        <div className="flex items-center gap-3">
          {generatedImage && (
            <button
              onClick={downloadPlan}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              {copySuccess ? <Check size={16} /> : <Download size={16} />}
              {copySuccess ? "Saved!" : "Download CAD Blueprint"}
            </button>
          )}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left Column: Controls & Presets (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Preset Selector */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Architecture Presets</span>
            <div className="space-y-2">
              {PRESET_DESIGNS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(idx)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    activePresetIndex === idx
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-200'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activePresetIndex === idx ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <preset.icon size={18} />
                  </div>
                  <div className="flex-1 truncate">
                    <h4 className="text-xs font-bold truncate">{preset.title}</h4>
                    <span className="text-[11px] text-slate-500">{preset.type} Layout</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Controls */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Custom Design Prompt</label>
            <textarea
              className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px] bg-slate-50 text-slate-900 placeholder-slate-400 text-xs resize-none"
              placeholder="Describe requirements (e.g. 1800 sqft 3BHK with central courtyard, prayer room, open kitchen)..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            {/* Reference Sketch Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Upload Rough Sketch (Optional)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  title="Upload sketch"
                />
                {uploadedSketch ? (
                  <div className="relative z-0">
                    <img src={uploadedSketch} alt="Sketch" className="max-h-28 mx-auto object-contain rounded shadow-sm" />
                    <button 
                      onClick={clearSketch}
                      className="absolute -top-2 -right-2 bg-white text-red-500 p-1 rounded-full shadow-md hover:bg-red-50 z-20 border border-slate-200"
                    >
                      <X size={14} />
                    </button>
                    <p className="text-[10px] text-slate-400 mt-2">Sketch uploaded</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-500 py-1">
                    <Upload size={22} className="mb-1 text-slate-400" />
                    <span className="text-xs font-medium">Click to upload hand-drawn sketch</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleGenerate('2D')}
                disabled={loading}
                className={`py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                  mode === '2D' ? 'bg-indigo-600 hover:bg-indigo-700 ring-2 ring-indigo-300' : 'bg-slate-700 hover:bg-slate-800'
                }`}
              >
                {loading && mode === '2D' ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"/>
                ) : (
                  <Wand2 size={16} />
                )}
                Generate 2D CAD
              </button>

              <button
                onClick={() => handleGenerate('3D')}
                disabled={loading}
                className={`py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                  mode === '3D' ? 'bg-purple-600 hover:bg-purple-700 ring-2 ring-purple-300' : 'bg-slate-700 hover:bg-slate-800'
                }`}
              >
                {loading && mode === '3D' ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"/>
                ) : (
                  <Eye size={16} />
                )}
                3D Perspective
              </button>
            </div>
          </div>

          {/* Room Dimensions Schedule Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Ruler size={14} className="text-indigo-600" /> Room Schedule &amp; Dimensions
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
                {currentRooms.length} Spaces
              </span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {currentRooms.map((room, i) => (
                <div key={i} className="p-2 bg-slate-50 rounded-lg flex items-center justify-between text-xs border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-800 block">{room.name}</span>
                    <span className="text-[10px] text-slate-400">{room.floor}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-indigo-600 block">{room.dimensions}</span>
                    <span className="text-[10px] text-slate-500">{room.area}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Architectural Viewport Canvas (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative min-h-[580px] border border-slate-800">
          {/* Viewport Top Toolbar */}
          <div className="p-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleGenerate('2D')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  mode === '2D' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Compass size={14} /> 2D CAD Blueprint
              </button>
              <button
                onClick={() => handleGenerate('3D')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  mode === '3D' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Eye size={14} /> 3D Perspective Render
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  showGrid ? 'bg-slate-800 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
                title="Toggle CAD Grid"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setShowDimensions(!showDimensions)}
                className={`p-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  showDimensions ? 'bg-slate-800 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
                title="Toggle Dimensions"
              >
                <Ruler size={16} />
              </button>
              <button
                onClick={downloadPlan}
                className="p-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                title="Download High-Res SVG"
              >
                <Download size={16} />
              </button>
            </div>
          </div>

          {/* Viewport Canvas Render */}
          <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
            {loading ? (
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-lg" />
                <div>
                  <h3 className="text-white font-bold text-base">Rendering Architectural {mode} Layout...</h3>
                  <p className="text-slate-400 text-xs mt-1">Calculating structural walls, dimensions, and lighting profiles</p>
                </div>
              </div>
            ) : generatedImage ? (
              <div className="w-full h-full flex items-center justify-center animate-fade-in relative group">
                <img
                  src={generatedImage}
                  alt="Generated Design"
                  className="max-w-full max-h-[500px] object-contain rounded-xl shadow-2xl transition-all duration-300"
                />
                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live AI Vectorized Plan
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 space-y-3">
                <Layers size={48} className="mx-auto opacity-20" />
                <p className="text-sm">Click "Generate 2D CAD" or "3D Perspective" to render your blueprint.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanGenerator;