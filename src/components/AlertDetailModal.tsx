import { 
  FileCheck2, 
  ShieldCheck, 
  HelpCircle, 
  Cpu, 
  Stamp, 
  Lock, 
  Clock, 
  CheckCircle, 
  ExternalLink 
} from 'lucide-react';

interface AlertDetailModalProps {
  type: 'briefing' | 'certificate' | null;
  onClose: () => void;
  certAssetName?: string;
  certAssetId?: string;
  isEmergencyShut?: boolean;
}

export default function AlertDetailModal({
  type,
  onClose,
  certAssetName = 'Substation 04',
  certAssetId = 'ID: S-99231',
  isEmergencyShut
}: AlertDetailModalProps) {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card wrapper */}
      <div className="bg-white dark:bg-[#111625] border border-slate-300 dark:border-slate-800 rounded-2xl w-full max-w-2xl p-6 sm:p-8 relative z-10 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto text-left animate-scale-up">
        
        {/* Close Button top-right */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm uppercase px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          ╳ Close
        </button>

        {type === 'briefing' ? (
          /* A. Full Executive Briefing template */
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200/50 dark:border-slate-850/20 pb-4">
              <span className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-405 rounded-xl">
                <FileCheck2 className="w-7 h-7" />
              </span>
              <div>
                <h3 className="font-sans text-xl font-black text-slate-800 dark:text-slate-100 uppercase leading-none">
                  AI Facility Executive Briefing
                </h3>
                <span className="font-mono text-[9px] text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-widest mt-1 block">
                  System Compiled • Live Integrity Trace
                </span>
              </div>
            </div>

            {/* Checkpoints status updates */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-100/50 dark:bg-slate-850/40 border border-slate-200/50 dark:border-slate-850/20 rounded-xl space-y-3">
                <h4 className="font-mono text-xs font-black text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>Real-time Operations Checkpoints</span>
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-655 dark:text-slate-300">
                    <span className="font-sans font-semibold">1. Pressure Vessels Clearance (Zone B)</span>
                    <span className="font-mono font-bold text-emerald-500">✓ NOMINAL (42.8 bar)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-655 dark:text-slate-300">
                    <span className="font-sans font-semibold">2. Hydraulic Subassembly Heat Delta</span>
                    <span className="font-mono font-bold text-amber-500">⚠ WARNING (+4.8°C)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-655 dark:text-slate-300">
                    <span className="font-sans font-semibold">3. Gas Seal Gland Particulate Density</span>
                    <span className="font-mono font-bold text-red-500">🗙 CRITICAL LIMIT (Lube Filter #4)</span>
                  </div>
                </div>
              </div>

              {/* Narrative report */}
              <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-sans">
                <h5 className="font-mono text-[10px] text-slate-450 dark:text-slate-500 font-extrabold uppercase tracking-wider block">
                  Executive Narrative Summary
                </h5>
                <p>
                  Industrial analytics modeling logs verified transient thermal cavitation signs on Pump P101. Thermal shielding diagnostics map localized heat concentrations consistent with minor seal weeping. AI system has initiated temporary coolant bypass valves to support operations pending manual replacement schedules.
                </p>
                <p>
                  Overall site safety risk score remains stable at <strong className="text-slate-800 dark:text-slate-200">82% (Nominal Yellow)</strong>, but immediate physical check of secondary interlocks on high-tension systems is advised within 48 operational hours.
                </p>
              </div>
            </div>

            {/* Actions button */}
            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-850/20 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={onClose}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase rounded-lg tracking-wider transition-all text-center"
              >
                Distribute Briefing PDF
              </button>
              <button 
                onClick={onClose}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-455 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all text-center"
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : (
          /* B. Formal Digital Compliance Certificate template */
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b-2 border-dashed border-slate-200 dark:border-slate-800 pb-4">
              <span className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded-xl">
                <ShieldCheck className="w-7 h-7" />
              </span>
              <div>
                <h3 className="font-sans text-xl font-black text-slate-800 dark:text-slate-100 uppercase leading-none">
                  Digital Audit Certification
                </h3>
                <span className="font-mono text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-widest mt-1 block">
                  Federally Verified Standard Cleared
                </span>
              </div>
            </div>

            {/* Certificate content parchment box */}
            <div className="border border-amber-500/20 bg-amber-500/[0.01] dark:bg-amber-500/[0.02] p-6 sm:p-8 rounded-xl relative space-y-4 text-center">
              {/* Back decoration stamp watermark */}
              <div className="absolute right-6 top-6 opacity-10">
                <Stamp className="w-24 h-24 text-amber-600 dark:text-amber-500" />
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[9px] text-slate-400 font-extrabold uppercase tracking-widest leading-none block">
                  HARDWARE COMPLIANCE CLEARANCE ID
                </span>
                <span className="font-mono text-xs font-bold text-slate-650 dark:text-slate-350 block">
                  {certAssetId}
                </span>
              </div>

              <div className="py-2">
                <h4 className="font-sans text-xl sm:text-2xl font-black text-amber-800 dark:text-amber-600 uppercase tracking-tight leading-tight">
                  {certAssetName}
                </h4>
                <p className="font-sans text-xs text-slate-500 dark:text-slate-450 mt-1 font-medium italic">
                  Cleared and Certified compliant under Federal standard safety rulesets in Subsection G.
                </p>
              </div>

              {/* Hashes and stamps meta details */}
              <div className="grid grid-cols-2 gap-4 border-t border-dashed border-slate-200 dark:border-slate-800 pt-4 text-xs font-mono">
                <div className="text-left">
                  <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wide">SHA-256 Hash ID:</span>
                  <span className="text-slate-600 dark:text-slate-400 block truncate text-[10px] uppercase font-semibold">
                    e89cd12b50428fa60bce42ae7a9fbc7ac2
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wide">Verification Authority:</span>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-amber-700 dark:text-amber-500 font-bold uppercase">
                    <Stamp className="w-3.5 h-3.5" />
                    <span>Lead Auditor Seal</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-850/20 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={onClose}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase rounded-lg tracking-wider"
              >
                Download Security Certificate
              </button>
              <button 
                onClick={onClose}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-mono font-bold uppercase tracking-wider"
              >
                Close Certificate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
