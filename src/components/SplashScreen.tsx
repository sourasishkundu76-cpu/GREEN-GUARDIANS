import React, { useEffect, useState } from 'react';
import { Sparkles, Cpu, Sprout, ArrowRight, Activity, Wifi } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 800);
    const t2 = setTimeout(() => setStage(2), 2000);
    const t3 = setTimeout(() => setStage(3), 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#040e08] via-[#06180e] to-[#020905] text-white overflow-hidden">
      {/* Background glowing bio-mesh grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Header Pill */}
      <div className="pt-8 flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs font-mono text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          AI + IoT ECOSYSTEM INITIALIZING
        </div>
      </div>

      {/* Central Visual: Growing Plant & Particle Flux */}
      <div className="relative flex flex-col items-center justify-center my-auto w-full max-w-md">
        {/* Glowing circular backdrop */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-600/20 via-cyan-500/20 to-emerald-400/30 blur-2xl animate-glow-pulse" />
          
          {/* Orbital Data Rings */}
          <div className="absolute inset-2 rounded-full border border-emerald-500/20 border-dashed animate-spin" style={{ animationDuration: '24s' }} />
          <div className="absolute inset-8 rounded-full border border-cyan-500/25 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '16s' }} />

          {/* Plant Icon & Hologram Core */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-b from-emerald-500/20 to-emerald-900/40 border border-emerald-400/40 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.35)] backdrop-blur-xl">
              <Sprout className="w-14 h-14 text-emerald-400 animate-bounce" style={{ animationDuration: '3s' }} />
              
              {/* Corner tech notches */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400" />
            </div>

            {/* Glowing soil baseline */}
            <div className="mt-4 w-40 h-1.5 rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981]" />
          </div>
        </div>

        {/* Closed-loop data stream path indicator */}
        <div className="mt-6 flex items-center gap-2 sm:gap-3 text-[11px] font-mono">
          <span className={`px-2 py-1 rounded transition-all duration-500 ${stage >= 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-gray-600'}`}>
            SOIL
          </span>
          <span className="text-emerald-500/60">→</span>
          <span className={`px-2 py-1 rounded transition-all duration-500 ${stage >= 1 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-600'}`}>
            SENSOR
          </span>
          <span className="text-emerald-500/60">→</span>
          <span className={`px-2 py-1 rounded transition-all duration-500 ${stage >= 2 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-gray-600'}`}>
            AI
          </span>
          <span className="text-emerald-500/60">→</span>
          <span className={`px-2 py-1 rounded transition-all duration-500 ${stage >= 3 ? 'bg-emerald-400 text-black font-bold' : 'text-gray-600'}`}>
            PLANT
          </span>
        </div>

        {/* App Title & Tagline */}
        <div className="mt-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
            GREEN <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">GUARDIANS</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-200/80 font-mono tracking-widest uppercase">
            Sense. Understand. Protect. Grow.
          </p>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="w-full max-w-sm pb-8 flex flex-col gap-3">
        <button
          onClick={onComplete}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <span>ENTER DASHBOARD</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </button>

        <div className="flex items-center justify-between text-[11px] text-emerald-400/60 font-mono">
          <span className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-emerald-400" /> ESP32 Mesh v2.4
          </span>
          <span>Build 2026.10</span>
        </div>
      </div>
    </div>
  );
};
