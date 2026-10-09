import React, { useState } from 'react';
import {
  FlaskConical,
  Layers,
  CheckCircle,
  AlertTriangle,
  Droplets,
  Thermometer,
  Activity,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  Info,
  Calendar,
} from 'lucide-react';
import { Plant, SensorData } from '../types';
import { ThreeSoilCrossSection } from '../components/ThreeSoilCrossSection';

interface SoilLabViewProps {
  plants: Plant[];
  isDarkMode: boolean;
}

export const SoilLabView: React.FC<SoilLabViewProps> = ({ plants, isDarkMode }) => {
  const [selectedPlantIndex, setSelectedPlantIndex] = useState(0);
  const activePlant = plants[selectedPlantIndex] || plants[0];
  const sensors = activePlant.sensors;

  const soilHealthBreakdown = [
    { label: 'Moisture Saturation', value: 82, status: 'Acceptable', icon: Droplets, color: 'text-cyan-400' },
    { label: 'Substrate pH Balance', value: 94, status: 'Optimal', icon: FlaskConical, color: 'text-emerald-400' },
    { label: 'Nitrogen Availability', value: 58, status: 'Low ⚠', icon: Activity, color: 'text-amber-400' },
    { label: 'Phosphorus Ion Complex', value: 89, status: 'Optimal', icon: Sparkles, color: 'text-emerald-400' },
    { label: 'Potassium Reserves', value: 62, status: 'Low ⚠', icon: Zap, color: 'text-amber-400' },
    { label: 'Rhizosphere Temperature', value: 91, status: 'Optimal', icon: Thermometer, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header (Section 13) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#07190e] to-teal-950/40 border border-emerald-500/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🧪</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              PHYSICOCHEMICAL & MICROBIAL LABORATORY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
            Smart Soil Lab
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 font-mono mt-0.5">
            "Your soil, scientifically understood."
          </p>
        </div>

        {/* Plant selector switcher */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-emerald-500/20 text-xs font-mono">
          <span className="text-gray-400 text-[10px] pl-2 hidden sm:inline">Active Soil Probe:</span>
          {plants.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlantIndex(idx)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedPlantIndex === idx
                  ? 'bg-emerald-500 text-black font-bold shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {p.emoji} {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive 3D Soil Cross Section (Section 13 & 48) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wider">
              Rhizosphere Soil Profile (-25 cm Depth)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-cyan-300">ESP32 3-Tier Capacitive Probe</span>
        </div>

        <ThreeSoilCrossSection sensors={sensors} isDarkMode={isDarkMode} />
      </div>

      {/* 3. Soil Spectrometry Metrics Bar (Section 13) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3 rounded-2xl bg-[#07190e] border border-cyan-500/30 text-center">
          <div className="text-[10px] font-mono text-gray-400 uppercase">MOISTURE</div>
          <div className="text-xl font-bold font-display text-white mt-1">{sensors.moisture}%</div>
          <div className="text-[10px] text-amber-300 font-mono">Below Opt</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#07190e] border border-emerald-500/30 text-center">
          <div className="text-[10px] font-mono text-gray-400 uppercase">pH LEVEL</div>
          <div className="text-xl font-bold font-display text-white mt-1">{sensors.ph}</div>
          <div className="text-[10px] text-emerald-400 font-mono">Good</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#07190e] border border-amber-500/30 text-center">
          <div className="text-[10px] font-mono text-gray-400 uppercase">NITROGEN</div>
          <div className="text-xl font-bold font-display text-amber-300 mt-1">{sensors.nitrogen}</div>
          <div className="text-[10px] text-gray-400 font-mono">{sensors.nitrogenValue} mg/kg</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#07190e] border border-emerald-500/30 text-center">
          <div className="text-[10px] font-mono text-gray-400 uppercase">PHOSPHORUS</div>
          <div className="text-xl font-bold font-display text-emerald-400 mt-1">{sensors.phosphorus}</div>
          <div className="text-[10px] text-gray-400 font-mono">{sensors.phosphorusValue} mg/kg</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#07190e] border border-amber-500/30 text-center">
          <div className="text-[10px] font-mono text-gray-400 uppercase">POTASSIUM</div>
          <div className="text-xl font-bold font-display text-amber-300 mt-1">{sensors.potassium}</div>
          <div className="text-[10px] text-gray-400 font-mono">{sensors.potassiumValue} mg/kg</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#07190e] border border-emerald-500/30 text-center">
          <div className="text-[10px] font-mono text-gray-400 uppercase">TEMPERATURE</div>
          <div className="text-xl font-bold font-display text-white mt-1">{sensors.temperature}°C</div>
          <div className="text-[10px] text-emerald-400 font-mono">Substrate</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#07190e] border border-teal-500/30 text-center">
          <div className="text-[10px] font-mono text-gray-400 uppercase">EC / SALINITY</div>
          <div className="text-xl font-bold font-display text-white mt-1">{sensors.ec}</div>
          <div className="text-[10px] text-teal-400 font-mono">{sensors.ecValue} dS/m</div>
        </div>
      </div>

      {/* 4. Soil Health Score & Breakdown (Section 14) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-[#07190e] to-[#040e08] border border-emerald-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                SOIL HEALTH SCORE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                🟢 GOOD STATUS
              </span>
            </div>

            <div className="my-6 text-center">
              <div className="text-5xl font-extrabold font-display text-white">78 / 100</div>
              <div className="text-xs font-mono text-emerald-300 mt-2">
                Overall Soil Vitality Index
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              The physical soil matrix possesses excellent microbial aeration and optimal pH (6.4). Secondary macronutrients (Nitrogen & Potassium) require replenishing.
            </p>
          </div>

          <div className="pt-4 border-t border-emerald-500/20 mt-4 text-xs font-mono text-gray-400">
            Probe Calibration: <strong className="text-white">Active 0.1Hz Telemetry</strong>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-gradient-to-br from-[#06170e] to-[#040e08] border border-emerald-500/30 space-y-3.5">
          <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2">
            Comprehensive Physicochemical Breakdown
          </h3>

          {soilHealthBreakdown.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-300 flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-[11px]">{item.status}</span>
                    <span className="font-bold text-white">{item.value}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      item.value >= 80 ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Soil Suitability Checker (Section 15) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#07190e] to-[#040e08] border border-emerald-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activePlant.emoji}</span>
            <div>
              <h3 className="text-base font-bold font-display text-white">
                IS THIS SOIL SUITABLE FOR {activePlant.name.toUpperCase()}?
              </h3>
              <p className="text-xs text-gray-400 font-mono">Botanical Target Compatibility Audit</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold font-display text-emerald-400">
              {activePlant.suitabilityScore}%
            </span>
            <div className="text-[10px] font-mono text-emerald-300">Suitability Index</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-4 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/20 text-emerald-300 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>pH Suitable (6.4)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/20 text-emerald-300 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Temp Suitable (27°C)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/20 text-emerald-300 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Moisture Acceptable</span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Nitrogen Low ⚠</span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Potassium Low ⚠</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-200 flex items-center justify-between">
          <span>
            Final Recommendation: <strong className="text-white">"Suitable with minor soil improvements."</strong>
          </span>
          <span className="text-[10px] text-emerald-400">Match score: High</span>
        </div>
      </div>

      {/* 6. Soil Improvement Guidance (Section 16) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/30 via-[#07190e] to-[#040e08] border border-amber-500/30 space-y-4">
        <div className="flex items-center gap-2 text-amber-400">
          <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
          <h3 className="text-base font-bold font-display text-white">
            SOIL CONDITIONS NEED IMPROVEMENT
          </h3>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed font-sans">
          "Your plant may require attention to nitrogen and potassium availability."
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-gray-400 text-[10px] uppercase font-bold text-amber-300">Why It Matters</span>
            <p className="text-gray-300 font-sans text-xs">
              Nitrogen powers chlorophyll synthesis and foliage growth. Potassium regulates plant water retention and fruit development.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-gray-400 text-[10px] uppercase font-bold text-cyan-300">What To Check</span>
            <p className="text-gray-300 font-sans text-xs">
              Check lower leaves for pale yellow chlorosis. Verify drainage is not leaching liquid fertilizer out of substrate.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-gray-400 text-[10px] uppercase font-bold text-emerald-400">Suggested Next Step</span>
            <p className="text-gray-300 font-sans text-xs">
              Add 1 tablespoon organic kelp meal or diluted fish hydrolysate during the evening watering cycle.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-gray-400 text-[10px] uppercase font-bold text-purple-300">When To Re-Test</span>
            <p className="text-gray-300 font-sans text-xs">
              Automated re-test scheduled in <strong>48 hours</strong> once root microbes digest applied organic amendments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
