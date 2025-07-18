'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Quantum State Representation
interface QuantumState {
  amplitude: Complex;
  probability: number;
  phase: number;
  entangled: boolean;
  superposition: QuantumState[] | null;
}

interface Complex {
  real: number;
  imaginary: number;
}

interface QuantumComponent {
  id: string;
  states: QuantumState[];
  measured: boolean;
  entangledWith: string[];
  observables: string[];
}

// Quantum Genetic Algorithm Engine
class QuantumGeneticAlgorithm {
  private population: QuantumComponent[] = [];
  private generation = 0;
  private fitnessHistory: number[] = [];

  constructor(populationSize: number = 50) {
    this.initializePopulation(populationSize);
  }

  private initializePopulation(size: number) {
    for (let i = 0; i < size; i++) {
      this.population.push(this.createRandomQuantumComponent());
    }
  }

  private createRandomQuantumComponent(): QuantumComponent {
    const numStates = Math.floor(Math.random() * 4) + 2;
    const states: QuantumState[] = [];
    
    for (let i = 0; i < numStates; i++) {
      const amplitude = this.createRandomComplex();
      states.push({
        amplitude,
        probability: this.complexMagnitudeSquared(amplitude),
        phase: Math.random() * 2 * Math.PI,
        entangled: Math.random() > 0.7,
        superposition: Math.random() > 0.8 ? this.createSuperposition() : null
      });
    }

    return {
      id: `quantum-${Math.random().toString(36).substr(2, 9)}`,
      states: this.normalizeStates(states),
      measured: false,
      entangledWith: [],
      observables: ['position', 'momentum', 'spin']
    };
  }

  private createRandomComplex(): Complex {
    return {
      real: (Math.random() - 0.5) * 2,
      imaginary: (Math.random() - 0.5) * 2
    };
  }

  private createSuperposition(): QuantumState[] {
    const numSuperposed = Math.floor(Math.random() * 3) + 2;
    const superposed: QuantumState[] = [];
    
    for (let i = 0; i < numSuperposed; i++) {
      const amplitude = this.createRandomComplex();
      superposed.push({
        amplitude,
        probability: this.complexMagnitudeSquared(amplitude),
        phase: Math.random() * 2 * Math.PI,
        entangled: false,
        superposition: null
      });
    }
    
    return this.normalizeStates(superposed);
  }

  private complexMagnitudeSquared(c: Complex): number {
    return c.real * c.real + c.imaginary * c.imaginary;
  }

  private normalizeStates(states: QuantumState[]): QuantumState[] {
    const totalProbability = states.reduce((sum, state) => sum + state.probability, 0);
    
    return states.map(state => ({
      ...state,
      probability: state.probability / totalProbability
    }));
  }

  // Quantum crossover operation
  private quantumCrossover(parent1: QuantumComponent, parent2: QuantumComponent): QuantumComponent {
    const childStates: QuantumState[] = [];
    const maxStates = Math.max(parent1.states.length, parent2.states.length);
    
    for (let i = 0; i < maxStates; i++) {
      const state1 = parent1.states[i % parent1.states.length];
      const state2 = parent2.states[i % parent2.states.length];
      
      // Quantum superposition of parent states
      const newAmplitude: Complex = {
        real: (state1.amplitude.real + state2.amplitude.real) / Math.sqrt(2),
        imaginary: (state1.amplitude.imaginary + state2.amplitude.imaginary) / Math.sqrt(2)
      };
      
      childStates.push({
        amplitude: newAmplitude,
        probability: this.complexMagnitudeSquared(newAmplitude),
        phase: (state1.phase + state2.phase) / 2,
        entangled: state1.entangled || state2.entangled,
        superposition: Math.random() > 0.5 ? state1.superposition : state2.superposition
      });
    }

    return {
      id: `quantum-${Math.random().toString(36).substr(2, 9)}`,
      states: this.normalizeStates(childStates),
      measured: false,
      entangledWith: [...parent1.entangledWith, ...parent2.entangledWith],
      observables: ['position', 'momentum', 'spin', 'energy']
    };
  }

