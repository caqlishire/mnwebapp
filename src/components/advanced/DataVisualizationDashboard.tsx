'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  ChartBarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  HomeIcon,
  ShieldCheckIcon,
  StarIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  XMarkIcon,
  InformationCircleIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface MetricData {
  id: string;
  title: string;
  value: number;
  previousValue: number;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

const metricsData: MetricData[] = [
  {
    id: 'residents',
    title: 'Active Residents',
    value: 127,
    previousValue: 119,
    unit: '',
    icon: UserGroupIcon,
    color: '#2563eb',
    trend: 'up',
    description: 'Total number of residents currently receiving care services'
  },
  {
    id: 'satisfaction',
    title: 'Satisfaction Rate',
    value: 98.2,
    previousValue: 97.8,
    unit: '%',
    icon: StarIcon,
    color: '#059669',
    trend: 'up',
    description: 'Overall family and resident satisfaction based on monthly surveys'
  },
  {
    id: 'response_time',
    title: 'Avg Response Time',
    value: 2.3,
    previousValue: 2.7,
    unit: ' min',
    icon: ClockIcon,
    color: '#dc2626',
    trend: 'up',
    description: 'Average emergency response time across all facilities'
  },
  {
    id: 'occupancy',
    title: 'Facility Occupancy',
    value: 94.5,
    previousValue: 91.2,
    unit: '%',
    icon: HomeIcon,
    color: '#7c3aed',
    trend: 'up',
    description: 'Current occupancy rate across all residential facilities'
  },
  {
    id: 'safety_score',
    title: 'Safety Score',
    value: 99.1,
    previousValue: 98.9,
    unit: '%',
    icon: ShieldCheckIcon,
    color: '#ea580c',
    trend: 'up',
    description: 'Composite safety score based on incidents, compliance, and training'
  },
  {
    id: 'staff_ratio',
    title: 'Staff-to-Resident Ratio',
    value: 1.8,
    previousValue: 1.6,
    unit: ':1',
    icon: UserGroupIcon,
    color: '#0891b2',
    trend: 'up',
    description: 'Current staff-to-resident ratio during peak hours'
  }
];

const chartData: ChartDataPoint[] = [
  { label: 'Q1 2024', value: 89, color: '#3b82f6' },
  { label: 'Q2 2024', value: 92, color: '#10b981' },
  { label: 'Q3 2024', value: 95, color: '#f59e0b' },
  { label: 'Q4 2024', value: 98, color: '#ef4444' },
  { label: 'Q1 2025', value: 98.2, color: '#8b5cf6' }
];

export default function DataVisualizationDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricData | null>(null);
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({});
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen) {
      // Animate metric values when dashboard opens
      const initialValues: { [key: string]: number } = {};
      metricsData.forEach(metric => {
        initialValues[metric.id] = 0;
      });
      setAnimatedValues(initialValues);

      // Animate to real values with staggered timing
      metricsData.forEach((metric, index) => {
        setTimeout(() => {
          setAnimatedValues(prev => ({
            ...prev,
            [metric.id]: metric.value
          }));
        }, index * 200);
      });

      // Start real-time updates simulation
      intervalRef.current = setInterval(() => {
        setAnimatedValues(prev => {
          const updated = { ...prev };
          metricsData.forEach(metric => {
            // Add small random variations to simulate real-time data
            const variation = (Math.random() - 0.5) * 0.2;
            updated[metric.id] = Math.max(0, metric.value + variation);
          });
          return updated;
        });
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isOpen]);

  const formatValue = (value: number, unit: string) => {
    const displayValue = value;
    if (unit === '%' || unit === ' min' || unit === ':1') {
      return `${displayValue.toFixed(1)}${unit}`;
    }
    return `${Math.round(displayValue)}${unit}`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpIcon className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDownIcon className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <>
      {/* Dashboard Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-6 z-50 w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-xl flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: isOpen 
            ? '0 0 30px rgba(99, 102, 241, 0.5)' 
            : '0 8px 25px rgba(99, 102, 241, 0.3)'
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chart"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChartBarIcon className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dashboard Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed left-20 top-20 z-40 w-96 h-[calc(100vh-6rem)] bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Analytics Dashboard</h3>
                  <p className="text-sm opacity-90">Real-time facility metrics</p>
                </div>
                <div className="ml-auto">
                  <motion.div
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="p-4 h-full overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
              <div className="grid grid-cols-2 gap-3 mb-6">
                {metricsData.map((metric, index) => {
                  const currentValue = animatedValues[metric.id] || 0;
                  const changePercent = ((metric.value - metric.previousValue) / metric.previousValue) * 100;
                  
                  return (
                    <motion.div
                      key={metric.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedMetric(metric)}
                      className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-3 cursor-pointer hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${metric.color}20` }}
                        >
                          <metric.icon 
                            className="w-4 h-4"
                            style={{ color: metric.color }}
                          />
                        </div>
                        {getTrendIcon(metric.trend)}
                      </div>
                      
                      <div className="mb-1">
                        <motion.div
                          className="text-xl font-bold text-gray-900 dark:text-white"
                          animate={{ scale: currentValue !== metric.value ? [1, 1.1, 1] : 1 }}
                        >
                          {formatValue(currentValue, metric.unit)}
                        </motion.div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {metric.title}
                        </div>
                      </div>
                      
                      <div className={`text-xs flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                        <span>{changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%</span>
                        <span className="text-gray-500">vs last period</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Chart Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 mb-4 border border-gray-200 dark:border-gray-700"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <ArrowTrendingUpIcon className="w-5 h-5 text-indigo-600" />
                  Satisfaction Trend
                </h4>
                
                {/* Simple Bar Chart */}
                <div className="space-y-3">
                  {chartData.map((dataPoint, index) => {
                    const maxValue = Math.max(...chartData.map(d => d.value));
                    const percentage = (dataPoint.value / maxValue) * 100;
                    
                    return (
                      <div key={dataPoint.label} className="flex items-center gap-3">
                        <div className="w-16 text-xs text-gray-600 dark:text-gray-400">
                          {dataPoint.label}
                        </div>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 relative">
                          <motion.div
                            className="h-2 rounded-full"
                            style={{ backgroundColor: dataPoint.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                          />
                        </div>
                        <div className="w-12 text-xs font-medium text-gray-900 dark:text-white text-right">
                          {dataPoint.value}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="space-y-2"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Quick Actions</h4>
                
                <button className="w-full bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 text-left hover:bg-white/90 dark:hover:bg-gray-800/90 transition-colors border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">Generate Report</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Export current metrics</div>
                    </div>
                  </div>
                </button>
                
                <button className="w-full bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 text-left hover:bg-white/90 dark:hover:bg-gray-800/90 transition-colors border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <CogIcon className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">Configure Alerts</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Set up metric thresholds</div>
                    </div>
                  </div>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metric Detail Modal */}
      <AnimatePresence>
        {selectedMetric && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedMetric(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${selectedMetric.color}20` }}
                  >
                    <selectedMetric.icon 
                      className="w-6 h-6"
                      style={{ color: selectedMetric.color }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {selectedMetric.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current Value: {formatValue(selectedMetric.value, selectedMetric.unit)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMetric(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <InformationCircleIcon className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900 dark:text-white">Description</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedMetric.description}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Previous</span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatValue(selectedMetric.previousValue, selectedMetric.unit)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Change</span>
                    <div className={`font-medium flex items-center gap-1 ${getTrendColor(selectedMetric.trend)}`}>
                      {getTrendIcon(selectedMetric.trend)}
                      {((selectedMetric.value - selectedMetric.previousValue) / selectedMetric.previousValue * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}