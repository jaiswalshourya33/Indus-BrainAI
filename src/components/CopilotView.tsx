import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Paperclip, 
  FileText, 
  History, 
  Wand2, 
  BarChart2, 
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  Search,
  ExternalLink,
  Shield,
  HelpCircle,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { ChatMessage } from '../types';

interface MaintenanceLog {
  title: string;
  time: string;
  content: string;
}

interface QuickPrompt {
  label: string;
  query: string;
}

interface SafetyLimit {
  title: string;
  items: string[];
}

interface AssetInfo {
  id: string;
  name: string;
  code: string;
  image: string;
  maintenance: MaintenanceLog[];
  quickPrompts: QuickPrompt[];
  safetyLimits: SafetyLimit;
}

const ASSETS_MAP: Record<string, AssetInfo> = {
  't4-a': {
    id: 't4-a',
    name: 'Turbine Group 4',
    code: 'T4-A',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgrBEIvmqc3JqK3oo2YasE79BbayCfD__yNVa5m43b2nmZxAPaSuZQ2RVG1Aou7bZbvE90RsbiWZ7dySMT9JjZjaKF4pcvEkUsUa1kK9P0kene288fj9hzWkL9iQlmjiPUlqsSR4gNSTy6sk8XzAVwyeU9Mz-_bmYNdAuA8RnLfRZwOiLFUPYBhmF7e3gmBJZgopfZnSptJalrPX1djUMYK0kvEUzI7PTxfrcadUEVhPlwN6SbTCdwNRFLDigSXsJCYBSkeWmMmXs',
    maintenance: [
      {
        title: 'Lubrication Cycle',
        time: '2d ago',
        content: 'Completed by Engineer J. Doe. No issues noted. Exhaust tolerances optimal.'
      },
      {
        title: 'Seal Replacement',
        time: '14d ago',
        content: 'Post-inspection reported minor weeping on secondary housing. Recommend monitoring.'
      }
    ],
    quickPrompts: [
      { label: 'T4 Efficiency drop vs. baseline', query: 'Turbine T4 efficiency drop versus historical baseline' },
      { label: 'Compressor heat delta logs', query: 'Review compressor heat delta logs in Sector B' }
    ],
    safetyLimits: {
      title: 'Critical Safety Limits (T4-A)',
      items: [
        'High-pressure zone. Do NOT bypass active mechanical interlocks under any circumstances.',
        'Isolation protocol ALPHA signoff required before authorized technician entry.'
      ]
    }
  },
  't5-c': {
    id: 't5-c',
    name: 'Turbine Group 5',
    code: 'T5-C',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA6IJY92L4X7XUGnJY2HwaWrETyPB0zMnHVtJN401WZ658OiuBzc6Eybqe71VemnPlBjIEjObF3HdhDZ0fFx__1vAyo3QysKFu5m7-WIh494b4kMRDuxugA7j88XuHe_st_ejFITnt-N_eOFVdYQ79NvgpuN1teY4p3SuRiEMlDDleamxtg1cwUULdp5GfNd92L6ODRqE9Aye6reB2wVjNgoW0PVX6d8HOZQ8vo-iObOputmUMZWXfBp2EG2rgaY2wnLXzAmN9B4g',
    maintenance: [
      {
        title: 'Magnetic Bearings Calibr.',
        time: '1d ago',
        content: 'Recalibrated magnetic bearing response curves. Adjusted warning vibration margin to 2.2 mm/s.'
      },
      {
        title: 'Blade Wash Cycle',
        time: '18d ago',
        content: 'Conducted offline pneumatic wash on compression fan blades. Zero salt residue recorded.'
      }
    ],
    quickPrompts: [
      { label: 'Check T5 thermal exhaust levels', query: 'Inspect Turbine T5 thermal exhaust levels and rotor speed logs' },
      { label: 'T5 Vibration analysis', query: 'Analyze Turbine T5 magnetic bearing dynamic vibration patterns' }
    ],
    safetyLimits: {
      title: 'Critical Safety Limits (T5-C)',
      items: [
        'High thermal rotor. Ensure proper magnetic bearing heat dissipation checks are active.',
        'Do NOT authorize entry or borescope analysis while rotation exceeds 3,000 RPM.'
      ]
    }
  },
  'p-101': {
    id: 'p-101',
    name: 'Hydraulic Pump',
    code: 'P-101',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX3MROb85Y6Sv7_dlc7YIZVxCLrAkff9XeuHu7CHt_F68PBKyoJQWv-EiZ3qdRoMlrQ0i7sn7Yt-i1uFyPy_UoAbH1JLoN_UFe_6AUuSPEfZnwER2StyrjxccM-4XNotCUYm8DHfVu6zW1ZKs_43q755C0saP056_wqx1-kKs5jojsJwev49ZbVNTD9eY0cWbqbms46T6zfgHLJ8nBGHrH6NGBOyAooQYlGMXOeS6e5HRIoZh83CDRVvomaFbl9suRzqylVFlMfsg',
    maintenance: [
      {
        title: 'O-Ring Replacement',
        time: '3h ago',
        content: 'Replaced O-ring sealant following minor fluid pressure weeping below 8.2 bar thresholds.'
      },
      {
        title: 'Acoustic Signature Scan',
        time: '5d ago',
        content: 'Detected clean, low cavitation acoustic frequency profile. Safe for sustained operational load.'
      }
    ],
    quickPrompts: [
      { label: 'P-101 Cavitation spike logs', query: 'What caused the primary hydraulic pump P-101 cavitation spike?' },
      { label: 'Flow rates & load baseline', query: 'Get recent flow rate logs for Hyd-Pump P-101' }
    ],
    safetyLimits: {
      title: 'Critical Safety Limits (P-101)',
      items: [
        'Wear protective acoustic headset. Fluid cavitation zone ambient noise exceeds 85 dBA.',
        'Verify emergency cutoff bypass valve is fully operational before executing test sequence.'
      ]
    }
  },
  'g-302': {
    id: 'g-302',
    name: 'Steam Generator',
    code: 'G-302',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA6IJY92L4X7XUGnJY2HwaWrETyPB0zMnHVtJN401WZ658OiuBzc6Eybqe71VemnPlBjIEjObF3HdhDZ0fFx__1vAyo3QysKFu5m7-WIh494b4kMRDuxugA7j88XuHe_st_ejFITnt-N_eOFVdYQ79NvgpuN1teY4p3SuRiEMlDDleamxtg1cwUULdp5GfNd92L6ODRqE9Aye6reB2wVjNgoW0PVX6d8HOZQ8vo-iObOputmUMZWXfBp2EG2rgaY2wnLXzAmN9B4g',
    maintenance: [
      {
        title: 'Rotor Balancing Sweep',
        time: '4d ago',
        content: 'Dynamically balanced rotors. Phase grid locking response matches absolute reference standards.'
      },
      {
        title: 'Thermal Core Infrared',
        time: '2w ago',
        content: 'Identified minor thermal hotspot on Phase B stator windings. Continues within standard specs.'
      }
    ],
    quickPrompts: [
      { label: 'Generator frequency limits', query: 'Review Steam Generator G-302 peak grid locking frequency' },
      { label: 'Stator Phase telemetry', query: 'Thermal report for stator windings on Steam Generator G-302' }
    ],
    safetyLimits: {
      title: 'Critical Safety Limits (G-302)',
      items: [
        'High voltage hazard! Ensure grounding terminals are connected before manual live balancing.',
        'Electromagnetic fields active. Pacemaker wearers keep away from surrounding containment cage.'
      ]
    }
  },
  'v-02': {
    id: 'v-02',
    name: 'Cooling Tower Valve',
    code: 'V-02',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgrBEIvmqc3JqK3oo2YasE79BbayCfD__yNVa5m43b2nmZxAPaSuZQ2RVG1Aou7bZbvE90RsbiWZ7dySMT9JjZjaKF4pcvEkUsUa1kK9P0kene288fj9hzWkL9iQlmjiPUlqsSR4gNSTy6sk8XzAVwyeU9Mz-_bmYNdAuA8RnLfRZwOiLFUPYBhmF7e3gmBJZgopfZnSptJalrPX1djUMYK0kvEUzI7PTxfrcadUEVhPlwN6SbTCdwNRFLDigSXsJCYBSkeWmMmXs',
    maintenance: [
      {
        title: 'Actuator Air Bleed',
        time: '8h ago',
        content: 'Expelled air bubbles from electromagnetic backup pneumatic line. Response latency dropped below 200ms.'
      },
      {
        title: 'Feedback Loop Calib.',
        time: '1mo ago',
        content: 'Calibrated analog bypass mechanism to kick in at backup cooling threshold limits.'
      }
    ],
    quickPrompts: [
      { label: 'Cooling Valve response latency', query: 'Why is Cooling Tower Valve V-02 feedback latency elevated?' },
      { label: 'Check bleed threshold limits', query: 'What are current backup emergency bypass bleed thresholds for V-02?' }
    ],
    safetyLimits: {
      title: 'Critical Safety Limits (V-02)',
      items: [
        'High mass-flow steam hazards. Systems handle 150°C superheated water vapor loops.',
        'Actuator mechanical leverage can crush fingers; perform repairs under strict lockout-tagout protocol.'
      ]
    }
  }
};

