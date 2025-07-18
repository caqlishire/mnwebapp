'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartIcon, 
  UserGroupIcon, 
  HomeIcon, 
  CheckCircleIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Healthcare data types
interface HealthcareData {
  metric: string;
  value: number;
  trend: number; // percentage change
  target: number;
  category: 'care' | 'satisfaction' | 'occupancy' | 'safety';
  icon: typeof HeartIcon;
  color: string;
  unit: string;
  description: string;
  timeframe: string;
}

interface ChartDataPoint {
  label: string;
  value: number;
  timestamp: Date;
  target?: number;
}

const mockHealthcareData: HealthcareData[] = [
  {
    metric: 'Patient Satisfaction',
    value: 94.5,
    trend: 2.3,
    target: 95,
    category: 'satisfaction',
    icon: HeartIcon,
    color: '#059669',
    unit: '%',
    description: 'Overall satisfaction rating from residents and families',
    timeframe: 'Last 30 days'
  },
  {
    metric: 'Care Quality Score',
    value: 97.8,
    trend: 1.2,
    target: 98,
    category: 'care',
    icon: CheckCircleIcon,
    color: '#2F6DB6',
    unit: '%',
    description: 'Quality assurance metrics and care plan adherence',
    timeframe: 'Current quarter'
  },
  {
    metric: 'Community Integration',
    value: 87.3,
    trend: 4.1,
    target: 90,
    category: 'satisfaction',
    icon: UserGroupIcon,
    color: '#7c3aed',
    unit: '%',
    description: 'Participation in community activities and programs',
    timeframe: 'Last 90 days'
  },
  {
    metric: 'Facility Occupancy',
    value: 92.0,
    trend: -1.5,
    target: 95,
    category: 'occupancy',
    icon: HomeIcon,
    color: '#f59e0b',
    unit: '%',
    description: 'Current occupancy rate across all facilities',
    timeframe: 'Real-time'
  },
  {
    metric: 'Safety Incidents',
    value: 0.2,
    trend: -15.3,
    target: 0.1,
    category: 'safety',
    icon: ClockIcon,
    color: '#ef4444',
    unit: 'per month',
    description: 'Safety incidents per resident per month',
    timeframe: 'Last 6 months'
  }
];

