import React, { useState, useRef } from 'react';
import {
  Settings,
  History,
  AlertTriangle,
  ShieldAlert,
  BookOpen,
  FileText,
  ArrowRight,
  Sparkles,
  Network
} from 'lucide-react';
import { ViewType, Incident } from '../types';

interface RelatedDoc {
  name: string;
  type: string;
  info: string;
}


interface KnowledgeNode {
  id: string;
  label: string;
  type: 'asset' | 'log' | 'incident' | 'sop' | 'manual';
  x: number; // percentage left
  y: number; // percentage top
  statusText?: string;
  riskRating?: string;
  riskProgress?: number;
  aiSummary?: string;
  system: string;
  relatedDocs?: RelatedDoc[];
  imageSrc?: string;
}

interface KnowledgeGraphViewProps {
  onAddIncident: (incident: Incident) => void;
  setCurrentView: (view: ViewType) => void;
  onShowNotification: (message: string) => void;
}

// Fallback JSX types to avoid TypeScript complaints in some build configs
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export default function KnowledgeGraphView({
  onAddIncident,
  setCurrentView,
  onShowNotification
}: KnowledgeGraphViewProps) {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [positions, setPositions] = useState({ dx: 0, dy: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [initialDrag, setInitialDrag] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const nodesList: KnowledgeNode[] = [
    {
      id: 'p101',
      label: 'Pump P101',
      type: 'asset',
      x: 42,
      y: 42,
      statusText: 'CRITICAL',
      riskRating: '8.2/10',
      riskProgress: 82,
      system: 'Hydro-Processing Unit B',
      aiSummary: 'Asset is currently 20% past its scheduled maintenance cycle (Ref: Maintenance Log #42). Cross-referencing Incident Report IR-99, similar vibration patterns previously led to bearing failure in Unit A. Recommendation: Immediate vibration dampening and seal inspection.',
      relatedDocs: [
        { name: 'Maintenance_Log_42.pdf', type: 'log', info: 'Last modified: 12 days ago' },
        { name: 'Safety_SOP_05_Rev4', type: 'sop', info: 'Critical Protocol • Active' }
      ],
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX3MROb85Y6Sv7_dlc7YIZVxCLrAkff9XeuHu7CHt_F68PBKyoJQWv-EiZ3qdRoMlrQ0i7sn7Yt-i1uFyPy_UoAbH1JLoN_UFe_6AUuSPEfZnwER2StyrjxccM-4XNotCUYm8DHfVu6zW1ZKs_43q755C0saP056_wqx1-kKs5jojsJwev49ZbVNTD9eY0cWbqbms46T6zfgHLJ8nBGHrH6NGBOyAooQYlGMXOeS6e5HRIoZh83CDRVvomaFbl9suRzqylVFlMfsg'
    },
    {
      id: 'log42',
      label: 'Maintenance Log #42',
      type: 'log',
      x: 62,
      y: 28,
      statusText: 'OVERDUE',
      riskRating: '6.4/10',
      riskProgress: 64,
      system: 'Scheduled Preventive Cycle',
      aiSummary: 'Lubricant oil testing parameters outlined micro-particulate metals floating in return lines. Sign-off delayed due to lead shift engineering changes.',
      relatedDocs: [
        { name: 'Lubricant_QA_Standards.pdf', type: 'manual', info: 'Standard Reference • 2025' }
      ]
    },
    {
      id: 'ir99',
      label: 'Incident IR-99',
      type: 'incident',
      x: 68,
      y: 60,
      statusText: 'LOGGED EVENT',
      riskRating: '7.5/10',
      riskProgress: 75,
      system: 'Turbine Bearing Chamber B',
      aiSummary: 'Telemetry incident IR-99 mapped an identical temperature gradient climb across matching structural mounts. Seal weeping confirmed before automatic lock-down.',
      relatedDocs: [
        { name: 'Incident_Lessons_Learned.pdf', type: 'log', info: 'Safety Archive • 2025' }
      ]
    },
    {
      id: 'sop05',
      label: 'Safety SOP 05',
      type: 'sop',
      x: 22,
      y: 60,
      statusText: 'PROTOCOL ACTIVE',
      riskRating: '1.2/10',
      riskProgress: 12,
      system: 'Mandatory Site Safety Guides',
      aiSummary: 'Protocol outlines emergency interlock bypass constraints. Gland seal inspection strictly dictates double line isolation parameters prior to manual contact.',
      relatedDocs: [
        { name: 'OSHA_Pressure_Hazards.pdf', type: 'sop', info: 'Formal regulatory filing' }
      ]
    },
    {
      id: 'manual',
      label: 'Asset Manual-B',
      type: 'manual',
      x: 82,
      y: 35,
      statusText: 'DOCUMENT',
      riskRating: '0.0/10',
      riskProgress: 0,
      system: 'Pump Technical Manual',
      aiSummary: 'Original hardware operating tolerances, fluid viscosity requirements, and structural disassembly diagrams.',
      relatedDocs: []
    }
  ];

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setInitialDrag({ x: e.clientX - positions.dx, y: e.clientY - positions.dy });
  };

  const handleDragMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPositions({
      dx: e.clientX - initialDrag.x,
      dy: e.clientY - initialDrag.y
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleInitiateRepair = (node: KnowledgeNode) => {
    // Add real incident
    const added: Incident = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${node.label} Repair Request`,
      location: node.system,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      level: 'WARNING',
      status: 'active',
      description: `RCA triggered work order for ${node.label} following risk evaluation of ${node.system}`
    };

    onAddIncident(added);
    onShowNotification(`Repair request successfully initiated for ${node.label}. Work Ticket published: WT-9014.`);
    setSelectedNode(null);
  };

  // Filter based on search query
  const filteredNodesList = searchQuery
    ? nodesList.filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : nodesList;

  // Render connector line paths dynamically relative to canvas parent layout percentages
  const getLineCoordinates = (id1: string, id2: string) => {
    const n1 = nodesList.find(n => n.id === id1) as any;
    const n2 = nodesList.find(n => n.id === id2) as any;
    if (!n1 || !n2) return { x1: 0, y1: 0, x2: 0, y2: 0 };
    return {
      x1: `${n1.x}%`,
      y1: `${n1.y}%`,
      x2: `${n2.x}%`,
      y2: `${n2.y}%`
    };
  };

  const connections = [
    { from: 'p101', to: 'log42' },
    { from: 'p101', to: 'ir99' },
    { from: 'p101', to: 'sop05' },
    { from: 'log42', to: 'manual' }
  ];

  return (
    <div className="flex-1 h-full w-full min-h-0 relative overflow-hidden blueprint-grid flex">
      {/* Search and focus headers overlay */}
      <div className="absolute top-4 left-4 z-20 w-80">
        <div className="bg-white/80 dark:bg-[#1a1f2f]/80 backdrop-blur-md rounded-xl p-2 flex items-center gap-2 border border-slate-300/50 dark:border-slate-800 shadow-lg">
          <Network className="w-4 h-4 text-blue-500 pl-1" />
          <input
            type="text"
            className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs w-full text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            placeholder="Search nodes (e.g., Pump, SOP)..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Graph Canvas Area */}
      <div 
        ref={canvasRef}
        className={`flex-1 relative h-full select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* Dynamic coordinate transform container for dragging */}
        <div 
          className="absolute inset-0 w-full h-full transition-transform duration-75"
          style={{ transform: `translate(${positions.dx}px, ${positions.dy}px)` }}
        >
          {/* Connector Graphic Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((conn, idx) => {
              const coords = getLineCoordinates(conn.from, conn.to);
              return (
                <g key={idx}>
                  {/* Backdrop Glow effect path */}
                  <line
                    x1={coords.x1}
                    y1={coords.y1}
                    x2={coords.x2}
                    y2={coords.x2 ? coords.y2 : 0}
                    className="stroke-blue-500/10 dark:stroke-blue-400/20"
                    strokeWidth="4"
                  />
                  {/* High Precision mechanical line */}
                  <line
                    x1={coords.x1}
                    y1={coords.y1}
                    x2={coords.x2}
                    y2={coords.y2}
                    className="stroke-slate-300 dark:stroke-slate-700"
                    strokeWidth="1.5"
                  />
                  {/* Animated tech data flow pulses */}
                  <circle r="3" fill="#0066ff" className="animate-[pulse_1.5s_infinite]">
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      path={`M 0,0 L 100,100`} // fallback animation attributes
                    />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating HTML Division Nodes */}
          {filteredNodesList.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();
                  setSelectedNode(node);
                }}
                className={`absolute w-32 h-32 rounded-full p-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-105 z-10 ${
                  isSelected 
                    ? 'border-2 border-blue-500 bg-blue-500/10 scale-103 neon-glow-primary dark:border-blue-400 dark:bg-blue-400/10' 
                    : 'border border-slate-300/80 bg-white/90 dark:border-slate-800 dark:bg-[#161b2b]/95 hover:border-blue-500/50'
                }`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {/* Visual Indicators */}
                {node.type === 'asset' && (
                  <Settings className="w-6 h-6 text-blue-500 dark:text-blue-400 mb-1" />
                )}
                {node.type === 'log' && (
                  <History className="w-6 h-6 text-indigo-500 mb-1" />
                )}
                {node.type === 'incident' && (
                  <AlertTriangle className="w-6 h-6 text-amber-500 mb-1" />
                )}
                {node.type === 'sop' && (
                  <ShieldAlert className="w-6 h-6 text-emerald-500 mb-1" />
                )}
                {node.type === 'manual' && (
                  <BookOpen className="w-6 h-6 text-slate-500 mb-1" />
                )}

                <span className="font-sans text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight leading-snug">
                  {node.label}
                </span>

                {node.statusText && (
                  <span className={`text-[8px] font-mono font-bold mt-1.5 px-1.5 py-0.5 rounded ${
                    node.statusText === 'CRITICAL' ? 'bg-red-500/15 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-550'
                  }`}>
                    {node.statusText}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating map legend bottom left overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 dark:bg-[#0e1322]/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-800 shadow-md space-y-2 text-left">
        <h5 className="font-mono text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Graph Legends</h5>
        <div className="space-y-1.5 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="font-sans font-semibold text-slate-600 dark:text-slate-400">Primary Systems Asset</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="font-sans font-semibold text-slate-600 dark:text-slate-400">Linked Incident Event</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span className="font-sans font-semibold text-slate-600 dark:text-slate-400">Documentation Node</span>
          </div>
        </div>
      </div>

      {/* Lateral flyout Panel triggers details info sheet */}
      {selectedNode && (
        <div className="w-96 h-full bg-white dark:bg-[#161b2b] border-l border-slate-200 dark:border-slate-800/80 shadow-2xl relative z-40 flex flex-col animate-[slideLeft_0.35s_cubic-bezier(0.16,1,0.3,1)]">
          {/* Header section */}
          <div className="p-5 border-b border-slate-200/50 dark:border-slate-800/20 flex justify-between items-center text-left">
            <div className="p-3 bg-slate-50 dark:bg-slate-850/50 rounded-lg border border-slate-200 dark:border-slate-800/40 flex items-center gap-3 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/30 cursor-pointer">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-800 dark:text-slate-800 truncate">{selectedNode.label}</div>
                <p className="font-mono text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-1 block">
                  {selectedNode.system}
                </p>
              </div>
              <FileText className="w-5 h-5 text-slate-400 shrink-0" />
            </div>
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-mono text-sm uppercase px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ╳
            </button>
          </div>

          {/* Scrolling metadata content section */}
          <div className="grow overflow-y-auto p-5 space-y-6 text-left">
            
            {/* Risk Indicator Card */}
            {selectedNode.riskRating && (
              <div className="p-4 bg-slate-100/55 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/30 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                    Calculated Risk Rating
                  </span>
                  <span className="font-sans text-xs font-black text-red-500">
                    {selectedNode.riskRating}
                  </span>
                </div>
                {/* Custom status bar */}
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      (selectedNode.riskProgress || 0) > 80 ? 'bg-red-500 neon-glow-error' : 'bg-blue-500 neon-glow-primary'
                    }`}
                    style={{ width: `${selectedNode.riskProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* AI Summary focus sheet */}
            {selectedNode.aiSummary && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>AI Summary Diagnostics</span>
                </div>
                <div className="p-3 bg-blue-500/5 border border-blue-500/15 dark:border-blue-400/25 rounded-xl font-sans text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-medium">
                  {selectedNode.aiSummary}
                </div>
              </div>
            )}

            {/* CAD Thermal Image Overlay representation */}
            {selectedNode.imageSrc && (
              <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800">
                <img 
                  src={selectedNode.imageSrc}
                  alt={`${selectedNode.label} thermal image analysis`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent p-2 text-left">
                  <span className="bg-red-500/25 border border-red-500 text-red-400 px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold tracking-widest">
                    LIVE THERMAL HEATMAP
                  </span>
                </div>
              </div>
            )}

            {/* Related items references section links */}
            {selectedNode.relatedDocs && selectedNode.relatedDocs.length > 0 && (
              <div className="space-y-2.5">
                <h5 className="font-mono text-[9px] text-slate-400 font-extrabold uppercase tracking-wider pl-0.5">
                  Related Knowledge Assets
                </h5>
                <div className="space-y-2">
                  {selectedNode.relatedDocs.map((doc, idx) => (
                    <div key={doc.name ? `${doc.name}-${idx}` : idx} className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-black dark:text-slate-200 group-hover:text-white transition-colors">
                          {doc.name || selectedNode.label}
                        </div>

                        <p className="font-mono text-[10px] text-blue-600 dark:text-blue-400 group-hover:text-white uppercase tracking-wider mt-1 block transition-colors">
                          {doc.type || selectedNode.system}
                        </p>
                      </div>

                      <FileText className="w-5 h-5 text-slate-400 group-hover:text-white shrink-0 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Slide out footer actions */}
          <div className="p-5 border-t border-slate-200/50 dark:border-slate-800/20 bg-slate-50/50 dark:bg-[#1a1f2f]/30">
            {selectedNode.type === 'asset' ? (
              <button
                onClick={() => handleInitiateRepair(selectedNode)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-sans text-xs font-black tracking-widest uppercase rounded-lg transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>Initiate Repair Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setSelectedNode(null)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 font-sans text-xs font-bold tracking-widest uppercase rounded-lg transition-all text-center cursor-pointer"
              >
                Dismiss Overview
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
