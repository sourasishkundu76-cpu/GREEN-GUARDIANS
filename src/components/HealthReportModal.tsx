import React from 'react';
import { X, Printer, Download, Sprout, ShieldCheck, AlertTriangle, Droplets, FlaskConical, FileText } from 'lucide-react';
import { Plant, SystemStatus } from '../types';

interface HealthReportModalProps {
  plant: Plant;
  systemStatus: SystemStatus;
  isOpen: boolean;
  onClose: () => void;
}

export const HealthReportModal: React.FC<HealthReportModalProps> = ({
  plant,
  systemStatus,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-[#091a11] border border-emerald-500/40 p-6 sm:p-8 text-white shadow-2xl">
        {/* Header Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold font-display">AI Plant Health Dossier</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Document Content */}
        <div className="space-y-6 text-sm text-gray-200">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-black/50 border border-emerald-500/20">
            <div>
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                GREEN GUARDIANS • IOT BIOMETRIC AUDIT
              </div>
              <h1 className="text-2xl font-bold font-display text-white mt-1">
                {plant.emoji} {plant.name} ({plant.variety})
              </h1>
              <div className="text-xs font-mono text-gray-400 italic">
                Taxon: {plant.scientificName} • Node: ESP32-GG-01
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-mono text-gray-400">Report Generated</div>
              <div className="text-xs font-mono text-emerald-300 font-bold">2026-10-09 08:30 UTC</div>
              <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
                <ShieldCheck className="w-3 h-3" /> Telemetry Verified
              </div>
            </div>
          </div>

          {/* Core Scorecard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/20 text-center">
              <div className="text-[10px] font-mono text-gray-400 uppercase">Health Score</div>
              <div className="text-2xl font-bold font-display text-emerald-400 mt-1">
                {plant.healthScore}/100
              </div>
              <div className="text-[10px] text-emerald-300 font-mono">Vegetative Vigor</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-cyan-500/20 text-center">
              <div className="text-[10px] font-mono text-gray-400 uppercase">Soil Score</div>
              <div className="text-2xl font-bold font-display text-cyan-400 mt-1">
                {plant.soilScore}/100
              </div>
              <div className="text-[10px] text-cyan-300 font-mono">Microbial Equilibrium</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-blue-500/20 text-center">
              <div className="text-[10px] font-mono text-gray-400 uppercase">Hydration Index</div>
              <div className="text-2xl font-bold font-display text-blue-400 mt-1">
                {plant.waterStatus}%
              </div>
              <div className="text-[10px] text-amber-300 font-mono">Below Optimal (50-70)</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-purple-500/20 text-center">
              <div className="text-[10px] font-mono text-gray-400 uppercase">Growth Delta</div>
              <div className="text-2xl font-bold font-display text-purple-400 mt-1">
                +{plant.growthRate}%
              </div>
              <div className="text-[10px] text-purple-300 font-mono">Weekly Biometrics</div>
            </div>
          </div>

          {/* Section: Live Sensor Metrics */}
          <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20">
            <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5" /> Physical Sensor Spectrometry
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-gray-400">Moisture:</span>{' '}
                <span className="font-bold text-white">{plant.sensors.moisture}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-gray-400">Soil pH:</span>{' '}
                <span className="font-bold text-white">{plant.sensors.ph}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-gray-400">Nitrogen (N):</span>{' '}
                <span className="font-bold text-amber-300">{plant.sensors.nitrogen} ({plant.sensors.nitrogenValue} mg/kg)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-gray-400">Phosphorus (P):</span>{' '}
                <span className="font-bold text-emerald-400">{plant.sensors.phosphorus} ({plant.sensors.phosphorusValue} mg/kg)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-gray-400">Potassium (K):</span>{' '}
                <span className="font-bold text-amber-300">{plant.sensors.potassium} ({plant.sensors.potassiumValue} mg/kg)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-gray-400">Temp:</span>{' '}
                <span className="font-bold text-white">{plant.sensors.temperature}°C</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-gray-400">Humidity:</span>{' '}
                <span className="font-bold text-white">{plant.sensors.humidity}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-gray-400">Solar Lux:</span>{' '}
                <span className="font-bold text-white">{plant.sensors.light.toLocaleString()} lx</span>
              </div>
            </div>
          </div>

          {/* Section: AI Diagnostics & Pathology Scan */}
          <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-2">
            <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5" /> AI Pathology & Risk Analysis
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              <strong className="text-white">Current Assessment:</strong> {plant.aiStatus}
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono">
              <span className="text-gray-300">Pest Hazard: <strong className="text-emerald-400">{plant.pestRisk}</strong></span>
              <span className="text-gray-300">Fungal/Disease Hazard: <strong className="text-emerald-400">{plant.diseaseRisk}</strong></span>
              <span className="text-gray-300">Suitability Index: <strong className="text-emerald-400">{plant.suitabilityScore}%</strong></span>
            </div>
          </div>

          {/* Section: Water Savings & Future Forecast */}
          <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5" /> Closed-Loop Water Management & 7-Day Forecast
            </h3>
            <p className="text-xs text-gray-300">
              Weather analysis indicates rain probability is low (20%). Automatic micro-dosing of 350 mL is scheduled for 06:30 PM.
              Estimated water saved this week via predictive delay: <strong>840 mL (18% reduction)</strong>.
            </p>
            <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200">
              <strong>Future Risk Prediction (18-Hour Window):</strong> Substrate moisture may fall below 35% without evening watering. Automated irrigation trigger will maintain target rhizosphere saturation at 55%.
            </div>
          </div>

          {/* Compliance & Safety Disclaimer */}
          <div className="text-[11px] font-mono text-gray-400 leading-normal border-t border-white/10 pt-3">
            Disclaimer: GREEN GUARDIANS diagnostic and automation telemetry is powered by multi-sensor embedded IoT hardware and generative agronomic intelligence models. Recommendations should be validated with physical cultivation context.
          </div>
        </div>
      </div>
    </div>
  );
};