interface CopilotViewProps {
  initialQuery?: string;
  clearInitialQuery: () => void;
  onWorkOrderTriggered: (orderId: string) => void;
  uploadedDocs?: string[];
}

export default function CopilotView({
  initialQuery,
  clearInitialQuery,
  onWorkOrderTriggered,
  uploadedDocs = []
}: CopilotViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'user',
      content: 'What is the current operating pressure for Turbine Group 4 and are there any reported anomalies in the last 24 hours?',
      timestamp: '10:42 AM'
    },
    {
      id: 'msg-2',
      sender: 'assistant',
      content: 'Current operating pressure for Turbine Group 4 is 42.8 bar, which is within the standard threshold (40-45 bar). However, vibration sensors on the main bearing detected a 12% increase in harmonic distortion at 08:15 UTC today.',
      timestamp: '10:42 AM',
      confidence: '94%',
      sourceCitation: 'Pump_Manual_v2.pdf',
      maintenanceRef: 'T4-LOG-2023-Q4',
      recommendedAction: {
        action: 'Schedule an borescope inspection of the primary housing within the next 48 operational hours to prevent potential cavitation damage.',
        workOrder: 'Initiate Work Order #5502'
      }
    }
  ]);
  const [activeAssetId, setActiveAssetId] = useState<string>('t4-a');
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const hasProcessedInitialQuery = useRef(false);
  const lastSubmitTime = useRef(0);

  // Check for pre-loaded queries from the dashboard
  useEffect(() => {
    if (initialQuery && !hasProcessedInitialQuery.current) {
      hasProcessedInitialQuery.current = true;
      handleSendPrompt(initialQuery);
      clearInitialQuery();
    }
  }, [initialQuery]);

  // Scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const detectAsset = (queryText: string): string | null => {
    const lower = queryText.toLowerCase();
    if (lower.includes('turbine 5') || lower.includes('t5-c') || lower.includes('t5') || lower.includes('group 5')) {
      return 't5-c';
    }
    if (lower.includes('turbine 4') || lower.includes('t4-a') || lower.includes('t4') || lower.includes('group 4')) {
      return 't4-a';
    }
    if (lower.includes('pump') || lower.includes('p101') || lower.includes('p-101') || lower.includes('gasket') || lower.includes('cavitation') || lower.includes('leak')) {
      return 'p-101';
    }
    if (lower.includes('generator') || lower.includes('g302') || lower.includes('g-302') || lower.includes('steam')) {
      return 'g-302';
    }
    if (lower.includes('valve') || lower.includes('coolant') || lower.includes('cooling') || lower.includes('v02') || lower.includes('v-02')) {
      return 'v-02';
    }
    return null;
  };

  const handleSendPrompt = (text: string) => {
    if (!text.trim()) return;

    // Detect asset from prompt text and change the selected active asset accordingly
    const detectedId = detectAsset(text);
    if (detectedId) {
      setActiveAssetId(detectedId);
    }

    // Add user message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}-${Math.random()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    // Simulated high-fidelity intelligence answers
    setTimeout(() => {
      let assistantContent = '';
      let citation = 'Standard_SOP_v4.pdf';
      let ref = 'MAINT-LOG-GEN';
      let confidence = '91%';
      let actionObj: ChatMessage['recommendedAction'] | undefined = undefined;

      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('turbine 5') || lowerText.includes('t5')) {
        assistantContent = 'Turbine Group 5 (T5-C) magnetic bearing feedback reveals atypical micro-vibration peaks of 1.84 mm/s, slightly above standard thresholds. Thermal core temperatures remain stable at 94.2°C, but dynamic balancing is recommended during the upcoming sweep cycle.';
        citation = 'Turbine_Overhaul_Guides.pdf';
        ref = 'T5-LOG-2024-Q2';
        confidence = '97%';
        actionObj = {
          action: 'Initiate telemetry micro-sensor threshold alignment and queue dynamic balancing review for Turbine Group 5.',
          workOrder: 'Initiate Dispatch Ticket #5587'
        };
      } else if (lowerText.includes('turbine 4') || lowerText.includes('t4') || lowerText.includes('pressure') || (!lowerText.includes('turbine 5') && lowerText.includes('turbine'))) {
        assistantContent = 'Turbine Subsystem telemetry confirms an active coolant temperature delta of +4.8°C at primary manifolds. While pressures are steady at 41.2 bar, a localized gas seal weeping behavior is suspected on Turbine Group 4 (T4-A) in Sector B.';
        citation = 'Turbine_Overhaul_Guides.pdf';
        ref = 'T4-LOG-2024-Q1';
        confidence = '95%';
        actionObj = {
          action: 'Deploy visual check of turbine gland seals and verify exhaust gas temperatures immediately on Turbine Group 4.',
          workOrder: 'Initiate Dispatch Ticket #5512'
        };
      } else if (lowerText.includes('pump') || lowerText.includes('p101') || lowerText.includes('p-101') || lowerText.includes('cavitation')) {
        assistantContent = 'Hydraulic Pump P101 telemetry outlines a critical cavitation spike at 04:30 AM corresponding to thermal exhaust limits. Pressure is stable at 8.2 bar, but seal degradation is estimated at 82% critical status.';
        citation = 'Pump_Manual_v2.pdf';
        ref = 'PUMP-INS-RCA';
        confidence = '96%';
        actionObj = {
          action: 'Lock out pump subsystem P-101 or initiate seal swap bypass sequence within 24 working hours.',
          workOrder: 'Execute Critical Maintenance #5501'
        };
      } else if (lowerText.includes('generator') || lowerText.includes('g302') || lowerText.includes('g-302') || lowerText.includes('steam')) {
        assistantContent = 'Steam Generator G-302 stator core thermal scans highlight a localized heat retention spot (+8.1°C) centered around Phase B winding terminations. Grid locking frequency holds solid at 60.02 Hz, but dynamic balancing checks are requested.';
        citation = 'Generator_Specs_2025.pdf';
        ref = 'G302-DIAG-REPORT';
        confidence = '94%';
        actionObj = {
          action: 'Execute infrared thermography review of Phase B stator windings on generator G-302 and verify signal integrity.',
          workOrder: 'Generate Inspection order #5599'
        };
      } else if (lowerText.includes('valve') || lowerText.includes('coolant') || lowerText.includes('cooling') || lowerText.includes('v02') || lowerText.includes('v-02')) {
        assistantContent = 'Cooling Tower Valve V-02 feedback loop reports actuator action latency of 180ms during standard test sweeps. Emergency coolant bleed bypass loop continues to sustain pressure thresholds within safety factors.';
        citation = 'Valve_Flow_Mechanics.pdf';
        ref = 'V02-LATENCY-REPORT';
        confidence = '92%';
        actionObj = {
          action: 'Deploy technician to perform physical valve mechanical lubrication and physical inspection of actuator seals on V-02.',
          workOrder: 'Issue Preventative Work Ticket #5611'
        };
      } else if (lowerText.includes('compliance') || lowerText.includes('safety')) {
        assistantContent = 'Asset compliance registry audits for High Pressure Sector A verify that the secondary certification has lagged by 14 days. Current operating margins are still within safe operational tolerances, but formal OSHA compliance review requires a stamped inspection sign-off.';
        citation = 'OSHA_Standard_H7.pdf';
        ref = 'CERT-STATUS-ACTIVE';
        confidence = '89%';
        actionObj = {
          action: 'Perform complete diagnostic checklist and recompile test logs for formal auditor review.',
          workOrder: 'Certify Field Audit Ticket #5530'
        };
      } else {
        const activeAsset = ASSETS_MAP[detectedId || activeAssetId] || ASSETS_MAP['t4-a'];
        assistantContent = `Synthesizing neural model database resources. Subsystem monitoring vectors for ${activeAsset.name} (${activeAsset.code}) appear normal. I found matching telemetry and maintenance guidelines in active system indexes.`;
        citation = 'Operations_Handbook_2026.pdf';
        ref = `${activeAsset.code}-REF-INDEX`;
        confidence = '88%';
      }

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}-${Math.random()}`,
        sender: 'assistant',
        content: assistantContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence,
        sourceCitation: citation,
        maintenanceRef: ref,
        recommendedAction: actionObj
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsThinking(false);
    }, 1500);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query || isThinking) return;

    // Guard against synchronous double triggers
    const now = Date.now();
    if (now - lastSubmitTime.current < 500) {
      return;
    }
    lastSubmitTime.current = now;

    setInputValue('');
    handleSendPrompt(query);
  };

  const handleShortcutClick = (text: string) => {
    setInputValue(text);
  };

  const activeAsset = ASSETS_MAP[activeAssetId] || ASSETS_MAP['t4-a'];

  return (
    <div className="flex flex-col lg:flex-row h-full w-full min-h-0 border border-slate-200 /50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none bg-white dark:bg-[#0e1322]">
      {/* 1. Left/Center Chat Area Layout */}
      <section className="flex-1 flex flex-col h-full bg-white dark:bg-[#0e1322] border-r border-slate-200/50 dark:border-slate-800/30 overflow-hidden">
        
        {/* Messages Feed panel */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 leading-relaxed text-sm ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/20">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  {isUser ? (
                    <div className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/50 px-4 py-3 rounded-xl rounded-tr-none text-slate-800 dark:text-slate-100 shadow-sm transition-all text-left">
                      <p>{msg.content}</p>
                      <span className="block text-[9px] text-slate-400 dark:text-slate-500 mt-1 text-right font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  ) : (
                    /* High-intel layout chat answer card from system */
                    <div className="glass-card p-5 rounded-2xl rounded-tl-none border-l-4 border-l-blue-500 dark:border-l-blue-400 flex flex-col space-y-4 animate-fade-in relative text-left">
                      {/* Analysis Result Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/50 dark:border-slate-800/20 pb-2">
                        <h4 className="font-sans text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                          <Bot className="w-4 h-4 text-blue-500" />
                          <span>Turbine Diagnostic Intelligence Unit</span>
                        </h4>
                        {msg.confidence && (
                          <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 rounded-full text-[10px] font-mono font-bold tracking-wide border border-blue-500/10 uppercase">
                            <span>Confidence:</span>
                            <span>{msg.confidence}</span>
                          </div>
                        )}
                      </div>

                      {/* Main explanation content */}
                      <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed">
                        {msg.content}
                      </p>

                      {/* Diagnostic details if existing */}
                      {(msg.sourceCitation || msg.maintenanceRef) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {msg.sourceCitation && (
                            <div className="bg-slate-100/70 dark:bg-[#1a1f2f]/30 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/30 flex items-center gap-2.5">
                              <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <span className="font-mono text-[9px] text-slate-400 block font-semibold leading-none mb-0.5">SOURCE MANUAL</span>
                                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-200 truncate block font-bold">{msg.sourceCitation}</span>
                              </div>
                            </div>
                          )}
                          {msg.maintenanceRef && (
                            <div className="bg-slate-100/70 dark:bg-[#1a1f2f]/30 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/30 flex items-center gap-2.5">
                              <History className="w-4 h-4 text-amber-500 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <span className="font-mono text-[9px] text-slate-400 block font-semibold leading-none mb-0.5">MAINTENANCE REF</span>
                                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-200 truncate block font-bold">{msg.maintenanceRef}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Recommended technical actions blocks */}
                      {msg.recommendedAction && (
                        <div className="p-3.5 bg-blue-500/5 border border-blue-500/15 dark:border-blue-400/20 rounded-xl space-y-3">
                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <Sparkles className="w-4 h-4 animate-pulse" />
                            <span className="font-mono text-xs font-black tracking-wide uppercase">AI Recommended Action</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                            {msg.recommendedAction.action}
                          </p>
                          {msg.recommendedAction.workOrder && (
                            <button
                              onClick={() => {
                                onWorkOrderTriggered(msg.recommendedAction?.workOrder || '5502');
                              }}
                              className="w-full py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600/90 text-white font-mono text-xs font-bold rounded shadow-sm hover:translate-y-[-1px] transition-all cursor-pointer text-center"
                            >
                              {msg.recommendedAction.workOrder}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Thinking Simulated Prompt Indicator */}
          {isThinking && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center animate-bounce shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-850 px-4 py-3.5 border border-slate-200 dark:border-slate-800 rounded-xl rounded-tl-none flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1.4s_infinite_0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1.4s_infinite_0.4s]"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1.4s_infinite_0.6s]"></span>
                </div>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  Analyzing Sensor Data Streams...
                </span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input prompt text controller */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/30 bg-slate-50/55 dark:bg-[#111625]/20">
          <form onSubmit={handleInputSubmit} className="relative max-w-4xl mx-auto">
            <textarea
              rows={2}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleInputSubmit(e);
                }
              }}
              placeholder="Ask a follow-up or specify a different asset..."
              className="w-full bg-slate-100/80 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3.5 pr-14 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-800 dark:text-slate-105 text-sm transition-all resize-none font-sans shadow-inner"
            />
            <div className="absolute right-3.5 bottom-3.5 flex items-center gap-2">
              <button
                type="button"
                className="p-1.5 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-md transition-colors"
                title="Attach log dump"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 p-2 rounded-lg text-white transition-all shadow shadow-blue-500/20 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Core Telemetry Shortcuts below prompt area */}
          <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs">
            <button
              onClick={() => handleShortcutClick('Draft an inspection plan for cavitation risk')}
              className="text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-colors flex items-center gap-1 font-mono font-bold uppercase tracking-wider"
            >
              <Wand2 className="w-3.5 h-3.5 text-blue-500/70" />
              <span>Draft Inspection Plan</span>
            </button>
            <button
              onClick={() => handleShortcutClick('Compare efficiency trends over last quarter')}
              className="text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-colors flex items-center gap-1 font-mono font-bold uppercase tracking-wider"
            >
              <BarChart2 className="w-3.5 h-3.5 text-emerald-500/70" />
              <span>Show Trend Graph</span>
            </button>
            <button
              onClick={() => handleShortcutClick('Review emergency evacuation procedures')}
              className="text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-colors flex items-center gap-1 font-mono font-bold uppercase tracking-wider"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-500/70" />
              <span>Check Safety Protocols</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Right Context and Troubleshooting Sidebar */}
      <aside className="w-full lg:w-96 flex-shrink-0 flex flex-col h-full bg-slate-50/50 dark:bg-[#0a0f1d]/40 border-t lg:border-t-0 border-slate-200 dark:border-slate-800 overflow-y-auto">
        {/* Active Asset Selector/Monitor Target selector */}
        <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60">
          <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5 tracking-wider">
            Monitor Subsystem Target
          </label>
          <div className="relative">
            <select
              value={activeAssetId}
              onChange={(e) => setActiveAssetId(e.target.value)}
              className="w-full bg-white dark:bg-[#111625] border border-slate-250 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-lg py-1.5 pl-3 pr-8 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans shadow-sm appearance-none cursor-pointer"
            >
              <option value="t4-a">Turbine Group 4 (T4-A)</option>
              <option value="t5-c">Turbine Group 5 (T5-C)</option>
              <option value="p-101">Hydraulic Pump (P-101)</option>
              <option value="g-302">Steam Generator (G-302)</option>
              <option value="v-02">Cooling Tower Valve (V-02)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-450 dark:text-slate-500 absolute right-2.5 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Active Asset contextual profile card */}
        <div className="h-44 mx-4 mt-5 rounded-xl border border-slate-250 dark:border-slate-800/80 bg-slate-900 dark:bg-slate-950 relative overflow-hidden flex flex-col justify-end p-5 shadow-sm">
          <img 
            src={activeAsset.image}
            alt={`${activeAsset.name} engine assembly`}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover brightness-60 dark:brightness-40 rounded-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent pointer-events-none rounded-xl"></div>
          <div className="relative z-10 text-left">
            <span className="bg-blue-500 text-white dark:bg-blue-500/10 dark:text-blue-400 dark:border border-blue-400/25 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider">
              ACTIVE ASSET DIAGNOSTIC
            </span>
            <h3 className="text-base font-black text-white mt-1.5 flex items-center gap-2">
              <span>{activeAsset.name} ({activeAsset.code})</span>
              <ArrowUpRight className="w-4 h-4 text-slate-350" />
            </h3>
          </div>
        </div>

        {/* Diagnostic details section */}
        <div className="p-4 space-y-6 text-left">
          {/* Recent maintenance activities logs */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <h4 className="font-mono text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                Recent Maintenance
              </h4>
              <button className="text-slate-400 hover:text-blue-500 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {activeAsset.maintenance.map((m, index) => (
                <div 
                  key={index} 
                  className="p-3 glass-card rounded-lg border border-slate-200 dark:border-slate-800/50 hover:bg-slate-100/40 dark:hover:bg-slate-800/30 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{m.title}</span>
                    <span className="font-mono text-[10px] text-slate-400 font-semibold uppercase">{m.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                    {m.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick history queries shortcuts */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <h4 className="font-mono text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                Quick Prompts Feed
              </h4>
              <History className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="space-y-1.5 font-mono text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
              {activeAsset.quickPrompts.map((q, index) => (
                <button
                  key={index}
                  onClick={() => handleShortcutClick(q.query)}
                  className="w-full flex items-center gap-2 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="truncate">{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Document Library Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <h4 className="font-mono text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                Document Library
              </h4>
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="space-y-1.5 font-mono text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
              <div className="flex items-center gap-2 p-2 rounded bg-slate-100/40 dark:bg-slate-800/10 border border-slate-200/50 dark:border-slate-800/20">
                <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span className="truncate">Turbine_Overhaul_Guides.pdf</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-slate-100/40 dark:bg-slate-800/10 border border-slate-200/50 dark:border-slate-800/20">
                <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span className="truncate">OSHA_Standard_H7.pdf</span>
              </div>
              {uploadedDocs.map((doc, index) => (
                <div key={index} className="flex items-center justify-between gap-2 p-2 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 flex-shrink-0 animate-pulse text-blue-500" />
                    <span className="truncate font-sans tracking-wide normal-case text-xs font-semibold">{doc}</span>
                  </div>
                  <span className="text-[8px] font-mono select-none px-1 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/10 rounded">INDEXED</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety constraints parameters overlay */}
          <div className="bg-red-500/10 border border-red-500/25 p-4 rounded-xl space-y-2.5">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Shield className="w-4 h-4" />
              <h5 className="font-mono text-xs font-black tracking-wider uppercase">{activeAsset.safetyLimits.title}</h5>
            </div>
            <ul className="text-xs space-y-2 text-slate-500 dark:text-slate-400 pl-1">
              {activeAsset.safetyLimits.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
