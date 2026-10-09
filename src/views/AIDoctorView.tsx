import React, { useState, useRef } from 'react';
import {
  Bot,
  Camera,
  Upload,
  Mic,
  Send,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Bug,
  Activity,
  Layers,
  Thermometer,
  Droplets,
  HelpCircle,
  FileQuestion,
  RefreshCw,
  Eye,
  ShieldAlert,
} from 'lucide-react';
import { Plant, ChatMessage, DiagnosticResult } from '../types';
import { askPlantDoctor } from '../services/geminiService';

interface AIDoctorViewProps {
  plants: Plant[];
  isDarkMode: boolean;
  onTriggerWater: (amountMl: number) => void;
}

export const AIDoctorView: React.FC<AIDoctorViewProps> = ({
  plants,
  isDarkMode,
  onTriggerWater,
}) => {
  const [selectedPlantIndex, setSelectedPlantIndex] = useState(0);
  const activePlant = plants[selectedPlantIndex] || plants[0];

  const [inputQuery, setInputQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial conversational messages with real agro diagnosis
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Greetings! I am your AI Plant Doctor. I am continuously linked to ${activePlant.name}'s ESP32 soil probe (Moisture: ${activePlant.sensors.moisture}%, pH: ${activePlant.sensors.ph}, NPK: ${activePlant.sensors.nitrogenValue}/${activePlant.sensors.phosphorusValue}/${activePlant.sensors.potassiumValue} ppm). What symptoms or abnormalities have you noticed?`,
      timestamp: '08:15 AM',
      suggestedActions: [
        'My tomato leaves are turning yellow',
        'Should I water my tomato today?',
        'Run AI Pest & Disease Scan',
        'Check current plant stress score',
      ],
    },
  ]);

  // Leaf Health Score state
  const [leafHealthScore, setLeafHealthScore] = useState(82);
  const [activeDiagnosticTab, setActiveDiagnosticTab] = useState<'chat' | 'pest' | 'disease' | 'leaf_scan' | 'stress'>('chat');

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() && !uploadedImagePreview) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend || 'Uploaded image for botanical diagnostic review.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsAnalyzing(true);

    try {
      const response = await askPlantDoctor({
        plantName: activePlant.name,
        userQuery: textToSend,
        sensorData: {
          moisture: activePlant.sensors.moisture,
          ph: activePlant.sensors.ph,
          nitrogen: activePlant.sensors.nitrogen,
          phosphorus: activePlant.sensors.phosphorus,
          potassium: activePlant.sensors.potassium,
          temperature: activePlant.sensors.temperature,
          humidity: activePlant.sensors.humidity,
        },
        imageBase64: uploadedImagePreview || undefined,
      });

      if (response.leafHealthScore) {
        setLeafHealthScore(response.leafHealthScore);
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        diagnostic: {
          diagnosisType: 'general',
          detectedIssue: response.detectedIssue || 'Diagnostic Assessment',
          confidence: response.confidence || 88,
          risk: response.risk || 'Moderate',
          leafHealthScore: response.leafHealthScore || 82,
          symptoms: ['Foliage chlorosis', 'Lower canopy lightening'],
          possibleCauses: response.possibleCauses,
          recommendedSteps: response.recommendedSteps,
          treatmentGuidance: response.scientificNote,
          disclaimer: response.disclaimer,
          timestamp: 'Just now',
        },
        suggestedActions: [
          'Water 350 mL via Irrigation Center',
          'Add organic nitrogen/potassium supplement',
          'Schedule re-test in 48 hours',
        ],
      };

      setMessages((prev) => [...prev, aiMessage]);
      setUploadedImagePreview(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulateVoice = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputQuery('My tomato leaves are turning yellow at the bottom.');
      }, 1800);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header (Section 22) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#07190e] to-teal-950/40 border border-emerald-500/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              MULTIMODAL AGRONOMIC INTELLIGENCE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
            AI Plant Doctor
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 font-mono mt-0.5">
            "Tell me what's wrong with your plant."
          </p>
        </div>

        {/* Specimen selector */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-emerald-500/20 text-xs font-mono">
          <span className="text-gray-400 text-[10px] pl-2 hidden sm:inline">Diagnostic Specimen:</span>
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

      {/* 2. Diagnostic Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        <button
          onClick={() => setActiveDiagnosticTab('chat')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeDiagnosticTab === 'chat'
              ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 font-bold'
              : 'bg-black/30 text-gray-400 hover:text-white'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Doctor Consultation</span>
        </button>
        <button
          onClick={() => setActiveDiagnosticTab('pest')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeDiagnosticTab === 'pest'
              ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 font-bold'
              : 'bg-black/30 text-gray-400 hover:text-white'
          }`}
        >
          <Bug className="w-3.5 h-3.5" />
          <span>Pest Detection</span>
        </button>
        <button
          onClick={() => setActiveDiagnosticTab('disease')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeDiagnosticTab === 'disease'
              ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 font-bold'
              : 'bg-black/30 text-gray-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Disease Analysis</span>
        </button>
        <button
          onClick={() => setActiveDiagnosticTab('leaf_scan')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeDiagnosticTab === 'leaf_scan'
              ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 font-bold'
              : 'bg-black/30 text-gray-400 hover:text-white'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Leaf Health Scanner</span>
        </button>
        <button
          onClick={() => setActiveDiagnosticTab('stress')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeDiagnosticTab === 'stress'
              ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50 font-bold'
              : 'bg-black/30 text-gray-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Plant Stress Monitor</span>
        </button>
      </div>

      {/* 3. MAIN SECTION ACCORDING TO TAB */}

      {/* TAB: CHAT / DOCTOR CONSULTATION */}
      {activeDiagnosticTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Chat history & interaction */}
          <div className="lg:col-span-8 flex flex-col h-[580px] rounded-3xl bg-[#081a10] border border-emerald-500/30 p-4 sm:p-5 shadow-xl">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs font-sans leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-black font-medium rounded-tr-sm'
                        : 'bg-black/50 border border-emerald-500/30 text-gray-100 rounded-tl-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                        {msg.sender === 'user' ? 'Cultivator' : 'AI Plant Doctor'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">{msg.timestamp}</span>
                    </div>

                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Rich Diagnostic Card if attached */}
                    {msg.diagnostic && (
                      <div className="mt-3 p-3.5 rounded-xl bg-[#05130b] border border-emerald-500/40 text-xs font-mono space-y-2.5">
                        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                          <span className="text-amber-300 font-bold">{msg.diagnostic.detectedIssue}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                            Confidence: {msg.diagnostic.confidence}%
                          </span>
                        </div>

                        {/* Possible Causes (Section 22) */}
                        <div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase">Possible Causes</div>
                          <ul className="list-disc pl-4 mt-1 space-y-0.5 text-gray-300">
                            {msg.diagnostic.possibleCauses.map((cause, i) => (
                              <li key={i}>{cause}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Next Steps (Section 22) */}
                        <div>
                          <div className="text-[10px] font-bold text-emerald-400 uppercase">Recommended Next Steps</div>
                          <ul className="pl-1 mt-1 space-y-1 text-emerald-200">
                            {msg.diagnostic.recommendedSteps.map((step, i) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Disclaimer (Section 22 & 47) */}
                        <div className="pt-2 border-t border-white/5 text-[9px] text-gray-400 italic">
                          {msg.diagnostic.disclaimer}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isAnalyzing && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-black/40 border border-emerald-500/20 text-xs font-mono text-emerald-300 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Synthesizing physical soil telemetry with leaf computer vision model...</span>
                </div>
              )}
            </div>

            {/* Image Preview Thumbnail if selected */}
            {uploadedImagePreview && (
              <div className="relative mb-3 p-2 bg-black/60 rounded-xl border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={uploadedImagePreview} alt="Leaf preview" className="w-10 h-10 object-cover rounded-lg" />
                  <span className="text-xs font-mono text-gray-300">Leaf image attached for vision analysis</span>
                </div>
                <button
                  onClick={() => setUploadedImagePreview(null)}
                  className="text-xs text-rose-400 hover:text-rose-300 font-mono px-2"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Suggested quick prompt chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-[11px] font-mono">
              <button
                onClick={() => handleSendMessage('My tomato leaves are turning yellow')}
                className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300 border border-white/5 whitespace-nowrap cursor-pointer transition-colors"
              >
                "My tomato leaves are turning yellow"
              </button>
              <button
                onClick={() => handleSendMessage('Should I water my tomato today?')}
                className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300 border border-white/5 whitespace-nowrap cursor-pointer transition-colors"
              >
                "Should I water today?"
              </button>
              <button
                onClick={() => handleSendMessage('Why is my soil NPK nitrogen low?')}
                className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300 border border-white/5 whitespace-nowrap cursor-pointer transition-colors"
              >
                "Why is nitrogen low?"
              </button>
            </div>

            {/* Bottom Input Controls */}
            <div className="relative flex items-center gap-2 pt-2 border-t border-emerald-500/20">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Upload image button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl bg-black/50 hover:bg-white/10 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
                title="Upload or snap leaf image"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Voice button */}
              <button
                onClick={handleSimulateVoice}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-500 text-black border-rose-400 animate-pulse'
                    : 'bg-black/50 hover:bg-white/10 text-cyan-400 border-cyan-500/30'
                }`}
                title="Voice input"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Text input */}
              <input
                type="text"
                placeholder={isRecording ? 'Listening to voice...' : `Ask Doctor about ${activePlant.name} symptoms...`}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-black/50 border border-emerald-500/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-sans"
              />

              {/* Send button */}
              <button
                onClick={() => handleSendMessage()}
                disabled={isAnalyzing}
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Live Sensor Telemetry Context for Doctor */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-3xl bg-[#081a10] border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  ACTIVE SENSOR TELEMETRY
                </span>
                <span className="text-[10px] font-mono text-cyan-300">ESP32 Linked</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <span className="text-gray-400">Moisture:</span>
                  <span className="text-amber-300 font-bold">{activePlant.sensors.moisture}% (Below Opt)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <span className="text-gray-400">Soil pH:</span>
                  <span className="text-emerald-400 font-bold">{activePlant.sensors.ph} (Balanced)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <span className="text-gray-400">Nitrogen (N):</span>
                  <span className="text-amber-300 font-bold">LOW (38 ppm)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <span className="text-gray-400">Potassium (K):</span>
                  <span className="text-amber-300 font-bold">LOW (44 ppm)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <span className="text-gray-400">Ambient Temp:</span>
                  <span className="text-white font-bold">{activePlant.sensors.temperature}°C</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-[11px] font-mono text-cyan-200">
                AI Cross-Referencing: The doctor automatically checks these values before responding.
              </div>
            </div>

            {/* Quick Action Water Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#06170e] to-[#040e08] border border-cyan-500/30 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
                <Droplets className="w-4 h-4" /> Doctor Prescribed Action
              </div>
              <p className="text-xs text-gray-300 font-sans">
                Replenish root zone moisture to avoid stomatal closure and assist nitrogen intake.
              </p>
              <button
                onClick={() => onTriggerWater(350)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>Execute 350 mL Irrigation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PEST DETECTION (Section 23) */}
      {activeDiagnosticTab === 'pest' && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#081a10] to-[#040e08] border border-amber-500/30 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <Bug className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  🐛 AI Pest Detection Spectrum
                </h3>
                <p className="text-xs text-gray-400 font-mono">Micro-Feature Computer Vision</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
              Confidence: 91%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-gray-400 text-[10px] uppercase">Possible Pest</span>
              <div className="text-base font-bold text-amber-300">Aphid-like infestation</div>
              <span className="text-[10px] text-gray-500">Sub-family Aphididae</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-gray-400 text-[10px] uppercase">Risk Assessment</span>
              <div className="text-base font-bold text-amber-400">Moderate Risk</div>
              <span className="text-[10px] text-gray-500">Early cluster formation</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-gray-400 text-[10px] uppercase">Affected Foliage</span>
              <div className="text-base font-bold text-white">Tender Terminal Shoots</div>
              <span className="text-[10px] text-gray-500">Upper apical meristem</span>
            </div>
          </div>

          {/* Recommended Next Checks & Guidance (Section 23) */}
          <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 space-y-2 text-xs">
            <h4 className="font-mono font-bold text-amber-300 uppercase">
              Recommended Next Checks & Treatment Guidance
            </h4>
            <ul className="space-y-1.5 text-gray-300 font-sans">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Examine leaf undersides for curled edges and sticky honeydew secretions.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Apply cold-pressed organic neem oil or insecticidal soap diluted at 0.5% at sundown.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Isolate plant from nearby companions for 48 hours to prevent vector transfer.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB: DISEASE ANALYSIS (Section 24) */}
      {activeDiagnosticTab === 'disease' && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#081a10] to-[#040e08] border border-rose-500/30 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                <Activity className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  🦠 AI Disease Analysis
                </h3>
                <p className="text-xs text-gray-400 font-mono">Foliar Pathogen Pattern Scanner</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold">
              Confidence: 88%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-gray-400 text-[10px] uppercase">Possible Issue</span>
              <div className="text-base font-bold text-rose-300">Leaf disease pattern detected</div>
              <span className="text-[10px] text-gray-500">Alternaria / Early chlorotic spots</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-gray-400 text-[10px] uppercase">Symptoms Identified</span>
              <div className="text-base font-bold text-white">• Discoloration • Spotting</div>
              <span className="text-[10px] text-gray-500">Lower leaf margins</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-gray-400 text-[10px] uppercase">Recommended Action</span>
              <div className="text-base font-bold text-emerald-300">Inspect & Monitor</div>
              <span className="text-[10px] text-gray-500">Targeted root drip only</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-xs font-sans text-gray-200">
            <strong>Recommended:</strong> "Inspect affected leaves and continue monitoring. Avoid wetting leaves during watering cycles to prevent fungal spores from spreading."
          </div>
        </div>
      )}

      {/* TAB: LEAF HEALTH ANALYSIS (Section 25) */}
      {activeDiagnosticTab === 'leaf_scan' && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#081a10] to-[#040e08] border border-cyan-500/30 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold font-display text-white">
                🍃 Visual Leaf Health Scanner
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
              Status: 🟢 Mostly Healthy
            </span>
          </div>

          {/* Leaf health score circular gauge */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 p-6 rounded-2xl bg-black/40 border border-white/5">
            <div className="text-center">
              <div className="text-5xl font-extrabold font-display text-emerald-400">
                {leafHealthScore} / 100
              </div>
              <div className="text-xs font-mono text-emerald-300 mt-1 uppercase tracking-wider">
                LEAF HEALTH INDEX
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono flex-1">
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-gray-400 text-[10px]">Color:</span>
                <div className="text-emerald-300 font-bold mt-0.5">86% Normal</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-gray-400 text-[10px]">Texture:</span>
                <div className="text-emerald-300 font-bold mt-0.5">90% Firm</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-gray-400 text-[10px]">Spots:</span>
                <div className="text-amber-300 font-bold mt-0.5">Minor (74%)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-gray-400 text-[10px]">Damage:</span>
                <div className="text-emerald-300 font-bold mt-0.5">Minimal (92%)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-gray-400 text-[10px]">Shape:</span>
                <div className="text-emerald-300 font-bold mt-0.5">Optimal (88%)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-gray-400 text-[10px]">Wilting:</span>
                <div className="text-amber-300 font-bold mt-0.5">Low-Mid (72%)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PLANT STRESS MONITOR (Section 26) */}
      {activeDiagnosticTab === 'stress' && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#081a10] to-[#040e08] border border-purple-500/30 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold font-display text-white">
                ⚠️ Plant Stress Monitor
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
              Stress Level: MODERATE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-gray-400 text-[10px] uppercase">Previous Moisture</span>
              <div className="text-2xl font-bold text-cyan-300 mt-1">62%</div>
              <span className="text-[10px] text-gray-500">Optimal baseline</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-gray-400 text-[10px] uppercase">Current Moisture</span>
              <div className="text-2xl font-bold text-amber-300 mt-1">34%</div>
              <span className="text-[10px] text-amber-400">-28% drop over 36 hours</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-gray-400 text-[10px] uppercase">Temperature Delta</span>
              <div className="text-2xl font-bold text-rose-400 mt-1">+5°C</div>
              <span className="text-[10px] text-rose-300">Above seasonal average</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-xs font-sans text-purple-200">
            <strong>AI Diagnostics:</strong> "Possible plant stress detected due to accelerated evapotranspiration and declining rhizosphere moisture. Stomatal conductances are beginning to compensate. Watering recommendation stands at 350 mL."
          </div>
        </div>
      )}
    </div>
  );
};
