/**
 * GREEN GUARDIANS
 * AI + IoT Smart Plant Care Platform
 * "Sense. Understand. Protect. Grow."
 * 
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initialPlants, initialSystemStatus, initialWeather, initialAlerts } from './data/mockData';
import { Plant, SystemStatus, WeatherInfo, AlertNotification } from './types';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { Navbar } from './components/Navbar';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { PlantsView } from './views/PlantsView';
import { SoilLabView } from './views/SoilLabView';
import { AIDoctorView } from './views/AIDoctorView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';
import { AddPlantModal } from './components/AddPlantModal';
import { HealthReportModal } from './components/HealthReportModal';
import confetti from 'canvas-confetti';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Core application state
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [plants, setPlants] = useState<Plant[]>(initialPlants);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(initialSystemStatus);
  const [weather, setWeather] = useState<WeatherInfo>(initialWeather);
  const [alerts, setAlerts] = useState<AlertNotification[]>(initialAlerts);

  // Modals state
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);
  const [selectedPlantModal, setSelectedPlantModal] = useState<Plant | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Water notification banner toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live seconds ticker for IoT status
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemStatus((prev) => ({
        ...prev,
        lastUpdateSecondsAgo: (prev.lastUpdateSecondsAgo + 1) % 30,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Water irrigation trigger handler
  const handleTriggerWatering = (amountMl: number = 350) => {
    // 1. Update pump status
    setSystemStatus((prev) => ({
      ...prev,
      waterPump: 'active',
      reservoirLevel: Math.max(10, prev.reservoirLevel - 3),
    }));

    showToast(`💧 ESP32 Relay Activated: Dispensing ${amountMl} mL to root zone...`);

    // 2. Simulate moisture rise
    setTimeout(() => {
      setPlants((prev) =>
        prev.map((p, idx) => {
          if (idx === 0) {
            // Tomato active update
            const newMoist = Math.min(68, p.sensors.moisture + 14);
            return {
              ...p,
              waterStatus: newMoist,
              sensors: {
                ...p.sensors,
                moisture: newMoist,
              },
              healthScore: Math.min(96, p.healthScore + 3),
              aiStatus: 'Target root moisture restored. Transpiration stress mitigated.',
            };
          }
          return p;
        })
      );

      setSystemStatus((prev) => ({
        ...prev,
        waterPump: 'ready',
      }));

      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.9 },
          colors: ['#06b6d4', '#10b981'],
        });
      } catch (e) {}

      showToast(`✅ Target Moisture Restored: 56% (+14%). ESP32 pump switched off.`);
    }, 2400);
  };

  // Add new plant handler
  const handleAddNewPlant = (newPlantData: Partial<Plant>) => {
    const newPlant: Plant = {
      id: `plant-${Date.now()}`,
      name: newPlantData.name || 'New Botanical',
      scientificName: newPlantData.scientificName || 'Plantae species',
      variety: newPlantData.variety || 'Custom Hybrid',
      emoji: newPlantData.emoji || '🌱',
      healthScore: 88,
      soilScore: 82,
      waterStatus: 50,
      growthRate: 6.5,
      pestRisk: 'Low',
      diseaseRisk: 'Low',
      aiStatus: 'Plant specimen verified and calibrated with ESP32 Node 01.',
      stage: 'Vegetative',
      plantedDate: 'Today',
      optimalRanges: newPlantData.optimalRanges || {
        moistureMin: 50,
        moistureMax: 70,
        phMin: 6.0,
        phMax: 6.8,
        tempMin: 20,
        tempMax: 28,
        idealN: 'OPTIMAL',
        idealP: 'OPTIMAL',
        idealK: 'OPTIMAL',
      },
      sensors: newPlantData.sensors || {
        moisture: 50,
        ph: 6.5,
        nitrogen: 'OPTIMAL',
        nitrogenValue: 60,
        phosphorus: 'OPTIMAL',
        phosphorusValue: 70,
        potassium: 'OPTIMAL',
        potassiumValue: 65,
        temperature: 25,
        humidity: 60,
        light: 8500,
        ec: 'NORMAL',
        ecValue: 1.5,
        timestamp: 'Just now',
      },
      history: [],
      growthTimeline: [{ day: 1, date: 'Today', heightCm: 10, leafCount: 6, stage: 'Initial', growthDeltaPercent: 0 }],
      carePlan: [
        { id: `cp-${Date.now()}`, time: '08:00 AM', title: 'Verify sensor depth', description: 'Ensure probe prongs contact moist substrate', icon: 'CheckCircle', completed: false, category: 'soil' },
      ],
      suitabilityScore: 92,
      suitabilityChecks: { ph: true, temp: true, moisture: true, nitrogen: true, potassium: true },
    };

    setPlants((prev) => [newPlant, ...prev]);
    showToast(`🌱 New Plant Added: ${newPlant.name} is now actively monitored!`);
  };

  const gardenHealthScore = Math.round(
    plants.reduce((sum, p) => sum + p.healthScore, 0) / plants.length
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? 'bg-[#06140b] text-emerald-50'
          : 'bg-[#f4fbf6] text-[#0f2d19]'
      }`}
    >
      {/* 1. Splash Screen */}
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            setShowSplash(false);
          }}
        />
      )}

      {/* 2. Onboarding Modal Walkthrough */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      {/* 3. Add Plant AI Scanner Modal */}
      <AddPlantModal
        isOpen={isAddPlantOpen}
        onClose={() => setIsAddPlantOpen(false)}
        onAddPlant={handleAddNewPlant}
      />

      {/* 4. AI Plant Health Report Modal */}
      <HealthReportModal
        plant={plants[0]}
        systemStatus={systemStatus}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* 5. Notification Toast Bar */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-950/95 border border-emerald-400/50 text-emerald-200 text-xs font-mono shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 6. Primary Top Header */}
      <Navbar
        systemStatus={systemStatus}
        alerts={alerts}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onTriggerWater={() => handleTriggerWatering(200)}
        onOpenOnboarding={() => setShowOnboarding(true)}
        gardenHealthScore={gardenHealthScore}
      />

      {/* 7. View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
        {currentTab === 'home' && (
          <HomeView
            plants={plants}
            systemStatus={systemStatus}
            weather={weather}
            isDarkMode={isDarkMode}
            onSelectPlant={(plant) => setSelectedPlantModal(plant)}
            onOpenAddPlant={() => setIsAddPlantOpen(true)}
            onTriggerWater={handleTriggerWatering}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'plants' && (
          <PlantsView
            plants={plants}
            systemStatus={systemStatus}
            isDarkMode={isDarkMode}
            onOpenAddPlant={() => setIsAddPlantOpen(true)}
            onSelectPlant={(plant) => setSelectedPlantModal(plant)}
            onTriggerWater={handleTriggerWatering}
            selectedPlantModal={selectedPlantModal}
            onClosePlantModal={() => setSelectedPlantModal(null)}
          />
        )}

        {currentTab === 'soil' && (
          <SoilLabView plants={plants} isDarkMode={isDarkMode} />
        )}

        {currentTab === 'doctor' && (
          <AIDoctorView
            plants={plants}
            isDarkMode={isDarkMode}
            onTriggerWater={handleTriggerWatering}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView
            plants={plants}
            systemStatus={systemStatus}
            isDarkMode={isDarkMode}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            systemStatus={systemStatus}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onUpdateSystemStatus={(up) => setSystemStatus((p) => ({ ...p, ...up }))}
            plants={plants}
          />
        )}
      </main>

      {/* 8. Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        plantAttentionCount={plants.filter((p) => p.healthScore < 80).length}
      />
    </div>
  );
}
