export interface PowerGridMetrics {
  timestamp: string;
  consumption: number;
  production: number;
  renewable: number;
  conventional: number;
  efficiency: number;
  load: number;
  alerts: Alert[];
  predictions: Prediction;
  weather: WeatherImpact;
}

export interface WeatherImpact {
  temperature: number;
  windSpeed: number;
  solarIrradiance: number;
  impact: {
    solar: number;
    wind: number;
    demand: number;
  };
}

export interface Prediction {
  expectedLoad: number;
  expectedEfficiency: number;
  recommendations: string[];
  confidenceScore: number;
  weatherAdjustedOutput: {
    solar: number;
    wind: number;
  };
}

export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  message: string;
  timestamp: string;
}

export interface GridZone {
  id: string;
  name: string;
  status: 'normal' | 'warning' | 'critical';
  load: number;
  efficiency: number;
  faults?: FaultDetection[];
  prediction?: {
    loadTrend: 'increasing' | 'decreasing' | 'stable';
    nextHourLoad: number;
    maintenanceScore: number;
    failureProbability: number;
  };
}

export interface FaultDetection {
  id: string;
  zoneId: string;
  type: 'voltage_drop' | 'overload' | 'equipment_failure';
  severity: 'low' | 'medium' | 'high';
  location: string;
  timestamp: string;
  affectedUsers: number;
  readings: {
    voltage: number;
    current: number;
    frequency: number;
    powerFactor: number;
    temperature?: number;
  };
  description: string;
}