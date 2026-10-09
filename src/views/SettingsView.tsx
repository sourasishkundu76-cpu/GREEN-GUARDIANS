import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  Wifi,
  Battery,
  ShieldCheck,
  Globe,
  FileText,
  Download,
  Moon,
  Sun,
  Droplets,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { SystemStatus, Plant } from '../types';

interface SettingsViewProps {
  systemStatus: SystemStatus;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenReportModal: () => void;
  onUpdateSystemStatus: (updated: Partial<SystemStatus>) => void;
  plants: Plant[];
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  systemStatus,
  isDarkMode,
  onToggleDarkMode,
  onOpenReportModal,
  onUpdateSystemStatus,
  plants,
}) => {
  const [moistureThreshold, setMoistureThreshold] = useState(systemStatus.moistureThreshold || 40);
  const [autoIrrigation, setAutoIrrigation] = useState(systemStatus.autoIrrigationEnabled);
  const [waterSaving, setWaterSaving] = useState(systemStatus.waterSavingMode);
  const [testPumpActive, setTestPumpActive] = useState(false);

  const handleTestRelay = () => {
    setTestPumpActive(true);
    setTimeout(() => {
      setTestPumpActive(false);
    }, 2500);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Timestamp,Plant,Moisture(%),pH,Nitrogen(ppm),Phosphorus(ppm),Potassium(ppm),Temp(C)\n' +
      plants
        .map(
          (p) =>
            `2026-10-09T08:00:00Z,${p.name},${p.sensors.moisture},${p.sensors.ph},${p.sensors.nitrogenValue},${p.sensors.phosphorusValue},${p.sensors.potassiumValue},${p.sensors.temperature}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'green_guardians_telemetry_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header (Section 40) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#07190e] to-teal-950/40 border border-emerald-500/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              NODE HARDWARE & AUTOMATION PREFERENCES
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
            System Settings
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 font-mono mt-0.5">
            Configure ESP32 actuators, closed-loop triggers and audit reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReportModal}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-black font-bold font-mono text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Health Report</span>
          </button>
        </div>
      </div>

      {/* 2. Device Management Card (Section 36) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#06170e] to-[#040e08] border border-cyan-500/30 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white">
                📡 SMART DEVICE: GREEN GUARDIANS NODE 01
              </h3>
              <p className="text-xs text-cyan-300/80 font-mono">ESP32 Dual-Core • Firmware v2.4.1</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            🟢 ONLINE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-gray-400 text-[10px] uppercase">Wi-Fi Connection</span>
            <div className="text-emerald-400 font-bold mt-1 flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5" /> 🟢 Connected
            </div>
            <span className="text-[10px] text-gray-500 mt-0.5">{systemStatus.wifiRssi} dBm Strong</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-gray-400 text-[10px] uppercase">LiPo Battery</span>
            <div className="text-cyan-300 font-bold mt-1 flex items-center gap-1">
              <Battery className="w-3.5 h-3.5" /> {systemStatus.batteryLevel}%
            </div>
            <span className="text-[10px] text-gray-500 mt-0.5">Solar trickle charging</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-gray-400 text-[10px] uppercase">Sensor Probes</span>
            <div className="text-emerald-300 font-bold mt-1">8 / 8 operational</div>
            <span className="text-[10px] text-emerald-400/80 mt-0.5">100% Calibrated</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-gray-400 text-[10px] uppercase">Relay / Pump</span>
            <div className={`font-bold mt-1 ${testPumpActive ? 'text-cyan-300 animate-pulse' : 'text-emerald-400'}`}>
              {testPumpActive ? 'DISPENSING' : 'Ready / Standby'}
            </div>
            <span className="text-[10px] text-gray-500 mt-0.5">12V Submersible</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-gray-400 text-[10px] uppercase">Last Sync</span>
            <div className="text-white font-bold mt-1">12 seconds ago</div>
            <span className="text-[10px] text-gray-500 mt-0.5">Continuous Mesh</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-cyan-500/20 text-xs font-mono">
          <span className="text-gray-400">Manual hardware actuator diagnostic:</span>
          <button
            onClick={handleTestRelay}
            disabled={testPumpActive}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>{testPumpActive ? 'Fired Relay Pulse (2s)...' : 'Test Relay & Pump Pulse'}</span>
          </button>
        </div>
      </div>

      {/* 3. Closed-Loop Automation Controls (Section 19 & 40) */}
      <div className="p-6 rounded-3xl bg-[#081a10] border border-emerald-500/30 space-y-5">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold font-display text-white">
            Automation & Irrigation Thresholds
          </h3>
        </div>

        <div className="space-y-4">
          {/* Auto Irrigation Toggle */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Auto Irrigation Engine</div>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                Automatically fire ESP32 pump when soil moisture falls below threshold.
              </p>
            </div>
            <button
              onClick={() => {
                const updated = !autoIrrigation;
                setAutoIrrigation(updated);
                onUpdateSystemStatus({ autoIrrigationEnabled: updated });
              }}
              className={`w-14 h-7 rounded-full transition-colors p-1 cursor-pointer ${
                autoIrrigation ? 'bg-emerald-500' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  autoIrrigation ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Moisture Threshold Slider */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-300 font-bold">Soil Moisture Activation Threshold:</span>
              <span className="text-emerald-400 font-bold text-sm">{moistureThreshold}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="60"
              value={moistureThreshold}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMoistureThreshold(val);
                onUpdateSystemStatus({ moistureThreshold: val });
              }}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>20% (Dry Arid)</span>
              <span>40% (Default Recommended)</span>
              <span>60% (High Moisture)</span>
            </div>
          </div>

          {/* Water-Saving Mode Toggle */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Weather-Aware Water Saving Mode</div>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                Postpone automatic irrigation when weather radar predicts rainfall within 6 hours.
              </p>
            </div>
            <button
              onClick={() => {
                const updated = !waterSaving;
                setWaterSaving(updated);
                onUpdateSystemStatus({ waterSavingMode: updated });
              }}
              className={`w-14 h-7 rounded-full transition-colors p-1 cursor-pointer ${
                waterSaving ? 'bg-cyan-500' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  waterSaving ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Sustainability Score (Section 39) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#06190f] to-[#030d07] border border-emerald-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold font-display text-white">
              🌍 Sustainability Score
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
            91 / 100 • ECO GUARDIAN
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono text-center">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-gray-400 text-[10px]">Water Usage</span>
            <div className="text-base font-bold text-cyan-300 mt-1">94% Optimal</div>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-gray-400 text-[10px]">Fertilizer Intake</span>
            <div className="text-base font-bold text-emerald-300 mt-1">88% Organic</div>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-gray-400 text-[10px]">Soil Regeneration</span>
            <div className="text-base font-bold text-emerald-300 mt-1">92% Humus</div>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-gray-400 text-[10px]">Energy Consumption</span>
            <div className="text-base font-bold text-amber-300 mt-1">95% Solar</div>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-gray-400 text-[10px]">Plant Health</span>
            <div className="text-base font-bold text-emerald-300 mt-1">87% Mean</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-sans text-emerald-200">
          <strong>Eco Tip:</strong> Rainwater catchment connection saves up to 1.4 liters per tomato specimen weekly while reducing municipal tap chlorine exposure.
        </div>
      </div>

      {/* 5. Theme & Data Export (Section 40) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Dark/Light mode card */}
        <div className="p-5 rounded-3xl bg-[#081a10] border border-emerald-500/30 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-white">Visual Appearance</div>
            <p className="text-xs text-gray-400 font-sans mt-0.5">
              Switch between Dark Botanical and Soft Light mode.
            </p>
          </div>
          <button
            onClick={onToggleDarkMode}
            className="p-3 rounded-2xl bg-black/50 border border-emerald-500/40 text-emerald-300 hover:text-white transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>

        {/* Export telemetry CSV */}
        <div className="p-5 rounded-3xl bg-[#081a10] border border-emerald-500/30 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-white">Export Agronomic Telemetry</div>
            <p className="text-xs text-gray-400 font-sans mt-0.5">
              Download complete CSV logs of all 8 calibrated probes.
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="p-3 rounded-2xl bg-black/50 border border-emerald-500/40 text-emerald-300 hover:text-white transition-colors cursor-pointer"
            title="Download CSV"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
