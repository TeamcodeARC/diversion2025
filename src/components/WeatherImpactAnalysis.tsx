import { motion } from 'framer-motion';
import { Cloud, Sun, Thermometer, Wind } from 'lucide-react';
import { WeatherImpact } from '../types';

interface WeatherImpactAnalysisProps {
  weather: WeatherImpact;
}

export function WeatherImpactAnalysis({ weather }: WeatherImpactAnalysisProps) {
  const getImpactColor = (impact: number) => {
    if (impact >= 0.7) return 'text-green-500';
    if (impact >= 0.4) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-500">Temperature</span>
          </div>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {weather.temperature.toFixed(1)}°C
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-500">Wind Speed</span>
          </div>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {weather.windSpeed.toFixed(1)} m/s
          </p>
        </motion.div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Resource Impact Analysis
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Solar Impact</span>
            </div>
            <span className={`text-sm font-medium ${getImpactColor(weather.impact.solar)}`}>
              {(weather.impact.solar * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Wind Impact</span>
            </div>
            <span className={`text-sm font-medium ${getImpactColor(weather.impact.wind)}`}>
              {(weather.impact.wind * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Demand Impact</span>
            </div>
            <span className={`text-sm font-medium ${getImpactColor(weather.impact.demand)}`}>
              {(weather.impact.demand * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}