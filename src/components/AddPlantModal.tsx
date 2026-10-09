import React, { useState } from 'react';
import {
  X,
  Camera,
  Search,
  Sprout,
  Check,
  Sparkles,
  ScanLine,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Plant } from '../types';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlant: (newPlant: Partial<Plant>) => void;
}

const PRESET_PLANTS = [
  { name: 'Tomato', scientific: 'Solanum lycopersicum', variety: 'Roma Heirloom', emoji: '🍅', minM: 50, maxM: 70, ph: 6.4 },
  { name: 'Rose', scientific: 'Rosa damascena', variety: 'English Tea Rose', emoji: '🌹', minM: 55, maxM: 75, ph: 6.5 },
  { name: 'Chilli', scientific: 'Capsicum annuum', variety: 'Birdseye Hot Pepper', emoji: '🌶️', minM: 45, maxM: 65, ph: 6.8 },
  { name: 'Sweet Basil', scientific: 'Ocimum basilicum', variety: 'Genovese Aromatica', emoji: '🌿', minM: 50, maxM: 70, ph: 6.6 },
  { name: 'Potato', scientific: 'Solanum tuberosum', variety: 'Yukon Gold Bio', emoji: '🥔', minM: 50, maxM: 70, ph: 6.1 },
  { name: 'Lavender', scientific: 'Lavandula angustifolia', variety: 'French Provence', emoji: '🪻', minM: 35, maxM: 55, ph: 7.0 },
  { name: 'Strawberry', scientific: 'Fragaria ananassa', variety: 'Albion Sweet', emoji: '🍓', minM: 60, maxM: 75, ph: 6.0 },
  { name: 'Mint', scientific: 'Mentha spicata', variety: 'Moroccan Spearmint', emoji: '🍃', minM: 60, maxM: 80, ph: 6.5 },
  { name: 'Monstera', scientific: 'Monstera deliciosa', variety: 'Swiss Cheese Vine', emoji: '🪴', minM: 50, maxM: 65, ph: 6.2 },
];