// Advanced data visualization components
function AnimatedProgressRing({ 
  value, 
  target, 
  size = 120, 
  strokeWidth = 8, 
  color = '#2F6DB6',
  showTarget = true 
}: {
  value: number;
  target?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showTarget?: boolean;
}) {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const targetOffset = target ? circumference - (target / 100) * circumference : 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        
        {/* Target indicator */}
        {showTarget && target && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#94a3b8"
            strokeWidth={strokeWidth / 2}
            strokeDasharray={`${strokeWidth} ${circumference - strokeWidth}`}
            strokeDashoffset={targetOffset}
            strokeLinecap="round"
            opacity={0.5}
          />
        )}
        
        {/* Progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            className="text-2xl font-bold text-gray-900"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {value.toFixed(1)}
          </motion.div>
          <div className="text-xs text-gray-500">of {target}</div>
        </div>
      </div>
    </div>
  );
}

function InteractiveBarChart({ 
  data, 
  height = 200, 
  color = '#2F6DB6',
  showTrend = true 
}: {
  data: ChartDataPoint[];
  height?: number;
  color?: string;
  showTrend?: boolean;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const getBarHeight = (value: number) => {
    return ((value - minValue) / range) * (height - 40) + 20;
  };

  return (
    <div className="relative">
      <svg width="100%" height={height + 40} className="overflow-visible">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((fraction, index) => {
          const y = height - (fraction * (height - 40)) + 20;
          return (
            <line
              key={index}
              x1="40"
              y1={y}
              x2="100%"
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          );
        })}
        
        {/* Bars */}
        {data.map((point, index) => {
          const barWidth = `${80 / data.length}%`;
          const barHeight = getBarHeight(point.value);
          const x = `${(index / data.length) * 80 + 10}%`;
          const y = height - barHeight + 20;
          
          return (
            <g key={index}>
              <motion.rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={hoveredIndex === index ? `${color}CC` : color}
                rx="4"
                initial={{ height: 0, y: height + 20 }}
                animate={{ height: barHeight, y }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              />
              
              {/* Hover tooltip */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.g
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <rect
                      x={`calc(${x} - 30px)`}
                      y={y - 35}
                      width="60"
                      height="25"
                      fill="rgba(0,0,0,0.8)"
                      rx="4"
                    />
                    <text
                      x={x}
                      y={y - 18}
                      textAnchor="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {point.value.toFixed(1)}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          );
        })}
        
        {/* X-axis labels */}
        {data.map((point, index) => (
          <text
            key={index}
            x={`${(index / data.length) * 80 + 10 + (80 / data.length) / 2}%`}
            y={height + 35}
            textAnchor="middle"
            fontSize="10"
            fill="#6b7280"
          >
            {point.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function MetricCard({ 
  data, 
  index 
}: { 
  data: HealthcareData; 
  index: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = data.icon;
  
  // Generate mock time series data
  const timeSeriesData = useMemo(() => {
    const points: ChartDataPoint[] = [];
    const baseValue = data.value;
    
    for (let i = 6; i >= 0; i--) {
      const variation = (Math.random() - 0.5) * 10;
      const value = Math.max(0, Math.min(100, baseValue + variation - (i * 2)));
      points.push({
        label: `W${7-i}`,
        value,
        timestamp: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000)
      });
    }
    
    return points;
  }, [data.value]);

  const trendColor = data.trend > 0 ? '#059669' : data.trend < 0 ? '#ef4444' : '#6b7280';
  const TrendIcon = data.trend > 0 ? TrendingUpIcon : TrendingDownIcon;

  return (
    <motion.div
      className="bg-white rounded-xlarge p-6 shadow-depth-2 hover:shadow-depth-3 transition-all duration-300 border border-gray-200 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => setIsExpanded(!isExpanded)}
      layout
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="p-3 rounded-large"
            style={{ backgroundColor: `${data.color}15` }}
          >
            <Icon 
              className="h-6 w-6" 
              style={{ color: data.color }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{data.metric}</h3>
            <p className="text-sm text-gray-500">{data.timeframe}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-gray-900">
              {data.value.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">{data.unit}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <TrendIcon 
              className="h-4 w-4" 
              style={{ color: trendColor }}
            />
            <span 
              className="text-sm font-medium"
              style={{ color: trendColor }}
            >
              {Math.abs(data.trend).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Progress visualization */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Progress to Target</span>
          <span className="text-sm font-medium text-gray-900">
            {data.target}{data.unit}
          </span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full"
              style={{ backgroundColor: data.color }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (data.value / data.target) * 100)}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          </div>
          {/* Target indicator */}
          <div 
            className="absolute top-0 w-1 h-2 bg-gray-600 rounded-full"
            style={{ left: `${Math.min(100, (data.target / Math.max(data.value, data.target)) * 100)}%` }}
          />
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">{data.description}</p>
              
              {/* Advanced progress ring */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">7-Day Trend</h4>
                  <InteractiveBarChart 
                    data={timeSeriesData}
                    height={120}
                    color={data.color}
                  />
                </div>
                
                <div className="ml-6">
                  <AnimatedProgressRing
                    value={data.value}
                    target={data.target}
                    color={data.color}
                    size={100}
                  />
                </div>
              </div>

              {/* Additional metrics */}
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {(data.value + Math.random() * 5 - 2.5).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">7-day avg</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {(data.value + Math.random() * 10 - 5).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">30-day avg</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold" style={{ color: data.color }}>
                    {data.value > data.target ? '✓' : '○'}
                  </div>
                  <div className="text-xs text-gray-500">Target met</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HealthcareMetrics() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [isRealTime, setIsRealTime] = useState(false);

  const categories = [
    { id: 'all', label: 'All Metrics', color: '#6b7280' },
    { id: 'care', label: 'Care Quality', color: '#2F6DB6' },
    { id: 'satisfaction', label: 'Satisfaction', color: '#059669' },
    { id: 'occupancy', label: 'Occupancy', color: '#f59e0b' },
    { id: 'safety', label: 'Safety', color: '#ef4444' }
  ];

  const filteredData = selectedCategory === 'all' 
    ? mockHealthcareData 
    : mockHealthcareData.filter(item => item.category === selectedCategory);

  // Calculate overall health score
  const overallScore = useMemo(() => {
    const totalScore = mockHealthcareData.reduce((sum, item) => {
      const normalizedScore = (item.value / item.target) * 100;
      return sum + Math.min(100, normalizedScore);
    }, 0);
    return totalScore / mockHealthcareData.length;
  }, []);

  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        // Simulate real-time updates
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isRealTime]);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-xlarge p-6 shadow-depth-2 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Healthcare Metrics Dashboard</h2>
            <p className="text-gray-600">Real-time insights into care quality and performance</p>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setIsRealTime(!isRealTime)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isRealTime 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isRealTime ? '● Live' : 'Start Live'}
            </motion.button>
            
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Overall Health Score */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-large">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Overall Health Score</h3>
            <p className="text-sm text-gray-600">Composite score across all metrics</p>
          </div>
          <div className="flex items-center gap-4">
            <AnimatedProgressRing
              value={overallScore}
              target={95}
              color="#2F6DB6"
              size={80}
            />
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {overallScore.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">Excellent</div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-6">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: selectedCategory === category.id ? category.color : undefined
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredData.map((data, index) => (
          <MetricCard key={data.metric} data={data} index={index} />
        ))}
      </div>

      {/* Insights Panel */}
      <motion.div
        className="bg-gradient-to-br from-gray-50 to-white rounded-xlarge p-6 shadow-depth-1 border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Strong Performance</span>
            </div>
            <p className="text-sm text-green-700">
              Care Quality Score is consistently above target, showing excellent care delivery and plan adherence.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUpIcon className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Improvement Trend</span>
            </div>
            <p className="text-sm text-blue-700">
              Community Integration has shown 4.1% improvement, indicating successful outreach programs.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}