import { 
  LayoutDashboard, 
  Bot, 
  Network, 
  ShieldCheck, 
  Activity, 
  Settings, 
  Bell, 
  Menu, 
  X,
  Gauge
} from 'lucide-react';
import { ViewType } from '../types';

interface NavigationProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  operatorName: string;
  operatorRole: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  notificationCount: number;
}

export default function Navigation({
  currentView,
  setCurrentView,
  isDarkMode,
  setIsDarkMode,
  operatorName,
  operatorRole,
  mobileMenuOpen,
  setMobileMenuOpen,
  notificationCount
}: NavigationProps) {

  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'copilot' as ViewType, label: 'AI Copilot', icon: Bot },
    { id: 'graph' as ViewType, label: 'Knowledge Graph', icon: Network },
    { id: 'compliance' as ViewType, label: 'Compliance', icon: ShieldCheck },
    { id: 'rca' as ViewType, label: 'Root Cause Analysis', icon: Activity },
  ];

  const handleNavClick = (viewId: ViewType) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Branding Header Area */}
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary-container p-1 rounded-sm text-primary">
            <Gauge className="w-6 h-6 animate-[pulse_3s_infinite]" />
          </div>
          <h1 className="font-sans text-xl font-black tracking-tight text-slate-100 dark:text-slate-100 uppercase sm:text-lg">
            INDUS BRAIN AI
          </h1>
        </div>
        <p className="font-mono text-[10px] text-indigo-400 dark:text-indigo-400 font-semibold tracking-widest mt-1 uppercase">
          Precision Intelligence
        </p>
      </div>

      {/* Navigation Links Grid */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 font-sans text-sm font-semibold active:scale-98 text-left ${
                isActive
                  ? 'text-blue-500 bg-blue-500/10 border-r-4 border-blue-500 dark:text-blue-400 dark:bg-blue-400/10 dark:border-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Navigation Footer Controls */}
      <div className="mt-auto space-y-3 pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
        {/* Quick Settings Link */}
        <button
          onClick={() => handleNavClick('dashboard')} // fallback to settings action on dashboard
          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-md transition-colors text-left"
        >
          <Settings className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          <span>Config Centre</span>
        </button>

        {/* Notifications alert */}
        <div className="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400 rounded-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {notificationCount}
                </span>
              )}
            </div>
            <span>Alerts Feed</span>
          </div>
          <span className="text-xs px-2 py-0.5 bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 rounded-full">
            Live
          </span>
        </div>

        {/* Profile indicator card at footer */}
        <div className="p-3 bg-blue-500/5 border border-blue-500/15 dark:border-blue-400/15 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30 text-blue-500 flex-shrink-0 font-bold">
            {operatorName.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-sans text-sm font-bold text-slate-700 dark:text-slate-200 truncate leading-none">
              {operatorName}
            </p>
            <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase truncate font-semibold">
              {operatorRole}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Navigation Panel */}
      <aside className="hidden lg:flex flex-col h-screen w-72 fixed left-0 top-0 border-r border-slate-200/50 dark:border-slate-800/35 bg-white dark:bg-[#0e1322] z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Slide Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop screen filter */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-[#0e1322] border-r border-slate-200 dark:border-slate-800/50">
            {/* Close panel corner action */}
            <div className="absolute top-4 right-4 z-50">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
