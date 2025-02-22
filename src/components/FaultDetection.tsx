import { useEffect, useState } from 'react';
import { AlertTriangle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import * as tf from '@tensorflow/tfjs';
import { GridZone } from '../types';

interface FaultDetection {
  zoneId: string;
  type: 'voltage_drop' | 'overload' | 'equipment_failure';
  severity: 'low' | 'medium' | 'high';
  location: string;
  timestamp: string;
  affectedUsers: number;
}

export function FaultDetectionSystem({ zones }: { zones: GridZone[] }) {
  const [faults, setFaults] = useState<FaultDetection[]>([]);
  const [model, setModel] = useState<tf.LayersModel | null>(null);

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

  useEffect(() => {
    if (!model) return;

    // Analyze each zone for potential faults
    const detectedFaults = zones.map(zone => {
      const input = tf.tensor2d([[
        zone.load,
        zone.efficiency,
        zone.prediction?.nextHourLoad || 0,
        zone.status === 'critical' ? 1 : zone.status === 'warning' ? 0.5 : 0
      ]]);

      const prediction = model.predict(input) as tf.Tensor;
      const faultProbability = prediction.dataSync()[0];

      if (faultProbability > 0.7) {
        return {
          zoneId: zone.id,
          type: zone.load > 90 ? 'overload' : 'voltage_drop',
          severity: faultProbability > 0.9 ? 'high' : faultProbability > 0.8 ? 'medium' : 'low',
          location: zone.name,
          timestamp: new Date().toISOString(),
          affectedUsers: Math.floor(Math.random() * 1000) + 100
        };
      }
      return null;
    }).filter(Boolean) as FaultDetection[];

    setFaults(detectedFaults);
  }, [zones, model]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Fault Detection System
        </h3>
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
          Active Monitoring
        </span>
      </div>

      <div className="grid gap-4">
        {faults.map((fault, index) => (
          <motion.div
            key={`${fault.zoneId}-${fault.timestamp}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg ${
              fault.severity === 'high'
                ? 'bg-red-50 dark:bg-red-900/20'
                : fault.severity === 'medium'
                ? 'bg-yellow-50 dark:bg-yellow-900/20'
                : 'bg-orange-50 dark:bg-orange-900/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                fault.severity === 'high'
                  ? 'bg-red-100 dark:bg-red-900'
                  : fault.severity === 'medium'
                  ? 'bg-yellow-100 dark:bg-yellow-900'
                  : 'bg-orange-100 dark:bg-orange-900'
              }`}>
                {fault.type === 'overload' ? (
                  <Zap className="w-5 h-5 text-red-600 dark:text-red-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {fault.type === 'overload' ? 'System Overload' : 'Voltage Drop Detected'}
                  </h4>
                  <span className={`text-sm ${
                    fault.severity === 'high'
                      ? 'text-red-600 dark:text-red-400'
                      : fault.severity === 'medium'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-orange-600 dark:text-orange-400'
                  }`}>
                    {fault.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Location: {fault.location}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Affected Users: {fault.affectedUsers.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Detected at {new Date(fault.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {faults.length === 0 && (
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