  // Quantum mutation with probability amplitude changes
  private quantumMutation(component: QuantumComponent, mutationRate: number = 0.1): QuantumComponent {
    const mutatedStates = component.states.map(state => {
      if (Math.random() < mutationRate) {
        const mutationStrength = 0.1;
        const amplitude: Complex = {
          real: state.amplitude.real + (Math.random() - 0.5) * mutationStrength,
          imaginary: state.amplitude.imaginary + (Math.random() - 0.5) * mutationStrength
        };
        
        return {
          ...state,
          amplitude,
          probability: this.complexMagnitudeSquared(amplitude),
          phase: state.phase + (Math.random() - 0.5) * 0.5
        };
      }
      return state;
    });

    return {
      ...component,
      states: this.normalizeStates(mutatedStates)
    };
  }

  // Fitness function based on quantum coherence and interface usability
  private calculateFitness(component: QuantumComponent): number {
    let fitness = 0;
    
    // Coherence score (higher for more organized quantum states)
    const coherence = component.states.reduce((sum, state) => {
      return sum + Math.exp(-Math.abs(state.phase));
    }, 0) / component.states.length;
    
    // Entanglement score (moderate entanglement is preferred)
    const entanglementScore = component.entangledWith.length > 0 && component.entangledWith.length < 3 ? 1 : 0.5;
    
    // Superposition diversity score
    const superpositionScore = component.states.filter(s => s.superposition).length / component.states.length;
    
    // Probability distribution score (prefer balanced distributions)
    const entropyScore = -component.states.reduce((sum, state) => {
      const p = state.probability;
      return sum + (p > 0 ? p * Math.log2(p) : 0);
    }, 0);
    
    fitness = coherence * 0.3 + entanglementScore * 0.2 + superpositionScore * 0.3 + entropyScore * 0.2;
    
    return fitness;
  }

  // Evolve the population using quantum genetic operations
  evolveGeneration(): QuantumComponent {
    // Calculate fitness for all components
    const fitnessScores = this.population.map(comp => ({
      component: comp,
      fitness: this.calculateFitness(comp)
    }));
    
    // Sort by fitness
    fitnessScores.sort((a, b) => b.fitness - a.fitness);
    
    // Select parents using quantum probability selection
    const parents = fitnessScores.slice(0, Math.floor(this.population.length / 2));
    
    // Create new generation
    const newPopulation: QuantumComponent[] = [];
    
    // Keep best individuals (elitism)
    newPopulation.push(...parents.slice(0, 5).map(p => p.component));
    
    // Generate offspring through quantum crossover
    while (newPopulation.length < this.population.length) {
      const parent1 = parents[Math.floor(Math.random() * parents.length)].component;
      const parent2 = parents[Math.floor(Math.random() * parents.length)].component;
      
      let offspring = this.quantumCrossover(parent1, parent2);
      offspring = this.quantumMutation(offspring);
      
      newPopulation.push(offspring);
    }
    
    this.population = newPopulation;
    this.generation++;
    
    const bestFitness = fitnessScores[0].fitness;
    this.fitnessHistory.push(bestFitness);
    
    return fitnessScores[0].component;
  }

  getBestComponent(): QuantumComponent {
    const fitnessScores = this.population.map(comp => ({
      component: comp,
      fitness: this.calculateFitness(comp)
    }));
    
    fitnessScores.sort((a, b) => b.fitness - a.fitness);
    return fitnessScores[0].component;
  }

  getGenerationStats() {
    return {
      generation: this.generation,
      populationSize: this.population.length,
      fitnessHistory: this.fitnessHistory
    };
  }
}

