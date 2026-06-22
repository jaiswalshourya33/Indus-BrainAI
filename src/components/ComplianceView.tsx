import { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  Filter, 
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  FileCheck2,
  Lock,
  Stamp,
  BookOpen,
  CheckCircle,
  X,
  Sparkles
} from 'lucide-react';
import { ComplianceAsset } from '../types';

interface ComplianceViewProps {
  onShowCert: (assetName: string, id: string) => void;
  onShowNotification: (msg: string) => void;
}

export default function ComplianceView({ onShowCert, onShowNotification }: ComplianceViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NON-COMPLIANT' | 'PENDING' | 'COMPLIANT'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAsset, setSelectedAsset] = useState<ComplianceAsset | null>(null);

  const initialAssets: ComplianceAsset[] = [
    {
      id: 'asset-1',
      name: 'Turbine XT-400',
      assetId: 'ID: T-40912',
      status: 'NON-COMPLIANT',
      lastAudit: '2023-11-12',
      nextDue: 'OVERDUE (14d)',
      riskScore: 'CRITICAL',
      description: 'System pressure sensors indicated minor gland leak on primary flange assembly leading to non-compliant status.'
    },
    {
      id: 'asset-2',
      name: 'Primary Conveyor A',
      assetId: 'ID: C-11200',
      status: 'PENDING',
      lastAudit: '2024-03-01',
      nextDue: 'In 3 Days',
      riskScore: 'MEDIUM',
      description: 'Periodic vibration test schedules have elapsed. Secondary safety audit review is pending field checklist compilation.'
    },
    {
      id: 'asset-3',
      name: 'Substation 04',
      assetId: 'ID: S-99231',
      status: 'COMPLIANT',
      lastAudit: '2024-04-15',
      nextDue: '2025-04-15',
      riskScore: 'LOW',
      description: 'All electrical isolators, high-tension relays, and cooling oil metrics correspond perfectly to federal standards.'
    },
    {
      id: 'asset-4',
      name: 'HV Generator Group B',
      assetId: 'ID: G-11048',
      status: 'PENDING',
      lastAudit: '2024-01-20',
      nextDue: 'In 5 Days',
      riskScore: 'MEDIUM',
      description: 'Intermittent magnetic rotor heat metrics require manual field validation prior to formal compliance signoff.'
    },
    {
      id: 'asset-5',
      name: 'Cooling Tank CT-2',
      assetId: 'ID: K-30914',
      status: 'COMPLIANT',
      lastAudit: '2024-05-10',
      nextDue: '2025-05-10',
      riskScore: 'LOW',
      description: 'Fluid volumes, pump seals, and level transmitters comply with regional wastewater structural criteria.'
    }
  ];

  const handleAuditRequest = (asset: ComplianceAsset) => {
    onShowNotification(`Compliance audit ticket submitted for ${asset.name}. Lead investigator dispatched.`);
  };

  // Filter ledger assets
  const filteredAssets = initialAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || asset.assetId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate items for rendering pagination
  const itemsPerPage = 3;
  const paginatedAssets = filteredAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Section */}
      <section className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 pb-2 border-b border-slate-200/50 dark:border-slate-800/10">
        <div className="text-left">
          <div className="flex items-center gap-3.5 mb-2">
            <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Live Intelligence Compliance Feed
            </span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">
            Compliance Intelligence
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 max-w-xl font-medium">
            Monitoring federal certification cycles, valve integrity standard clearances, and incident risk thresholds.
          </p>
        </div>

        {/* Radial overall score loop card */}
        <div className="glass-card p-5 rounded-2xl flex items-center gap-6 border-l-4 border-l-amber-500/80 min-w-[325px] w-full xl:w-auto">
          <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
            {/* SVG radial track */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-slate-200 dark:text-slate-800"
                cx="40"
                cy="40"
                r="34"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="5"
              />
              <circle
                className="text-amber-500"
                cx="40"
                cy="40"
                r="34"
                fill="transparent"
                stroke="currentColor"
                strokeDasharray="213.6"
                strokeDashoffset="38" // 82% filled
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute font-sans text-xl font-black text-amber-600 dark:text-amber-500">
              82%
            </span>
          </div>
          <div className="text-left">
            <h4 className="font-sans text-sm font-bold text-slate-700 dark:text-slate-250">
              Composite Zone Verification
            </h4>
            <span className="font-mono text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase mt-1 inline-block">
              YELLOW WARNING STATUS
            </span>
            <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-2 font-mono">
              Value decreased by 4.2% since last week
            </p>
          </div>
        </div>
      </section>

      {/* 2. KPI Bento Grid Summary cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* red inspection card */}
        <div className="glass-card p-5 rounded-xl border-l-4 border-l-red-500 flex flex-col justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all text-left">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4.5 h-4.5 text-red-500" />
            <h5 className="font-mono text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none">
              Inspection Gaps
            </h5>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">12</span>
            <span className="text-xs text-slate-400 dark:text-slate-505 font-semibold uppercase font-mono">Critical Tasks</span>
          </div>
          <p className="text-[10px] text-red-500 font-bold font-mono mt-4 flex items-center gap-1">
            <span>▲</span>
            <span>3 unresolved audits since 08:00 AM</span>
          </p>
        </div>

        {/* amber expired certifications card */}
        <div className="glass-card p-5 rounded-xl border-l-4 border-l-amber-500 flex flex-col justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all text-left">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4.5 h-4.5 text-amber-500" />
            <h5 className="font-mono text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none">
              Expired Certifications
            </h5>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">08</span>
            <span className="text-xs text-slate-400 dark:text-slate-550 font-semibold uppercase font-mono">Assets Affected</span>
          </div>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold font-mono mt-4">
            ⏱ Next mandatory expiry in 48 hours
          </p>
        </div>

        {/* green mitigated warnings */}
        <div className="glass-card p-5 rounded-xl border-l-4 border-l-emerald-500 flex flex-col justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all text-left">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
            <h5 className="font-mono text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none">
              Mitigated Compliance Gaps
            </h5>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">94</span>
            <span className="text-xs text-slate-400 dark:text-slate-550 font-semibold uppercase font-mono">Proactive Fixes</span>
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold font-mono mt-4">
            ✓ 100% policy grid alignment verified
          </p>
        </div>
      </section>

      {/* 3. AI Generated Audit & Context Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left AI summary frosted view card */}
        <div className="lg:col-span-2 glass-card p-6 rounded-xl flex flex-col justify-between min-h-[350px] text-left">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/50 dark:border-slate-850/30 pb-3 mb-4">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <h4 className="font-sans text-base font-bold text-slate-800 dark:text-slate-200">
                  AI-Generated Audit Summary
                </h4>
              </div>
              <span className="font-mono text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-550 border border-slate-200/50 dark:border-slate-800 shrink-0 px-2.5 py-0.5 rounded uppercase font-bold text-right">
                SCAN VERIFIED: 10m AGO
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              <p>
                The neural analyzer has verified <strong className="text-red-500 font-bold text-xs sm:text-sm">significant compliance gaps</strong> in the high-stakes boiler room operating loops. While individual asset connectivity remains pristine, the 20% decline in inspection rate metrics for pressure vessels suggests human resource bottlenecking.
              </p>
              
              <ul className="space-y-3.5 pt-2">
                <li className="flex items-start gap-2.5 text-xs">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong className="text-slate-700 dark:text-slate-200">Critical Recommendation:</strong> Expedite structural certification for the 3 HV Generators currently running on temporary waiver protocols.
                  </p>
                </li>
                <li className="flex items-start gap-2.5 text-xs">
                  <FileCheck2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong className="text-slate-700 dark:text-slate-200">Insight:</strong> Asset safety risk in Zone 4 was successfully mitigated yesterday following AI automatic cooling pump regulator shifts.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button 
              onClick={() => onShowNotification("Detailed compliance certificate archive pack compiled. Download ticket: REF-Compliance-2026.")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase rounded-lg transition-all"
            >
              Download Full Audit Report
            </button>
            <button 
              onClick={() => onShowNotification("Federal agency citations list successfully checked. Status: 0 active fines, 2 warnings pending resolution.")}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-350 dark:border-slate-700 rounded-lg text-xs font-mono font-bold uppercase transition-all"
            >
              Review Citations
            </button>
          </div>
        </div>

        {/* Right context graphics visualization */}
        <div className="glass-card rounded-xl overflow-hidden relative group min-h-[350px] flex flex-col justify-end p-5 text-left">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA6IJY92L4X7XUGnJY2HwaWrETyPB0zMnHVtJN401WZ658OiuBzc6Eybqe71VemnPlBjIEjObF3HdhDZ0fFx__1vAyo3QysKFu5m7-WIh494b4kMRDuxugA7j88XuHe_st_ejFITnt-N_eOFVdYQ79NvgpuN1teY4p3SuRiEMlDDleamxtg1cwUULdp5GfNd92L6ODRqE9Aye6reB2wVjNgoW0PVX6d8HOZQ8vo-iObOputmUMZWXfBp2EG2rgaY2wnLXzAmN9B4g"
            alt="Cinematic facility interior engineering visualization mockup"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover brightness-50 group-hover:scale-103 transition-transform duration-700 rounded-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent pointer-events-none rounded-xl"></div>
          
          <div className="relative z-10 space-y-1">
            <span className="font-mono text-[9px] text-blue-500 dark:text-blue-400 font-extrabold uppercase bg-blue-500/10 border border-blue-500/25 px-2 py-0.5 rounded tracking-widest inline-block">
              FACILITY ENVIRONMENT
            </span>
            <h4 className="font-sans text-base font-black text-white uppercase tracking-tight">
              Zone 04 North Wing
            </h4>
            <p className="text-[11px] text-slate-300 leading-snug font-sans">
              Currently holds our largest compliance pressure score due to pipe layout age limits. AI active gas sniffing sequence is armed.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Ledger Data Table Section */}
      <section className="glass-card rounded-xl overflow-hidden">
        {/* Table header menu */}
        <div className="p-4 sm:p-5 border-b border-slate-200/50 dark:border-slate-800/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-100/30 dark:bg-[#1a1f2f]/20 text-left">
          <div>
            <h3 className="font-sans text-base font-bold text-slate-800 dark:text-slate-200">
              Asset Compliance Ledger
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
              Audit log trace index for regulatory sign-off certification
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ledger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700/50 rounded-lg py-1.5 pl-8.5 pr-3 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-48"
              />
            </div>

            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-white dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700/50 text-xs text-slate-650 dark:text-slate-300 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">ALL STATUS</option>
              <option value="COMPLIANT">COMPLIANT</option>
              <option value="PENDING">PENDING</option>
              <option value="NON-COMPLIANT">NON-COMPLIANT</option>
            </select>
          </div>
        </div>

        {/* Data list table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-slate-100/55 dark:bg-[#1a1f2f]/35 border-b border-slate-200/50 dark:border-slate-800/25">
              <tr className="font-mono text-[9px] text-slate-450 dark:text-slate-500 font-extrabold uppercase tracking-wider">
                <th className="p-4 pl-5">Asset Name / System ID</th>
                <th className="p-4">Status Clearance</th>
                <th className="p-4">Last Audit Stamp</th>
                <th className="p-4">Regulatory Due</th>
                <th className="p-4">Vulnerability Margin</th>
                <th className="p-4 text-right pr-5">Execution Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/25 text-xs text-slate-700 dark:text-slate-200">
              {paginatedAssets.length > 0 ? (
                paginatedAssets.map((asset) => (
                  <tr 
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className="hover:bg-slate-100/40 dark:hover:bg-[#111523]/30 transition-colors cursor-pointer group"
                  >
                    {/* name column */}
                    <td className="p-4 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-250 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {asset.name}
                          </p>
                          <p className="font-mono text-[10px] text-slate-400 uppercase mt-0.5 font-semibold">
                            {asset.assetId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* status tag */}
                    <td className="p-4">
                      <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded tracking-wide border uppercase ${
                        asset.status === 'COMPLIANT'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : asset.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          : 'bg-red-500/10 text-red-600 border-red-500/20'
                      }`}>
                        {asset.status}
                      </span>
                    </td>

                    {/* date */}
                    <td className="p-4 font-mono text-slate-500">
                      {asset.lastAudit}
                    </td>

                    {/* due deadline status */}
                    <td className={`p-4 font-mono font-bold ${
                      asset.nextDue.includes('OVERDUE') ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {asset.nextDue}
                    </td>

                    {/* vulnerability margin */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          <div className={`w-1.5 h-3.5 rounded-sm ${
                            asset.riskScore === 'CRITICAL' ? 'bg-red-500' : asset.riskScore === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          <div className={`w-1.5 h-3.5 rounded-sm ${
                            asset.riskScore === 'CRITICAL' ? 'bg-red-500' : asset.riskScore === 'MEDIUM' ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-800'
                          }`} />
                          <div className={`w-1.5 h-3.5 rounded-sm ${
                            asset.riskScore === 'CRITICAL' ? 'bg-red-500' : 'bg-slate-200 dark:bg-slate-800'
                          }`} />
                        </div>
                        <span className={`font-mono text-[10px] font-bold uppercase ${
                          asset.riskScore === 'CRITICAL' ? 'text-red-500' : asset.riskScore === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-500'
                        }`}>
                          {asset.riskScore}
                        </span>
                      </div>
                    </td>

                    {/* action click handlers */}
                    <td className="p-4 text-right pr-5">
                      {asset.status === 'COMPLIANT' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onShowCert(asset.name, asset.assetId);
                          }}
                          className="font-mono text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold uppercase cursor-pointer"
                        >
                          View Cert
                        </button>
                      ) : asset.status === 'PENDING' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAuditRequest(asset);
                          }}
                          className="font-mono text-xs text-amber-600 dark:text-amber-400 hover:underline font-bold uppercase cursor-pointer"
                        >
                          Schedule
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAuditRequest(asset);
                          }}
                          className="font-mono text-xs text-red-500 hover:underline font-bold uppercase cursor-pointer"
                        >
                          Audit Field
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    No compliant items correspond to search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* pagination footer panels */}
        <div className="p-4 flex justify-between items-center bg-slate-100/30 dark:bg-[#1a1f2f]/10 border-t border-slate-200/50 dark:border-slate-800/25">
          <p className="font-mono text-[10px] text-slate-400 font-semibold uppercase">
            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredAssets.length)} of {filteredAssets.length} assets
          </p>
          <div className="flex gap-2 font-mono">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 border border-slate-350 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ◀
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 border border-slate-350 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ▶
            </button>
          </div>
        </div>
      </section>

      {/* Asset Description Modal Overlay */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedAsset(null)} />
          <div className="bg-white dark:bg-[#1a1f2f] border border-slate-300 dark:border-slate-800/80 rounded-2xl w-full max-w-lg p-6 relative z-10 shadow-2xl text-left animate-scale-up">
            <button 
              onClick={() => setSelectedAsset(null)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ╳
            </button>
            <div className="flex items-center gap-3.5 mb-4">
              <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-sans text-base font-black text-slate-800 dark:text-slate-100 leading-none">
                  {selectedAsset.name} Audit Profile
                </h3>
                <span className="font-mono text-[10px] text-slate-400 uppercase font-semibold mt-1 block">
                  {selectedAsset.assetId}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-100/50 dark:bg-slate-850/40 p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-850/20 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block mb-1">Status Stamp:</span>
                  <span className={`font-mono font-bold uppercase block ${
                    selectedAsset.status === 'COMPLIANT' ? 'text-emerald-500' : 'text-amber-500'
                  }`}>
                    {selectedAsset.status}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-1">Deadlines:</span>
                  <span className="font-mono font-bold block text-slate-800 dark:text-slate-100">
                    {selectedAsset.nextDue}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-xs font-bold block">Telemetry Narrative Summary</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-[#090e1c]/10 dark:bg-[#090e1c]/40 p-3 rounded-lg border border-slate-200/30">
                  {selectedAsset.description}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  handleAuditRequest(selectedAsset);
                  setSelectedAsset(null);
                }}
                className="flex-1 py-2.5 bg-blue-650 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold rounded-lg text-xs uppercase"
              >
                Trigger Deep Verification
              </button>
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-400 rounded-lg text-xs uppercase"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