export const AddPlantModal: React.FC<AddPlantModalProps> = ({
  isOpen,
  onClose,
  onAddPlant,
}) => {
  const [tab, setTab] = useState<'scan' | 'search' | 'database'>('scan');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    name: string;
    scientific: string;
    confidence: number;
    variety: string;
    emoji: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<typeof PRESET_PLANTS[0] | null>(null);

  if (!isOpen) return null;

  const handleStartScan = () => {
    setIsScanning(true);
    setScanResult(null);

    // Simulate AI Vision identification
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        name: 'Heritage Cherry Tomato',
        scientific: 'Solanum lycopersicum var. cerasiforme',
        confidence: 96,
        variety: 'Sweet Million Cherry',
        emoji: '🍅',
      });
    }, 2200);
  };

  const handleConfirmAdd = (plantData: any) => {
    onAddPlant({
      name: plantData.name,
      scientificName: plantData.scientific,
      variety: plantData.variety || 'Standard Cultivar',
      emoji: plantData.emoji || '🌱',
      healthScore: 88,
      soilScore: 82,
      waterStatus: 48,
      growthRate: 7.2,
      pestRisk: 'Low',
      diseaseRisk: 'Low',
      aiStatus: 'Plant profile initialized. Ready for sensor telemetry binding.',
      stage: 'Vegetative',
      plantedDate: 'Today',
      optimalRanges: {
        moistureMin: plantData.minM || 50,
        moistureMax: plantData.maxM || 70,
        phMin: plantData.ph ? plantData.ph - 0.4 : 6.0,
        phMax: plantData.ph ? plantData.ph + 0.4 : 6.8,
        tempMin: 20,
        tempMax: 28,
        idealN: 'OPTIMAL',
        idealP: 'OPTIMAL',
        idealK: 'OPTIMAL',
      },
      sensors: {
        moisture: 48,
        ph: plantData.ph || 6.4,
        nitrogen: 'OPTIMAL',
        nitrogenValue: 55,
        phosphorus: 'OPTIMAL',
        phosphorusValue: 70,
        potassium: 'OPTIMAL',
        potassiumValue: 60,
        temperature: 25,
        humidity: 60,
        light: 8500,
        ec: 'NORMAL',
        ecValue: 1.4,
        timestamp: 'Just now',
      },
      history: [],
      growthTimeline: [{ day: 1, date: 'Today', heightCm: 12, leafCount: 8, stage: 'Initial', growthDeltaPercent: 0 }],
      carePlan: [
        { id: 'cp-new-1', time: '08:00 AM', title: 'Calibrate ESP32 probe', description: 'Seat sensor into root crown', icon: 'CheckCircle', completed: false, category: 'soil' },
        { id: 'cp-new-2', time: '06:30 PM', title: 'Initial root hydration (300 mL)', description: 'Establish capillary moisture zone', icon: 'Droplets', completed: false, category: 'water' },
      ],
      suitabilityScore: 90,
      suitabilityChecks: { ph: true, temp: true, moisture: true, nitrogen: true, potassium: true },
    });
    onClose();
  };

  const filteredPresets = PRESET_PLANTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.scientific.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#091d12] border border-emerald-500/30 p-6 text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Plus className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display">Add Your Plant</h3>
              <p className="text-[11px] font-mono text-emerald-400/80">AI Vision + Botanical Database</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-xl border border-emerald-500/20 mb-5 text-xs font-mono">
          <button
            onClick={() => setTab('scan')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'scan' ? 'bg-emerald-500/30 text-emerald-300 font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>AI Camera Scan</span>
          </button>
          <button
            onClick={() => setTab('search')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'search' ? 'bg-emerald-500/30 text-emerald-300 font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Crop</span>
          </button>
          <button
            onClick={() => setTab('database')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'database' ? 'bg-emerald-500/30 text-emerald-300 font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Database</span>
          </button>
        </div>

        {/* TAB 1: AI CAMERA SCAN */}
        {tab === 'scan' && (
          <div className="flex flex-col items-center">
            {/* Viewfinder simulation box */}
            <div className="relative w-full h-56 rounded-2xl bg-black/60 border-2 border-dashed border-emerald-500/40 flex flex-col items-center justify-center overflow-hidden mb-4">
              {/* Corner focus brackets */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-400" />

              {/* Scanning laser line */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-bounce" style={{ animationDuration: '1.2s' }} />
              )}

              {/* Viewfinder center text */}
              {!isScanning && !scanResult && (
                <div className="flex flex-col items-center text-center p-4">
                  <Camera className="w-10 h-10 text-emerald-400/80 mb-2 animate-pulse" />
                  <span className="text-xs font-bold text-white">Point camera toward plant leaves or stem</span>
                  <span className="text-[11px] text-gray-400 font-mono mt-1">
                    AI Vision will detect species, variety, and optimum parameters
                  </span>
                </div>
              )}

              {isScanning && (
                <div className="flex flex-col items-center">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
                  <span className="text-xs font-mono text-cyan-300">Extracting Botanical Feature Embeddings...</span>
                </div>
              )}

              {scanResult && (
                <div className="p-4 bg-emerald-950/80 rounded-xl border border-emerald-500/50 text-center animate-in zoom-in-95">
                  <div className="text-3xl mb-1">{scanResult.emoji}</div>
                  <div className="text-base font-bold text-white">{scanResult.name}</div>
                  <div className="text-xs text-emerald-300 font-mono italic">{scanResult.scientific}</div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-mono">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    Confidence: {scanResult.confidence}%
                  </div>
                </div>
              )}
            </div>

            {/* Scan Buttons */}
            {!scanResult ? (
              <button
                onClick={handleStartScan}
                disabled={isScanning}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <ScanLine className="w-4 h-4" />
                <span>{isScanning ? 'Analyzing Plant...' : 'Scan Plant With Camera'}</span>
              </button>
            ) : (
              <div className="w-full flex gap-2">
                <button
                  onClick={handleStartScan}
                  className="w-1/3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-gray-300"
                >
                  Rescan
                </button>
                <button
                  onClick={() => handleConfirmAdd(scanResult)}
                  className="w-2/3 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Check className="w-4 h-4" />
                  <span>Create Plant Profile</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2 & 3: SEARCH & DATABASE */}
        {(tab === 'search' || tab === 'database') && (
          <div>
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search tomato, rose, chilli, basil..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/50 border border-emerald-500/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-mono"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filteredPresets.map((plant) => (
                <div
                  key={plant.name}
                  onClick={() => setSelectedPreset(plant)}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    selectedPreset?.name === plant.name
                      ? 'bg-emerald-500/20 border-emerald-400'
                      : 'bg-black/30 border-white/5 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{plant.emoji}</span>
                    <div>
                      <div className="text-xs font-bold text-white">{plant.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono italic">{plant.scientific}</div>
                    </div>
                  </div>

                  <div className="text-right text-[10px] font-mono text-emerald-300">
                    <div>Moisture: {plant.minM}–{plant.maxM}%</div>
                    <div className="text-gray-400">pH: {plant.ph}</div>
                  </div>
                </div>
              ))}
            </div>

            {selectedPreset && (
              <button
                onClick={() => handleConfirmAdd(selectedPreset)}
                className="mt-4 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add {selectedPreset.name} to Garden</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
