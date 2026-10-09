import React, { useState } from 'react';
import {
  Sprout,
  Plus,
  Search,
  Droplets,
  FlaskConical,
  Activity,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  X,
  Clock,
  Sparkles,
  Calendar,
  CheckCircle2,
  Layers,
  Thermometer,
} from 'lucide-react';
import { Plant, SystemStatus } from '../types';
import { ThreePlantTwin } from '../components/ThreePlantTwin';

interface PlantsViewProps {
  plants: Plant[];
  systemStatus: SystemStatus;
  isDarkMode: boolean;
  onOpenAddPlant: () => void;
  onSelectPlant: (plant: Plant) => void;
  onTriggerWater: (amountMl: number) => void;
  selectedPlantModal: Plant | null;
  onClosePlantModal: () => void;
}

export const PlantsView: React.FC<PlantsViewProps> = ({
  plants,
  systemStatus,
  isDarkMode,
  onOpenAddPlant,
  onSelectPlant,
  onTriggerWater,
  selectedPlantModal,
  onClosePlantModal,
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'soil' | 'water' | 'nutrition' | 'health' | 'growth' | 'history'>('overview');

  const filteredPlants = plants.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.scientificName.toLowerCase().includes(search.toLowerCase()) ||
      p.stage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header & Add Plant Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#07190e] to-teal-950/40 border border-emerald-500/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              MY BOTANICAL GARDEN ({plants.length} SPECIMENS)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
            Plant Guardians
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 font-mono mt-0.5">
            Individual AI telemetry profiles, multi-depth soil probes & biometric tracking.
          </p>
        </div>

        <button
          onClick={onOpenAddPlant}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>+ ADD PLANT</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search by plant name, species, or stage (e.g. Tomato, Flowering)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/40 border border-emerald-500/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-mono shadow-inner"
        />
      </div>

      {/* Plants Grid (Section 9 & 34) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlants.map((plant) => (
          <div
            key={plant.id}
            onClick={() => onSelectPlant(plant)}
            className="p-5 rounded-3xl bg-gradient-to-br from-[#081a10] to-[#040e08] border border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-black/50 border border-emerald-500/30 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    {plant.emoji}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display text-white group-hover:text-emerald-300 transition-colors">
                      {plant.name}
                    </h3>
                    <div className="text-[11px] font-mono text-gray-400 italic">
                      {plant.scientificName}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                      plant.healthScore >= 80
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {plant.healthScore}% Health
                  </span>
                </div>
              </div>

              {/* Status pills grid */}
              <div className="grid grid-cols-2 gap-2 my-4 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-gray-400 text-[10px]">Soil Status:</span>
                  <div className="text-emerald-400 font-bold mt-0.5">
                    {plant.soilScore >= 80 ? 'Good' : 'Needs Check'} ({plant.soilScore}%)
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-gray-400 text-[10px]">Water Status:</span>
                  <div
                    className={`font-bold mt-0.5 ${
                      plant.waterStatus < 45 ? 'text-amber-300' : 'text-cyan-300'
                    }`}
                  >
                    {plant.waterStatus < 45 ? '⚠ Needed' : 'Optimal'} ({plant.waterStatus}%)
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-gray-400 text-[10px]">NPK Balance:</span>
                  <div className="text-gray-200 font-bold mt-0.5">
                    {plant.sensors.nitrogen === 'LOW' ? '⚠ Attention' : 'Optimal'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-gray-400 text-[10px]">Growth Delta:</span>
                  <div className="text-purple-400 font-bold mt-0.5">
                    +{plant.growthRate}%
                  </div>
                </div>
              </div>

              {/* AI Status snippet */}
              <div className="p-3 rounded-2xl bg-black/30 border border-white/5 text-[11px] font-mono text-gray-300 line-clamp-2">
                "{plant.aiStatus}"
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-emerald-400" /> Stage: {plant.stage}
              </span>
              <span className="text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>View Dossier</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* DEDICATED PLANT PROFILE MODAL WITH ALL 7 TABS (Section 12) */}
      {selectedPlantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl my-auto rounded-3xl bg-[#081a10] border border-emerald-500/40 p-5 sm:p-8 text-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20 mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedPlantModal.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold font-display text-white">
                    {selectedPlantModal.name} ({selectedPlantModal.variety})
                  </h2>
                  <p className="text-xs text-gray-400 font-mono italic">
                    {selectedPlantModal.scientificName} • ESP32 Node 01
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onTriggerWater(350)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Water 350mL</span>
                </button>
                <button
                  onClick={onClosePlantModal}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 7 Tabs Bar */}
            <div className="flex items-center gap-1 pb-3 overflow-x-auto border-b border-emerald-500/20 mb-5 text-xs font-mono shrink-0">
              {(['overview', 'soil', 'water', 'nutrition', 'health', 'growth', 'history'] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 py-1.5 rounded-xl capitalize transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 font-bold'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            {/* Tab Contents - Scrollable */}
            <div className="overflow-y-auto pr-1 flex-1 space-y-5">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/20 text-center">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">Health Score</div>
                      <div className="text-2xl font-bold font-display text-emerald-400 mt-1">
                        {selectedPlantModal.healthScore}%
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-black/40 border border-cyan-500/20 text-center">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">Soil Score</div>
                      <div className="text-2xl font-bold font-display text-cyan-400 mt-1">
                        {selectedPlantModal.soilScore}%
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-black/40 border border-blue-500/20 text-center">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">Water Status</div>
                      <div className="text-2xl font-bold font-display text-blue-400 mt-1">
                        {selectedPlantModal.waterStatus}%
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/20 text-center">
                      <div className="text-[10px] font-mono text-gray-400 uppercase">Growth Rate</div>
                      <div className="text-2xl font-bold font-display text-purple-400 mt-1">
                        +{selectedPlantModal.growthRate}%
                      </div>
                    </div>
                  </div>

                  {/* 3D Digital Twin Visual in modal */}
                  <div className="h-[280px]">
                    <ThreePlantTwin plant={selectedPlantModal} isDarkMode={isDarkMode} />
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono space-y-2">
                    <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> AI Health Summary
                    </div>
                    <p className="text-gray-200 leading-relaxed font-sans">
                      {selectedPlantModal.aiStatus}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-4 text-gray-400">
                      <span>Pest Risk: <strong className="text-emerald-300">{selectedPlantModal.pestRisk}</strong></span>
                      <span>Disease Risk: <strong className="text-emerald-300">{selectedPlantModal.diseaseRisk}</strong></span>
                      <span>Stage: <strong className="text-white">{selectedPlantModal.stage}</strong></span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SOIL */}
              {activeTab === 'soil' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20">
                    <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase mb-3">
                      Substrate Telemetry & Ion Concentrations
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-white/5">
                        <span className="text-gray-400">Moisture:</span>{' '}
                        <span className="font-bold text-white">{selectedPlantModal.sensors.moisture}%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5">
                        <span className="text-gray-400">Substrate pH:</span>{' '}
                        <span className="font-bold text-white">{selectedPlantModal.sensors.ph}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5">
                        <span className="text-gray-400">Nitrogen (N):</span>{' '}
                        <span className="font-bold text-amber-300">{selectedPlantModal.sensors.nitrogen}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5">
                        <span className="text-gray-400">Phosphorus (P):</span>{' '}
                        <span className="font-bold text-emerald-400">{selectedPlantModal.sensors.phosphorus}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5">
                        <span className="text-gray-400">Potassium (K):</span>{' '}
                        <span className="font-bold text-amber-300">{selectedPlantModal.sensors.potassium}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5">
                        <span className="text-gray-400">Soil Temp:</span>{' '}
                        <span className="font-bold text-white">{selectedPlantModal.sensors.temperature}°C</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: WATER */}
              {activeTab === 'water' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-cyan-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                        Irrigation Status & Target
                      </span>
                      <span className="text-xs font-mono text-gray-400">Optimal Range: 50–70%</span>
                    </div>
                    <div className="text-sm font-sans text-gray-200">
                      Current Moisture: <strong className="text-amber-300">{selectedPlantModal.sensors.moisture}% (Below Target)</strong>
                    </div>
                    <div className="mt-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-200">
                      Recommendation: Water 350 mL at 6:30 PM. Weather forecast indicates no significant rain in the next 14 hours.
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: NUTRITION */}
              {activeTab === 'nutrition' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20">
                    <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase mb-3">
                      Macronutrient Availability Analysis
                    </h3>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200">
                        <strong>Nitrogen (38 ppm):</strong> Low availability. Lower leaf chlorosis may manifest if unaddressed.
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200">
                        <strong>Phosphorus (74 ppm):</strong> Optimal. Root energy and flowering buds supported.
                      </div>
                      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200">
                        <strong>Potassium (44 ppm):</strong> Low availability. Regulates stomatal closure and water transport.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: HEALTH */}
              {activeTab === 'health' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20">
                    <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase mb-3">
                      Pest & Pathological Risk Matrix
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-white/5">
                        <span className="text-gray-400">Aphid / Sap Risk:</span>
                        <div className="text-emerald-400 font-bold mt-1">Low (12% Probability)</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5">
                        <span className="text-gray-400">Fungal Blight Risk:</span>
                        <div className="text-emerald-400 font-bold mt-1">Low (8% Probability)</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: GROWTH */}
              {activeTab === 'growth' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20">
                    <h3 className="text-xs font-mono font-bold text-purple-400 uppercase mb-3">
                      Biometric Growth Timeline
                    </h3>
                    <div className="space-y-2">
                      {selectedPlantModal.growthTimeline.map((rec) => (
                        <div
                          key={rec.day}
                          className="p-3 rounded-xl bg-white/5 flex items-center justify-between text-xs font-mono"
                        >
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                              Day {rec.day}
                            </span>
                            <span className="text-white font-bold">{rec.stage}</span>
                            <span className="text-gray-400">({rec.date})</span>
                          </div>
                          <div className="text-right">
                            <span className="text-cyan-300">{rec.heightCm} cm</span> •{' '}
                            <span className="text-emerald-400">{rec.leafCount} leaves</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: HISTORY */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20">
                    <h3 className="text-xs font-mono font-bold text-gray-400 uppercase mb-3">
                      Hourly Telemetry Logs
                    </h3>
                    <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                      {selectedPlantModal.history.map((h, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-lg bg-white/5 flex items-center justify-between text-[11px] font-mono"
                        >
                          <span className="text-emerald-300 font-bold">{h.time}</span>
                          <span className="text-cyan-300">Moisture: {h.moisture}%</span>
                          <span className="text-gray-300">pH: {h.ph}</span>
                          <span className="text-amber-300">Temp: {h.temperature}°C</span>
                          <span className="text-gray-400">Water: {h.waterUsedMl} mL</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
