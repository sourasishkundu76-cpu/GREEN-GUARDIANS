export type PlantHealthStatus = 'healthy' | 'attention' | 'critical' | 'monitoring';

export interface SensorData {
  moisture: number; // percentage (0-100)
  ph: number; // 0-14
  nitrogen: 'LOW' | 'OPTIMAL' | 'HIGH';
  nitrogenValue: number; // mg/kg
  phosphorus: 'LOW' | 'OPTIMAL' | 'HIGH';
  phosphorusValue: number; // mg/kg
  potassium: 'LOW' | 'OPTIMAL' | 'HIGH';
  potassiumValue: number; // mg/kg
  temperature: number; // °C
  humidity: number; // %
  light: number; // lux
  ec: 'NORMAL' | 'ELEVATED' | 'LOW';
  ecValue: number; // dS/m
  timestamp: string;
}

export interface HistoricalReading {
  time: string;
  moisture: number;
  ph: number;
  temperature: number;
  humidity: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  waterUsedMl: number;
}

export interface GrowthRecord {
  day: number;
  date: string;
  heightCm: number;
  leafCount: number;
  stage: string;
  imageUrl?: string;
  growthDeltaPercent: number;
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  variety: string;
  emoji: string;
  healthScore: number;
  soilScore: number;
  waterStatus: number;
  growthRate: number; // +8.4%
  pestRisk: 'Low' | 'Moderate' | 'High';
  diseaseRisk: 'Low' | 'Moderate' | 'High';
  aiStatus: string;
  stage: 'Seedling' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Mature';
  plantedDate: string;
  optimalRanges: {
    moistureMin: number;
    moistureMax: number;
    phMin: number;
    phMax: number;
    tempMin: number;
    tempMax: number;
    idealN: string;
    idealP: string;
    idealK: string;
  };
  sensors: SensorData;
  history: HistoricalReading[];
  growthTimeline: GrowthRecord[];
  carePlan: CarePlanTask[];
  suitabilityScore: number;
  suitabilityChecks: {
    ph: boolean;
    temp: boolean;
    moisture: boolean;
    nitrogen: boolean;
    potassium: boolean;
  };
}

export interface CarePlanTask {
  id: string;
  time: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  category: 'water' | 'inspect' | 'sunlight' | 'soil' | 'nutrient';
}

export interface SystemStatus {
  esp32: 'connected' | 'offline' | 'reconnecting';
  cloud: 'online' | 'degraded' | 'offline';
  sensorsCount: { operational: number; total: number };
  waterPump: 'ready' | 'active' | 'error';
  reservoirLevel: number; // percentage
  reservoirCapacityLiters: number;
  batteryLevel: number; // %
  wifiRssi: number; // dBm
  lastUpdateSecondsAgo: number;
  autoIrrigationEnabled: boolean;
  waterSavingMode: boolean;
  moistureThreshold: number;
}

export interface WeatherInfo {
  temp: number;
  humidity: number;
  condition: string;
  rainProbability: number;
  forecastSummary: string;
  irrigationAdvice: string;
  delayRecommended: boolean;
  waterSavedEstimateMl: number;
}

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  plantId?: string;
  read: boolean;
  actionRequired?: string;
}

export interface DiagnosticResult {
  diagnosisType: 'pest' | 'disease' | 'leaf_health' | 'general';
  detectedIssue: string;
  confidence: number;
  risk: 'Low' | 'Moderate' | 'High' | 'Severe';
  leafHealthScore?: number;
  symptoms: string[];
  possibleCauses: string[];
  recommendedSteps: string[];
  treatmentGuidance: string;
  disclaimer: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  diagnostic?: DiagnosticResult;
  suggestedActions?: string[];
}
