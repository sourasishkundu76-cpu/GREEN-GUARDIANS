import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  Cloud,
  BrainCircuit,
  Zap,
  Droplets,
  Sprout,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClosedLoopVisualizerProps {
  onTriggerWatering?: (amountMl: number) => void;
  currentMoisture?: number;
}

export const ClosedLoopVisualizer: React.FC<ClosedLoopVisualizerProps> = ({
  onTriggerWatering,
  currentMoisture = 42,
}) => {
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [liveMoisture, setLiveMoisture] = useState<number>(currentMoisture);
  const [pumpActive, setPumpActive] = useState<boolean>(false);

  const loopSteps = [
    {
      id: 'sense',
      title: 'SENSE',
      subtitle: 'ESP32 Soil Probe',
      desc: 'Capacitive probe records 29% moisture (below 50% threshold).',
      icon: Activity,
      color: 'text-cyan-400',
      border: 'border-cyan-500',
      bg: 'bg-cyan-950/40',
    },
    {
      id: 'analyze',
      title: 'ANALYZE',
      subtitle: 'Cloud AI Telemetry',
      desc: 'Transpiration index, pH 6.4 and NPK levels evaluated.',
      icon: Cloud,
      color: 'text-blue-400',
      border: 'border-blue-500',
      bg: 'bg-blue-950/40',
    },
    {
      id: 'predict',
      title: 'PREDICT',
      subtitle: 'Weather Engine',
      desc: 'Rain chance 20%. No natural precipitation expected.',
      icon: BrainCircuit,
      color: 'text-purple-400',
      border: 'border-purple-500',
      bg: 'bg-purple-950/40',
    },
    {
      id: 'decide',
      title: 'DECIDE',
      subtitle: 'Decision Engine',
      desc: 'Dosing calculated: 350 mL evening root replenishment.',
      icon: Zap,
      color: 'text-amber-400',
      border: 'border-amber-500',
      bg: 'bg-amber-950/40',
    },
    {
      id: 'act',
      title: 'ACT',
      subtitle: 'Relay & Pump',
      desc: 'ESP32 fires relay. Precision pump dispenses 350 mL.',
      icon: Droplets,
      color: 'text-emerald-400',
      border: 'border-emerald-500',
      bg: 'bg-emerald-950/40',
    },
    {
      id: 'verify',
      title: 'VERIFY',
      subtitle: 'Probe Re-check',
      desc: 'Moisture rises to 52%. Hydration verified at root depth.',
      icon: CheckCircle2,
      color: 'text-teal-400',
      border: 'border-teal-500',
      bg: 'bg-teal-950/40',
    },
    {
      id: 'learn',
      title: 'LEARN',
      subtitle: 'Reinforcement AI',
      desc: 'Telemetry stored. Absorption curves updated for next cycle.',
      icon: Sprout,
      color: 'text-emerald-300',
      border: 'border-emerald-400',
      bg: 'bg-emerald-950/60',
    },
  ];

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(0);
    setLiveMoisture(29);

    const stepInterval = 1400;

    // Step 0: Sense
    setTimeout(() => {
      setActiveStep(1); // Analyze
    }, stepInterval);

    setTimeout(() => {
      setActiveStep(2); // Predict
    }, stepInterval * 2);

    setTimeout(() => {
      setActiveStep(3); // Decide
    }, stepInterval * 3);

    setTimeout(() => {
      setActiveStep(4); // Act
      setPumpActive(true);
      if (onTriggerWatering) onTriggerWatering(350);
    }, stepInterval * 4);

    setTimeout(() => {
      setActiveStep(5); // Verify
      setPumpActive(false);
      setLiveMoisture(52);
    }, stepInterval * 5);

    setTimeout(() => {
      setActiveStep(6); // Learn
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#10b981', '#06b6d4', '#a7f3d0'],
        });
      } catch (e) {}
    }, stepInterval * 6);

    setTimeout(() => {
      setIsRunning(false);
    }, stepInterval * 7.5);
  };

  const resetLoop = () => {
    setActiveStep(-1);
    setIsRunning(false);
    setPumpActive(false);
    setLiveMoisture(currentMoisture);
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-[#07170e] via-[#05110a] to-[#030905] border border-emerald-500/30 p-5 sm:p-7 text-white shadow-2xl overflow-hidden">
      {/* Background cyber grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
              CLOSED FEEDBACK ARCHITECTURE
            </span>
            {pumpActive && (
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-400 text-[10px] font-mono text-cyan-300 flex items-center gap-1 animate-pulse">
                <Droplets className="w-3 h-3 text-cyan-400 animate-bounce" />
                PUMP RELAY ACTIVE
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold font-display mt-1 text-white">
            Real-Time Closed-Loop Automation
          </h3>
          <p className="text-xs text-emerald-200/70 font-mono mt-0.5">
            SENSE → ANALYZE → PREDICT → DECIDE → ACT → VERIFY → LEARN
          </p>
        </div>

        {/* Action Trigger Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              isRunning
                ? 'bg-emerald-950 text-emerald-400/50 border border-emerald-500/20 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-emerald-500/20'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running Loop Cycle...' : 'Simulate Dry Soil Loop'}</span>
          </button>

          {activeStep !== -1 && (
            <button
              onClick={resetLoop}
              disabled={isRunning}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Live Simulated Probe Status Bar */}
      <div className="mb-6 p-3 rounded-2xl bg-black/50 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-gray-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Soil Saturation:</span>
            <span
              className={`font-bold transition-colors ${
                liveMoisture < 35
                  ? 'text-amber-400'
                  : liveMoisture < 50
                  ? 'text-cyan-300'
                  : 'text-emerald-400'
              }`}
            >
              {liveMoisture}%
            </span>
          </div>
          <span className="text-emerald-500/30">|</span>
          <div className="flex items-center gap-1.5 text-gray-300">
            <span>Water Pump:</span>
            <span className={`font-bold ${pumpActive ? 'text-cyan-400 animate-pulse' : 'text-gray-400'}`}>
              {pumpActive ? 'DISPENSING (350 mL)' : 'STANDBY'}
            </span>
          </div>
        </div>

        <div className="text-emerald-300/80 text-[11px]">
          Target: <span className="font-bold text-white">50–70% Optimal</span>
        </div>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5 relative">
        {loopSteps.map((step, idx) => {
          const StepIcon = step.icon;
          const isCurrent = activeStep === idx;
          const isDone = activeStep > idx;

          return (
            <div
              key={step.id}
              className={`relative rounded-2xl p-3 border transition-all duration-300 flex flex-col justify-between ${
                isCurrent
                  ? `${step.bg} ${step.border} shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.03]`
                  : isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 opacity-90'
                  : 'bg-black/30 border-white/5 opacity-60'
              }`}
            >
              {/* Step indicator pill */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-gray-400">
                  0{idx + 1}
                </span>
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    isCurrent
                      ? 'bg-white/10 text-white animate-bounce'
                      : isDone
                      ? 'text-emerald-400'
                      : 'text-gray-500'
                  }`}
                >
                  <StepIcon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className={`text-xs font-bold font-display tracking-wider ${isCurrent ? 'text-white' : step.color}`}>
                  {step.title}
                </div>
                <div className="text-[10px] text-gray-300/90 font-mono mt-0.5">
                  {step.subtitle}
                </div>
                <div className="text-[10px] text-gray-400 mt-1 leading-tight line-clamp-3">
                  {step.desc}
                </div>
              </div>

              {/* Status footer inside step card */}
              <div className="mt-2 pt-2 border-t border-white/5 text-[9px] font-mono">
                {isCurrent ? (
                  <span className="text-cyan-300 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    EXECUTING
                  </span>
                ) : isDone ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> VERIFIED
                  </span>
                ) : (
                  <span className="text-gray-600">IDLE</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
