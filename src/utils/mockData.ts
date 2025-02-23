import { Alert, GridZone, PowerGridMetrics, Prediction, WeatherImpact } from '../types';

function generateWeatherData(): WeatherImpact {
  const temperature = 15 + Math.random() * 20;
  const windSpeed = 2 + Math.random() * 8;
  const solarIrradiance = 200 + Math.random() * 800;

  return {
    temperature,
    windSpeed,
    solarIrradiance,
    impact: {
      solar: 0.3 + Math.random() * 0.7,
      wind: 0.4 + Math.random() * 0.6,
      demand: 0.5 + Math.random() * 0.5
    }
  };
}

function generatePrediction(): Prediction {
  const recommendations = [
    'Optimize renewable energy distribution in Zone C',
    'Schedule maintenance for Zone A transformers',
    'Reduce peak load in industrial sectors',
    'Increase solar panel efficiency in Zone B',
    'Balance load distribution across zones',
    'Adjust wind turbine angles for optimal performance',
    'Prepare for weather-related demand surge'
  ];

  return {
    expectedLoad: 70 + Math.random() * 15,
    expectedEfficiency: 88 + Math.random() * 5,
    recommendations: recommendations.slice(0, 2 + Math.floor(Math.random() * 3)),
    confidenceScore: 0.85 + Math.random() * 0.1,
    weatherAdjustedOutput: {
      solar: 400 + Math.random() * 600,
      wind: 300 + Math.random() * 400
    }
  };
}

export function generateMockData(points: number): PowerGridMetrics[] {
  const data: PowerGridMetrics[] = [];
  const now = new Date();

  for (let i = 0; i < points; i++) {
    const timestamp = new Date(now.getTime() - (points - i) * 60000).toISOString();
    data.push({
      timestamp,
      consumption: 2000 + Math.random() * 1000,
      production: 2200 + Math.random() * 1000,
      renewable: 40 + Math.random() * 20,
      conventional: 60 - Math.random() * 20,
      efficiency: 85 + Math.random() * 10,
      load: 65 + Math.random() * 20,
      alerts: [],
      predictions: generatePrediction(),
      weather: generateWeatherData()
    });
  }

  return data;
}

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'danger',
    message: 'Critical load detected in Zone A - Immediate attention required',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'warning',
    message: 'Efficiency dropping in renewable energy sector',
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: '3',
    type: 'info',
    message: 'AI Prediction: Potential efficiency improvement opportunity in Zone C',
    timestamp: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: '4',
    type: 'info',
    message: 'Weather alert: High wind conditions affecting turbine performance',
    timestamp: new Date(Date.now() - 750000).toISOString(),
  },
  {
    id: '5',
    type: 'info',
    message: 'Scheduled maintenance completed for Zone C',
    timestamp: new Date(Date.now() - 900000).toISOString(),
  }
];

export const mockFaults = [
  {
    id: 'f1',
    zoneId: '1',
    type: 'voltage_drop',
    severity: 'high',
    location: 'Transformer Station A-3',
    timestamp: new Date().toISOString(),
    affectedUsers: 2345,
    readings: {
      voltage: 198, // Volts (Normal: 220-240V)
      current: 95.5, // Amps
      frequency: 49.2, // Hz (Normal: 50Hz)
      powerFactor: 0.82 // (Normal: >0.95)
    },
    description: 'Severe voltage drop detected at main transformer. Emergency intervention required.'
  },
  {
    id: 'f2',
    zoneId: '3',
    type: 'overload',
    severity: 'medium',
    location: 'Distribution Hub B-7',
    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    affectedUsers: 1250,
    readings: {
      voltage: 235,
      current: 150.2,
      frequency: 50.1,
      powerFactor: 0.88
    },
    description: 'Sustained high current load detected. Load balancing recommended.'
  },
  {
    id: 'f3',
    zoneId: '6',
    type: 'equipment_failure',
    severity: 'low',
    location: 'Solar Array C-12',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    affectedUsers: 450,
    readings: {
      voltage: 228,
      current: 45.8,
      frequency: 50.0,
      powerFactor: 0.94,
      temperature: 78 // °C
    },
    description: 'Inverter efficiency degradation detected. Maintenance inspection recommended.'
  }
];

export const mockZones: GridZone[] = [
  {
    id: '1',
    name: 'Zone A',
    status: 'critical',
    load: 92,
    efficiency: 78,
    faults: [mockFaults[0]],
    prediction: {
      loadTrend: 'increasing',
      nextHourLoad: 95,
      maintenanceScore: 0.35, // Low score indicates maintenance needed
      failureProbability: 0.82 // High probability of failure
    }
  },
  {
    id: '2',
    name: 'Zone B',
    status: 'normal',
    load: 65,
    efficiency: 89,
    faults: [],
    prediction: {
      loadTrend: 'stable',
      nextHourLoad: 67,
      maintenanceScore: 0.92,
      failureProbability: 0.05
    }
  },
  {
    id: '3',
    name: 'Zone C',
    status: 'warning',
    load: 78,
    efficiency: 82,
    faults: [mockFaults[1]],
    prediction: {
      loadTrend: 'decreasing',
      nextHourLoad: 72,
      maintenanceScore: 0.65,
      failureProbability: 0.45
    }
  },
  {
    id: '4',
    name: 'Zone D',
    status: 'normal',
    load: 45,
    efficiency: 95,
    faults: [],
    prediction: {
      loadTrend: 'stable',
      nextHourLoad: 46,
      maintenanceScore: 0.88,
      failureProbability: 0.08
    }
  },
  {
    id: '5',
    name: 'Zone E',
    status: 'normal',
    load: 58,
    efficiency: 91,
    faults: [],
    prediction: {
      loadTrend: 'increasing',
      nextHourLoad: 63,
      maintenanceScore: 0.85,
      failureProbability: 0.12
    }
  },
  {
    id: '6',
    name: 'Zone F',
    status: 'warning',
    load: 82,
    efficiency: 76,
    faults: [mockFaults[2]],
    prediction: {
      loadTrend: 'decreasing',
      nextHourLoad: 77,
      maintenanceScore: 0.58,
      failureProbability: 0.35
    }
  }
];