import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  Settings, 
  Compass, 
  Bot, 
  Database, 
  Network, 
  ShieldCheck, 
  Activity,
  AlertTriangle,
  X,
  Plus,
  Upload,
  Loader2,
  FileText
} from 'lucide-react';
import { ViewType, Incident } from './types';
import Navigation from './components/Navigation';
import DashboardView from './components/DashboardView';
import CopilotView from './components/CopilotView';
import KnowledgeGraphView from './components/KnowledgeGraphView';
import ComplianceView from './components/ComplianceView';
import RcaView from './components/RcaView';
import AlertDetailModal from './components/AlertDetailModal';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  // Is dark mode static true now
  const [operatorName, setOperatorName] = useState('Marcus Vane');
  const [operatorRole, setOperatorRole] = useState('Lead Systems Auditor');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alertsFeedCount, setAlertsFeedCount] = useState(3);
  const [isEmergencyShut, setIsEmergencyShut] = useState(false);

  // Active overlay modal state
  const [modalType, setModalType] = useState<'briefing' | 'certificate' | null>(null);
  const [selectedCertName, setSelectedCertName] = useState('Substation 04');
  const [selectedCertId, setSelectedCertId] = useState('ID: S-99231');

  // Shared state: dynamic lists of telemetry incidents
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 'INC-9402',
      title: 'Turbine Overheat (T-04)',
      location: 'Section A - Rotor Shaft',
      time: '14:02 PM',
      level: 'CRITICAL',
      status: 'active',
      description: 'Main rotor bearing casing reached 112°C, causing automatic feedback speed governors to engage.'
    },
    {
      id: 'INC-8110',
      title: 'Pressure Drop (Line 12)',
      location: 'Main Header Coolant Line',
      time: '13:45 PM',
      level: 'WARNING',
      status: 'active',
      description: 'System pressure sensors indicated pressure decline below core threshold.'
    },
    {
      id: 'INC-3341',
      title: 'Maintenance Overdue',
      location: 'Hydraulic Feed Pump P101',
      time: '09:12 AM',
      level: 'NOTICE',
      status: 'monitoring',
      description: 'Preventive lubrication cycle has elapsed by over 12 operational hours.'
    }
  ]);

  // Initial Copilot query bridging from search
  const [copilotInitialQuery, setCopilotInitialQuery] = useState('');

  // Top Toast notifications banner values
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isFixedView = currentView === 'copilot' || currentView === 'graph';
  const isDarkMode = true;

  // Sync theme to root class wrapper
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
  }, []);

  const showNotification = (message: string) => {
    setToastMessage(message);
    setAlertsFeedCount(prev => prev + 1);
    
    // Clear toast message after 4s
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAddIncident = (newInc: Incident) => {
    setIncidents(prev => [newInc, ...prev]);
    showNotification(`New active incident logged to Ledger: ${newInc.title}`);
  };

  const handleTriggerWorkOrder = (workOrderId: string) => {
    showNotification(`Active work order initiated: ${workOrderId}. Dispatching technical response team.`);
  };

  const handleTriggerEmergencyShutdown = () => {
    setIsEmergencyShut(true);
    showNotification('EMERGENCY CRITICAL SAFETY INTERLOCK ENGAGED. SYSTEMS ENTERING OFFLINE SAFESTATE.');
  };

  const handleShowCertDetails = (assetName: string, id: string) => {
    setSelectedCertName(assetName);
    setSelectedCertId(id);
    setModalType('certificate');
  };

  // Document upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [uploadFileName, setUploadFileName] = useState('');

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate analysis & indexing progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadedDocs((docs) => [...docs, file.name]);
            showNotification(`Industry document "${file.name}" has been successfully parsed and indexed into the Intel Knowledge Base.`);
          }, 600);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Profile Editor inside configuration settings
  const [showConfigCenter, setShowConfigCenter] = useState(false);

  return (
    <div className="min-h-screen blueprint-grid transition-colors duration-300 font-sans bg-[#0a0f1d] text-slate-100 dark">
      
      {/* 1. Sidebar Navigation */}
      <Navigation
        currentView={currentView}
        setCurrentView={setCurrentView}
        isDarkMode={isDarkMode}
        setIsDarkMode={() => {}}
        operatorName={operatorName}
        operatorRole={operatorRole}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        notificationCount={alertsFeedCount}
      />

      {/* 2. Global Sliding Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-[slideDown_0.35s_cubic-bezier(0.16,1,0.3,1)]">
          <div className="bg-blue-650 dark:bg-blue-500 border border-blue-400 text-white font-mono text-xs font-bold px-4 py-3.5 rounded-xl shadow-2xl flex items-center justify-between gap-3 relative overflow-hidden">
            {/* Blinking indicator */}
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-2 right-2" />
            <div className="flex-1 text-left">
              <span className="text-[9px] text-blue-100 uppercase tracking-widest block font-extrabold mb-0.5">TELEMETRY NOTIFICATION</span>
              <p className="leading-snug text-blue-50">{toastMessage}</p>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-white hover:text-slate-200"
            >
              ╳
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Frame layout */}
      <main className={`lg:pl-72 ${isFixedView ? 'h-screen overflow-hidden' : 'min-h-screen'} flex flex-col`}>
        
        {/* Mobile Header bar */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#0e1322] border-b border-slate-800/35 z-40">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 -ml-1 text-slate-400 hover:bg-slate-805 rounded-md"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-sans font-black tracking-tight text-white uppercase text-base">
              Indus Brain AI
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications badge */}
            <div className="relative p-1.5 text-slate-400">
              <Bell className="w-5 h-5" />
              {alertsFeedCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {alertsFeedCount}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Context views controller */}
        <div className={`flex-1 w-full mx-auto relative ${isFixedView ? 'h-full overflow-hidden p-4 sm:p-6 pb-2 m-0 flex flex-col' : 'p-6 sm:p-8 max-w-7xl'}`}>
          
          {/* Settings Section Panel Trigger overlay */}
          {showConfigCenter && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowConfigCenter(false)} />
              <div className="bg-white dark:bg-[#1a1f2f] border border-slate-300 dark:border-slate-800/80 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl text-left animate-scale-up">
                <button 
                  onClick={() => setShowConfigCenter(false)} 
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-205"
                >
                  ╳
                </button>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Settings className="w-6 h-6 animate-[spin_4s_infinite_linear]" />
                  </div>
                  <div>
                    <h3 className="font-sans text-base font-black text-slate-800 dark:text-slate-100 uppercase">
                      Audit Config Centre
                    </h3>
                    <p className="text-[10px] text-slate-400 block mt-1">
                      Adjust operational credentials for reporting logs
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                      Operator Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none"
                      value={operatorName}
                      onChange={(e) => setOperatorName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                      Operator Site Role
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none"
                      value={operatorRole}
                      onChange={(e) => setOperatorRole(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowConfigCenter(false);
                    showNotification("Operator profile credentials synchronized.");
                  }}
                  className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold rounded-lg text-xs uppercase"
                >
                  Save Diagnostics Profile
                </button>
              </div>
            </div>
          )}

          {/* Quick config button inside desktop main frame */}
          <div className="absolute top-6 right-6 hidden lg:flex items-center gap-3 z-30">
            {/* Industry Documents Upload Button & Input */}
            <input
              type="file"
              id="industry-doc-upload"
              className="hidden"
              onChange={handleDocumentUpload}
              accept=".pdf,.doc,.docx,.txt"
            />
            <button
              onClick={() => document.getElementById('industry-doc-upload')?.click()}
              className="px-3.5 py-1.5 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-blue-400 bg-slate-900 border border-slate-200/20 dark:border-slate-800/60 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Upload Industry Document"
            >
              <Upload className="w-4 h-4 text-blue-500" />
              <span>Upload Docs</span>
            </button>

            <button
              onClick={() => setShowConfigCenter(true)}
              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-[#1a1f2f]/30 border border-slate-200/20 dark:border-slate-800/60 rounded-xl transition-all"
              title="Open Config Center"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Render Active View State */}
          {currentView === 'dashboard' && (
            <DashboardView
              incidents={incidents}
              onAddIncident={handleAddIncident}
              setCurrentView={setCurrentView}
              setCopilotInitialQuery={setCopilotInitialQuery}
              onOpenBriefing={() => setModalType('briefing')}
              operatorRole={operatorRole}
              triggerEmergencyShutdown={handleTriggerEmergencyShutdown}
              isEmergencyShut={isEmergencyShut}
            />
          )}

          {currentView === 'copilot' && (
            <CopilotView
              initialQuery={copilotInitialQuery}
              clearInitialQuery={() => setCopilotInitialQuery('')}
              onWorkOrderTriggered={handleTriggerWorkOrder}
              uploadedDocs={uploadedDocs}
            />
          )}

          {currentView === 'graph' && (
            <KnowledgeGraphView
              onAddIncident={handleAddIncident}
              setCurrentView={setCurrentView}
              onShowNotification={showNotification}
            />
          )}

          {currentView === 'compliance' && (
            <ComplianceView
              onShowCert={handleShowCertDetails}
              onShowNotification={showNotification}
            />
          )}

          {currentView === 'rca' && (
            <RcaView
              onShowNotification={showNotification}
            />
          )}
        </div>
      </main>

      {/* 4. Overlays Details Modal Panels */}
      <AlertDetailModal
        type={modalType}
        onClose={() => setModalType(null)}
        certAssetName={selectedCertName}
        certAssetId={selectedCertId}
        isEmergencyShut={isEmergencyShut}
      />

      {/* 5. Document Upload Progress Indicator Modal */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md" />
          <div className="bg-[#0e1322] border border-blue-500/30 rounded-2xl w-full max-w-sm p-6 relative z-10 shadow-2xl text-center font-sans space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-full animate-bounce">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-100 uppercase tracking-wider font-mono">Indexing Industry Document</h4>
              <p className="text-xs text-slate-400 truncate max-w-xs">{uploadFileName}</p>
            </div>
            <div className="space-y-2">
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-150" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>AI SYNAPSE INTEGRATION</span>
                <span>{uploadProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
