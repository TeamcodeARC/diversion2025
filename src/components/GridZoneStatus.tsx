import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { GridZone } from '../types';

interface GridZoneStatusProps {
  zones: GridZone[];
}

export function GridZoneStatus({ zones }: GridZoneStatusProps) {
  const getStatusColor = (status: GridZone['status']) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const getTrendIcon = (trend?: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {zones.map((zone, index) => (
        <motion.div
          key={zone.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(zone.status)}`} />
            <h3 className="font-medium text-gray-800 dark:text-gray-200">{zone.name}</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Load:</span>
              <div className="flex items-center gap-1">
                <span className="text-gray-800 dark:text-gray-200">{zone.load}%</span>
                {zone.prediction && getTrendIcon(zone.prediction.loadTrend)}
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Efficiency:</span>
              <span className="text-gray-800 dark:text-gray-200">{zone.efficiency}%</span>
            </div>
            {zone.prediction && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Next Hour:</span>
                <span className="text-gray-800 dark:text-gray-200">
                  {zone.prediction.nextHourLoad}%
                </span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}