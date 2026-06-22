import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowRight, 
  FileText, 
  Cpu, 
  ShieldAlert, 
  AlertTriangle, 
  TrendingUp, 
  RefreshCw, 
  Flame, 
  Bot, 
  Plus,
  Compass,
  CheckCircle,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { Incident, ViewType } from '../types';

interface DashboardViewProps {
  incidents: Incident[];
  onAddIncident: (incident: Incident) => void;
  setCurrentView: (view: ViewType) => void;
  setCopilotInitialQuery: (query: string) => void;
  onOpenBriefing: () => void;
  operatorRole: string;
  triggerEmergencyShutdown: () => void;
  isEmergencyShut: boolean;
}

export default function DashboardView({
  incidents,
  onAddIncident,
  setCurrentView,
  setCopilotInitialQuery,
  onOpenBriefing,
  operatorRole,
  triggerEmergencyShutdown,
  isEmergencyShut
}: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newLevel, setNewLevel] = useState<'CRITICAL' | 'WARNING' | 'NOTICE'>('NOTICE');

  const handleShortcutClick = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCopilotInitialQuery(searchQuery);
      setCurrentView('copilot');
    }
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim()) return;

    const added: Incident = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle,
      location: newLocation,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      level: newLevel,
      status: 'active',
      description: `Manual incident logged by ${operatorRole}`
    };

    onAddIncident(added);
    setNewTitle('');
    setNewLocation('');
    setNewLevel('NOTICE');
    setShowAddForm(false);
  };

  // Compute stats based on dynamic incidents list
  const criticalCount = incidents.filter(i => i.level === 'CRITICAL' && i.status === 'active').length;
  const warningCount = incidents.filter(i => i.level === 'WARNING' && i.status === 'active').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/50 dark:border-slate-800/10">
        <div>
          <span className="font-mono text-xs text-blue-500 dark:text-blue-400 font-bold tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
            Telemetry Grid Online
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Operational Protocol v2.4 • Operator Session Active
          </p>
        </div>
      </div>

      {/* Hero Header Presentation */}
      <section className="flex flex-col items-center justify-center py-6 text-center">
        <div className="mb-4">
          <span className="font-mono text-[10px] sm:text-xs font-bold text-blue-600 bg-blue-500/10 border border-blue-500/20 dark:text-blue-400 dark:bg-blue-400/10 dark:border-blue-400/20 px-4 py-1 rounded-full uppercase tracking-wider">
            Autonomous Industrial Interface v2.4
          </span>
        </div>
        <h1 className="font-sans text-3xl sm:text-5xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter max-w-4xl">
          INDUS BRAIN AI
        </h1>
        <p className="font-sans text-lg sm:text-xl font-light text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
          Unified Asset &amp; Operations Brain
        </p>

        {/* Dynamic Contextual Search / Ask anything */}
        <form onSubmit={handleSearchSubmit} className="mt-8 w-full max-w-3xl px-2">
          <div className="bg-white/80 dark:bg-[#1a1f2f]/30 backdrop-blur-xl rounded-xl p-2 flex items-center gap-3 border border-slate-300/60 dark:border-blue-500/25 shadow-lg shadow-blue-500/5 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all">
            <div className="flex-1 flex items-center px-3 gap-3">
              <Bot className="w-6 h-6 text-blue-500 dark:text-blue-400 animate-pulse flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask the Plant Anything... (e.g., Boiler health, incident report)"
                className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-sans text-base w-full p-1"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all shadow-md shadow-blue-500/10 flex items-center gap-2 active:scale-95"
            >
              <span>Analyze</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Prompt Shortcuts Suggestions Chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => handleShortcutClick('Why did Pump P101 fail?')}
              className="font-mono text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 bg-slate-100/50 dark:bg-[#161b2b]/50 px-3.5 py-1.5 rounded transition-all active:scale-95 text-left truncate max-w-full"
            >
              &quot;Why did Pump P101 fail?&quot;
            </button>
            <button
              type="button"
              onClick={() => handleShortcutClick('Show compliance issues')}
              className="font-mono text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 bg-slate-100/50 dark:bg-[#161b2b]/50 px-3.5 py-1.5 rounded transition-all active:scale-95 text-left truncate max-w-full"
            >
              &quot;Show compliance issues&quot;
            </button>
            <button
              type="button"
              onClick={() => handleShortcutClick('Section B safety score')}
              className="font-mono text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 bg-slate-100/50 dark:bg-[#161b2b]/50 px-3.5 py-1.5 rounded transition-all active:scale-95 text-left truncate max-w-full"
            >
              &quot;Section B safety score&quot;
            </button>
          </div>
        </form>
      </section>

      {/* KPI Telemetry Panels */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 - Documents Processed */}
        <div className="glass-card p-5 rounded-xl border-l-4 border-blue-500/80 flex flex-col justify-between group relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </span>
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] animate-pulse"></div>
          </div>
          <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
            Documents Processed
          </p>
          <h3 className="font-sans text-3xl font-black text-slate-800 dark:text-slate-200 mt-1">
            14,282
          </h3>
          <div className="flex items-center gap-1 mt-3 font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% this week</span>
          </div>
        </div>

        {/* Metric 2 - Equipment Connectivity */}
        <div className="glass-card p-5 rounded-xl border-l-4 border-emerald-500/80 flex flex-col justify-between group relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Cpu className="w-5 h-5" />
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]"></div>
          </div>
          <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
            Equipment Assets
          </p>
          <h3 className="font-sans text-3xl font-black text-slate-800 dark:text-slate-200 mt-1">
            3,850
          </h3>
          <div className="flex items-center gap-1 mt-3 font-mono text-xs text-slate-500 dark:text-slate-400">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>99.8% Connectivity</span>
          </div>
        </div>

        {/* Metric 3 - Compliance Issues alerts */}
        <div className="glass-card p-5 rounded-xl border-l-4 border-amber-500/80 flex flex-col justify-between group relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)] animate-pulse"></div>
          </div>
          <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
            Compliance Issues
          </p>
          <h3 className="font-sans text-3xl font-black text-amber-600 dark:text-amber-500 mt-1">
            08
          </h3>
          <div className="flex items-center gap-1 mt-3 font-mono text-xs text-amber-600 dark:text-amber-500 font-bold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{warningCount + 1} critical priority</span>
          </div>
        </div>

        {/* Metric 4 - Risk Alerts */}
        <div className="glass-card p-5 rounded-xl border-l-4 border-red-500/80 flex flex-col justify-between group relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="p-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg">
              <Flame className="w-5 h-5 animate-bounce" />
            </span>
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-ping"></div>
          </div>
          <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
            Risk Alerts
          </p>
          <h3 className="font-sans text-3xl font-black text-red-600 dark:text-red-400 mt-1 font-bold">
            {criticalCount > 0 ? String(criticalCount).padStart(2, '0') : '02'}
          </h3>
          <div className="flex items-center gap-1 mt-3 font-mono text-xs text-red-600 dark:text-red-400 font-bold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Section B high risk</span>
          </div>
        </div>
      </section>

      {/* Bento Grid: Asymmetric Details Layout */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        
        {/* Card 1: Recent Incidents Ledger */}
        <div className="col-span-12 lg:col-span-5 glass-card p-6 rounded-xl flex flex-col min-h-[380px]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              <h4 className="font-sans text-base font-bold text-slate-800 dark:text-slate-200">
                Recent Incidents
              </h4>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="font-mono text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              {showAddForm ? 'Cancel Log' : 'Report Incident'}
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {showAddForm ? (
            /* Add Incident Local Form component */
            <form onSubmit={handleCreateIncident} className="space-y-4 flex-1 flex flex-col justify-center animate-[fadeIn_0.3s_ease]">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Incident Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Turbine Temperature Rise"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-sm text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Location Area
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Section C"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-sm text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Severity Level
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as any)}
                    className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700/50 rounded p-2 text-sm text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="WARNING">WARNING</option>
                    <option value="NOTICE">NOTICE</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold rounded text-sm transition-all shadow-md active:scale-98"
              >
                Log to Telemetry Ledger
              </button>
            </form>
          ) : (
            /* Items List */
            <div className="space-y-3 overflow-y-auto flex-1 max-h-[290px] pr-1">
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  className={`p-3 bg-slate-100/50 dark:bg-[#090e1c]/40 border-l-4 ${
                    inc.level === 'CRITICAL'
                      ? 'border-red-500'
                      : inc.level === 'WARNING'
                      ? 'border-amber-500'
                      : 'border-blue-500'
                  } rounded-r-lg flex justify-between items-start transition-all hover:bg-slate-100 dark:hover:bg-[#1a1f2f]/30`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">
                      {inc.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {inc.location} • {inc.time}
                    </p>
                  </div>
                  <span
                    className={`font-mono font-bold text-[9px] px-2 py-0.5 rounded flex-shrink-0 ${
                      inc.level === 'CRITICAL'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                        : inc.level === 'WARNING'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {inc.level}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 2: Interactive Asset Health Sparkline */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 glass-card p-6 rounded-xl flex flex-col justify-between min-h-[380px]">
          <div>
            <h4 className="font-sans text-base font-bold text-slate-800 dark:text-slate-200 mb-2">
              Asset Health Overview
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live composite mechanical structural viability metric
            </p>
          </div>

          {/* Sparkline Graphic with real CSS properties */}
          <div className="relative h-28 my-4 flex items-end">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
              <defs>
                <linearGradient id="gradient-health" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0066ff" stopOpacity="0.3"></stop>
                  <stop offset="100%" stopColor="#0066ff" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path
                className="text-blue-500 dark:text-blue-400"
                d="M0,80 L30,78 L65,85 L100,55 L135,62 L170,45 L210,65 L250,30 L290,48 L330,22 L370,14 L400,18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              ></path>
              <path
                d="M0,80 L30,78 L65,85 L100,55 L135,62 L170,45 L210,65 L250,30 L290,48 L330,22 L370,14 L400,18 L400,100 L0,100 Z"
                fill="url(#gradient-health)"
              ></path>
            </svg>
            <div className="absolute top-2 right-2 font-sans text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
              94%
            </div>
          </div>

          {/* Inline spec logs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-100/70 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200/50 dark:border-slate-800/30 text-left">
              <p className="font-mono text-[9px] text-slate-500 dark:text-slate-500 uppercase tracking-widest leading-none font-bold">
                Mean Time to Repair
              </p>
              <p className="font-sans text-lg font-extrabold text-slate-800 dark:text-slate-200 mt-1">
                4.2 hrs
              </p>
            </div>
            <div className="bg-slate-100/70 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200/50 dark:border-slate-800/30 text-left">
              <p className="font-mono text-[9px] text-slate-500 dark:text-slate-500 uppercase tracking-widest leading-none font-bold">
                Uptime Performance
              </p>
              <p className="font-sans text-lg font-extrabold text-slate-800 dark:text-slate-200 mt-1">
                99.2%
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: AI Insights Feed & Briefings */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 glass-card p-6 rounded-xl border-2 border-blue-500/20 dark:border-blue-500/30 flex flex-col justify-between min-h-[380px] relative">
          <div className="absolute top-3 right-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-[pulse_2s_infinite]"></div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Compass className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <h4 className="font-sans text-base font-bold text-slate-800 dark:text-slate-200">
                AI Insights Focus
              </h4>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2.5 items-start text-xs group">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                <p className="text-slate-600 dark:text-slate-300 leading-snug">
                  <strong className="text-slate-800 dark:text-slate-200">Critical Alert:</strong> Risk detected in Section B thermal shielding. Localized cooling recommended.
                </p>
              </div>
              <div className="flex gap-2.5 items-start text-xs group">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                <p className="text-slate-600 dark:text-slate-300 leading-snug">
                  <strong className="text-slate-800 dark:text-slate-200">Asset Prediction:</strong> Pump P101 cavitation signal. Schedule inspection within 7 days.
                </p>
              </div>
              <div className="flex gap-2.5 items-start text-xs group">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                <p className="text-slate-600 dark:text-slate-300 leading-snug">
                  <strong className="text-slate-800 dark:text-slate-200">Optimization:</strong> Compliance reporting for current EPA cycle is 80% finished.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenBriefing}
            className="w-full mt-6 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-400/30 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 active:scale-95 text-center cursor-pointer"
          >
            Generate Full Briefing
          </button>
        </div>
      </div>

      {/* Extreme Emergency Safety Grid Action */}
      <section className="p-4 bg-red-500/5 dark:bg-red-500/10 border border-red-500/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-red-500 animate-[bounce_3s_infinite]" />
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Critical Facility Safety Override Controls
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-450 mt-0.5">
              Instant physical interlock disconnect for non-nominal emergency conditions.
            </p>
          </div>
        </div>
        <button
          onClick={triggerEmergencyShutdown}
          className={`px-6 py-2 rounded-lg font-mono text-xs font-extrabold tracking-wider uppercase transition-all duration-300 active:scale-95 ${
            isEmergencyShut
              ? 'bg-slate-300 text-slate-600 dark:bg-slate-750 dark:text-slate-400 cursor-not-allowed'
              : 'bg-red-600 text-slate-100 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-650'
          }`}
          disabled={isEmergencyShut}
        >
          {isEmergencyShut ? 'Emergency Override Triggered' : 'Execute Emergency Shutdown'}
        </button>
      </section>
    </div>
  );
}
