import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  Activity, 
  Sliders, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Cpu,
  RefreshCw,
  X,
  FileCheck2
} from 'lucide-react';
import { UploadedFile } from '../types';

interface RcaViewProps {
  onShowNotification: (message: string) => void;
}

export default function RcaView({ onShowNotification }: RcaViewProps) {
  const [filesList, setFilesList] = useState<UploadedFile[]>([
    { id: 'f1', name: 'Sensor_Data_Aug_24.csv', size: '14.2 MB', status: 'completed', progress: 100 },
    { id: 'f2', name: 'Operator_Log_ShiftB.pdf', size: '4.8 MB', status: 'completed', progress: 100 }
  ]);
  const [dragActive, setDragActive] = useState(false);
  const [machineConfidence, setMachineConfidence] = useState(94.2);
  const [processConfidence, setProcessConfidence] = useState(42.1);
  const [envConfidence, setEnvConfidence] = useState(12.5);
  const [humanConfidence, setHumanConfidence] = useState(4.8);
  const [showRemediationSuccess, setShowRemediationSuccess] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<'machine' | 'people' | 'process' | 'env' | null>('machine');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const simulateFileAdd = (fileName: string, fileSize: string) => {
    const fileId = `usr-file-${Date.now()}`;
    const newFile: UploadedFile = {
      id: fileId,
      name: fileName,
      size: fileSize,
      status: 'uploading',
      progress: 10
    };

    setFilesList(prev => [...prev, newFile]);

    // Simulate transfer progress ticker
    let currentProgress = 10;
    const interval = setInterval(() => {
      currentProgress += 15;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setFilesList(prev => prev.map(f => {
          if (f.id === fileId) {
            return { ...f, progress: 100, status: 'completed' };
          }
          return f;
        }));
        onShowNotification(`Telemetry log "${fileName}" compiled and categorized successfully.`);
      } else {
        setFilesList(prev => prev.map(f => {
          if (f.id === fileId) {
            return { ...f, progress: currentProgress };
          }
          return f;
        }));
      }
    }, 250);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      simulateFileAdd(file.name, sizeStr);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      simulateFileAdd(file.name, sizeStr);
    }
  };

  const handleApproveAction = () => {
    setShowRemediationSuccess(true);
    onShowNotification("Critical Remediation Procedure Approved: Locking out lubricant feedback valve #2.");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200/50 dark:border-slate-800/10">
        <div className="text-left">
          <h2 className="font-sans text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter leading-none">
            Diagnostic Center
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-sans text-sm sm:text-base mt-2 font-medium max-w-xl">
            Deep learning root-cause analysis (RCA) active on INCINC-9902: Primary Turbine Bearing Overheat.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 font-mono text-xs font-bold rounded-lg border border-red-500/10 uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            INCIDENT LIVE
          </span>
          <span className="font-mono text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded border border-slate-200 dark:border-slate-800/60 font-semibold">
            v2.4.0-STABLE
          </span>
        </div>
      </div>

      {/* Main Bento Layout Grid panels */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        
        {/* Card 1: Drag-and-Drop Investigation Portal */}
        <section className="col-span-12 lg:col-span-4 glass-card p-5 rounded-xl flex flex-col justify-between min-h-[360px] text-left">
          <div>
            <h3 className="font-sans text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-1">
              <UploadCloud className="w-5 h-5 text-blue-500" />
              <span>Investigation Portal</span>
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
              Ingest telemetry sensor dumps or log catalogs
            </p>
          </div>

          {/* Interactive Drag-and-Drop dashed container */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center flex-1 transition-all ${
              dragActive 
                ? 'border-blue-500 bg-blue-500/5' 
                : 'border-slate-350 dark:border-slate-800 hover:border-blue-500/50 hover:bg-slate-50/50 dark:hover:bg-[#1a1f2f]/10'
            }`}
          >
            <UploadCloud className="w-9 h-9 text-slate-400 mb-2 animate-bounce" />
            <p className="font-sans text-xs font-bold text-slate-700 dark:text-slate-200">
              Drag file here or click to browse
            </p>
            <p className="font-mono text-[9px] text-slate-400 mt-1">
              PDF, CSV, LOG (MAX 50MB)
            </p>
            <input
              type="file"
              onChange={handleFileInputChange}
              className="hidden"
              id="fileInput"
            />
            <label 
              htmlFor="fileInput"
              className="mt-3.5 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-extrabold rounded uppercase tracking-wider cursor-pointer hover:bg-blue-500/20 transition-all border border-blue-500/15"
            >
              Browse Storage
            </label>
          </div>

          {/* Uploaded Files Ledger list */}
          <div className="mt-4 space-y-2 max-h-[140px] overflow-y-auto pr-1">
            {filesList.map((file) => (
              <div 
                key={file.id}
                className="p-2 bg-slate-100/60 dark:bg-[#090e1c]/45 border border-slate-200/55 dark:border-slate-800/35 rounded-lg flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-sans font-bold text-slate-700 dark:text-slate-205 truncate">
                      {file.name}
                    </p>
                    {file.status === 'uploading' && (
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ width: `${file.progress}%` }} />
                      </div>
                    )}
                  </div>
                </div>
                {file.status === 'completed' ? (
                  <CheckCircle2 className="w-4.5 h-4.5 text-blue-500 flex-shrink-0" />
                ) : (
                  <span className="font-mono text-[9px] font-bold text-blue-500 animate-pulse uppercase flex-shrink-0">
                    {file.progress}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Card 2: AI Engine Diagnostic Summary */}
        <section className="col-span-12 lg:col-span-8 glass-card p-5 rounded-xl flex flex-col justify-between min-h-[360px] text-left">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-3 border-b border-slate-200/50 dark:border-slate-800/20 pb-2">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <h3 className="font-sans text-sm font-bold">
                Brain AI Insight Diagnostic Engine
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              {/* Incident summary */}
              <div className="space-y-1.5">
                <span className="font-mono text-[9px] text-slate-500 dark:text-slate-450 uppercase font-black tracking-wider leading-none">
                  INC-9902 Narrative Raw Summary
                </span>
                <div className="p-3 bg-slate-50 dark:bg-slate-850/30 border border-slate-200/50 dark:border-slate-850/20 rounded-xl">
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans">
                    Primary turbine bearing (T-B-04) reached critical telemetry temperature limit (<span className="text-red-500">112°C</span>) at 03:44:12 UTC. System mechanical safety disconnect sequence initiated. Vibration analytics surge preceded temperature rise.
                  </p>
                </div>
              </div>

              {/* Root Cause Card */}
              <div className="space-y-1.5">
                <span className="font-mono text-[9px] text-slate-500 dark:text-slate-450 uppercase font-black tracking-wider leading-none">
                  AI Probable Root Cause Analysis
                </span>
                <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl leading-relaxed text-xs">
                  <p className="font-sans font-bold text-red-600 dark:text-red-400 mb-1 leading-snug">
                    Bearing degradation due to lubricant particulate contamination
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    High particulate density feedback telemetry registered in returns oil line filter #4. Metal shavings match bearing race alloy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Historical references & guides split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-200/50 dark:border-slate-850/20 mt-4 text-xs">
            {/* Similar events */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Relevant Historical Records
              </span>
              <div className="space-y-1 font-sans">
                <a href="#" className="flex items-center justify-between p-1 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded transition-colors text-slate-700 dark:text-slate-300">
                  <span className="underline decoration-blue-500/30">INC-4451: Pump Seal Failure (88% Match)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-1 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded transition-colors text-slate-700 dark:text-slate-300">
                  <span className="underline decoration-blue-500/30">INC-8102: Lube Line Clog (72% Match)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Checklist recommendations */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Deployable Corrective Checks
              </span>
              <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Hot-flush entire lubricating subsystem and deploy clean filter filters.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Authorize immediate borescope diagnostics of bearing inner races.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Cause-and-Effect Visualization (Fishbone Models diagram) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-stretch">
        <section className="xl:col-span-3 glass-card p-5 sm:p-6 rounded-xl flex flex-col justify-between min-h-[420px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-200/50 dark:border-slate-850/20 pb-3 text-left">
            <div>
              <h3 className="font-sans text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <span>Ishikawa Cause-and-Effect (Fishbone) Diagram</span>
              </h3>
              <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 font-medium pb-2">
                Click on the core category cards (Machine, Process, etc.) to load localized diagnostic parameters.
              </p>
            </div>
            
            {/* Legend indicators */}
            <div className="flex gap-4 font-mono text-[10px] uppercase font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Primary Risk Path</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-350 dark:bg-slate-700" />
                <span>Secondary Factors</span>
              </div>
            </div>
          </div>

          {/* Complex Interactive Fishbone SVG Layout container */}
          <div className="relative flex-grow flex items-center justify-center py-6 min-h-[260px] bg-slate-100/30 dark:bg-[#090e1c]/45 rounded-xl border border-slate-200/55 dark:border-slate-850/25">
            {/* Center spine */}
            <div className="absolute h-1 w-4/5 left-10 bg-slate-300 dark:bg-slate-800 flex items-center justify-end">
              <div className="bg-red-500 text-white font-mono text-[10px] px-3 py-1.5 rounded-lg border border-red-500 font-extrabold shadow-md transform translate-x-4 absolute -right-3">
                OVERHEAT CRITICAL LIMIT
              </div>
            </div>

            {/* Fishbone branches layout container */}
            <div className="grid grid-cols-2 w-full h-full max-w-2xl px-6 gap-y-24 gap-x-6 relative py-4 z-10">
              
              {/* TOP LEFT: PEOPLE */}
              <button
                type="button"
                onClick={() => setSelectedBranch('people')}
                className={`relative flex flex-col items-center justify-end pb-8 cursor-pointer group rounded-lg p-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-850/30 text-center ${
                  selectedBranch === 'people' ? 'ring-2 ring-blue-500 bg-blue-500/5' : ''
                }`}
              >
                {/* diagonal separator */}
                <div className="absolute bottom-0 left-1/2 w-1 h-14 bg-slate-300 dark:bg-slate-820 transform origin-bottom -rotate-45" />
                <div className="bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>People</span>
                </div>
                <div className="font-mono text-[9px] text-slate-400 dark:text-slate-500 mt-2 space-y-0.5 leading-none font-semibold uppercase">
                  <p>Training Gap logs</p>
                  <p>Inadvertent schedule skip</p>
                </div>
              </button>

              {/* TOP RIGHT: PROCESS */}
              <button
                type="button"
                onClick={() => setSelectedBranch('process')}
                className={`relative flex flex-col items-center justify-end pb-8 cursor-pointer group rounded-lg p-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-850/30 text-center ${
                  selectedBranch === 'process' ? 'ring-2 ring-blue-500 bg-blue-500/5' : ''
                }`}
              >
                <div className="absolute bottom-0 right-1/2 w-1 h-14 bg-slate-300 dark:bg-slate-820 transform origin-bottom rotate-45" />
                <div className="bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Process</span>
                </div>
                <div className="font-mono text-[9px] text-slate-400 dark:text-slate-500 mt-2 space-y-0.5 leading-none font-semibold uppercase">
                  <p>Shift lag metrics</p>
                  <p>Override overrides active</p>
                </div>
              </button>

              {/* BOTTOM LEFT: MACHINE (ACTIVE ERROR STATUS) */}
              <button
                type="button"
                onClick={() => setSelectedBranch('machine')}
                className={`relative flex flex-col items-center justify-start pt-8 cursor-pointer group rounded-lg p-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-850/30 text-center ${
                  selectedBranch === 'machine' ? 'ring-2 ring-red-500 bg-red-500/5' : ''
                }`}
              >
                <div className="absolute top-0 left-1/2 w-1 h-14 bg-red-400/50 transform origin-top rotate-45 animate-pulse" />
                <div className="bg-red-500/10 border border-red-500/35 px-3.5 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 text-red-600 dark:text-red-450 uppercase animate-[pulsate_2s_infinite]">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Machine</span>
                </div>
                <div className="font-mono text-[9px] text-red-500 font-bold mt-2 space-y-0.5 leading-none uppercase">
                  <p className="animate-pulse">Lube particulate Contaminants</p>
                  <p>Gland seal degradation</p>
                </div>
              </button>

              {/* BOTTOM RIGHT: ENVIRONMENT */}
              <button
                type="button"
                onClick={() => setSelectedBranch('env')}
                className={`relative flex flex-col items-center justify-start pt-8 cursor-pointer group rounded-lg p-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-850/30 text-center ${
                  selectedBranch === 'env' ? 'ring-2 ring-blue-500 bg-blue-500/5' : ''
                }`}
              >
                <div className="absolute top-0 right-1/2 w-1 h-14 bg-slate-300 dark:bg-slate-820 transform origin-top -rotate-45" />
                <div className="bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  <span>Environment</span>
                </div>
                <div className="font-mono text-[9px] text-slate-400 dark:text-slate-500 mt-2 space-y-0.5 leading-none font-semibold uppercase">
                  <p>Thermal envelope delta</p>
                  <p>Humidity moisture leak</p>
                </div>
              </button>

            </div>
          </div>
        </section>

        {/* RCA Diagnostics right bar slider metrics inputs */}
        <section className="col-span-12 xl:col-span-1 space-y-6 flex flex-col justify-between text-left h-full">
          {/* Sliders Card */}
          <div className="glass-card p-5 rounded-xl flex-grow flex flex-col justify-between">
            <h4 className="font-sans text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-850/20 pb-2 mb-4">
              <Sliders className="w-4 h-4 text-blue-500" />
              <span>Category Margin Weight</span>
            </h4>

            {/* Adjustable sliders */}
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10px] font-bold text-slate-500 uppercase">
                  <span>Machine error</span>
                  <span className="text-red-500">{machineConfidence.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={machineConfidence}
                  onChange={(e) => setMachineConfidence(parseFloat(e.target.value))}
                  className="w-full accent-red-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10px] font-bold text-slate-500 uppercase">
                  <span>Process fault</span>
                  <span className="text-amber-500">{processConfidence.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={processConfidence}
                  onChange={(e) => setProcessConfidence(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10px] font-bold text-slate-500 uppercase">
                  <span>Environment Envelope</span>
                  <span className="text-blue-500">{envConfidence.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={envConfidence}
                  onChange={(e) => setEnvConfidence(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10px] font-bold text-slate-500 uppercase">
                  <span>Operator oversight</span>
                  <span className="text-indigo-400">{humanConfidence.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={humanConfidence}
                  onChange={(e) => setHumanConfidence(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Target recommendation widget panel */}
          <div className="p-4 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/15 dark:border-blue-400/20 rounded-xl space-y-3">
            <h5 className="font-mono text-[9px] text-blue-500 dark:text-blue-400 font-extrabold uppercase tracking-widest pl-0.5">
              Targeted AI Remediation
            </h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              &quot;Participant ratios confirm {machineConfidence > 50 ? 'significant mechanical cavitation' : 'unusual temperature delta'}. Lock lubrication feedback line #2 or deploy standby generator CT-2 immediately.&quot;
            </p>
            <button
              onClick={handleApproveAction}
              className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600/95 text-white font-mono text-[10px] font-extrabold rounded uppercase tracking-wider transition-all duration-300 cursor-pointer text-center"
            >
              Approve Remediation
            </button>
          </div>
        </section>
      </div>

      {/* Remediation Approved Action Success Overlay Modal */}
      {showRemediationSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" 
            onClick={() => setShowRemediationSuccess(false)} 
          />
          <div className="bg-white dark:bg-[#1a1f2f] border border-slate-300 dark:border-slate-800/80 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl text-center animate-scale-up">
            <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4 animate-[pulse_1s_infinite]" />
            <h3 className="font-sans text-base font-black text-slate-800 dark:text-slate-100 uppercase">
              Remediation Action Implemented
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-sans">
              Isolation commands dispatched successfully to local Programmable Logic Controllers (PLCs). Telemetry sensor registers are reflecting immediate coolant bypass valve flow adjustments.
            </p>
            <button
              onClick={() => setShowRemediationSuccess(false)}
              className="mt-6 w-full py-2 bg-blue-650 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase rounded-lg tracking-wider"
            >
              Verify System Nominal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
