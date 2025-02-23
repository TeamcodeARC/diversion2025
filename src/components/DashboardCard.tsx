import { motion } from 'framer-motion';
import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
}

export function DashboardCard({ title, children, className = '', maxHeight }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>
      <div className={maxHeight ? `overflow-auto ${maxHeight}` : undefined}>
        {children}
      </div>
    </motion.div>
  );
}