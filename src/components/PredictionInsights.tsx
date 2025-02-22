import { motion } from 'framer-motion';
import { Brain, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Prediction } from '../types';
import { getPowerInsights } from '../services/ai';

interface PredictionInsightsProps {
  prediction: Prediction;
}

export function PredictionInsights({ prediction }: PredictionInsightsProps) {
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);

  useEffect(() => {
    async function fetchInsights() {
      const insights = await getPowerInsights(prediction);
      setAiRecommendations(insights);
    }
    fetchInsights();
  }, [prediction]);

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return 'text-green-500';
    if (score >= 0.7) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
          <Brain className="w-5 h-5 text-purple-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
            AI Predictions
          </h3>
          <p className={`text-xs ${getConfidenceColor(prediction.confidenceScore)}`}>
            {(prediction.confidenceScore * 100).toFixed(1)}% confidence
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            {prediction.expectedLoad > 75 ? (
              <TrendingUp className="w-4 h-4 text-red-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-500" />
            )}
            <span className="text-xs text-gray-500">Expected Load</span>
          </div>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {prediction.expectedLoad.toFixed(1)}%
          </p>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            {prediction.expectedEfficiency > 85 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className="text-xs text-gray-500">Expected Efficiency</span>
          </div>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {prediction.expectedEfficiency.toFixed(1)}%
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          AI-Generated Recommendations
        </h4>
        <div className="space-y-2">
          {aiRecommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {recommendation}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}