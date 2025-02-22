import React, { useEffect, useState } from 'react';
import { Activity, Battery, Brain, Cloud, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { AlertsList } from './components/AlertsList';
import { ConsumptionHeatmap } from './components/ConsumptionHeatmap';
import { DashboardCard } from './components/DashboardCard';
import { DeviceSimulator } from './components/DeviceSimulator';
import { FaultDetectionSystem } from './components/FaultDetection';
import { GridMap } from './components/GridMap';
import { GridZoneStatus } from './components/GridZoneStatus';
import { PowerConsumptionChart } from './components/PowerConsumptionChart';
import { PredictionInsights } from './components/PredictionInsights';
import { ThemeToggle } from './components/ThemeToggle';
import { WeatherImpactAnalysis } from './components/WeatherImpactAnalysis';
import { PowerGridMetrics } from './types';
import { mockAlerts, mockZones } from './utils/mockData';
import { getHistoricalMetrics } from './services/supabase';
import { sendAlertNotification } from './services/notifications';

function App() {
  const [data, setData] = useState<PowerGridMetrics[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<PowerGridMetrics | null>(null);

  useEffect(() => {
    // Initial data load
    async function loadData() {
      const historicalData = await getHistoricalMetrics();
      if (historicalData.length > 0) {
        setData(historicalData);
        setCurrentMetrics(historicalData[0]);
      }
    }
    loadData();

    // Refresh data every 5 minutes
    const interval = setInterval(loadData, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Send notifications for critical alerts
    const criticalAlerts = mockAlerts.filter(alert => alert.type === 'danger');
    criticalAlerts.forEach(alert => {
      sendAlertNotification(alert);
    });
  }, [mockAlerts]);

  if (!currentMetrics) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
          >
            Power Grid Management System
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400"
          >
            AI-Powered Monitoring and Analytics
          </motion.p>
        </div>
        <ThemeToggle />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <DashboardCard title="Current Load">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Zap className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {currentMetrics.load.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500">System Load</p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Efficiency">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Activity className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {currentMetrics.efficiency.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500">System Efficiency</p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Renewable Energy">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Battery className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {currentMetrics.renewable.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500">Of Total Production</p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Weather Impact">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-100 dark:bg-sky-900 rounded-lg">
              <Cloud className="w-6 h-6 text-sky-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {(currentMetrics.weather.impact.solar * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-gray-500">Solar Efficiency</p>
            </div>
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <DashboardCard title="Power Consumption & Production">
            <PowerConsumptionChart data={data} />
          </DashboardCard>
        </div>
        <DashboardCard title="Consumption Heatmap">
          <ConsumptionHeatmap zones={mockZones} />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <DashboardCard title="Grid Map View" className="lg:col-span-2">
          <GridMap zones={mockZones} />
        </DashboardCard>
        <div className="space-y-6">
          <DashboardCard title="Fault Detection">
            <FaultDetectionSystem zones={mockZones} />
          </DashboardCard>
          <DashboardCard title="Device Simulator">
            <DeviceSimulator />
          </DashboardCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCard title="Grid Zones Status">
            <GridZoneStatus zones={mockZones} />
          </DashboardCard>
        </div>
        <div className="space-y-6">
          <DashboardCard title="Weather Impact Analysis">
            <WeatherImpactAnalysis weather={currentMetrics.weather} />
          </DashboardCard>
          <DashboardCard title="AI Predictions & Insights">
            <PredictionInsights prediction={currentMetrics.predictions} />
          </DashboardCard>
          <DashboardCard title="Recent Alerts">
            <AlertsList alerts={mockAlerts} />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

export default App;