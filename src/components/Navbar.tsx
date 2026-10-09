import React, { useState } from 'react';
import {
  Sprout,
  Sun,
  Moon,
  Bell,
  Wifi,
  Droplets,
  Layers,
  ChevronDown,
  X,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { SystemStatus, AlertNotification } from '../types';

interface NavbarProps {
  systemStatus: SystemStatus;
  alerts: AlertNotification[];
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onTriggerWater: () => void;
  onOpenOnboarding: () => void;
  gardenHealthScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  systemStatus,
  alerts,
  isDarkMode,
  onToggleDarkMode,
  onTriggerWater,
  onOpenOnboarding,
  gardenHealthScore,
}) => {
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const unreadAlerts = alerts.filter((a) => !a.read).length;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#06140b]/85 border-b border-emerald-500/20 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
            <div className="w-full h-full bg-[#07190e] rounded-[10px] flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-lg tracking-tight text-white">
                GREEN <span className="text-emerald-400">GUARDIANS</span>
              </span>
              <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono">
                AI + IoT v2.4
              </span>
            </div>
            <p className="text-[10px] text-emerald-300/70 font-mono tracking-wider uppercase hidden sm:block">
              Sense. Understand. Protect. Grow.
            </p>
          </div>
        </div>

        {/* Center: Live Garden Score & Device Status */}
        <div className="hidden md:flex items-center gap-4">
          {/* Garden Health Score Pill */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-black/40 border border-emerald-500/30">
            <div className="relative w-7 h-7 flex items-center justify-center">
              <svg className="w-7 h-7 -rotate-90">
                <circle
                  cx="14"
                  cy="14"
                  r="11"
                  stroke="rgba(16, 185, 129, 0.2)"
                  strokeWidth="2.5"
                  fill="none"
                />
                <circle
                  cx="14"
                  cy="14"
                  r="11"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="69"
                  strokeDashoffset={69 - (69 * gardenHealthScore) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-white font-mono">
                {gardenHealthScore}
              </span>
            </div>
            <div className="text-left">
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Garden Health</div>
              <div className="text-xs font-bold text-white">
                {gardenHealthScore >= 80 ? 'Optimal' : 'Attention'}
              </div>
            </div>
          </div>

          {/* ESP32 Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-cyan-500/30 text-xs font-mono">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-cyan-300 font-semibold">ESP32: Online</span>
            <span className="text-gray-400 text-[10px]">({systemStatus.wifiRssi} dBm)</span>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Manual Irrigation Pulse */}
          <button
            onClick={onTriggerWater}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 border border-cyan-400/40 text-cyan-200 text-xs font-mono font-medium transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
            title="Dispense micro-burst of water (200 mL)"
          >
            <Droplets className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
            <span>Water (200mL)</span>
          </button>

          {/* Alert Center Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
              className="relative p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-emerald-500/30 text-emerald-300 transition-colors cursor-pointer"
              title="Alert Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-bold flex items-center justify-center font-mono">
                  {unreadAlerts}
                </span>
              )}
            </button>

            {/* Alerts Dropdown Modal */}
            {showAlertsDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#091d12] border border-emerald-500/40 p-4 shadow-2xl text-white z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold font-display">Alert Center</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                      {alerts.length} Total
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAlertsDropdown(false)}
                    className="p-1 rounded-md text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {alerts.map((alt) => (
                    <div
                      key={alt.id}
                      className={`p-3 rounded-xl border text-xs ${
                        alt.severity === 'critical'
                          ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                          : alt.severity === 'warning'
                          ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                          : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          {alt.severity === 'warning' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          {alt.title}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 font-normal">
                          {alt.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300 leading-snug">{alt.message}</p>
                      {alt.actionRequired && (
                        <div className="mt-2 text-[10px] font-mono text-emerald-300 font-semibold bg-black/40 p-1.5 rounded-lg border border-white/5">
                          Action: {alt.actionRequired}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-emerald-500/30 text-emerald-300 transition-colors cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Onboarding Help Guide */}
          <button
            onClick={onOpenOnboarding}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-emerald-500/30 text-emerald-300 transition-colors cursor-pointer"
            title="View Guided Walkthrough"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
