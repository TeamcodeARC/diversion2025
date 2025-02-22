import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GridZone } from '../types';

interface ConsumptionHeatmapProps {
  zones: GridZone[];
}

export function ConsumptionHeatmap({ zones }: ConsumptionHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create gradient
    const createHeatmapGradient = (value: number) => {
      const hue = ((1 - value) * 120).toString(10);
      return `hsla(${hue}, 100%, 50%, 0.6)`;
    };

    // Draw heatmap cells
    const cellSize = canvas.width / 3;
    zones.forEach((zone, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const x = col * cellSize;
      const y = row * cellSize;

      // Draw cell background
      ctx.fillStyle = createHeatmapGradient(zone.load / 100);
      ctx.fillRect(x, y, cellSize, cellSize);

      // Draw zone name and values
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(zone.name, x + cellSize/2, y + cellSize/2 - 10);
      ctx.fillText(`${zone.load}%`, x + cellSize/2, y + cellSize/2 + 10);
    });
  }, [zones]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className="w-full rounded-lg"
      />
      <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg text-sm">
        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        <span>Low</span>
        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
        <span>Medium</span>
        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
        <span>High</span>
      </div>
    </motion.div>
  );
}