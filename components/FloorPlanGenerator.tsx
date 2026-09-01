import React, { useState, useEffect } from 'react';
import { Upload, Wand2, Download, Layers, X, Eye, Sparkles, Check, Home, Building, Building2, Compass, Ruler, RefreshCw, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { generateFloorPlanImage, generate3DView } from '../services/geminiService';

export interface PresetDesign {
  id: string;
  title: string;
  type: string;
  prompt: string;
  icon: any;
  area: string;
  rooms: Array<{ name: string; dimensions: string; area: string; floor: string }>;
}

const PRESET_DESIGNS: PresetDesign[] = [
  {
    id: "3bhk",
    title: "1650 sqft 3BHK Contemporary Residence",
    type: "3BHK Villa",
    area: "1,650 sqft",
    icon: Home,
    prompt: "1650 sqft modern 3BHK residential house with master bedroom ensuite, modular kitchen, living and dining hall, guest bedroom, balcony, and front car parking.",
    rooms: [
      { name: "Living & Dining", dimensions: "18'-6\" x 14'-0\"", area: "259 sqft", floor: "Italian Vitrified Tiles" },
      { name: "Master Suite", dimensions: "15'-0\" x 13'-6\"", area: "202 sqft", floor: "Hardwood Laminated" },
      { name: "Ensuite Master Bath", dimensions: "7'-0\" x 8'-0\"", area: "56 sqft", floor: "Anti-skid Ceramic" },
      { name: "Bedroom 2 (Kids)", dimensions: "12'-0\" x 11'-0\"", area: "132 sqft", floor: "Vitrified Tiles" },
      { name: "Modular Kitchen", dimensions: "11'-0\" x 12'-0\"", area: "132 sqft", floor: "Granite Countertop" },
      { name: "Bedroom 3 / Study", dimensions: "10'-0\" x 12'-0\"", area: "120 sqft", floor: "Rustic Matte" }
    ]
  },
  {
    id: "4bhk",
    title: "2850 sqft 4BHK Luxury Courtyard Villa",
    type: "4BHK Villa",
    area: "2,850 sqft",
    icon: Building2,
    prompt: "2850 sqft luxury 4BHK villa with central open atrium courtyard, formal living, grand master suite with walk-in spa, gourmet island kitchen, and home theater.",
    rooms: [
      { name: "Formal Living Foyer", dimensions: "16'-0\" x 14'-0\"", area: "224 sqft", floor: "Statuario Italian Marble" },
      { name: "Central Open Atrium", dimensions: "12'-0\" x 12'-0\"", area: "144 sqft", floor: "Skylight & Water Court" },
      { name: "Grand Master Suite", dimensions: "18'-0\" x 15'-0\"", area: "270 sqft", floor: "Burmese Teak Hardwood" },
      { name: "Walk-in & Spa Bath", dimensions: "10'-0\" x 12'-0\"", area: "120 sqft", floor: "Imported Onyx Marble" },
      { name: "Gourmet Island Kitchen", dimensions: "16'-0\" x 12'-0\"", area: "192 sqft", floor: "Quartz Countertop" },
      { name: "Guest Suite 2", dimensions: "15'-0\" x 14'-0\"", area: "210 sqft", floor: "Vitrified Tiles" },
      { name: "Home Theater / Media", dimensions: "12'-0\" x 11'-0\"", area: "132 sqft", floor: "Acoustic Carpet" }
    ]
  },
  {
    id: "2bhk",
    title: "1150 sqft 2BHK Deluxe Apartment",
    type: "2BHK Flat",
    area: "1,150 sqft",
    icon: Home,
    prompt: "1150 sqft 2BHK deluxe apartment with master bedroom, second bedroom, open kitchen, living and dining area, and cross-ventilation balcony.",
    rooms: [
      { name: "Living & Dining", dimensions: "16'-0\" x 13'-0\"", area: "208 sqft", floor: "Double Charged Vitrified" },
      { name: "Master Bedroom", dimensions: "14'-0\" x 12'-0\"", area: "168 sqft", floor: "Laminated Wood" },
      { name: "Guest Bedroom 2", dimensions: "12'-0\" x 12'-0\"", area: "144 sqft", floor: "Vitrified Tiles" },
      { name: "Modular Kitchen", dimensions: "10'-0\" x 11'-0\"", area: "110 sqft", floor: "Polished Granite" },
      { name: "Bathroom", dimensions: "6'-0\" x 9'-0\"", area: "54 sqft", floor: "Anti-skid Ceramic" }
    ]
  },
  {
    id: "studio",
    title: "620 sqft 1BHK Compact Smart Studio",
    type: "1BHK Studio",
    area: "620 sqft",
    icon: Home,
    prompt: "620 sqft compact 1BHK urban studio apartment with open living, kitchenette, bedroom, modern bath, and private deck balcony.",
    rooms: [
      { name: "Living & Dining", dimensions: "14'-0\" x 12'-0\"", area: "168 sqft", floor: "Glazed Vitrified" },
      { name: "Bedroom", dimensions: "11'-0\" x 12'-0\"", area: "132 sqft", floor: "Engineered Wood" },
      { name: "Kitchenette", dimensions: "8'-0\" x 9'-0\"", area: "72 sqft", floor: "Granite Top" },
      { name: "Modern Bath", dimensions: "6'-0\" x 8'-0\"", area: "48 sqft", floor: "Ceramic Tile" },
      { name: "Deck Balcony", dimensions: "11'-0\" x 8'-0\"", area: "88 sqft", floor: "Rustic Weatherproof" }
    ]
  },
  {
    id: "duplex",
    title: "3200 sqft Luxury Duplex Residence",
    type: "Duplex G+1",
    area: "3,200 sqft",
    icon: Building2,
    prompt: "3200 sqft luxury duplex villa with double-height great room, curved staircase void, landscaped patio, and upper floor suites.",
    rooms: [
      { name: "Double-Height Great Room", dimensions: "20'-0\" x 16'-0\"", area: "320 sqft", floor: "Italian Statuario" },
      { name: "Curved Stair Void", dimensions: "10'-0\" x 16'-0\"", area: "160 sqft", floor: "Tempered Glass & Wood" },
      { name: "Gourmet Kitchen & Dining", dimensions: "18'-0\" x 12'-0\"", area: "216 sqft", floor: "Quartz Countertop" },
      { name: "Master Suite", dimensions: "15'-0\" x 16'-0\"", area: "240 sqft", floor: "Hardwood Laminated" },
      { name: "Landscaped Patio", dimensions: "18'-0\" x 12'-0\"", area: "216 sqft", floor: "Teak Decking" }
    ]
  },
  {
    id: "office",
    title: "3500 sqft Commercial Corporate Suite",
    type: "Commercial Office",
    area: "3,500 sqft",
    icon: Building,
    prompt: "3500 sqft commercial corporate office with reception lobby, 16-pax boardroom, 2 executive cabins, 30-desk open workstation bay, and server room.",
    rooms: [
      { name: "Reception Lobby", dimensions: "18'-0\" x 16'-0\"", area: "288 sqft", floor: "Polished Granite" },
      { name: "Boardroom (16 Pax)", dimensions: "24'-0\" x 16'-0\"", area: "384 sqft", floor: "Acoustic Carpet" },
      { name: "Open Workstation Bay", dimensions: "40'-0\" x 20'-0\"", area: "800 sqft", floor: "Heavy Duty Carpet" },
      { name: "Executive Cabins (x2)", dimensions: "12'-0\" x 12'-0\"", area: "288 sqft", floor: "Engineered Wood" },
      { name: "Server Room", dimensions: "10'-0\" x 12'-0\"", area: "120 sqft", floor: "Anti-static Raised Tile" },
      { name: "Cafeteria & Pantry", dimensions: "14'-0\" x 12'-0\"", area: "168 sqft", floor: "Matte Porcelain" }
    ]
  }
];

const FloorPlanGenerator: React.FC = () => {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [prompt, setPrompt] = useState(PRESET_DESIGNS[0].prompt);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'2D' | '3D'>('2D');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [uploadedSketch, setUploadedSketch] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Generate initial plan on mount
  useEffect(() => {
    handleGenerate('2D', PRESET_DESIGNS[0].prompt);
  }, []);

  const handleGenerate = async (targetMode: '2D' | '3D', customPrompt?: string) => {
    const activePrompt = customPrompt || prompt || "1650 sqft 3BHK residential house";
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
    link.download = `AIrchitect-${mode}-${PRESET_DESIGNS[activePresetIndex].id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 75));
  const handleResetZoom = () => setZoomLevel(100);

  const currentPreset = PRESET_DESIGNS[activePresetIndex] || PRESET_DESIGNS[0];
  const currentRooms = currentPreset.rooms;

  return (
    <div className="p-6 h-full flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> High-Visibility Architectural CAD
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded">
              Active: {currentPreset.type} ({currentPreset.area})
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Wand2 className="text-indigo-600" /> AI High-Definition Floor Plan &amp; 3D Design
          </h1>
          <p className="text-sm text-slate-500">
            High-contrast dimension strings, large-format room callouts, door/window markers, and interactive viewport zoom (75%–250%).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {generatedImage && (
            <button
              onClick={downloadPlan}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              {copySuccess ? <Check size={16} /> : <Download size={16} />}
              {copySuccess ? "Saved!" : "Download Vector CAD SVG"}
            </button>
          )}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left Column: Preset Templates & Prompt (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Preset Selector Grid */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Floor Plan Template
              </span>
              <span className="text-[10px] text-indigo-600 font-bold">{PRESET_DESIGNS.length} Layout Styles</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_DESIGNS.map((preset, idx) => {
                const isSelected = activePresetIndex === idx;
                const IconComp = preset.icon;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(idx)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-300 text-indigo-950 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <IconComp size={15} />
                      </div>
                      <span className="text-xs font-bold truncate">{preset.type}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{preset.area}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt Controls */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Architectural Requirements Prompt
              </label>
              <button 
                onClick={() => handleGenerate(mode)}
                disabled={loading}
                className="text-[11px] text-indigo-600 font-bold hover:underline flex items-center gap-1"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Regenerate
              </button>
            </div>

            <textarea
              className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[90px] bg-slate-50 text-slate-900 placeholder-slate-400 text-xs resize-none"
              placeholder="Describe requirements (e.g. 2400 sqft 4BHK duplex with double height living, prayer room, home theater)..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            {/* Reference Sketch Upload */}
            <div>
              <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center hover:bg-slate-50 transition-colors relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  title="Upload sketch"
                />
                {uploadedSketch ? (
                  <div className="relative z-0">
                    <img src={uploadedSketch} alt="Sketch" className="max-h-24 mx-auto object-contain rounded shadow-sm" />
                    <button 
                      onClick={clearSketch}
                      className="absolute -top-2 -right-2 bg-white text-red-500 p-1 rounded-full shadow-md hover:bg-red-50 z-20 border border-slate-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-slate-500 py-0.5">
                    <Upload size={16} className="text-slate-400" />
                    <span className="text-xs font-medium">Attach hand sketch or site plot map (Optional)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleGenerate('2D')}
                disabled={loading}
                className={`py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                  mode === '2D' ? 'bg-indigo-600 hover:bg-indigo-700 ring-2 ring-indigo-300' : 'bg-slate-800 hover:bg-slate-900'
                }`}
              >
                {loading && mode === '2D' ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"/>
                ) : (
                  <Compass size={16} />
                )}
                <span>Generate 2D CAD</span>
              </button>

              <button
                onClick={() => handleGenerate('3D')}
                disabled={loading}
                className={`py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                  mode === '3D' ? 'bg-purple-600 hover:bg-purple-700 ring-2 ring-purple-300' : 'bg-slate-800 hover:bg-slate-900'
                }`}
              >
                {loading && mode === '3D' ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"/>
                ) : (
                  <Eye size={16} />
                )}
                <span>3D Perspective</span>
              </button>
            </div>
          </div>

          {/* Room Dimensions Schedule Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Ruler size={14} className="text-indigo-600" /> Space Schedule &amp; Surface Areas
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
                {currentRooms.length} Spaces ({currentPreset.area})
              </span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {currentRooms.map((room, i) => (
                <div key={i} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-800 block">{room.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{room.floor}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-indigo-700 text-xs block">{room.dimensions}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">{room.area}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Architectural Viewport Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative min-h-[620px] border border-slate-800">
          {/* Viewport Top Toolbar */}
          <div className="p-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleGenerate('2D')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  mode === '2D' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Compass size={14} /> 2D CAD Layout
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

            {/* Viewport Zoom & Inspection Controls */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 75}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
                title="Zoom Out (Ctrl -)"
              >
                <ZoomOut size={15} />
              </button>

              <span className="text-[11px] font-mono font-bold text-indigo-400 px-2 min-w-[45px] text-center">
                {zoomLevel}%
              </span>

              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 250}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
                title="Zoom In (Ctrl +)"
              >
                <ZoomIn size={15} />
              </button>

              <button
                onClick={handleResetZoom}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Reset Zoom to 100%"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Viewport Canvas Render with Dynamic Zoom Container */}
          <div className="flex-1 flex items-center justify-center p-4 relative overflow-auto bg-slate-950 select-none">
            {loading ? (
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-lg" />
                <div>
                  <h3 className="text-white font-bold text-base">Rendering Architectural {mode} Layout...</h3>
                  <p className="text-slate-400 text-xs mt-1">Generating high-contrast dimension lines, room tags, and structural column grid for {currentPreset.type}</p>
                </div>
              </div>
            ) : generatedImage ? (
              <div 
                className="transition-all duration-200 flex items-center justify-center relative w-full h-full min-h-[500px]"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'center center'
                }}
              >
                <img
                  src={generatedImage}
                  alt="Generated Design"
                  className="max-w-full max-h-[560px] object-contain rounded-xl shadow-2xl transition-all duration-300"
                />
              </div>
            ) : (
              <div className="text-center text-slate-500 space-y-3">
                <Layers size={48} className="mx-auto opacity-20" />
                <p className="text-sm">Click "Generate 2D CAD" or "3D Perspective" to render your blueprint.</p>
              </div>
            )}

            {/* Bottom Status Bar */}
            {generatedImage && (
              <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                High-Definition CAD | Zoom: {zoomLevel}%
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanGenerator;