'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mathematical constants and ratios
const GOLDEN_RATIO = 1.618033988749895;
const FIBONACCI_SEQUENCE = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
const EULER = 2.718281828459045;

interface GridItem {
  id: string;
  content: React.ReactNode;
  span: { row: number; col: number };
  priority: number;
  category: 'primary' | 'secondary' | 'accent' | 'neutral';
  aspectRatio?: number;
}

interface MathematicalGridProps {
  items: GridItem[];
  algorithm?: 'golden' | 'fibonacci' | 'prime' | 'euler' | 'adaptive';
  responsive?: boolean;
  animated?: boolean;
  className?: string;
  maxColumns?: number;
  gap?: number;
}

// Mathematical layout algorithms
class LayoutAlgorithms {
  static goldenRatioLayout(items: GridItem[], maxCols: number) {
    const layout: Array<{ item: GridItem; x: number; y: number; w: number; h: number }> = [];
    let currentRow = 0;
    let currentCol = 0;
    
    // Sort by priority and apply golden ratio proportions
    const sortedItems = [...items].sort((a, b) => b.priority - a.priority);
    
    sortedItems.forEach((item, index) => {
      // Calculate dimensions based on golden ratio
      const baseWidth = Math.ceil(GOLDEN_RATIO * (item.priority / 10));
      const baseHeight = Math.ceil(baseWidth / GOLDEN_RATIO);
      
      const width = Math.min(baseWidth, maxCols - currentCol);
      const height = item.aspectRatio ? Math.ceil(width / item.aspectRatio) : baseHeight;
      
      layout.push({
        item,
        x: currentCol,
        y: currentRow,
        w: width,
        h: height
      });
      
      currentCol += width;
      if (currentCol >= maxCols) {
        currentCol = 0;
        currentRow += height;
      }
    });
    
    return layout;
  }

  static fibonacciLayout(items: GridItem[], maxCols: number) {
    const layout: Array<{ item: GridItem; x: number; y: number; w: number; h: number }> = [];
    let fibIndex = 0;
    let currentRow = 0;
    let currentCol = 0;
    
    items.forEach((item, index) => {
      const fibNumber = FIBONACCI_SEQUENCE[fibIndex % FIBONACCI_SEQUENCE.length];
      const width = Math.min(fibNumber, maxCols - currentCol) || 1;
      const height = Math.ceil(width * 0.618); // Inverse golden ratio
      
      layout.push({
        item,
        x: currentCol,
        y: currentRow,
        w: width,
        h: height
      });
      
      currentCol += width;
      if (currentCol >= maxCols) {
        currentCol = 0;
        currentRow += height;
        fibIndex++;
      }
    });
    
    return layout;
  }

  static primeLayout(items: GridItem[], maxCols: number) {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
    const layout: Array<{ item: GridItem; x: number; y: number; w: number; h: number }> = [];
    let currentRow = 0;
    let currentCol = 0;
    
    items.forEach((item, index) => {
      const prime = primes[index % primes.length];
      const width = Math.min(prime % 4 + 1, maxCols - currentCol) || 1;
      const height = prime % 3 + 1;
      
      layout.push({
        item,
        x: currentCol,
        y: currentRow,
        w: width,
        h: height
      });
      
      currentCol += width;
      if (currentCol >= maxCols) {
        currentCol = 0;
        currentRow += Math.max(1, height);
      }
    });
    
    return layout;
  }

  static eulerLayout(items: GridItem[], maxCols: number) {
    const layout: Array<{ item: GridItem; x: number; y: number; w: number; h: number }> = [];
    let currentRow = 0;
    let currentCol = 0;
    
    items.forEach((item, index) => {
      // Use Euler's number for organic spacing
      const eulerFactor = Math.pow(EULER, (index % 5) / 5);
      const width = Math.min(Math.ceil(eulerFactor), maxCols - currentCol) || 1;
      const height = Math.ceil(width / eulerFactor);
      
      layout.push({
        item,
        x: currentCol,
        y: currentRow,
        w: width,
        h: height
      });
      
      currentCol += width;
      if (currentCol >= maxCols) {
        currentCol = 0;
        currentRow += height;
      }
    });
    
    return layout;
  }

  static adaptiveLayout(items: GridItem[], maxCols: number, containerWidth: number, containerHeight: number) {
    // AI-like adaptive algorithm that considers multiple factors
    const layout: Array<{ item: GridItem; x: number; y: number; w: number; h: number }> = [];
    const grid: boolean[][] = Array(20).fill(null).map(() => Array(maxCols).fill(false));
    
    // Sort by priority and category weight
    const categoryWeights = { primary: 4, secondary: 3, accent: 2, neutral: 1 };
    const sortedItems = [...items].sort((a, b) => 
      (b.priority * categoryWeights[b.category]) - (a.priority * categoryWeights[a.category])
    );
    
    sortedItems.forEach((item) => {
      const baseSize = Math.ceil(item.priority / 2);
      let bestPosition = { x: 0, y: 0, w: baseSize, h: baseSize };
      let bestScore = -1;
      
      // Try different positions and sizes
      for (let y = 0; y < 15; y++) {
        for (let x = 0; x < maxCols - 1; x++) {
          for (let w = 1; w <= Math.min(baseSize + 1, maxCols - x); w++) {
            for (let h = 1; h <= baseSize + 1; h++) {
              if (this.canPlaceItem(grid, x, y, w, h)) {
                const score = this.calculatePositionScore(x, y, w, h, item, containerWidth, containerHeight);
                if (score > bestScore) {
                  bestScore = score;
                  bestPosition = { x, y, w, h };
                }
              }
            }
          }
        }
      }
      
      // Place the item
      this.placeItem(grid, bestPosition.x, bestPosition.y, bestPosition.w, bestPosition.h);
      layout.push({
        item,
        x: bestPosition.x,
        y: bestPosition.y,
        w: bestPosition.w,
        h: bestPosition.h
      });
    });
    
    return layout;
  }

  private static canPlaceItem(grid: boolean[][], x: number, y: number, w: number, h: number): boolean {
    if (y + h > grid.length || x + w > grid[0].length) return false;
    
    for (let i = y; i < y + h; i++) {
      for (let j = x; j < x + w; j++) {
        if (grid[i][j]) return false;
      }
    }
    return true;
  }

  private static placeItem(grid: boolean[][], x: number, y: number, w: number, h: number) {
    for (let i = y; i < y + h; i++) {
      for (let j = x; j < x + w; j++) {
        grid[i][j] = true;
      }
    }
  }

  private static calculatePositionScore(x: number, y: number, w: number, h: number, item: GridItem, containerWidth: number, containerHeight: number): number {
    let score = 0;
    
    // Prefer top-left for high priority items
    if (item.priority > 7) {
      score += (10 - x) * 2;
      score += (10 - y) * 2;
    }
    
    // Golden ratio preferences
    const ratio = w / h;
    const goldenRatioDiff = Math.abs(ratio - GOLDEN_RATIO);
    score += (2 - goldenRatioDiff) * 10;
    
    // Size bonus for primary items
    if (item.category === 'primary') {
      score += (w * h) * 5;
    }
    
    // Avoid edges for secondary items
    if (item.category === 'secondary' && (x === 0 || y === 0)) {
      score -= 5;
    }
    
    return score;
  }
}

