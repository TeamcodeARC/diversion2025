import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Battery, Laptop, Lightbulb, Smartphone, Tv } from 'lucide-react';

interface Device {
  id: string;
  type: 'smartphone' | 'laptop' | 'tv' | 'light' | 'battery';
  name: string;
  consumption: number;
  active: boolean;
}

export function DeviceSimulator() {
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', type: 'smartphone', name: 'Smartphone', consumption: 0.005, active: true },
    { id: '2', type: 'laptop', name: 'Laptop', consumption: 0.05, active: true },
    { id: '3', type: 'tv', name: 'TV', consumption: 0.1, active: false },
    { id: '4', type: 'light', name: 'Smart Light', consumption: 0.01, active: true },
    { id: '5', type: 'battery', name: 'Battery Storage', consumption: -0.5, active: true },
  ]);

  const [totalConsumption, setTotalConsumption] = useState(0);

  useEffect(() => {
    const active = devices.filter(d => d.active);
    const total = active.reduce((sum, device) => sum + device.consumption, 0);
    setTotalConsumption(total);
  }, [devices]);

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'smartphone':
        return <Smartphone className="w-6 h-6" />;
      case 'laptop':
        return <Laptop className="w-6 h-6" />;
      case 'tv':
        return <Tv className="w-6 h-6" />;
      case 'light':
        return <Lightbulb className="w-6 h-6" />;
      case 'battery':
        return <Battery className="w-6 h-6" />;
    }
  };

  const toggleDevice = (id: string) => {
    setDevices(devices.map(device =>
      device.id === id ? { ...device, active: !device.active } : device
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Device Simulator
        </h3>
        <div className="text-sm">
          <span className="text-gray-500">Total Consumption: </span>
          <span className={`font-medium ${
            totalConsumption > 0 ? 'text-red-500' : 'text-green-500'
          }`}>
            {Math.abs(totalConsumption).toFixed(3)} kW
          </span>
        </div>
      </div>

      <div className="grid gap-3">
        {devices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg cursor-pointer transition-colors ${
              device.active
                ? 'bg-gray-50 dark:bg-gray-800'
                : 'bg-gray-50 dark:bg-gray-800'
            }`}
            onClick={() => toggleDevice(device.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  device.active
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {getDeviceIcon(device.type)}
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {device.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {Math.abs(device.consumption)} kW
                    {device.consumption < 0 ? ' (Storage)' : ''}
                  </p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full ${
                device.active
                  ? 'bg-red-500'
                  : 'bg-green-500'
              }`} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}