// Quantum State Visualizer Component
function QuantumStateVisualizer({ 
  quantumComponent, 
  width = 300, 
  height = 300 
}: { 
  quantumComponent: QuantumComponent;
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 3;

    // Draw quantum states as probability clouds
    quantumComponent.states.forEach((state, index) => {
      const angle = (index / quantumComponent.states.length) * 2 * Math.PI;
      const radius = state.probability * maxRadius;
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Create probability cloud gradient
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 0.8);
      
      // Color based on phase
      const hue = (state.phase / (2 * Math.PI)) * 360;
      const saturation = state.probability * 100;
      const lightness = 50 + state.amplitude.real * 25;
      
      gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`);
      gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.1)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.8, 0, 2 * Math.PI);
      ctx.fill();

      // Draw wave function
      if (state.superposition) {
        ctx.strokeStyle = `hsla(${hue}, 70%, 40%, 0.6)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let t = 0; t < 2 * Math.PI; t += 0.1) {
          const waveX = x + Math.cos(t + state.phase) * radius * 0.3;
          const waveY = y + Math.sin(t + state.phase) * radius * 0.3;
          
          if (t === 0) ctx.moveTo(waveX, waveY);
          else ctx.lineTo(waveX, waveY);
        }
        ctx.stroke();
      }

      // Draw probability amplitude vector
      ctx.strokeStyle = `hsla(${hue}, 80%, 30%, 0.9)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Draw phase indicator
      ctx.fillStyle = `hsla(${hue}, 90%, 40%, 1)`;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw entanglement connections
    if (quantumComponent.entangledWith.length > 0) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      for (let i = 0; i < quantumComponent.states.length - 1; i++) {
        const angle1 = (i / quantumComponent.states.length) * 2 * Math.PI;
        const angle2 = ((i + 1) / quantumComponent.states.length) * 2 * Math.PI;
        
        const x1 = centerX + Math.cos(angle1) * maxRadius * 0.8;
        const y1 = centerY + Math.sin(angle1) * maxRadius * 0.8;
        const x2 = centerX + Math.cos(angle2) * maxRadius * 0.8;
        const y2 = centerY + Math.sin(angle2) * maxRadius * 0.8;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      
      ctx.setLineDash([]);
    }

    // Draw measurement indicator
    if (quantumComponent.measured) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * 1.2, 0, 2 * Math.PI);
      ctx.fill();
    }

  }, [quantumComponent, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-gray-300 rounded-lg bg-black"
    />
  );
}

// Main Quantum Interface Component
export default function QuantumInterface() {
  const [qga] = useState(() => new QuantumGeneticAlgorithm(30));
  const [currentComponent, setCurrentComponent] = useState<QuantumComponent | null>(null);
  const [isEvolving, setIsEvolving] = useState(false);
  const [evolutionSpeed, setEvolutionSpeed] = useState(1000);
  const [measurements, setMeasurements] = useState<string[]>([]);
  const evolutionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCurrentComponent(qga.getBestComponent());
  }, [qga]);

  const startEvolution = () => {
    if (isEvolving) return;
    
    setIsEvolving(true);
    evolutionIntervalRef.current = setInterval(() => {
      const evolved = qga.evolveGeneration();
      setCurrentComponent(evolved);
      
      // Log quantum measurements
      const newMeasurement = `Gen ${qga.getGenerationStats().generation}: ${evolved.states.length} states, ${evolved.entangledWith.length} entangled`;
      setMeasurements(prev => [...prev.slice(-9), newMeasurement]);
    }, evolutionSpeed);
  };

  const stopEvolution = () => {
    setIsEvolving(false);
    if (evolutionIntervalRef.current) {
      clearInterval(evolutionIntervalRef.current);
    }
  };

  const measureQuantumState = () => {
    if (!currentComponent) return;
    
    // Quantum measurement causes wave function collapse
    const measuredComponent: QuantumComponent = {
      ...currentComponent,
      measured: true,
      states: currentComponent.states.map(state => {
        // Collapse superposition
        if (state.superposition) {
          const collapsedState = state.superposition[Math.floor(Math.random() * state.superposition.length)];
          return {
            ...collapsedState,
            superposition: null
          };
        }
        return state;
      })
    };
    
    setCurrentComponent(measuredComponent);
    setMeasurements(prev => [...prev, `Measured: Wave function collapsed!`]);
  };

  const createEntanglement = () => {
    if (!currentComponent) return;
    
    const entangledComponent: QuantumComponent = {
      ...currentComponent,
      entangledWith: [...currentComponent.entangledWith, `entangled-${Date.now()}`],
      states: currentComponent.states.map(state => ({
        ...state,
        entangled: true,
        phase: state.phase + Math.PI / 4 // Phase shift due to entanglement
      }))
    };
    
    setCurrentComponent(entangledComponent);
    setMeasurements(prev => [...prev, `Entanglement created with ${entangledComponent.entangledWith.length} particles`]);
  };

  if (!currentComponent) {
    return <div>Initializing quantum system...</div>;
  }

  const stats = qga.getGenerationStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="max-w-7xl mx-auto"
      >
        {/* Quantum Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            Quantum Healthcare Interface
          </motion.h1>
          <p className="text-gray-300 text-xl">
            Revolutionary healthcare management through quantum computing principles
          </p>
        </div>

        {/* Main Quantum Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quantum State Visualizer */}
          <motion.div
            className="lg:col-span-2 bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Quantum State Visualization</h3>
            <div className="flex justify-center">
              <QuantumStateVisualizer 
                quantumComponent={currentComponent} 
                width={400} 
                height={400} 
              />
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-900/30 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-300">
                  {currentComponent.states.length}
                </div>
                <div className="text-blue-200 text-sm">Quantum States</div>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-300">
                  {currentComponent.entangledWith.length}
                </div>
                <div className="text-purple-200 text-sm">Entangled</div>
              </div>
              <div className="bg-pink-900/30 rounded-lg p-3">
                <div className="text-2xl font-bold text-pink-300">
                  {currentComponent.states.filter(s => s.superposition).length}
                </div>
                <div className="text-pink-200 text-sm">Superposed</div>
              </div>
            </div>
          </motion.div>

          {/* Quantum Controls */}
          <motion.div
            className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Quantum Controls</h3>
            
            <div className="space-y-4">
              <motion.button
                onClick={isEvolving ? stopEvolution : startEvolution}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isEvolving 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isEvolving ? 'Stop Evolution' : 'Start Evolution'}
              </motion.button>

              <motion.button
                onClick={measureQuantumState}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={currentComponent.measured}
              >
                {currentComponent.measured ? 'Already Measured' : 'Measure State'}
              </motion.button>

              <motion.button
                onClick={createEntanglement}
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Entanglement
              </motion.button>

              <div className="mt-6">
                <label className="block text-white text-sm mb-2">Evolution Speed</label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  value={evolutionSpeed}
                  onChange={(e) => setEvolutionSpeed(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-gray-400 text-xs mt-1">{evolutionSpeed}ms</div>
              </div>
            </div>

            {/* Generation Stats */}
            <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Evolution Stats</h4>
              <div className="text-gray-300 text-sm space-y-1">
                <div>Generation: {stats.generation}</div>
                <div>Population: {stats.populationSize}</div>
                <div>Best Fitness: {stats.fitnessHistory[stats.fitnessHistory.length - 1]?.toFixed(3) || 'N/A'}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quantum Measurements Log */}
        <motion.div
          className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Quantum Measurements</h3>
          <div className="bg-gray-900/50 rounded-lg p-4 h-48 overflow-y-auto">
            <AnimatePresence>
              {measurements.map((measurement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-green-300 text-sm mb-1 font-mono"
                >
                  {measurement}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Quantum Healthcare Applications */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-700/30 rounded-2xl p-6 border border-blue-500/30">
            <h4 className="text-xl font-bold text-blue-300 mb-3">Patient State Superposition</h4>
            <p className="text-blue-200 text-sm">
              Patients exist in multiple care states simultaneously until observed, allowing for optimized treatment planning.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-purple-700/30 rounded-2xl p-6 border border-purple-500/30">
            <h4 className="text-xl font-bold text-purple-300 mb-3">Entangled Care Networks</h4>
            <p className="text-purple-200 text-sm">
              Healthcare providers are quantum entangled, enabling instantaneous information sharing across facilities.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-900/50 to-pink-700/30 rounded-2xl p-6 border border-pink-500/30">
            <h4 className="text-xl font-bold text-pink-300 mb-3">Probabilistic Diagnostics</h4>
            <p className="text-pink-200 text-sm">
              Diagnostic results are represented as probability amplitudes, enabling more nuanced medical decisions.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}