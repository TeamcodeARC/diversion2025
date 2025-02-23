import { useEffect, useState } from 'react';
import { AlertTriangle, Zap, Thermometer, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import * as tf from '@tensorflow/tfjs';
import { GridZone, FaultDetection } from '../types';
import { mockFaults } from '../utils/mockData';

interface FaultDetectionSystemProps {
  zones: GridZone[];
}

export function FaultDetectionSystem({ zones }: FaultDetectionSystemProps) {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [activeFaults, setActiveFaults] = useState<FaultDetection[]>(mockFaults);

  useEffect(() => {
    async function loadModel() {
      // Simple anomaly detection model
      const model = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [4], units: 8, activation: 'relu' }),
          tf.layers.dense({ units: 4, activation: 'relu' }),
          tf.layers.dense({ units: 1, activation: 'sigmoid' })
        ]
      });
      setModel(model);
    }
    loadModel();
  }, []);

  const getFaultIcon = (type: FaultDetection['type']) => {
    switch (type) {
      case 'voltage_drop':
        return <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'overload':
        return <Activity className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'equipment_failure':
        return <Thermometer className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
    }
  };

  const getSeverityColor = (severity: FaultDetection['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'bg-orange-50 dark:bg-orange-900/20';
    }
  };

  const getReadingStatus = (reading: number, type: string) => {
    const thresholds = {
      voltage: { min: 220, max: 240 },
      frequency: { min: 49.5, max: 50.5 },
      powerFactor: { min: 0.95, max: 1 }
    };

    const threshold = thresholds[type as keyof typeof thresholds];
    if (!threshold) return 'text-gray-600 dark:text-gray-400';

    if (reading < threshold.min || reading > threshold.max) {
      return 'text-red-600 dark:text-red-400';
    }
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Fault Detection System
        </h3>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
            Active Monitoring
          </span>
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
            {activeFaults.length} Active Faults
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {activeFaults.map((fault, index) => (
          <motion.div
            key={fault.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg ${getSeverityColor(fault.severity)}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                fault.severity === 'high'
                  ? 'bg-red-100 dark:bg-red-900'
                  : fault.severity === 'medium'
                  ? 'bg-yellow-100 dark:bg-yellow-900'
                  : 'bg-orange-100 dark:bg-orange-900'
              }`}>
                {getFaultIcon(fault.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {fault.description}
                  </h4>
                  <span className={`text-sm font-medium ${
                    fault.severity === 'high'
                      ? 'text-red-600 dark:text-red-400'
                      : fault.severity === 'medium'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-orange-600 dark:text-orange-400'
                  }`}>
                    {fault.severity.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Location: {fault.location}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Affected Users: {fault.affectedUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className={getReadingStatus(fault.readings.voltage, 'voltage')}>
                      <span className="font-medium">Voltage</span>
                      <p>{fault.readings.voltage}V</p>
                    </div>
                    <div className={getReadingStatus(fault.readings.frequency, 'frequency')}>
                      <span className="font-medium">Frequency</span>
                      <p>{fault.readings.frequency}Hz</p>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Current</span>
                      <p>{fault.readings.current}A</p>
                    </div>
                    <div className={getReadingStatus(fault.readings.powerFactor, 'powerFactor')}>
                      <span className="font-medium">PF</span>
                      <p>{fault.readings.powerFactor}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Detected at {new Date(fault.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {activeFaults.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              No faults detected. All systems operating normally.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}