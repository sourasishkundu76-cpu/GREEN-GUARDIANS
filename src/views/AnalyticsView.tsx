import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Droplets,
  FlaskConical,
  Activity,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Plant, SystemStatus } from '../types';

interface AnalyticsViewProps {
  plants: Plant[];
  systemStatus: SystemStatus;
  isDarkMode: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  plants,
  systemStatus,
}) => {
  const [selectedPlantIndex, setSelectedPlantIndex] = useState(0);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'custom'>('week');
  const [activeMetric, setActiveMetric] = useState<'moisture' | 'ph' | 'npk' | 'temp' | 'health'>('moisture');

  const activePlant = plants[selectedPlantIndex] || plants[0];

  // Telemetry time-series points
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const moisturePoints = [58, 54, 49, 44, 41, 46, 42];
  const phPoints = [6.5, 6.4, 6.5, 6.3, 6.4, 6.4, 6.4];
  const tempPoints = [24, 25, 26, 28, 27, 26, 27];
  const healthPoints = [89, 88, 87, 85, 86, 88, 87];

  // 7-Day Forecast Points (Section 32)
  const forecastDays = ['Today', '+1d', '+2d', '+3d', '+4d', '+5d', '+6d'];
  const forecastTrend = [87, 86, 85, 88, 89, 90, 89];

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header (Section 30) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#07190e] to-teal-950/40 border border-emerald-500/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              TIME-SERIES BIOSENSOR ANALYTICS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
            Analytics Center
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 font-mono mt-0.5">
            Historical telemetry, water conservation metrics & 7-day predictive forecasting.
          </p>
        </div>

        {/* Timeframe pill selector */}
        <div className="flex items-center gap-1 bg-black/40 p-1.5 rounded-2xl border border-emerald-500/20 text-xs font-mono">
          {(['day', 'week', 'month', 'custom'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-xl uppercase transition-all cursor-pointer ${
                timeframe === t
                  ? 'bg-emerald-500 text-black font-bold shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Water Consumption Analytics (Section 31) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#06170e] to-[#040e08] border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h2 className="text-base font-bold font-display text-white">
              Water Consumption & Closed-Loop Savings
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
            PUMP RUNTIME: 4m 32s
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-gray-400 text-[10px] uppercase">Today</span>
            <div className="text-xl font-bold text-white mt-1">1.2 L</div>
            <span className="text-[10px] text-emerald-400">Target reached</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-gray-400 text-[10px] uppercase">This Week</span>
            <div className="text-xl font-bold text-white mt-1">8.4 L</div>
            <span className="text-[10px] text-gray-500">6 micro-cycles</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-gray-400 text-[10px] uppercase">This Month</span>
            <div className="text-xl font-bold text-white mt-1">32.7 L</div>
            <span className="text-[10px] text-cyan-300">Sustainable</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/30">
            <span className="text-emerald-400 text-[10px] uppercase">Water Saved</span>
            <div className="text-xl font-bold text-emerald-300 mt-1">18% Saved</div>
            <span className="text-[10px] text-emerald-400/80">Weather delay mode</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-gray-400 text-[10px] uppercase">Pump Runtime</span>
            <div className="text-xl font-bold text-white mt-1">4m 32s</div>
            <span className="text-[10px] text-gray-400">Total active pulses</span>
          </div>
        </div>
      </div>

      {/* 3. Interactive Sensor History Charts (Section 30) */}
      <div className="p-6 rounded-3xl bg-[#081a10] border border-emerald-500/30 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold font-display text-white">
              Telemetry Trend Spectrum: {activePlant.name}
            </h3>
          </div>

          {/* Metric selector buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
            {(['moisture', 'ph', 'temp', 'health'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setActiveMetric(m)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
                  activeMetric === m
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 font-bold'
                    : 'bg-black/30 text-gray-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* High-Tech Bar Chart Visualization */}
        <div className="h-56 p-4 rounded-2xl bg-black/50 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 pb-2 border-b border-white/5">
            <span>
              Metric: <strong className="text-white uppercase">{activeMetric}</strong>
            </span>
            <span>
              Current: <strong className="text-emerald-400">{activePlant.sensors.moisture}%</strong> (Target: 50–70%)
            </span>
          </div>

          {/* Bars */}
          <div className="flex items-end justify-between gap-2 h-36 pt-4">
            {daysOfWeek.map((day, idx) => {
              const val =
                activeMetric === 'moisture'
                  ? moisturePoints[idx]
                  : activeMetric === 'ph'
                  ? phPoints[idx] * 12
                  : activeMetric === 'temp'
                  ? tempPoints[idx] * 3
                  : healthPoints[idx];

              const displayLabel =
                activeMetric === 'moisture'
                  ? `${moisturePoints[idx]}%`
                  : activeMetric === 'ph'
                  ? `${phPoints[idx]}`
                  : activeMetric === 'temp'
                  ? `${tempPoints[idx]}°C`
                  : `${healthPoints[idx]}%`;

              return (
                <div key={day} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-mono text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {displayLabel}
                  </span>
                  <div
                    className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-400 group-hover:to-cyan-300 transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    style={{ height: `${Math.min(100, Math.max(15, val))}%` }}
                  />
                  <span className="text-[10px] font-mono text-gray-400 mt-2">{day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. 7-Day Plant Health Forecast & Future Risk Prediction (Section 32 & 33) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 7-Day Health Forecast */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-gradient-to-br from-[#07190e] to-[#040e08] border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold font-display text-white">
                🔮 7-Day Plant Health Forecast
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/30 text-[10px] font-mono text-purple-300">
              PREDICTION CONE: 84–90%
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-black/40 border border-white/5 text-center text-xs font-mono">
            <div>
              <span className="text-gray-400 text-[10px]">Current Health</span>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">87%</div>
            </div>
            <div>
              <span className="text-gray-400 text-[10px]">Predicted Trajectory</span>
              <div className="text-lg font-bold text-cyan-300 mt-0.5">84–90%</div>
            </div>
            <div>
              <span className="text-gray-400 text-[10px]">Primary Risk Vector</span>
              <div className="text-lg font-bold text-amber-300 mt-0.5">Low moisture</div>
            </div>
          </div>

          {/* Forecasting trend timeline */}
          <div className="h-32 p-3 rounded-2xl bg-black/40 border border-white/5 flex items-end justify-between gap-2">
            {forecastDays.map((fDay, i) => (
              <div key={fDay} className="flex-1 flex flex-col items-center h-full justify-end">
                <span className="text-[10px] font-mono text-cyan-300 mb-1">{forecastTrend[i]}%</span>
                <div
                  className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-purple-600 to-cyan-400"
                  style={{ height: `${(forecastTrend[i] / 100) * 100}%` }}
                />
                <span className="text-[10px] font-mono text-gray-400 mt-1">{fDay}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Future Risk Prediction (Section 33) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-amber-950/20 via-[#07190e] to-[#040e08] border border-amber-500/30 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
              <h3 className="text-base font-bold font-display text-white">
                ⚠️ FUTURE RISK PREDICTION
              </h3>
            </div>

            <p className="text-sm text-gray-200 leading-relaxed font-sans">
              "Moisture may fall below the optimal range within approximately <strong>18 hours</strong>."
            </p>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/20 text-xs font-mono text-amber-200 space-y-1">
              <div className="font-bold">Recommended Autonomous Action:</div>
              <p className="text-gray-300 font-sans">
                "Prepare for irrigation tomorrow morning or permit today’s scheduled 06:30 PM water cycle."
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-amber-500/20 mt-4 text-xs font-mono text-gray-400 flex items-center justify-between">
            <span>Confidence: <strong>92% Predictive Accuracy</strong></span>
            <span className="text-emerald-400">Preemptive Care</span>
          </div>
        </div>
      </div>
    </div>
  );
};