export default function MathematicalGrid({
  items,
  algorithm = 'adaptive',
  responsive = true,
  animated = true,
  className = '',
  maxColumns = 12,
  gap = 16
}: MathematicalGridProps) {
  const [containerSize, setContainerSize] = useState({ width: 1200, height: 800 });
  const [currentAlgorithm, setCurrentAlgorithm] = useState(algorithm);
  const [isRearranging, setIsRearranging] = useState(false);

  // Calculate layout based on selected algorithm
  const layout = useMemo(() => {
    switch (currentAlgorithm) {
      case 'golden':
        return LayoutAlgorithms.goldenRatioLayout(items, maxColumns);
      case 'fibonacci':
        return LayoutAlgorithms.fibonacciLayout(items, maxColumns);
      case 'prime':
        return LayoutAlgorithms.primeLayout(items, maxColumns);
      case 'euler':
        return LayoutAlgorithms.eulerLayout(items, maxColumns);
      case 'adaptive':
        return LayoutAlgorithms.adaptiveLayout(items, maxColumns, containerSize.width, containerSize.height);
      default:
        return LayoutAlgorithms.goldenRatioLayout(items, maxColumns);
    }
  }, [items, currentAlgorithm, maxColumns, containerSize]);

  // Calculate grid dimensions
  const gridStats = useMemo(() => {
    const maxRow = Math.max(...layout.map(l => l.y + l.h));
    const maxCol = Math.max(...layout.map(l => l.x + l.w));
    const totalCells = layout.reduce((sum, l) => sum + (l.w * l.h), 0);
    const efficiency = totalCells / (maxRow * maxCol);
    
    return { maxRow, maxCol, totalCells, efficiency };
  }, [layout]);

  useEffect(() => {
    const updateSize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    if (responsive) {
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, [responsive]);

  const rearrangeLayout = () => {
    const algorithms: typeof algorithm[] = ['golden', 'fibonacci', 'prime', 'euler', 'adaptive'];
    const currentIndex = algorithms.indexOf(currentAlgorithm);
    const nextAlgorithm = algorithms[(currentIndex + 1) % algorithms.length];
    
    setIsRearranging(true);
    setTimeout(() => {
      setCurrentAlgorithm(nextAlgorithm);
      setIsRearranging(false);
    }, 300);
  };

  // Calculate responsive grid sizing
  const cellSize = Math.floor((containerSize.width - gap * (maxColumns + 1)) / maxColumns);
  const gridHeight = gridStats.maxRow * (cellSize + gap) + gap;

  return (
    <div className={`relative ${className}`}>
      {/* Algorithm Control Panel */}
      <div className="mb-6 p-4 bg-surface-elevated rounded-large border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Mathematical Grid Layout</h3>
            <p className="text-sm text-gray-600">
              Algorithm: <span className="font-medium text-brand-600">{currentAlgorithm}</span> | 
              Efficiency: <span className="font-medium">{(gridStats.efficiency * 100).toFixed(1)}%</span>
            </p>
          </div>
          
          <motion.button
            onClick={rearrangeLayout}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isRearranging}
          >
            {isRearranging ? 'Rearranging...' : 'Rearrange'}
          </motion.button>
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {(['golden', 'fibonacci', 'prime', 'euler', 'adaptive'] as const).map((alg) => (
            <motion.button
              key={alg}
              onClick={() => setCurrentAlgorithm(alg)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                currentAlgorithm === alg
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {alg.charAt(0).toUpperCase() + alg.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Mathematical Grid Container */}
      <motion.div
        className="relative bg-gradient-to-br from-gray-50 to-white rounded-xlarge border border-gray-200 overflow-hidden"
        style={{
          height: `${gridHeight}px`,
          background: `
            radial-gradient(circle at 25% 25%, rgba(47, 109, 182, 0.1) 0%, transparent 25%),
            radial-gradient(circle at 75% 75%, rgba(5, 150, 105, 0.1) 0%, transparent 25%),
            linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)
          `
        }}
        animate={{ opacity: isRearranging ? 0.5 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(47, 109, 182, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(47, 109, 182, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize + gap}px ${cellSize + gap}px`,
            backgroundPosition: `${gap}px ${gap}px`
          }}
        />

        {/* Mathematical Visualization Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {layout.map((item, index) => {
            const x1 = item.x * (cellSize + gap) + gap + (item.w * cellSize + (item.w - 1) * gap) / 2;
            const y1 = item.y * (cellSize + gap) + gap + (item.h * cellSize + (item.h - 1) * gap) / 2;
            
            return layout.slice(index + 1).map((otherItem, otherIndex) => {
              const x2 = otherItem.x * (cellSize + gap) + gap + (otherItem.w * cellSize + (otherItem.w - 1) * gap) / 2;
              const y2 = otherItem.y * (cellSize + gap) + gap + (otherItem.h * cellSize + (otherItem.h - 1) * gap) / 2;
              
              // Only draw lines for related items
              if (item.item.category === otherItem.item.category && 
                  Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) < cellSize * 3) {
                return (
                  <motion.line
                    key={`${index}-${otherIndex}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(47, 109, 182, 0.2)"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.5 }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                );
              }
              return null;
            });
          })}
        </svg>

        {/* Grid Items */}
        <AnimatePresence mode="popLayout">
          {layout.map((layoutItem, index) => {
            const { item, x, y, w, h } = layoutItem;
            
            return (
              <motion.div
                key={item.id}
                className={`absolute overflow-hidden ${
                  item.category === 'primary' ? 'z-20' :
                  item.category === 'secondary' ? 'z-15' :
                  item.category === 'accent' ? 'z-10' : 'z-5'
                }`}
                style={{
                  left: `${x * (cellSize + gap) + gap}px`,
                  top: `${y * (cellSize + gap) + gap}px`,
                  width: `${w * cellSize + (w - 1) * gap}px`,
                  height: `${h * cellSize + (h - 1) * gap}px`,
                }}
                layout
                initial={{ 
                  opacity: 0, 
                  scale: 0.8,
                  rotateY: -90
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotateY: 0
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.8,
                  rotateY: 90
                }}
                transition={{
                  duration: 0.6,
                  delay: animated ? index * 0.1 : 0,
                  ease: [0.4, 0, 0.2, 1]
                }}
                whileHover={{
                  scale: 1.02,
                  z: 50,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Mathematical decoration based on category */}
                <div className="absolute inset-0">
                  {item.category === 'primary' && (
                    <div className="absolute top-2 right-2 w-3 h-3">
                      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-sm transform rotate-45" />
                    </div>
                  )}
                  
                  {item.category === 'accent' && (
                    <div className="absolute bottom-2 left-2 w-2 h-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full" />
                  )}
                </div>

                {/* Item Content */}
                <div className="w-full h-full bg-white rounded-large shadow-depth-1 hover:shadow-depth-2 transition-shadow duration-300 border border-gray-200/50">
                  {item.content}
                </div>

                {/* Mathematical ratio indicator */}
                <div className="absolute -bottom-6 left-0 text-xs text-gray-400 font-mono">
                  {w}×{h} ({(w/h).toFixed(2)})
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Algorithm Visualization */}
        <div className="absolute bottom-4 left-4 px-3 py-2 bg-black/80 text-white text-xs rounded-lg font-mono">
          <div>Grid: {gridStats.maxCol}×{gridStats.maxRow}</div>
          <div>Cells: {gridStats.totalCells}</div>
          <div>φ = {GOLDEN_RATIO.toFixed(3)}</div>
        </div>
      </motion.div>
    </div>
  );
}