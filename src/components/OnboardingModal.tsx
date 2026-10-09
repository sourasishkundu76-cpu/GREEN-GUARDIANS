import React, { useState } from 'react';
import { Sprout, Cpu, CloudSun, CheckCircle2, ArrowRight, ArrowLeft, X, Sparkles, Droplets, ShieldCheck } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Meet Your Digital Plant Guardian',
      subtitle: 'INTELLIGENT BOTANICAL CO-PILOT',
      description:
        'GREEN GUARDIANS combines capacitive multi-depth soil probes, machine learning diagnostics, and automated irrigation to understand your plants in real time.',
      icon: Sprout,
      accent: 'emerald',
      detailBadge: 'AI + IoT Closed Feedback Loop',
      bullets: [
        'Continuous 24/7 moisture, pH & NPK telemetry',
        'AI Plant Doctor leaf diagnosis with computer vision',
        'Autonomous micro-irrigation controller',
      ],
    },
    {
      title: 'Connect Your Smart Soil Device',
      subtitle: 'ESP32 NODE 01 HARDWARE',
      description:
        'Insert the industrial multi-depth sensor probe into your soil substrate. Your ESP32 node auto-connects to cloud telemetry via Wi-Fi/MQTT.',
      icon: Cpu,
      accent: 'cyan',
      detailBadge: '8/8 Calibrated Sensors Ready',
      bullets: [
        'Capacitive soil moisture & dielectric EC probe',
        'Optical NPK mineral spectrometer & analog pH glass electrode',
        'Waterproof PT100 soil temperature & ambient RH monitor',
      ],
    },
    {
      title: 'Let AI Understand Your Plant',
      subtitle: 'MULTI-MODAL SYNTHESIS',
      description:
        'Our decision engine correlates soil telemetry, hyper-local weather forecasts, and plant genetic profiles before taking any action.',
      icon: CloudSun,
      accent: 'teal',
      detailBadge: 'Soil + Plant + Weather + AI',
      bullets: [
        'Weather-aware rain anticipation delays wasteful watering',
        'Species-specific nutrient cation requirements',
        'Predictive stress warnings 18 hours in advance',
      ],
    },
    {
      title: 'Grow Smarter & Automate',
      subtitle: 'SENSE → ANALYZE → PREDICT → ACT',
      description:
        'Experience closed-loop automated plant care. When moisture dips, the ESP32 relay dispenses the exact hydration dose, verifies the result, and learns.',
      icon: ShieldCheck,
      accent: 'emerald',
      detailBadge: 'Target Hydration Restored',
      bullets: [
        'Save up to 40% water with predictive micro-dosing',
        'One-click comprehensive PDF/print health reports',
        'Sustainability index scoring for eco-conscious cultivation',
      ],
    },
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#091a11] border border-emerald-500/30 p-6 sm:p-8 text-white shadow-[0_0_50px_rgba(16,185,129,0.2)] overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar with step indicators & close */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? 'w-8 bg-emerald-400'
                    : idx < currentStep
                    ? 'w-3 bg-emerald-600'
                    : 'w-3 bg-white/10'
                }`}
              />
            ))}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Illustration */}
        <div className="flex flex-col items-center text-center my-4">
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-950 to-teal-900 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4">
            <StepIcon className="w-10 h-10 text-emerald-400" />
            <Sparkles className="w-4 h-4 text-cyan-300 absolute -top-1 -right-1" />
          </div>

          <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase font-semibold">
            {step.subtitle}
          </span>
          <h2 className="text-2xl font-bold mt-1 text-white font-display">
            {step.title}
          </h2>
          <p className="mt-3 text-sm text-gray-300 leading-relaxed max-w-md">
            {step.description}
          </p>
        </div>

        {/* Feature points */}
        <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-4 my-4 space-y-2">
          {step.bullets.map((bullet, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-emerald-500/20 mt-6">
          {currentStep > 0 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-gray-400 hover:text-white cursor-pointer"
            >
              Skip Onboarding
            </button>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-bold text-xs font-mono flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
