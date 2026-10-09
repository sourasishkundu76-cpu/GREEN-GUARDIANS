import React, { useState } from 'react';
import {
  Sprout,
  Droplets,
  FlaskConical,
  Thermometer,
  Wind,
  Sun,
  Activity,
  AlertTriangle,
  CheckCircle,
  CloudSun,
  ArrowRight,
  Clock,
  ShieldCheck,
  Zap,
  RotateCw,
  Plus,
} from 'lucide-react';
import { Plant, SystemStatus, WeatherInfo } from '../types';
import { ThreePlantTwin } from '../components/ThreePlantTwin';
import { ClosedLoopVisualizer } from '../components/ClosedLoopVisualizer';

interface HomeViewProps {
  plants: Plant[];
  systemStatus: SystemStatus;
  weather: WeatherInfo;
  isDarkMode: boolean;
  onSelectPlant: (plant: Plant) => void;
  onOpenAddPlant: () => void;
  onTriggerWater: (amountMl: number) => void;
  onNavigateTab: (tab: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  plants,
  systemStatus,
  weather,
  isDarkMode,
  onSelectPlant,
  onOpenAddPlant,
  onTriggerWater,
  onNavigateTab,
}) => {
  const [selectedPlantIndex, setSelectedPlantIndex] = useState(0);
  const activePlant = plants[selectedPlantIndex] || plants[0];

  const healthyCount = plants.filter((p) => p.healthScore >= 80).length;
  const attentionCount = plants.filter((p) => p.healthScore < 80 && p.healthScore >= 60).length;
  const criticalCount = plants.filter((p) => p.healthScore < 60).length;
  const gardenHealthScore = 87;

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header Command Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#07190e] to-teal-950/40 border border-emerald-500/30 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              COMMAND CENTER • BIOSYSTEM ONLINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
            Good Morning, Guardian
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 font-mono mt-0.5">
            "Your garden is under active AI + IoT surveillance."
          </p>
        </div>

        {/* Quick Garden Census stats */}
        <div className="flex items-center gap-2.5 sm:gap-4 bg-black/40 p-2.5 sm:p-3 rounded-2xl border border-emerald-500/20 text-xs font-mono">
          <div className="text-center px-2">
            <div className="text-gray-400 text-[10px]">Monitored</div>
            <div className="text-base font-bold text-white font-mono">{plants.length}</div>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="text-center px-2">
            <div className="text-emerald-400 text-[10px] flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Healthy
            </div>
            <div className="text-base font-bold text-emerald-300 font-mono">{healthyCount}</div>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="text-center px-2">
            <div className="text-amber-400 text-[10px] flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Attention
            </div>
            <div className="text-base font-bold text-amber-300 font-mono">{attentionCount}</div>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="text-center px-2">
            <div className="text-rose-400 text-[10px] flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Critical
            </div>
            <div className="text-base font-bold text-rose-300 font-mono">{criticalCount}</div>
          </div>
        </div>
      </div>

      {/* 2. Garden Health Score & Live System Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Garden Health Score Card (Large animated circular gauge) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-[#07190e] to-[#040e08] border border-emerald-500/30 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                GARDEN HEALTH SCORE
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
              REAL-TIME AGGREGATE
            </span>
          </div>

          <div className="my-6 flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* Animated Circular Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-36 h-36 -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="58"
                  stroke="rgba(16, 185, 129, 0.15)"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="58"
                  stroke="url(#healthGrad)"
                  strokeWidth="10"
                  strokeDasharray="364"
                  strokeDashoffset={364 - (364 * gardenHealthScore) / 100}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold font-display text-white">
                  {gardenHealthScore}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                  / 100
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono text-gray-300 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Vegetative Homeostasis: <strong>91%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Substrate Ion Balance: <strong>84%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Hydration Equilibrium: <strong>86%</strong></span>
              </div>
              <p className="text-[11px] text-emerald-300/80 pt-1 font-sans italic">
                Minor nutrient replenishment needed for tomato flowering cycle.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400">Status: <strong className="text-emerald-300">Optimal Equilibrium</strong></span>
            <button
              onClick={() => onNavigateTab('soil')}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Lab</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Live System Status Card (Section 7) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-gradient-to-br from-[#06170e] to-[#040e08] border border-cyan-500/30 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                LIVE HARDWARE TELEMETRY
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>Last update: {systemStatus.lastUpdateSecondsAgo}s ago</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/20">
              <div className="text-[10px] font-mono text-gray-400 uppercase">ESP32 Node</div>
              <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Connected
              </div>
              <div className="text-[10px] font-mono text-gray-500 mt-0.5">WiFi {systemStatus.wifiRssi} dBm</div>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-cyan-500/20">
              <div className="text-[10px] font-mono text-gray-400 uppercase">Cloud Sync</div>
              <div className="text-sm font-bold text-cyan-400 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Online
              </div>
              <div className="text-[10px] font-mono text-gray-500 mt-0.5">MQTT 0.1 Hz</div>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/20">
              <div className="text-[10px] font-mono text-gray-400 uppercase">Sensors Array</div>
              <div className="text-sm font-bold text-emerald-300 mt-1">
                {systemStatus.sensorsCount.operational}/{systemStatus.sensorsCount.total} OK
              </div>
              <div className="text-[10px] font-mono text-emerald-400/80 mt-0.5">All operational</div>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-blue-500/20">
              <div className="text-[10px] font-mono text-gray-400 uppercase">Water Reservoir</div>
              <div className="text-sm font-bold text-blue-400 mt-1">
                {systemStatus.reservoirLevel}%
              </div>
              <div className="text-[10px] font-mono text-gray-400 mt-0.5">11.7 / 15 Liters</div>
            </div>
          </div>

          {/* Reservoir Visual bar */}
          <div className="p-3 rounded-2xl bg-black/50 border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-300 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Submersible Pump Status:
                <strong className="text-emerald-400 uppercase">Ready / Standby</strong>
              </span>
              <span className="text-cyan-300 font-bold">{systemStatus.reservoirLevel}% Reservoir</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${systemStatus.reservoirLevel}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Sensor Overview Cards (Section 8) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wider">
              Live Sensor Readings (Active Plant: {activePlant.name})
            </h2>
          </div>
          <span className="text-[11px] font-mono text-gray-400">Calibrated Multi-Depth</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {/* Card 1: Moisture */}
          <div className="p-3.5 rounded-2xl bg-[#07190e] border border-cyan-500/30 hover:border-cyan-400 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-cyan-400">
              <Droplets className="w-4 h-4" />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                BELOW OPT
              </span>
            </div>
            <div className="my-2">
              <div className="text-[10px] font-mono text-gray-400 uppercase">Moisture</div>
              <div className="text-xl font-bold font-display text-white">
                {activePlant.sensors.moisture}%
              </div>
            </div>
            {/* Sparkline */}
            <div className="h-6 flex items-end gap-0.5 pt-1">
              {[38, 40, 42, 45, 43, 41, 42].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 bg-cyan-500/40 rounded-t"
                  style={{ height: `${(v / 50) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Card 2: pH */}
          <div className="p-3.5 rounded-2xl bg-[#07190e] border border-emerald-500/30 hover:border-emerald-400 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-400">
              <FlaskConical className="w-4 h-4" />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-300">
                GOOD
              </span>
            </div>
            <div className="my-2">
              <div className="text-[10px] font-mono text-gray-400 uppercase">Soil pH</div>
              <div className="text-xl font-bold font-display text-white">
                {activePlant.sensors.ph}
              </div>
            </div>
            <div className="h-6 flex items-end gap-0.5 pt-1">
              {[6.3, 6.4, 6.4, 6.5, 6.4, 6.4, 6.4].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 bg-emerald-500/40 rounded-t"
                  style={{ height: `${(v / 7) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Card 3: NPK */}
          <div className="p-3.5 rounded-2xl bg-[#07190e] border border-amber-500/30 hover:border-amber-400 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-400">
              <Activity className="w-4 h-4" />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500/30 text-amber-300">
                ATTN
              </span>
            </div>
            <div className="my-2">
              <div className="text-[10px] font-mono text-gray-400 uppercase">NPK Ratio</div>
              <div className="text-xs font-bold font-mono text-white mt-1">
                N: <span className="text-amber-400">LOW</span>
              </div>
              <div className="text-xs font-bold font-mono text-white">
                P: <span className="text-emerald-400">OK</span> | K: <span className="text-amber-400">LOW</span>
              </div>
            </div>
            <div className="text-[9px] font-mono text-gray-400">38 / 74 / 44 ppm</div>
          </div>

          {/* Card 4: Temperature */}
          <div className="p-3.5 rounded-2xl bg-[#07190e] border border-emerald-500/30 hover:border-emerald-400 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-400">
              <Thermometer className="w-4 h-4" />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300">
                IDEAL
              </span>
            </div>
            <div className="my-2">
              <div className="text-[10px] font-mono text-gray-400 uppercase">Temperature</div>
              <div className="text-xl font-bold font-display text-white">
                {activePlant.sensors.temperature}°C
              </div>
            </div>
            <div className="h-6 flex items-end gap-0.5 pt-1">
              {[24, 25, 26, 28, 27, 27, 27].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 bg-emerald-500/40 rounded-t"
                  style={{ height: `${(v / 30) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Card 5: Humidity */}
          <div className="p-3.5 rounded-2xl bg-[#07190e] border border-emerald-500/30 hover:border-emerald-400 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-400">
              <Wind className="w-4 h-4" />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300">
                NORMAL
              </span>
            </div>
            <div className="my-2">
              <div className="text-[10px] font-mono text-gray-400 uppercase">Humidity</div>
              <div className="text-xl font-bold font-display text-white">
                {activePlant.sensors.humidity}%
              </div>
            </div>
            <div className="h-6 flex items-end gap-0.5 pt-1">
              {[58, 60, 62, 64, 61, 60, 61].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 bg-emerald-500/40 rounded-t"
                  style={{ height: `${(v / 70) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Card 6: Light */}
          <div className="p-3.5 rounded-2xl bg-[#07190e] border border-emerald-500/30 hover:border-emerald-400 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-300">
              <Sun className="w-4 h-4" />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">
                ACTIVE
              </span>
            </div>
            <div className="my-2">
              <div className="text-[10px] font-mono text-gray-400 uppercase">Solar Lux</div>
              <div className="text-xl font-bold font-display text-white">
                8,200 <span className="text-xs font-normal font-mono text-gray-400">lx</span>
              </div>
            </div>
            <div className="text-[9px] font-mono text-emerald-300/80">6.2 hrs DLI Saturation</div>
          </div>

          {/* Card 7: EC */}
          <div className="p-3.5 rounded-2xl bg-[#07190e] border border-emerald-500/30 hover:border-emerald-400 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-teal-400">
              <Activity className="w-4 h-4" />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-teal-950 text-teal-300">
                NORMAL
              </span>
            </div>
            <div className="my-2">
              <div className="text-[10px] font-mono text-gray-400 uppercase">Salinity / EC</div>
              <div className="text-xl font-bold font-display text-white">
                1.4 <span className="text-xs font-normal font-mono text-gray-400">dS/m</span>
              </div>
            </div>
            <div className="text-[9px] font-mono text-gray-400">Cation exchange balance</div>
          </div>
        </div>
      </div>

      {/* 4. Active Plant Showcase with 3D Digital Plant Twin (Section 9 & 37) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: 3D Digital Plant Twin interactive canvas */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Digital Plant Twin ({activePlant.name})
              </span>
            </div>
            <div className="flex items-center gap-1">
              {plants.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlantIndex(idx)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    selectedPlantIndex === idx
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {p.emoji} {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-[380px]">
            <ThreePlantTwin plant={activePlant} isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* Right: Active Plant Card & AI Status Analysis */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-[#081b10] to-[#040e08] border border-emerald-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{activePlant.emoji}</span>
                <div>
                  <h3 className="text-xl font-bold font-display text-white">{activePlant.name}</h3>
                  <p className="text-xs text-gray-400 font-mono italic">{activePlant.scientificName}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                {activePlant.healthScore}% Health
              </span>
            </div>

            {/* Parameter badges */}
            <div className="grid grid-cols-2 gap-2.5 my-5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-gray-400 text-[10px]">Soil Status</div>
                <div className="text-emerald-400 font-bold mt-0.5">Good (78%)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-gray-400 text-[10px]">Water Needed</div>
                <div className="text-amber-300 font-bold mt-0.5">⚠ 350 mL Due</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-gray-400 text-[10px]">Nutrients (NPK)</div>
                <div className="text-amber-300 font-bold mt-0.5">⚠ Low N & K</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-gray-400 text-[10px]">Weekly Growth</div>
                <div className="text-purple-400 font-bold mt-0.5">+{activePlant.growthRate}%</div>
              </div>
            </div>

            {/* AI Status Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-[11px]">
                <Activity className="w-3.5 h-3.5" /> AI AGRO-STATUS
              </div>
              <p className="text-gray-200 leading-relaxed font-sans">
                "{activePlant.aiStatus}"
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-emerald-500/20 flex gap-2">
            <button
              onClick={() => onSelectPlant(activePlant)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Full Plant Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onTriggerWater(350)}
              className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Water 350mL</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Closed-Loop Automation Visualizer (Section 19, 41, 43) */}
      <ClosedLoopVisualizer
        onTriggerWatering={(amount) => onTriggerWater(amount)}
        currentMoisture={activePlant.sensors.moisture}
      />

      {/* 6. Weather-Aware Irrigation & Today's Care Plan (Section 18, 20, 27) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Weather Aware Card */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-gradient-to-br from-[#07190e] to-[#040e08] border border-emerald-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                WEATHER-AWARE IRRIGATION
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
              WATER SAVER ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-black/40 border border-white/5 text-center text-xs font-mono mb-4">
            <div>
              <div className="text-gray-400 text-[10px]">Ambient Temp</div>
              <div className="text-base font-bold text-white mt-0.5">{weather.temp}°C</div>
            </div>
            <div>
              <div className="text-gray-400 text-[10px]">Air Humidity</div>
              <div className="text-base font-bold text-white mt-0.5">{weather.humidity}%</div>
            </div>
            <div>
              <div className="text-gray-400 text-[10px]">Rain Chance</div>
              <div className="text-base font-bold text-cyan-300 mt-0.5">{weather.rainProbability}%</div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-black/30 border border-emerald-500/20 font-mono text-emerald-200">
              <strong>Forecast:</strong> {weather.forecastSummary}
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 font-mono text-emerald-300">
              <strong>AI Decision:</strong> "{weather.irrigationAdvice}"
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs font-mono text-gray-400">
            <span>Estimated Water Saved: <strong className="text-cyan-300">{weather.waterSavedEstimateMl} mL</strong></span>
            <span className="text-emerald-400">Zero Runoff Waste</span>
          </div>
        </div>

        {/* Today's Care Plan (Section 27) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-gradient-to-br from-[#07190e] to-[#040e08] border border-emerald-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                TODAY'S BIOMETRIC CARE PLAN
              </span>
            </div>
            <span className="text-[10px] font-mono text-gray-400">Targeted Schedule</span>
          </div>

          <div className="space-y-2.5">
            {activePlant.carePlan.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  task.completed
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-gray-400'
                    : 'bg-black/40 border-white/10 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                      task.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-emerald-300'
                    }`}
                  >
                    {task.completed ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold font-display">{task.title}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{task.description}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono font-bold text-emerald-300">{task.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-500/20 text-center">
            <button
              onClick={() => onNavigateTab('doctor')}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Consult AI Plant Doctor for customized dosing</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
