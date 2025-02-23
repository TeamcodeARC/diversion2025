import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PowerGridMetrics } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface PowerConsumptionChartProps {
  data: PowerGridMetrics[];
}

export function PowerConsumptionChart({ data }: PowerConsumptionChartProps) {
  const [animatedData, setAnimatedData] = useState(data);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    let startTime: number;
    const animationDuration = 500; // Animation duration in milliseconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / animationDuration;

      if (progress < 1) {
        const newData = data.map((target, index) => {
          const current = animatedData[index];
          if (!current) return target;

          return {
            ...target,
            consumption: current.consumption + (target.consumption - current.consumption) * progress,
            production: current.production + (target.production - current.production) * progress,
          };
        });

        setAnimatedData(newData);
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setAnimatedData(data);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [data]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full h-full"
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={animatedData}>
            <defs>
              <linearGradient id="consumption" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="production" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#9CA3AF"
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#F3F4F6'
              }}
              formatter={(value: number) => value.toFixed(2)}
            />
            <Area
              type="monotone"
              dataKey="consumption"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#consumption)"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="production"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#production)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </AnimatePresence>
  );
}