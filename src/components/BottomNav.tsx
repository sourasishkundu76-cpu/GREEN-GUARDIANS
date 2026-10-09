import React from 'react';
import { Home, Sprout, FlaskConical, Bot, BarChart3, Settings } from 'lucide-react';

export type NavTab = 'home' | 'plants' | 'soil' | 'doctor' | 'analytics' | 'settings';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  plantAttentionCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  plantAttentionCount = 1,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'plants' as NavTab, label: 'Plants', icon: Sprout, badge: plantAttentionCount > 0 ? plantAttentionCount : undefined },
    { id: 'soil' as NavTab, label: 'Soil Lab', icon: FlaskConical },
    { id: 'doctor' as NavTab, label: 'AI Doctor', icon: Bot, isAi: true },
    { id: 'analytics' as NavTab, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 py-2 sm:py-3 bg-[#05130b]/90 backdrop-blur-xl border-t border-emerald-500/20">
      <div className="max-w-xl mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 sm:px-4 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-white'
                  : 'text-emerald-300/50 hover:text-emerald-200'
              }`}
            >
              {/* Active top glow bar */}
              {isActive && (
                <div className="absolute -top-2 w-8 h-1 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
              )}

              <div className="relative">
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive
                      ? tab.isAi
                        ? 'bg-gradient-to-tr from-cyan-500/30 to-emerald-500/30 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5 sm:w-5 sm:h-5" />
                </div>

                {tab.badge && !isActive && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-bold flex items-center justify-center font-mono">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] font-medium mt-1 font-mono tracking-tight transition-all ${
                  isActive ? 'text-white font-semibold' : 'text-emerald-400/60'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
